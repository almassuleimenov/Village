"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface CanvasScrubberProps {
  sequenceName: string;
  frameCount: number;
  progress: MotionValue<number>;
  priority?: boolean; 
}

export function CanvasScrubber({ 
  sequenceName, 
  frameCount, 
  progress, 
  priority = false 
}: CanvasScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef<number>(0); 
  const lastDrawnIndexRef = useRef<number | null>(null);
  const containerSize = useRef({ width: 0, height: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Предзагрузка изображений
    const loadSequence = () => {
      const images: HTMLImageElement[] = [];
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameStr = i.toString().padStart(4, "0");
        
        if (priority && i < 10) {
          img.fetchPriority = "high";
        } else {
          img.fetchPriority = "low";
        }
        img.src = `/frames/${sequenceName}/frame_${frameStr}.jpg`;
        images.push(img);
      }
      imagesRef.current = images;

      images[0].onload = () => {
        if (isMounted) drawImage(0);
      };
    };

    loadSequence();

    return () => { 
      isMounted = false; 
      // Агрессивная очистка памяти (предотвращение OOM на мобилках)
      imagesRef.current.forEach(img => {
        img.onload = null;
        img.src = ""; 
      });
      imagesRef.current = [];
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [frameCount, sequenceName, priority]);

  // Обработка Resize и Device Pixel Ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        containerSize.current = { width, height };
        
        // ВАЖНО: Ограничиваем DPR максимум до 2. Иначе на iPhone (DPR 3) GPU задохнется.
        const rawDpr = window.devicePixelRatio || 1;
        const dpr = Math.min(rawDpr, 2);
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
        
        drawImage(currentIndexRef.current);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const drawImage = (index: number) => {
    currentIndexRef.current = index;
    
    if (!canvasRef.current || !imagesRef.current[index]) return;
    
    const img = imagesRef.current[index];
    const ctx = canvasRef.current.getContext("2d", { alpha: false }); 
    
    const render = () => {
      if (currentIndexRef.current !== index || !ctx) return;
      
      const { width, height } = containerSize.current;
      if (width === 0 || height === 0) return;

      // Алгоритм object-fit: cover
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;
      
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      lastDrawnIndexRef.current = index;
    };

    if (img.complete) {
      render();
    } else {
      img.onload = render;
    }
  };

  useMotionValueEvent(progress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const frameIndex = Math.min(frameCount - 1, Math.floor(clamped * frameCount));
    
    if (frameIndex === lastDrawnIndexRef.current) return;
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    animationFrameId.current = requestAnimationFrame(() => drawImage(frameIndex));
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        transform: "translateZ(0)", // Аппаратное ускорение
        willChange: "transform", // Подсказка браузеру о композитном слое
      }}
    />
  );
}
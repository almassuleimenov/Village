// components/CanvasScrubber.tsx
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

  useEffect(() => {
    let isMounted = true;

    // Предзагрузка изображений
    const loadSequence = () => {
      const images: HTMLImageElement[] = [];
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameStr = i.toString().padStart(4, "0");
        // Желательно добавить приоритет загрузки для первых кадров
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
        
        const dpr = window.devicePixelRatio || 1;
        // Устанавливаем физическое разрешение канваса с учетом плотности пикселей
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          // Нормализуем координаты
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
        
        // Перерисовываем текущий кадр при ресайзе
        drawImage(currentIndexRef.current);
      }
    });

    // Наблюдаем за родителем канваса (чтобы канвас сам себя не ресайзил бесконечно)
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
      
      // Заливаем фон черным (из-за alpha: false это полезно для краев, если пропорции не сошлись)
      ctx.fillStyle = "#000000";
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
    requestAnimationFrame(() => drawImage(frameIndex));
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        transform: "translateZ(0)", 
      }}
    />
  );
}
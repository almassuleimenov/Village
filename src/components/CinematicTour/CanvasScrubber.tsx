"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Следим за видимостью компонента, чтобы не грузить картинки раньше времени
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Нам нужно сработать только один раз
        }
      },
      { rootMargin: "600px 0px 600px 0px" } // Начинаем за 600px до появления на экране
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let isMounted = true;
    const BATCH_SIZE = 8; // Загружаем по 8 картинок одновременно, чтобы не блокировать сеть

    const loadSequence = async () => {
      const images: HTMLImageElement[] = new Array(frameCount);
      imagesRef.current = images;

      // Сначала загружаем самый первый кадр для мгновенной отрисовки
      const firstImg = new Image();
      firstImg.src = `/frames_webp/${sequenceName}/frame_0001.webp`; // Переведи в .webp при возможности
      firstImg.onload = () => {
        if (isMounted) {
          images[0] = firstImg;
          drawImage(0);
          // После первого кадра запускаем порционную загрузку остальных
          loadInBatches(1);
        }
      };
    };

    const loadInBatches = async (startIndex: number) => {
      if (startIndex > frameCount || !isMounted) return;

      const promises: Promise<void>[] = [];
      const endIndex = Math.min(startIndex + BATCH_SIZE - 1, frameCount);

      for (let i = startIndex; i <= endIndex; i++) {
        promises.push(
          new Promise<void>((resolve) => {
            const img = new Image();
            const frameStr = i.toString().padStart(4, "0");
            
            img.fetchPriority = priority && i < 15 ? "high" : "low";
            img.src = `/frames_webp/${sequenceName}/frame_${frameStr}.webp`;
            
            img.onload = () => {
              if (isMounted) imagesRef.current[i - 1] = img;
              resolve();
            };
            img.onerror = () => {
              resolve(); // Игнорируем ошибку битого кадра, чтобы не стопорить конвейер
            };
          })
        );
      }

      await Promise.all(promises);
      
      // ПРАВКА №1: Микро-пауза. Даем Main Thread 30мс на обработку скролла
      // пользователя, чтобы интерфейс не "замерзал" во время загрузки.
      await new Promise(resolve => setTimeout(resolve, 30));

      // Рекурсивно вызываем загрузку следующего пакета кадров
      loadInBatches(endIndex + 1);
    };

    loadSequence();

    return () => { 
      isMounted = false; 
      imagesRef.current.forEach(img => {
        if (img) {
          img.onload = null;
          img.src = ""; 
        }
      });
      imagesRef.current = [];
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [frameCount, sequenceName, priority, isIntersecting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        containerSize.current = { width, height };
        
        // ПРАВКА №2: Жестко фиксируем dpr на 1.
        // Это уменьшает площадь рендеринга на Retina-экранах в 4 раза, 
        // разгружая видеокарту (GPU).
        const dpr = 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          // ПРАВКА №3: Снижаем качество сглаживания ради производительности (визуально не отличить)
          ctx.imageSmoothingQuality = "low";
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
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    />
  );
}
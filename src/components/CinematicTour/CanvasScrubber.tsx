"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface CanvasScrubberProps {
  sequenceName: string;
  frameCount: number;
  progress: MotionValue<number>;
}

export function CanvasScrubber({ sequenceName, frameCount, progress }: CanvasScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // Трекаем актуальный индекс, чтобы загрузившиеся старые кадры не перекрывали новые
  const currentIndexRef = useRef<number>(0); 

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameStr = i.toString().padStart(4, "0");
      img.src = `/frames/${sequenceName}/${frameStr}.webp`;
      images.push(img);
    }
    imagesRef.current = images;

    images[0].onload = () => drawImage(0);
  }, [frameCount, sequenceName]);

  const drawImage = (index: number) => {
    currentIndexRef.current = index;
    
    if (!canvasRef.current || !imagesRef.current[index]) return;
    
    const img = imagesRef.current[index];
    const ctx = canvasRef.current.getContext("2d", { alpha: false }); // alpha: false дает буст FPS
    
    const render = () => {
      // Защита: рисуем только если пользователь всё ещё на этом кадре
      if (currentIndexRef.current !== index || !ctx) return;
      
      const { width, height } = canvasRef.current!;
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    if (img.complete) {
      render();
    } else {
      img.onload = render;
    }
  };

  useMotionValueEvent(progress, "change", (latest) => {
    // Жестко зажимаем лимиты, чтобы индекс никогда не вылетел за пределы
    const clamped = Math.max(0, Math.min(1, latest));
    const frameIndex = Math.min(frameCount - 1, Math.floor(clamped * frameCount));
    
    // Синхронизируем с частотой обновления монитора для идеальной плавности
    requestAnimationFrame(() => drawImage(frameIndex));
  });

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "translateZ(0)", // Включаем аппаратное ускорение
      }}
    />
  );
}
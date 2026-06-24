"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Сохраняем текущую фазу, чтобы не триггерить анимацию повторно
  // 0 = начало (0с), 1 = середина (4с), 2 = конец (duration)
  const currentStepRef = useRef<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(10); // Фолбэк, обновится при загрузке

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Инициализация длительности видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    if (video.readyState >= 1) {
      setVideoDuration(video.duration);
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Универсальный движок плавной перемотки видео (вперед и назад)
  const animateVideoTo = (targetTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startVidTime = video.currentTime;
    const timeDistance = Math.abs(targetTime - startVidTime);

    // Защита от микро-скачков (если мы уже близко к цели)
    if (timeDistance < 0.05) {
      video.currentTime = targetTime;
      return;
    }

    const startTime = performance.now();
    // Фиксированная скорость: 1 секунда видео проигрывается за 1 секунду реального времени
    const durationMs = timeDistance * 1000; 

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Линейная интерполяция времени
      const nextTime = startVidTime + ((targetTime - startVidTime) * progress);
      video.currentTime = nextTime;

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(renderLoop);
      } else {
        // Гарантируем точную остановку
        video.currentTime = targetTime;
      }
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);
  };

  // Маршрутизатор свайпов (слушает нативный скролл и переключает фазы)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let targetStep = 0;

    // Определяем зоны (с буферами, чтобы не было ложных срабатываний)
    if (latest > 0.25 && latest < 0.75) {
      targetStep = 1; // Середина пути
    } else if (latest >= 0.75) {
      targetStep = 2; // Конец блока
    }

    // Если фаза изменилась — запускаем анимацию до нужной секунды
    if (targetStep !== currentStepRef.current) {
      currentStepRef.current = targetStep;

      if (targetStep === 0) animateVideoTo(0);
      if (targetStep === 1) animateVideoTo(4.0); // Жестко фиксируем на 4 секундах
      if (targetStep === 2) animateVideoTo(videoDuration); // До конца
    }
  });

  // Очистка памяти при размонтировании
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.container}>
      {/* Контейнер имеет высоту 400vh (из CinematicTour.module.css),
        что дает пользователю достаточно пространства для скролла между фазами.
      */}
      <div className={styles.stickyArea}>
        <video
          ref={videoRef}
          src="/videos/mobilevideo_optimized.mp4"
          playsInline
          muted
          preload="auto"
          className={styles.mobileVideoElement}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: "translateZ(0)", // Принудительное аппаратное ускорение GPU
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
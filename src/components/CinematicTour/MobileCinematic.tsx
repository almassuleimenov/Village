"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const currentStepRef = useRef<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(10);
  const [shouldLoadVideo, setShouldLoadVideo] = useState<boolean>(false);
  const [isDecoderReady, setIsDecoderReady] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Ленивая инициализация контейнера
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px 400px 0px" } 
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 2. Обработка готовности медиа-потока и прогрев декодера
  const handleVideoReady = async () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoDuration(video.duration);

    // iOS/Android Safari Trick: принудительно будим декодер через кратковременный play/pause
    try {
      video.currentTime = 0;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        video.pause();
      }
      
      // Декодер прогрет, первый кадр извлечен, можно разрешать скраббинг
      setIsDecoderReady(true);
    } catch (error) {
      console.warn("Decoder warmup warm-up was interrupted:", error);
      // В случае блокировки политиками автоплея все равно разрешаем работу
      setIsDecoderReady(true);
    }
  };

  const animateVideoTo = (targetTime: number) => {
    const video = videoRef.current;
    // Запрещаем анимацию, если видео не смонтировано или декодер еще не готов
    if (!video || !shouldLoadVideo || !isDecoderReady) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startVidTime = video.currentTime;
    const timeDistance = Math.abs(targetTime - startVidTime);

    if (timeDistance < 0.04) {
      video.currentTime = targetTime;
      return;
    }

    const startTime = performance.now();
    const durationMs = timeDistance * 1000; 

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      const nextTime = startVidTime + ((targetTime - startVidTime) * progress);
      
      // Проверяем готовность буфера перед изменением кадра во избежание фризов
      if (video.readyState >= 2) {
        video.currentTime = nextTime;
      }

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(renderLoop);
      } else {
        video.currentTime = targetTime;
      }
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);
  };

  // Маршрутизатор скролла
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!shouldLoadVideo || !isDecoderReady) return;

    let targetStep = 0;

    if (latest > 0.25 && latest < 0.75) {
      targetStep = 1;
    } else if (latest >= 0.75) {
      targetStep = 2;
    }

    if (targetStep !== currentStepRef.current) {
      currentStepRef.current = targetStep;

      if (targetStep === 0) animateVideoTo(0);
      if (targetStep === 1) animateVideoTo(4.0);
      if (targetStep === 2) animateVideoTo(videoDuration);
    }
  });

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        {/* Использование условного рендеринга вместо динамического src */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            src="/videos/mobilevideo_optimized.mp4"
            playsInline
            muted
            preload="auto"
            onLoadedData={handleVideoReady}
            className={styles.mobileVideoElement}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "translateZ(0)",
              opacity: isDecoderReady ? 1 : 0, // Плавное проявление после прогрева декодера
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        )}
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
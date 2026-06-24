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
  const [isReady, setIsReady] = useState<boolean>(false); // Флаг готовности декодера

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Триггер загрузки
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoadVideo(true);
      },
      { rootMargin: "500px 0px 500px 0px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Гарантированная готовность
  useEffect(() => {
    if (!shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      setVideoDuration(video.duration);
      setIsReady(true); // Разрешаем скраббинг ТОЛЬКО после этого
    };

    if (video.readyState >= 2) onReady();
    else video.addEventListener("loadeddata", onReady);

    return () => video.removeEventListener("loadeddata", onReady);
  }, [shouldLoadVideo]);

  const animateVideoTo = (targetTime: number) => {
    const video = videoRef.current;
    // ВАЖНО: добавили !isReady
    if (!video || !shouldLoadVideo || !isReady) return;

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    const startVidTime = video.currentTime;
    const timeDistance = Math.abs(targetTime - startVidTime);
    if (timeDistance < 0.05) { video.currentTime = targetTime; return; }

    const startTime = performance.now();
    const durationMs = timeDistance * 1000; 

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      video.currentTime = startVidTime + ((targetTime - startVidTime) * progress);

      if (progress < 1) animationFrameId.current = requestAnimationFrame(renderLoop);
      else video.currentTime = targetTime;
    };
    animationFrameId.current = requestAnimationFrame(renderLoop);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!shouldLoadVideo || !isReady) return; // Игнорируем до готовности

    let targetStep = 0;
    if (latest > 0.25 && latest < 0.75) targetStep = 1;
    else if (latest >= 0.75) targetStep = 2;

    if (targetStep !== currentStepRef.current) {
      currentStepRef.current = targetStep;
      if (targetStep === 0) animateVideoTo(0);
      if (targetStep === 1) animateVideoTo(4.0);
      if (targetStep === 2) animateVideoTo(videoDuration);
    }
  });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        <video
          ref={videoRef}
          src={shouldLoadVideo ? "/videos/mobilevideo_optimized.mp4" : undefined}
          playsInline
          muted
          preload="auto"
          className={styles.mobileVideoElement}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: "translateZ(0)",
            opacity: isReady ? 1 : 0, // Показываем видео только когда оно готово играть
            transition: "opacity 0.3s"
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Состояние: ожидание -> проигрывание -> завершено
  const [videoState, setVideoState] = useState<"idle" | "playing" | "ended">("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Как только видео-блок занимает 95% экрана и мы еще не проигрывали его
        if (entry.isIntersecting && videoState === "idle") {
          setVideoState("playing");
          
          // Жесткая блокировка скролла 
          document.body.style.overflow = "hidden";
          document.body.style.touchAction = "none"; // Критично для iOS
          
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            
            // Обработка политик автоплея браузеров
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.warn("Autoplay was prevented by browser:", error);
                unlockScroll(); // Фолбэк: если браузер заблочил, отпускаем юзера
              });
            }
          }
        }
      },
      { threshold: 0.95 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Очистка эффектов при размонтировании (Safe Memory Management)
    return () => {
      observer.disconnect();
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [videoState]);

  const unlockScroll = () => {
    setVideoState("ended");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  return (
    <section ref={containerRef} className={styles.mobileVideoContainer}>
      <video
        ref={videoRef}
        src="/videos/mobilevideo.mp4"
        playsInline
        muted // Muted обязательно, иначе мобильный Safari заблокирует autoplay
        onEnded={unlockScroll}
        className={styles.mobileVideoElement}
      />
      
      {/* Сохраняем градиентный оверлей для целостности дизайна */}
      <div className={styles.cinematicOverlay} aria-hidden="true" />
    </section>
  );
}
"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [debugLog, setDebugLog] = useState<string>("Инициализация...");
  const [videoDuration, setVideoDuration] = useState<number>(10);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      setDebugLog("Видео-тег не найден в DOM");
      return;
    }

    setDebugLog(`Тег найден. readyState: ${video.readyState}`);

    const onLoaded = () => {
      setVideoDuration(video.duration);
      setDebugLog(`Метаданные загружены. Длина: ${video.duration}с`);
    };

    const onError = (e: any) => {
      setDebugLog(`Ошибка видео: ${video.error?.message || "неизвестно"}`);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);

    // Принудительный запуск декодера без сложных промисов
    video.currentTime = 0;

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video) return;

    let targetTime = 0;
    if (latest > 0.25 && latest < 0.75) targetTime = 4.0;
    if (latest >= 0.75) targetTime = videoDuration;

    // Пишем лог скролла прямо на экран телефона
    setDebugLog(`Скролл Progress: ${latest.toFixed(2)} | Target Time: ${targetTime}`);
    
    // Прямое синхронное изменение без requestAnimationFrame для теста стабильности
    video.currentTime = targetTime;
  });

  return (
    <section ref={containerRef} className={styles.container} style={{ border: "2px solid red" }}>
      <div className={styles.stickyArea}>
        {/* Дебаг-панель: покажет логи прямо на экране Айфона */}
        <div style={{
          position: "absolute",
          top: "80px",
          left: "10px",
          zIndex: 9999,
          background: "rgba(0,0,0,0.8)",
          color: "#00ff00",
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "12px",
          pointerEvents: "none"
        }}>
          {debugLog}
        </div>

        <video
          ref={videoRef}
          src="/videos/mobilevideo_optimized.mp4"
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          className={styles.mobileVideoElement}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: 1 // Исключаем блокировку по прозрачности
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
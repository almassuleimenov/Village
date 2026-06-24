"use client";

import { useRef, useEffect } from "react";
import { useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Преобразуем прогресс скролла в таймкоды видео (0 - начало, 4.0 - середина, 10 - конец)
  // Это плавнее, чем жесткое условие if/else
  const videoTime = useTransform(scrollYProgress, [0, 0.5, 1], [0, 4.0, 10]);

  useMotionValueEvent(videoTime, "change", (latest) => {
    if (videoRef.current) {
      // Прямое управление временем. Для iOS важно, чтобы muted и playsInline уже были установлены
      videoRef.current.currentTime = latest;
    }
  });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        <video
          ref={videoRef}
          src="/videos/mobilevideo_optimized.mp4"
          className={styles.mobileVideoElement}
          playsInline // Критично для iOS
          muted       // Критично для автоплея
          autoPlay    // Позволяет декодеру сразу подхватить поток
          loop
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: "translateZ(0)", // Аппаратное ускорение
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
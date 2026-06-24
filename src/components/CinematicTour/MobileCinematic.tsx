"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const videoTime = useTransform(scrollYProgress, [0, 0.5, 1], [0, 4.0, 10]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load(); // принудительная (ре)инициализация декодера

    const handleReady = () => {
      setIsReady(true);
      // Глушим автоплей сразу после старта — дальше управляем
      // временем ТОЛЬКО руками, чтобы не было гонки за кадр
      video.pause();
    };

    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplaythrough", handleReady);

    return () => {
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplaythrough", handleReady);
    };
  }, []);

  useMotionValueEvent(videoTime, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !isReady) return;
    if (video.readyState >= 2) {
      video.currentTime = latest;
    }
  });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        <video
          ref={videoRef}
          src="/videos/mobilevideo_optimized.mp4"
          className={styles.mobileVideoElement}
          playsInline
          muted
          autoPlay
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
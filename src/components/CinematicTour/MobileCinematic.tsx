"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./CinematicTour.module.css";

export function MobileCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // iOS Safari крайне не любит, когда currentTime меняется ДО того, как видео сказало "я могу играть"
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsReady(true);
      // ВАЖНО: для iOS часто нужно вызвать play() хотя бы раз в тишине
      video.play().catch(() => {});
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    video.load(); // Принудительный лоад ресурса

    return () => video.removeEventListener("canplaythrough", handleCanPlay);
  }, []);

  const animateVideoTo = (targetTime: number) => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    const startVidTime = video.currentTime;
    const timeDistance = Math.abs(targetTime - startVidTime);

    const startTime = performance.now();
    const durationMs = Math.max(timeDistance * 1000, 300); // Минимум 300мс на анимацию

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
    if (!isReady) return;

    let targetTime = 0;
    if (latest > 0.25 && latest < 0.75) targetTime = 4.0;
    else if (latest >= 0.75) targetTime = 10.0; // Замени 10.0 на реальную длительность

    animateVideoTo(targetTime);
  });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        <video
          ref={videoRef}
          src="/videos/mobilevideo_optimized.mp4"
          playsInline
          muted
          loop
          preload="auto"
          className={styles.mobileVideoElement}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: "translateZ(0)",
            // Если видео все равно черное, проверь этот opacity:
            opacity: 1 
          }}
        />
        <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
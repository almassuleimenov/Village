"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, animate } from "framer-motion";
import { CanvasScrubber } from "./CanvasScrubber";
import styles from "./CinematicTour.module.css";

const FRAMES_COUNT = 121; 

export function CinematicTour() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const animatingProgress = useMotionValue(0);
  const currentZoneRef = useRef<number>(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let targetZone = 0;
    let targetProgress = 0;

    // Оптимизированы пороги срабатывания для более чуткого отклика на скролл
    if (latest >= 0.20 && latest < 0.70) {
      targetZone = 1;
      targetProgress = 0.5; 
    } else if (latest >= 0.70) {
      targetZone = 2;
      targetProgress = 1.0; 
    }

    if (targetZone !== currentZoneRef.current) {
      currentZoneRef.current = targetZone;

      // Уменьшена длительность (duration) до 1.1s и выставлен плавный выезд easeOut
      // Это убирает ощущение "задержки" и делает старт видео моментальным
      animate(animatingProgress, targetProgress, {
        type: "tween",
        ease: "easeOut",
        duration: 1.1 
      });
    }
  });

  useEffect(() => {
    return () => {
      animatingProgress.stop();
    };
  }, [animatingProgress]);

  /* ================= МАРШРУТИЗАЦИЯ И МИКРО-КРОССФЕЙД ================= */
  
  // Поток 1: Изменение кадров от 0.0 до 0.5 значения animatingProgress
  const firsttProgress = useTransform(animatingProgress, [0, 0.5], [0, 1], { clamp: true });
  
  // Плавное исчезновение первого видео начинается чуть заранее (на прогрессе 0.42) и завершается ровно в 0.50
  const firsttOpacity = useTransform(animatingProgress, [0, 0.42, 0.50], [1, 1, 0], { clamp: true });

  // Поток 2: Изменение кадров начнется только ПОСЛЕ достижения 0.5 прогресса
  const seconddProgress = useTransform(animatingProgress, [0.5, 1.0], [0, 1], { clamp: true });
  
  // Плавное появление второго видео (на его статической 1-й картинке) происходит синхронно с угасанием первого
  const seconddOpacity = useTransform(animatingProgress, [0.42, 0.50, 1.0], [0, 1, 1], { clamp: true });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        
        {/* === ПОТОК 1: firstt === */}
        <motion.div 
          className={styles.canvasWrapper} 
          style={{ opacity: firsttOpacity }}
        >
          <CanvasScrubber 
            sequenceName="firstt" 
            frameCount={FRAMES_COUNT} 
            progress={firsttProgress} 
            priority={true} 
          />
        </motion.div>

        {/* === ПОТОК 2: secondd === */}
        <motion.div 
          className={styles.canvasWrapper} 
          style={{ opacity: seconddOpacity }}
        >
          <CanvasScrubber 
            sequenceName="secondd" 
            frameCount={FRAMES_COUNT} 
            progress={seconddProgress} 
            priority={false} 
          />
        </motion.div>
      <div className={styles.cinematicOverlay} aria-hidden="true" />
      </div>
    </section>
  );
}
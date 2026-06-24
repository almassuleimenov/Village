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
  
  const firsttProgress = useTransform(animatingProgress, [0, 0.5], [0, 1], { clamp: true });
  const firsttOpacity = useTransform(animatingProgress, [0, 0.42, 0.50], [1, 1, 0], { clamp: true });

  const seconddProgress = useTransform(animatingProgress, [0.5, 1.0], [0, 1], { clamp: true });
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
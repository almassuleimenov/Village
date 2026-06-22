"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CanvasScrubber } from "./CanvasScrubber";
import styles from "./CinematicTour.module.css";

// У нас два видео по 121 кадру
const FRAMES_COUNT = 121; 

export function CinematicTour() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring сглаживает колесо мыши/тачпад, защищая от резких прыжков между кадрами
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  /* ================= ЧАСТЬ 1: firstt ================= */
  // Прогресс воспроизведения от 0 до 100% за первую половину скролла
  const firsttProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1], { clamp: true });
  // Жесткий кат: секвенция моментально исчезает на 50% скролла
  const firsttOpacity = useTransform(scrollYProgress, [0.4999, 0.5], [1, 0], { clamp: true });

  /* ================= ЧАСТЬ 2: secondd ================= */
  // Прогресс воспроизведения от 0 до 100% за вторую половину скролла
  const seconddProgress = useTransform(scrollYProgress, [0.5, 1], [0, 1], { clamp: true });
  // Жесткий кат: секвенция моментально появляется на 50% скролла, продолжая движение
  const seconddOpacity = useTransform(scrollYProgress, [0.4999, 0.5], [0, 1], { clamp: true });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        
        {/* === ПОТОК 1 === */}
        <motion.div 
          className={styles.canvasWrapper} 
          style={{ opacity: firsttOpacity }}
        >
          <CanvasScrubber 
            sequenceName="firstt" 
            frameCount={FRAMES_COUNT} 
            progress={firsttProgress} 
            priority={true} // Высший приоритет для LCP
          />
        </motion.div>

        {/* === ПОТОК 2 === */}
        <motion.div 
          className={styles.canvasWrapper} 
          style={{ opacity: seconddOpacity }}
        >
          <CanvasScrubber 
            sequenceName="secondd" 
            frameCount={FRAMES_COUNT} 
            progress={seconddProgress} 
            priority={false} // Грузится в фоне, пока юзер скроллит первую часть
          />
        </motion.div>

      </div>
    </section>
  );
}
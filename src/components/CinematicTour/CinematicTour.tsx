"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, animate } from "framer-motion";
import { CanvasScrubber } from "./CanvasScrubber";
import styles from "./CinematicTour.module.css";

const FRAMES_COUNT = 121; 

export function CinematicTour() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Реальный скролл пользователя
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Изолированное значение прогресса, которым мы управляем программно
  const animatingProgress = useMotionValue(0);
  
  // Храним текущую зону, чтобы не перезапускать анимацию внутри одной и той же зоны
  const currentZoneRef = useRef<number>(0);

  /* Разбиваем скролл на 3 дискретные зоны:
    - От 0.0 до 0.25: Зона 0 (Начало первого видео, прогресс 0.0)
    - От 0.25 до 0.75: Зона 1 (Фиксация на старте второго видео, прогресс 0.5)
    - От 0.75 до 1.0:  Зона 2 (Конец второго видео, прогресс 1.0)
  */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let targetZone = 0;
    let targetProgress = 0;

    if (latest >= 0.25 && latest < 0.75) {
      targetZone = 1;
      targetProgress = 0.5; // Конец первого видео / старт второго
    } else if (latest >= 0.75) {
      targetZone = 2;
      targetProgress = 1.0; // Финал
    }

    // Если зона изменилась — запускаем плавное автономное проигрывание до точки
    if (targetZone !== currentZoneRef.current) {
      currentZoneRef.current = targetZone;

      animate(animatingProgress, targetProgress, {
        type: "tween",
        ease: "easeInOut",
        duration: 1.5 // Скорость автоматического проигрывания видео (в секундах)
      });
    }
  });

  // Синхронизируем уничтожение анимаций, если компонент размонтируется во время воспроизведения
  useEffect(() => {
    return () => {
      animatingProgress.stop();
    };
  }, [animatingProgress]);

  /* ================= МАРШРУТИЗАЦИЯ КАДРОВ ================= */
  // Первая секвенция берет диапазон прогресса от 0.0 до 0.5 и разворачивает в свои 0.0 -> 1.0
  const firsttProgress = useTransform(animatingProgress, [0, 0.5], [0, 1], { clamp: true });
  const firsttOpacity = useTransform(animatingProgress, [0.4999, 0.5], [1, 0], { clamp: true });

  // Вторая секвенция берет диапазон прогресса от 0.5 до 1.0 и разворачивает в свои 0.0 -> 1.0
  const seconddProgress = useTransform(animatingProgress, [0.5, 1.0], [0, 1], { clamp: true });
  const seconddOpacity = useTransform(animatingProgress, [0.4999, 0.5], [0, 1], { clamp: true });

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

      </div>
    </section>
  );
}
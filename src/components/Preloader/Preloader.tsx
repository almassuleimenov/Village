"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "./Preloader.module.css";

const luxuryEase = [0.76, 0, 0.24, 1] as any;

export function Preloader() {
  const [showLoader, setShowLoader] = useState(true);
  const [isInstantExit, setIsInstantExit] = useState(false);
  
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (latest) => Math.round(latest));
  const progressWidth = useTransform(count, (v) => `${v}%`);
  
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribe = roundedCount.on("change", (latest) => {
      if (counterRef.current) {
        counterRef.current.textContent = latest.toString().padStart(3, "0");
      }
    });
    return unsubscribe;
  }, [roundedCount]);

  useEffect(() => {
    // === 1. ПРОВЕРКА СЕССИИ ===
    // Если флаг есть в sessionStorage, значит пользователь уже был на сайте.
    // Скрываем лоадер мгновенно, без анимации.
    if (sessionStorage.getItem("v_village_preloaded")) {
      setIsInstantExit(true);
      setShowLoader(false);
      return; 
    }

    // === 2. ПЕРВАЯ ЗАГРУЗКА ===
    document.body.style.overflow = "hidden";

    const FRAMES_TO_LOAD = 5;
    const criticalAssets = [
      "/Desktop.webp", // Кэшируем главный фон Героя
      ...Array.from({ length: FRAMES_TO_LOAD }).map(
        (_, i) => `/frames_webp/firstt/frame_${String(i + 1).padStart(4, "0")}.webp`
      ),
    ];

    let loadedCount = 0;

    const loadAsset = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        
        const handleComplete = () => {
          loadedCount++;
          const actualProgress = (loadedCount / criticalAssets.length) * 100;
          
          animate(count, actualProgress, {
            type: "tween",
            ease: "easeOut",
            duration: 0.8,
          });
          resolve(true);
        };

        img.onload = handleComplete;
        img.onerror = handleComplete;
      });
    };

    Promise.all(criticalAssets.map(loadAsset)).then(() => {
      animate(count, 100, { duration: 0.4, ease: "easeOut" }).then(() => {
        setTimeout(() => {
          // Записываем флаг об успешной загрузке в текущей сессии
          sessionStorage.setItem("v_village_preloaded", "true");
          setShowLoader(false);
          document.body.style.overflow = "";
        }, 600);
      });
    });

    // Fallback: пускаем пользователя через 8 секунд, если интернет слишком медленный
    const timeout = setTimeout(() => {
      animate(count, 100, { duration: 1 }).then(() => {
        sessionStorage.setItem("v_village_preloaded", "true");
        setShowLoader(false);
        document.body.style.overflow = "";
      });
    }, 8000);

    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          className={styles.preloader}
          initial={{ opacity: 1 }}
          // === УМНЫЙ EXIT ===
          // Если это повторный заход, duration: 0 скрывает блок за 1 миллисекунду.
          // Если это первая загрузка, проигрывается роскошная Awwwards-анимация.
          exit={
            isInstantExit 
              ? { opacity: 0, transition: { duration: 0 } } 
              : { 
                  y: "-100vh", 
                  scale: 0.95,
                  opacity: 0,
                  filter: "blur(10px)",
                  transition: { duration: 1.2, ease: luxuryEase, delay: 0.2 } 
                }
          }
        >
          <div className={styles.noise} />

          <div className={styles.container}>
            <div className={styles.logoWrapper}>
              <motion.h1
                className={styles.logo}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.2, ease: luxuryEase, delay: 0.1 }}
              >
                V
              </motion.h1>
            </div>

            <div className={styles.progressSection}>
              <motion.div 
                className={styles.progressLineWrapper}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: luxuryEase, delay: 0.3 }}
              >
                <div className={styles.progressTrack} />
                <motion.div
                  className={styles.progressBar}
                  style={{ width: progressWidth }}
                >
                  <div className={styles.progressGlow} />
                </motion.div>
              </motion.div>

              <motion.div 
                className={styles.dataGroup}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: luxuryEase, delay: 0.5 }}
              >
                <span className={styles.label}>Инициализация пространства</span>
                <div className={styles.counterWrapper}>
                  <span ref={counterRef} className={styles.percentage}>000</span>
                  <span className={styles.percentSymbol}>%</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
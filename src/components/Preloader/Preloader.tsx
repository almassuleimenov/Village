"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Блокируем скролл Lenis/браузера на время загрузки
    document.body.style.overflow = "hidden";

    // 2. Формируем массив критических ассетов (Hero фон + Сцена 1)
    const FRAMES_TO_LOAD = 91;
    const criticalAssets = [
      "/image 407.png", // Главный фон Hero
      ...Array.from({ length: FRAMES_TO_LOAD }).map(
        (_, i) => `/frames/seq1/${String(i + 1).padStart(4, "0")}.webp`
      ),
    ];

    let loadedCount = 0;

    const loadAsset = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          // Плавно считаем процент
          setProgress(Math.round((loadedCount / criticalAssets.length) * 100));
          resolve(true);
        };
        // Если кадр не загрузился (ошибка сети 404), все равно резолвим промис, 
        // чтобы не получить вечно висящий лоадер.
        img.onerror = resolve; 
      });
    };

    // 3. Запускаем параллельную загрузку
    Promise.all(criticalAssets.map(loadAsset)).then(() => {
      // Искусственная задержка для эстетики: даем юзеру зафиксировать 100% и лого
      setTimeout(() => {
        setIsLoading(false);
        // Возвращаем скролл
        document.body.style.overflow = "";
      }, 900);
    });

    // Fallback на случай, если интернет слишком медленный — пускаем юзера через 8 секунд принудительно
    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.preloader}
          // Элитарный выход: лоадер не просто исчезает, он размывается и уходит в фон
          initial={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ 
            opacity: 0, 
            filter: "blur(24px)", 
            scale: 1.05,
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className={styles.container}>
            <motion.h1
              className={styles.logo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              V
            </motion.h1>

            <div className={styles.progressWrapper}>
              <motion.div
                className={styles.progressBar}
                // Анимируем ширину с помощью tween, чтобы ползунок не дергался
                animate={{ width: `${progress}%` }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
              />
            </div>

            <motion.div 
              className={styles.dataGroup}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className={styles.label}>LOADING ASSETS</span>
              <span className={styles.percentage}>
                {progress.toString().padStart(3, "0")}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import styles from "./HorizontalGallery.module.css";

const images = [
  "/Corona1.jpg.jpeg",
  "/Corona2.jpg.jpeg",
  "/Corona3.jpg.jpeg",
  "/Corona4.jpg.jpeg",
  "/Corona5.jpg.jpeg",
  "/Corona6.jpg",
];

export function HorizontalGallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  
  // Motion-значение для отслеживания координаты X при перетаскивании
  const x = useMotionValue(0);

  // Динамический пересчет доступной ширины для свайпа (O(1) сложность, отрабатывает только при ресайзе)
  useEffect(() => {
    const calcWidth = () => {
      if (carouselRef.current) {
        setDragWidth(
          carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
        );
      }
    };
    
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, []);

  // Физика пружины для прогресс-бара (чтобы он двигался чуть плавнее самой галереи)
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  
  // Интерполяция: превращаем пиксели сдвига (от 0 до -dragWidth) в проценты (от 0% до 100%)
  const progress = useTransform(springX, [0, -dragWidth], [0, 100]);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>[ ВИЗУАЛЬНАЯ ЭСТЕТИКА ]</span>
        <h2 className={styles.title}>Архитектура в деталях</h2>
      </header>

      {/* Контейнер, ограничивающий видимую область */}
      <div className={styles.carouselWrapper} ref={carouselRef}>
        
        {/* Интерактивный трек, который мы будем "тянуть" */}
        <motion.div 
          className={styles.track}
          drag="x"
          data-cursor="drag"
        

          // Ограничиваем перетаскивание размерами контента
          dragConstraints={{ right: 0, left: -dragWidth }}
          // Даем премиальное ощущение "резинки" при достижении края
          dragElastic={0.15}
          style={{ x }}
          // Тактильный фидбек: при клике галерея чуть "вдавливается"
          whileTap={{ cursor: "grabbing", scale: 0.99 }}
        >
          {images.map((src, index) => (
            <div key={src} className={styles.card}>
              <div className={styles.imageContainer}>
                <Image 
                  src={src} 
                  alt={`Ракурс виллы V-Village ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 60vw"
                  priority={index < 2}
                  quality={90}
                  // Отключаем pointer-events на картинке, чтобы она не перехватывала события drag
                  className={styles.image}
                  draggable={false} 
                />
                <div className={styles.imageOverlay} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Индикатор прогресса галереи */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill} 
            style={{ width: useTransform(progress, v => `${v}%`) }} 
          />
        </div>
        <div className={styles.dragHint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18M17.25 15.75L21 12m0 0l-3.75-3.75" />
          </svg>
          Тяните для просмотра
        </div>
      </div>
    </section>
  );
}
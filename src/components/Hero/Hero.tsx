// D:\Project\react_projects\v-village-brochure\src\components\Hero\Hero.tsx
"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { springSlow, textRevealVariant } from "@/lib/motion";
import styles from "./Hero.module.css";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion-значения для трекинга сырых координат курсора без ререндера React
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Физика пружины для плавности движения мыши (Emil Kowalski style)
  const smoothConfig = { damping: 30, stiffness: 100, mass: 2 };
  const smoothX = useSpring(mouseX, smoothConfig);
  const smoothY = useSpring(mouseY, smoothConfig);

  // Интерполяция: превращаем координаты от -1 до 1 в градусы вращения (от -8 до 8)
  // Обрати внимание: оси инвертированы для естественного 3D-наклона
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Нормализуем координаты в диапазон от -1 до 1
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  };

  const handleMouseLeave = () => {
    // Плавно возвращаем композицию в центр при уходе курсора с экрана
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Статическая виньетка (затемнение по краям) */}
      <div className={styles.vignette} />

      {/* 3D-Сцена, которая реагирует на мышь */}
      <motion.div 
        className={styles.scene}
        style={{ rotateX, rotateY }}
      >
        {/* Задний фон (отдален в Z-пространстве) */}
        <motion.div 
          className={styles.background}
          initial={{ scale: 1.2, z: -80 }}
          animate={{ scale: 1.05, z: -80 }}
          transition={springSlow}
        />
        
        {/* Контент (приближен в Z-пространстве) */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.2 } }
          }}
          className={styles.content}
          style={{ z: 80 }} // Выдвигаем текст ближе к зрителю
        >
          <motion.div variants={textRevealVariant}>
            <h1 className={styles.logo}>V</h1>
            <p className={styles.subtitle}>Club Village</p>
          </motion.div>

          <motion.h2 variants={textRevealVariant} className={styles.title}>
            Жизнь в гармонии <br /> с природой
          </motion.h2>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span>SCROLL</span>
        <motion.div 
          className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0], translateY: ['0%', '0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
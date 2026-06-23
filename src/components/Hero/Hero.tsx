"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { springSlow, textRevealVariant } from "@/lib/motion";
import styles from "./Hero.module.css";

export function Hero() {
  // Motion-значения для трекинга сырых координат курсора без ререндера React
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Физика пружины для плавности движения мыши
  const smoothConfig = { damping: 30, stiffness: 100, mass: 2 };
  const smoothX = useSpring(mouseX, smoothConfig);
  const smoothY = useSpring(mouseY, smoothConfig);

  // Интерполяция: превращаем координаты от -1 до 1 в градусы вращения (от -8 до 8)
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Чтение window.innerWidth/innerHeight не вызывает Layout Thrashing, 
    // в отличие от getBoundingClientRect()
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Нормализуем координаты в диапазон от -1 до 1
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
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
        >
          {/* Production-ready загрузка Hero изображения */}
          <Image
            src="/Corona3.jpg.jpeg"
            alt="Панорама V-Village"
            fill
            priority // Критически важно для LCP — грузит картинку мгновенно
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        
        {/* Контент (приближен в Z-пространстве) */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.2 } }
          }}
          className={styles.content}
          style={{ z: 80 }} 
        >
          <motion.div variants={textRevealVariant}>
            <h1 className={styles.logo}>V</h1>
            <p className={styles.subtitle}>Club Villas</p>
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
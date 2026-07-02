"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { springSlow, textRevealVariant } from "@/lib/motion";
import { useLanguage } from "@/context/LanguageContext"; // Импортируем наш хук
import styles from "./Hero.module.css";

// Локальный словарь переводов для Hero
const translations = {
  ru: {
    subtitle: "Club Villas",
    line1: "Проект,",
    line2: "который предлагает нам мечтать",
    line3: "с открытыми глазами.",
    altDesktop: "Панорама V-Village",
    altMobile: "Панорама V-Village (Мобильная версия)"
  },
  en: {
    subtitle: "Club Villas",
    line1: "A project",
    line2: "that invites us to dream",
    line3: "with our eyes wide open.",
    altDesktop: "V-Village Panorama",
    altMobile: "V-Village Panorama (Mobile)"
  },
  kz: {
    subtitle: "Club Villas",
    line1: "Көзіміз ашық күйде",
    line2: "армандауға шақыратын",
    line3: "жоба.",
    altDesktop: "V-Village панорамасы",
    altMobile: "V-Village панорамасы (Мобильді нұсқа)"
  }
};

export function Hero() {
  // Получаем текущий язык из контекста
  const { language } = useLanguage();
  const t = translations[language];

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
    // Чтение window.innerWidth/innerHeight не вызывает Layout Thrashing
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

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
      <div className={styles.vignette} />

      <motion.div
        className={styles.scene}
        style={{ rotateX, rotateY }}
      >
        <motion.div
          className={styles.background}
          initial={{ scale: 1.2, z: -80 }}
          animate={{ scale: 1.05, z: -80 }}
          transition={springSlow}
        >
          <Image
            src="/Desktop.webp"
            alt={t.altDesktop}
            fill
            priority
            quality={90}
            sizes="100vw"
            className={styles.desktopImage}
            style={{ objectFit: "cover" }}
          />

          <Image
            src="/Mobile.webp"
            alt={t.altMobile}
            fill
            priority
            quality={90}
            sizes="100vw"
            className={styles.mobileImage}
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.2 } }
          }}
          className={styles.content}
          style={{ z: 80 }}
        >
          <motion.div variants={textRevealVariant} className={styles.logoGroup}>
            <h1 className={styles.logo}>V</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </motion.div>

          {/* Текст рендерится динамически из словаря */}
          <motion.h2 variants={textRevealVariant} className={styles.title}>
            {t.line1} <br className={styles.desktopBreak} /> 
            {t.line2} <br className={styles.desktopBreak} /> 
            {t.line3}
          </motion.h2>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
}
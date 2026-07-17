"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/Cursor/Magnetic";
import styles from "./FloatingSocials.module.css";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export function FloatingSocials() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Находим тег footer на странице
    const footerElement = document.querySelector("footer");
    if (!footerElement) return;

    // IntersectionObserver аппаратно ускорен браузером
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Если footer появился в зоне видимости экрана, скрываем кнопки
        setIsHidden(entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px" }
    );

    observer.observe(footerElement);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={styles.container}
      // Анимация выезда: прячем за правый край, если isHidden === true
      initial={{ x: 100, opacity: 0 }}
      animate={{ 
        x: isHidden ? 100 : 0, 
        opacity: isHidden ? 0 : 1 
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Magnetic strength={0.4}>
        <a 
          href="https://www.instagram.com/v_clubvillas?igsh=aDJzeW95dDhwY2Fl&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.btn}
          aria-label="Наш Instagram"
        >
          <InstagramIcon />
          <div className={`${styles.liquid} ${styles.instaLiquid}`} aria-hidden="true" />
        </a>
      </Magnetic>

      <Magnetic strength={0.4}>
        <a 
          href="https://wa.me/77015292075" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.btn}
          aria-label="Наш WhatsApp"
        >
          <WhatsAppIcon />
          <div className={`${styles.liquid} ${styles.waLiquid}`} aria-hidden="true" />
        </a>
      </Magnetic>
    </motion.div>
  );
}
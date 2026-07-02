"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import styles from "./NotFound.module.css";

// Строгая типизация вместо 'as any'
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 } 
  },
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.noise} />

      <div className={styles.container}>
        
        {/* Типографика */}
        <motion.div 
          className={styles.textZone}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.h1 variants={fadeUp} className={styles.title}>
            404
          </motion.h1>
        </motion.div>

        {/* Зона изображения */}
        <motion.div 
          className={styles.imageZone}
          initial="hidden"
          animate="visible"
          variants={imageReveal}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/404f.webp"
              alt="404 - Страница не найдена"
              fill
              priority
              sizes="(max-width: 768px) 80vw, 480px"
              className={styles.image}
            />
            {/* Исправленная градиентная маска */}
            <div className={styles.imageVignette} />
          </div>
        </motion.div>

        {/* Кнопка возврата */}
        <motion.div 
          className={styles.actionZone}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Link href="/" className={styles.backButton}>
            Вернуться в резиденцию
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import styles from "./Advantages.module.css";

interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  span?: "col-2" | "col-1" | "row-2";
  icon: React.ReactNode;
}

const ADVANTAGES: AdvantageItem[] = [
  {
    id: "river",
    title: "Собственная речка",
    description:
      "Живописная речка проходит через территорию комплекса, создавая атмосферу спокойствия и естественной гармонии с природой.",
    span: "col-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c3-1.5 5 1.5 8 0s5-1.5 8 0M3 9c3-1.5 5 1.5 8 0s5-1.5 8 0" />
      </svg>
    ),
  },
  {
    id: "security",
    title: "Закрытая территория",
    description: "Приватное пространство с контролем доступа обеспечивает безопасность, тишину и комфорт для жителей.",
    span: "col-1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: "ecology",
    title: "Экологичная локация",
    description: "Комплекс расположен у подножия Заилийского Алатау, где свежий горный воздух и природное окружение становятся частью повседневной жизни.",
    span: "col-1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-4m0 0a2 2 0 100-4 2 2 0 000 4zm0-4a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    ),
  },
  {
    id: "family",
    title: "Пространство для семьи",
    description: "Современные детские площадки, прогулочные зоны и благоустроенная территория создают комфортную среду для отдыха, общения и счастливой жизни всей семьи.",
    span: "col-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const customEase = [0.16, 1, 0.3, 1] as any;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, 
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

export function Advantages() {
  return (
    <section id="advantages-section" className={styles.section}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: customEase }}
          >
            ВСЁ ДЛЯ КОМФОРТНОЙ ЖИЗНИ
          </motion.h2>
        </header>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {ADVANTAGES.map((adv) => (
            <motion.div
              key={adv.id}
              variants={itemVariants}
              className={`${styles.card} ${adv.span === "col-2" ? styles.col2 : ""}`}
            >
              <div className={styles.cardGlow} aria-hidden="true" />
              
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>{adv.icon}</div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>{adv.title}</h3>
                  <p className={styles.cardDescription}>{adv.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
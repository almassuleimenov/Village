"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Advantages.module.css";

interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  span?: "col-2" | "col-1" | "row-2";
  icon: React.ReactNode;
}

// Статические данные вынесены из компонента для оптимизации
const ADVANTAGES: AdvantageItem[] = [
  {
    id: "privacy",
    title: "Абсолютная приватность",
    description:
      "Скрытые маршруты, закрытая охраняемая территория и архитектурные решения, которые защищают вашу частную жизнь от посторонних взглядов.",
    span: "col-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: "architecture",
    title: "Вневременная архитектура",
    description: "Монументальный фасад, строгие линии и панорамное остекление, стирающее границу между интерьером и природой.",
    span: "col-1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    id: "engineering",
    title: "Инженерия будущего",
    description: "Системы «Умный дом», премиальная очистка воздуха и воды. Интеллектуальный климат-контроль в каждой комнате.",
    span: "col-1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    id: "ecology",
    title: "Эко-интеграция",
    description: "Проект органично вписан в естественный рельеф. Мы сохранили природный ландшафт и дополнили его вековыми соснами.",
    span: "col-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

// Настройки оркестрации анимаций
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Стандарты без компромиссов
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Философия V Club Village строится на безупречном внимании к деталям. 
            Каждое решение здесь подчинено комфорту и эстетике.
          </motion.p>
        </header>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {ADVANTAGES.map((adv) => (
            <motion.div
              key={adv.id}
              variants={itemVariants as any}
              className={`${styles.card} ${adv.span === "col-2" ? styles.col2 : ""}`}
            >
              {/* Декоративный градиент, реагирующий на hover */}
              <div className={styles.cardGlow} />
              
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
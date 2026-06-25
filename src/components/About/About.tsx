"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import styles from "./About.module.css";

interface ManifestoItem {
  number: string;
  tag: string;
  title: string;
  text: string;
}

interface MetricItem {
  value: string;
  label: string;
  description: string;
}

// Контент сбалансирован по длине строк для идеальной симметрии
const MANIFESTO_DATA: ManifestoItem[] = [
  {
    number: "01",
    tag: "Философия",
    title: "Монументальный минимализм",
    text: "Архитектура резиденций гармонично продолжает природный ландшафт предгорий, сочетая в себе грубую текстуру камня и безупречную гладь остекления.",
  },
  {
    number: "02",
    tag: "Эргономика",
    title: "Манифест личной свободы",
    text: "Каждый квадратный метр спроектирован с учетом сценариев движения света. Интеграция внутренних дворов создает абсолютную автономию для семьи.",
  },
];

const METRICS_DATA: MetricItem[] = [
  {
    value: "5",
    label: "Клубных вилл",
    description: "Ограниченная коллекция резиденций. Закрытое комьюнити для тех, кто ценит бескомпромиссную приватность и статус.",
  },
  {
    value: "6.8 м",
    label: "Высота потолков",
    description: "Просторные интерьеры со вторым светом, дающие невероятное ощущение объема и воздуха.",
  },
  {
    value: "5 мин",
    label: "До горных маршрутов",
    description: "Прямой выход к пешим тропам Заилийского Алатау. Приватные горные маршруты каждый день.",
  },
];

const textEasing = [0.16, 1, 0.3, 1] as any;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: textEasing },
  },
};

export function About() {
  return (
    <section id="about-section" className={styles.aboutSection}>
      <div className={styles.wrapper}>
        
        {/* Верхняя зона с заголовком */}
        <div className={styles.topZone}>
          <div className={styles.headerGrid}>
            <motion.span 
              className={styles.sectionKicker}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              О проекте
            </motion.span>
            <motion.h2 
              className={styles.mainTitle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: textEasing, delay: 0.1 }}
            >
              Бескомпромиссный взгляд на приватность и монументальное качество.
            </motion.h2>
          </div>
        </div>

        {/* Основной блок: Манифест (Bento Grid) */}
        <motion.div 
          className={styles.manifestoGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {MANIFESTO_DATA.map((item) => (
            <motion.article 
              key={item.number} 
              className={styles.card}
              variants={fadeUpVariants}
            >
              <div className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardNumber}>{item.number}</span>
                  <span className={styles.cardTag}>{item.tag}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Блок метрик (Bento Grid) */}
        <motion.div 
          className={styles.metricsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {METRICS_DATA.map((metric, idx) => (
            <motion.div 
              key={idx} 
              className={styles.card}
              variants={fadeUpVariants}
            >
              <div className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.cardContent}>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
                <p className={styles.metricDescription}>{metric.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
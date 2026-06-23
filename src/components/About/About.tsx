"use client";

import React from "react";
import { motion } from "framer-motion";
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

const MANIFESTO_DATA: ManifestoItem[] = [
  {
    number: "01",
    tag: "Философия",
    title: "Монументальный минимализм",
    text: "Мы убрали всё лишнее, чтобы обнажить чистую форму. Архитектура резиденций гармонично продолжает природный ландшафт предгорий, сочетая в себе грубую текстуру натурального камня, благородство темного металла и безупречную гладь панорамного остекления.",
  },
  {
    number: "02",
    tag: "Эргономика",
    title: "Пространство как манифест свободы",
    text: "Каждый квадратный метр спроектирован с учетом сценариев движения света и человека. Высокие потолки, отсутствие слепых зон и интеграция приватных внутренних дворов создают абсолютную автономию для каждого члена семьи.",
  },
];

const METRICS_DATA: MetricItem[] = [
  {
    value: "4.2 м",
    label: "Высота потолков",
    description: "В чистой отделке для максимального объема воздуха.",
  },
  {
    value: "0.45 га",
    label: "Приватный участок",
    description: "Интегрированный вековой сосновый парк вокруг каждой виллы.",
  },
  {
    value: "100%",
    label: "Автономия",
    description: "Резервное жизнеобеспечение: генерация, фильтрация, климат.",
  },
];

// Конфигурация плавных кривых Безье (Luxury Snappy Ease)
const textEasing = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: textEasing },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.4, ease: textEasing },
  },
};

export function About() {
  return (
    <section id="about-section" className={styles.aboutSection}>
      <div className={styles.wrapper}>
        
        {/* Верхняя линия и заголовок-айстоппер */}
        <div className={styles.topZone}>
          <motion.div 
            className={styles.horizontalLine}
            variants={lineVariants as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          />
          <div className={styles.headerGrid}>
            <motion.span 
              className={styles.sectionKicker}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
            </motion.span>
            <motion.h2 
              className={styles.mainTitle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: textEasing as any, delay: 0.1 }}
            >
              Бескомпромиссный взгляд на приватность и монументальное качество.
            </motion.h2>
          </div>
        </div>

        {/* Основной блок: Манифест */}
        <motion.div 
          className={styles.manifestoGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {MANIFESTO_DATA.map((item) => (
            <motion.article 
              key={item.number} 
              className={styles.manifestoCard}
              variants={fadeUpVariants as any}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>{item.number}</span>
                <span className={styles.cardTag}>{item.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* Блок метрик с тонкими разделительными линиями */}
        <div className={styles.metricsZone}>
          <motion.div 
            className={styles.horizontalLine}
            variants={lineVariants as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
          <motion.div 
            className={styles.metricsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {METRICS_DATA.map((metric, idx) => (
              <motion.div 
                key={idx} 
                className={styles.metricItem}
                variants={fadeUpVariants as any}
              >
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
                <p className={styles.metricDescription}>{metric.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
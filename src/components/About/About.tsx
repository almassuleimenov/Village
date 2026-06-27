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

// Контент от копирайтера (исправлены переносы \n без лишних пробелов)
const MANIFESTO_DATA: ManifestoItem[] = [
  {
    number: "01",
    tag: "Философия",
    title: "Архитектура,\nсозданная для жизни",
    text: "Каждая вилла спроектирована так, чтобы наполнять пространство естественным светом, открывать виды на горы и дарить ощущение свободы. Современная архитектура подчеркивает статус проекта, сохраняя гармонию с окружающей природой.",
  },
  {
    number: "02",
    tag: "Пространство",
    title: "Комфорт\nв каждой детали",
    text: "Высокие потолки, панорамное остекление, второй свет в гостиной и функциональные планировки создают просторные интерьеры, которые легко адаптировать под собственный стиль жизни.",
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
    value: "410 м²",
    label: "Общая площадь виллы",
    description: "Идеально сбалансированное пространство для жизни. Безупречное зонирование включает панорамную гостиную, просторные мастер-спальни и открытые террасы.",
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
        
        {/* Верхняя зона с заголовком и описанием */}
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
            
            {/* Обертка для Заголовка и нового текста */}
            <div className={styles.titleWrapper}>
              <motion.h2 
                className={styles.mainTitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: textEasing, delay: 0.1 }}
              >
                Жизнь, где природа <br />становится частью дома.
              </motion.h2>
            </div>
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
                {/* Заголовок с точным выравниванием */}
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
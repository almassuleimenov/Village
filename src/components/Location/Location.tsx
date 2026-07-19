"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from "@/context/LanguageContext";
import styles from './Location.module.css';

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  iframeTitle: string;
}> = {
  ru: {
    titleLine1: "Вдали от суеты.",
    titleLine2: "В центре событий.",
    subtitle: "Экологически чистый предгорный район с идеальной транспортной доступностью. Воздух, которым хочется дышать, и инфраструктура, к которой вы привыкли.",
    iframeTitle: "Расположение V Club Villas на карте"
  },
  en: {
    titleLine1: "Far from the hustle.",
    titleLine2: "In the center of events.",
    subtitle: "An eco-friendly foothill area with perfect transport accessibility. Air you want to breathe, and the infrastructure you are used to.",
    iframeTitle: "V Club Villas location on the map"
  },
  kz: {
    titleLine1: "У-шудан қашық.",
    titleLine2: "Оқиғалар орталығында.",
    subtitle: "Керемет көлік қатынасы бар экологиялық таза тау бөктері. Жұтқың келетін таза ауа және өзіңіз үйренген инфрақұрылым.",
    iframeTitle: "V Club Villas картадағы орналасуы"
  }
};

export function Location() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="location-section" className={styles.section}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.titleLine1}<br />{t.titleLine2}
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.subtitle}
          </motion.p>
        </header>

        <motion.div 
          className={styles.mapWrapper}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Контейнер Iframe */}
          <div className={styles.iframeContainer}>
            <iframe 
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A9c1fecfaf37e5dbbd57b267beab1ecea2de6f9522a89801cd5ad5275aaebc82f&source=constructor" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              loading="lazy"
              title={t.iframeTitle}
              className={styles.mapIframe}
            />
          </div>
          
          {/* Рамка-градиент поверх карты для интеграции в фон */}
          <div className={styles.mapVignette} aria-hidden="true" />
        </motion.div>

      </div>
    </section>
  );
}
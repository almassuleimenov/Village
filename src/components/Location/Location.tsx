"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Location.module.css';

// Статические данные для плавающих карточек (O(1) Memory)

export function Location() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Вдали от суеты.<br />В центре событий.
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Экологически чистый предгорный район с идеальной транспортной доступностью. 
            Воздух, которым хочется дышать, и инфраструктура, к которой вы привыкли.
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
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab47435fa340f5d62f619ff98703a3c58b8598b80531abea5c21e5a707aa13909&source=constructor" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              loading="lazy"
              title="Расположение V Club Village на карте"
              className={styles.mapIframe}
            />
          </div>
          
          {/* Рамка-градиент поверх карты для интеграции в фон */}
          <div className={styles.mapVignette} />
        </motion.div>

      </div>
    </section>
  );
}
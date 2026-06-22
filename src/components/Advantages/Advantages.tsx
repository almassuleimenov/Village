"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Advantages.module.css';

interface Advantage {
  id: string;
  title: string;
  description: string;
  visualClassName: string;
}

// Статические данные O(1) memory
const ADVANTAGES: Advantage[] = [
  {
    id: 'privacy',
    title: 'Абсолютная приватность',
    description: 'Интеллектуальная система контроля доступа, скрытые маршруты для персонала и продуманная посадка зданий, исключающая вид "окна в окна".',
    visualClassName: styles.visualPrivacy
  },
  {
    id: 'engineering',
    title: 'Инженерный интеллект',
    description: 'Системы очистки воздуха хирургического уровня, автономное резервное энергоснабжение и бесшовная интеграция умного дома в каждый элемент пространства.',
    visualClassName: styles.visualEngineering
  },
  {
    id: 'community',
    title: 'Курируемое комьюнити',
    description: 'Закрытый клуб для резидентов. Единая социальная среда, где ваши соседи разделяют те же ценности, уровень жизни и эстетический вкус.',
    visualClassName: styles.visualCommunity
  },
  {
    id: 'architecture',
    title: 'Архитектура вне времени',
    description: 'Монументальный фасад из юрского мрамора, строгие геометрические линии и панорамное остекление, стирающее границу между интерьером и ландшафтом.',
    visualClassName: styles.visualArchitecture
  }
];

const AUTO_PLAY_INTERVAL = 5000; // 5 секунд на каждый слайд

export function Advantages() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Логика авто-переключения с паузой при наведении (Apple-style behavior)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ADVANTAGES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <h2 className={styles.mainTitle}>Непревзойденный стандарт.</h2>
          <p className={styles.subtitle}>
            Мы переосмыслили каждый аспект премиальной недвижимости, чтобы создать среду, которая предугадывает ваши желания до их появления.
          </p>
        </header>

        <div 
          className={styles.contentGrid}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Левая колонка: Интерактивный список */}
          <div className={styles.listContainer}>
            {ADVANTAGES.map((adv, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={adv.id}
                  className={`${styles.listItem} ${isActive ? styles.listActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.itemIndex}>0{index + 1}</span>
                    <h3 className={styles.itemTitle}>{adv.title}</h3>
                  </div>

                  {/* Emil Kowalski style spring layout animation */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={styles.itemDescriptionWrapper}
                      >
                        <p className={styles.itemDescription}>{adv.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Индикатор прогресса для активного элемента */}
                  {isActive && (
                    <div className={styles.progressBarWrapper}>
                      <motion.div 
                        className={styles.progressBar}
                        initial={{ width: "0%" }}
                        animate={{ width: isHovered ? "100%" : "100%" }}
                        transition={{ 
                          duration: AUTO_PLAY_INTERVAL / 1000, 
                          ease: "linear" 
                        }}
                        // Сброс анимации при смене индекса
                        key={`progress-${activeIndex}`} 
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Правая колонка: Визуальное окно (Glassmorphism) */}
          <div className={styles.visualContainer}>
            <div className={styles.visualGlass}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`${styles.visualContent} ${ADVANTAGES[activeIndex].visualClassName}`}
                >
                  {/* Здесь абстрактный CSS-контент. Позже можно заменить на <img src={adv.image} /> */}
                  {activeIndex === 0 && <div className={styles.pulseRing} />}
                  {activeIndex === 1 && <div className={styles.scannerLine} />}
                  {activeIndex === 2 && (
                    <>
                      <div className={`${styles.orb} ${styles.orb1}`} />
                      <div className={`${styles.orb} ${styles.orb2}`} />
                    </>
                  )}
                  {activeIndex === 3 && (
                    <div className={styles.archLines}>
                      <div className={styles.lineH} />
                      <div className={styles.lineV} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
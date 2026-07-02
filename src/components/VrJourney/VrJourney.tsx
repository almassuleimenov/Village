"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/Cursor/Magnetic";
import styles from "./VrJourney.module.css";

// Строгая типизация для кривой Безье
const customEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  btnEnterText: string;
  btnEnterAria: string;
  btnCloseAria: string;
  tagInteractive: string;
  tag360: string;
  title: string;
  description: string;
}> = {
  ru: {
    btnEnterText: "Вход",
    btnEnterAria: "Войти в виртуальную реальность",
    btnCloseAria: "Закрыть VR тур",
    tagInteractive: "Интерактивный опыт",
    tag360: "Обзор 360°",
    title: "Ощутите масштаб пространства",
    description: "Шагните внутрь резиденции прямо сейчас. Оцените безупречную эргономику, монументальную высоту потолков и атмосферу абсолютной приватности еще до завершения строительства."
  },
  en: {
    btnEnterText: "Enter",
    btnEnterAria: "Enter virtual reality",
    btnCloseAria: "Close VR tour",
    tagInteractive: "Interactive Experience",
    tag360: "360° View",
    title: "Feel the Scale of the Space",
    description: "Step inside the residence right now. Appreciate the flawless ergonomics, monumental ceiling height, and atmosphere of absolute privacy even before construction is complete."
  },
  kz: {
    btnEnterText: "Кіру",
    btnEnterAria: "Виртуалды шындыққа кіру",
    btnCloseAria: "VR турды жабу",
    tagInteractive: "Интерактивті тәжірибе",
    tag360: "360° шолу",
    title: "Кеңістіктің ауқымын сезініңіз",
    description: "Резиденцияның ішіне дәл қазір қадам басыңыз. Құрылыс аяқталмас бұрын мінсіз эргономиканы, монументалды төбе биіктігін және абсолютті құпиялылық атмосферасын бағалаңыз."
  }
};

export function VrJourney() {
  const { language } = useLanguage();
  const t = translations[language];

  const [isActive, setIsActive] = useState<boolean>(false);

  // Управление блокировкой глобального скролла
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  return (
    <section id="vr-section" className={styles.section}>
    <section className={styles.section}>
      <div className={styles.wrapper}>
        
        {/* --- СОСТОЯНИЕ 1: КИНЕМАТОГРАФИЧНОЕ ПРЕВЬЮ --- */}
        <div className={styles.previewContainer}>
          {/* Эмбиентный фон */}
          <div className={styles.ambientBackground} aria-hidden="true">
            <div className={styles.orbOne} />
            <div className={styles.orbTwo} />
            <div className={styles.noiseOverlay} />
          </div>

          <div className={styles.previewContent}>
            
            {/* Центральная зона с огромной магнитной кнопкой */}
            <div className={styles.centerZone}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, delay: 0.2, ease: customEasing }}
              >
                <Magnetic strength={0.6}>
                  <button 
                    className={styles.massivePlayButton} 
                    onClick={() => setIsActive(true)}
                    aria-label={t.btnEnterAria}
                  >
                    <span className={styles.playText}>{t.btnEnterText}</span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Подвал карточки с типографикой */}
            <motion.div 
              className={styles.bottomZone}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, ease: customEasing }}
            >
              <div className={styles.metaTags}>
                <span className={styles.tag}>{t.tagInteractive}</span>
                <span className={styles.tag}>{t.tag360}</span>
              </div>
              
              <div className={styles.textGrid}>
                <h2 className={styles.title}>{t.title}</h2>
                <p className={styles.description}>{t.description}</p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* --- СОСТОЯНИЕ 2: ПОЛНОЭКРАННЫЙ VR ПОРТАЛ С IFRAME --- */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className={styles.vrPortal}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.7, ease: customEasing }}
          >
            <div className={styles.closeControl}>
              <Magnetic strength={0.5}>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setIsActive(false)}
                  aria-label={t.btnCloseAria}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Magnetic>
            </div>
            
            <div className={styles.vrTarget}>
              <iframe 
                className={styles.iframe}
                src="https://theviewer.co/share/d3823cce-b3cf-4d6e-bef4-4fde833679ab/0cc7f2e4-8e14-4e36-937c-8247c9201e8d?linkType=BehanceEmbedLink" 
                allow="accelerometer; encrypted-media; gyroscope; autoplay;" 
                allowFullScreen={true}
                title="VR Tour"
                loading="lazy"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
    </section>
  );
}
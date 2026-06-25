"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "@/components/Cursor/Magnetic";
import styles from "./VrJourney.module.css";

const customEasing = [0.16, 1, 0.3, 1] as any;

export function VrJourney() {
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
    <section className={styles.section}>
      <div className={styles.wrapper}>
        
        {/* --- СОСТОЯНИЕ 1: КИНЕМАТОГРАФИЧНОЕ ПРЕВЬЮ --- */}
        <div className={styles.previewContainer}>
          {/* Эмбиентный фон (замена отсутствующим рендерам) */}
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
                    aria-label="Войти в виртуальную реальность"
                  >
                    <span className={styles.playText}>Вход</span>
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
                <span className={styles.tag}>Интерактивный опыт</span>
                <span className={styles.tag}>Обзор 360°</span>
              </div>
              
              <div className={styles.textGrid}>
                <h2 className={styles.title}>Ощутите масштаб пространства</h2>
                <p className={styles.description}>
                  Шагните внутрь резиденции прямо сейчас. Оцените безупречную эргономику, 
                  монументальную высоту потолков и атмосферу абсолютной приватности 
                  еще до завершения строительства.
                </p>
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
                  aria-label="Закрыть VR тур"
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
                src="https://theviewer.co/share/theConstruct/d29e6438-74e0-4899-bcea-104754721297?linkType=BehanceEmbedLink" 
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
  );
}
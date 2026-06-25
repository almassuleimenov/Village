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
      {/* --- СОСТОЯНИЕ 1: ПРЕВЬЮ --- */}
      <div className={styles.previewWrapper}>
        <div className={styles.glowOverlay} aria-hidden="true" />
        
        <div className={styles.content}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: customEasing }}
            className={styles.textContent}
          >
            <span className={styles.kicker}>VR 360°</span>
            <h2 className={styles.title}>Погружение в пространство</h2>
            <p className={styles.description}>
              Оцените масштабы резиденции, эргономику планировок и интеграцию 
              с природным ландшафтом в интерактивном формате.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: customEasing }}
          >
            <Magnetic strength={0.4}>
              <button 
                className={styles.playButton} 
                onClick={() => setIsActive(true)}
                aria-label="Открыть VR тур"
              >
                <span className={styles.playIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span className={styles.playText}>Начать путешествие</span>
              </button>
            </Magnetic>
          </motion.div>
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
              {/* Используем iframe для безопасной изоляции 3D-контекста */}
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
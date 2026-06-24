"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
// Убедитесь, что путь к вашему Magnetic компоненту указан верно
import { Magnetic } from "@/components/Cursor/Magnetic"; 

// Оставили только блок Контактов
const FOOTER_COLUMNS = [
  {
    title: "Контакты",
    links: [
      { label: "Офис продаж", href: "/contacts" },
      { label: "vclubvillas@gmail.com", href: "mailto:vclubvillas@gmail.com" },
      { label: "+7 (700) 123-45-67", href: "tel:+77001234567" },
    ],
  },
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

// Анимации появления
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Основная сетка навигации */}
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Левая группа: Контакты и Соцсети */}
          <div className={styles.leftGroup}>
            {FOOTER_COLUMNS.map((col, idx) => (
              <motion.div key={idx} variants={columnVariants as any} className={styles.column}>
                <h4 className={styles.columnTitle}>{col.title}</h4>
                <ul className={styles.linkList}>
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div variants={columnVariants as any} className={styles.column}>
              <h4 className={styles.columnTitle}>Социальные сети</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="https://instagram.com/v_village" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <InstagramIcon />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://t.me/v_village" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <TelegramIcon />
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Правая группа: Магнитная кнопка "Наверх" */}
          <motion.div variants={columnVariants as any} className={styles.rightGroup}>
            <Magnetic strength={0.4}>
              <button onClick={scrollToTop} className={styles.backToTopBtn} aria-label="Вернуться наверх">
                <span className={styles.backToTopText}>Наверх</span>
                <div className={styles.backToTopCircle}>
                  <ArrowUpIcon />
                </div>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Разделитель */}
        <div className={styles.divider} />

        {/* Юридический блок (Compliance) */}
        <div className={styles.legalZone}>
          <div className={styles.copyright}>
            Copyright © {new Date().getFullYear()} V Club Village. All rights reserved.
          </div>
          
          <div className={styles.legalLinks}>
            <a href="/terms-of-use">Terms of Use</a>
            <span className={styles.dot}>&middot;</span>
            <a href="/privacy-policy">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
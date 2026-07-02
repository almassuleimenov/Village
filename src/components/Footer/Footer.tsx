"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";
// Убедитесь, что путь к вашему Magnetic компоненту указан верно
import { Magnetic } from "@/components/Cursor/Magnetic"; 

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  contactsTitle: string;
  salesOffice: string;
  socialsTitle: string;
  address: string;
  backToTop: string;
  backToTopAria: string;
  terms: string;
  privacy: string;
  rights: string;
}> = {
  ru: {
    contactsTitle: "Контакты",
    salesOffice: "Офис продаж",
    socialsTitle: "Социальные сети",
    address: "ул. Алатау, 54",
    backToTop: "Наверх",
    backToTopAria: "Вернуться наверх",
    terms: "Пользовательское соглашение",
    privacy: "Политика конфиденциальности",
    rights: "Все права защищены."
  },
  en: {
    contactsTitle: "Contacts",
    salesOffice: "Sales Office",
    socialsTitle: "Social Networks",
    address: "54 Alatau st.",
    backToTop: "Top",
    backToTopAria: "Back to top",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    rights: "All rights reserved."
  },
  kz: {
    contactsTitle: "Байланыс",
    salesOffice: "Сату бөлімі",
    socialsTitle: "Әлеуметтік желілер",
    address: "Алатау көшесі, 54",
    backToTop: "Жоғарыға",
    backToTopAria: "Жоғарыға қайту",
    terms: "Пайдалану шарттары",
    privacy: "Құпиялылық саясаты",
    rights: "Барлық құқықтар қорғалған."
  }
};

// Иконки в едином стиле (strokeWidth="1.5")
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
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
  const { language } = useLanguage();
  const t = translations[language];

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
          {/* Левая группа: Контакты и Соцсети/Адреса */}
          <div className={styles.leftGroup}>
            
            {/* Колонка: Контакты */}
            <motion.div variants={columnVariants as any} className={styles.column}>
              <h4 className={styles.columnTitle}>{t.contactsTitle}</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="https://wa.me/77760002507" className={styles.link} target="_blank" rel="noopener noreferrer">
                    {t.salesOffice}
                  </a>
                </li>
                <li>
                  <a href="tel:+77760002507" className={styles.link}>
                    8 776 000 25 07
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Колонка: Социальные сети */}
            <motion.div variants={columnVariants as any} className={styles.column}>
              <h4 className={styles.columnTitle}>{t.socialsTitle}</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="https://www.instagram.com/v_clubvillas" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <InstagramIcon />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://2gis.kz/almaty/geo/9430047375119615/76.895892,43.150935" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <MapPinIcon />
                    {t.address}
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/77760002507" target="_blank" rel="noopener noreferrer" className={styles.link}>
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
              <button onClick={scrollToTop} className={styles.backToTopBtn} aria-label={t.backToTopAria}>
                <span className={styles.backToTopText}>{t.backToTop}</span>
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
            Copyright © {new Date().getFullYear()} V Club Village. {t.rights}
          </div>
          
          <div className={styles.legalLinks}>
            <a href="/terms-of-use">{t.terms}</a>
            <span className={styles.dot}>&middot;</span>
            <a href="/privacy-policy">{t.privacy}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
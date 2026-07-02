"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Advantages.module.css";

// === ИКОНКИ (вынесены отдельно, чтобы не дублировать в переводах) ===
const ICONS: Record<string, React.ReactNode> = {
  river: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c3-1.5 5 1.5 8 0s5-1.5 8 0M3 9c3-1.5 5 1.5 8 0s5-1.5 8 0" />
    </svg>
  ),
  security: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  ecology: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-4m0 0a2 2 0 100-4 2 2 0 000 4zm0-4a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  ),
  family: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
};

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
type SpanType = "col-2" | "col-1" | "row-2";

interface AdvantageItem {
  id: keyof typeof ICONS;
  title: string;
  description: string;
  span?: SpanType;
}

const translations: Record<string, {
  headerTitle: string;
  items: AdvantageItem[];
}> = {
  ru: {
    headerTitle: "ВСЁ ДЛЯ КОМФОРТНОЙ ЖИЗНИ",
    items: [
      {
        id: "river",
        title: "Собственная речка",
        description: "Живописная речка проходит через территорию комплекса, создавая атмосферу спокойствия и естественной гармонии с природой.",
        span: "col-2",
      },
      {
        id: "security",
        title: "Закрытая территория",
        description: "Приватное пространство с контролем доступа обеспечивает безопасность, тишину и комфорт для жителей.",
        span: "col-1",
      },
      {
        id: "ecology",
        title: "Экологичная локация",
        description: "Комплекс расположен у подножия Заилийского Алатау, где свежий горный воздух и природное окружение становятся частью повседневной жизни.",
        span: "col-1",
      },
      {
        id: "family",
        title: "Пространство для семьи",
        description: "Современные детские площадки, прогулочные зоны и благоустроенная территория создают комфортную среду для отдыха, общения и счастливой жизни всей семьи.",
        span: "col-2",
      },
    ]
  },
  en: {
    headerTitle: "EVERYTHING FOR COMFORTABLE LIVING",
    items: [
      {
        id: "river",
        title: "Private River",
        description: "A picturesque river flows through the complex, creating an atmosphere of tranquility and natural harmony with nature.",
        span: "col-2",
      },
      {
        id: "security",
        title: "Gated Community",
        description: "A private space with access control ensures safety, silence, and comfort for all residents.",
        span: "col-1",
      },
      {
        id: "ecology",
        title: "Eco-Friendly Location",
        description: "Located at the foothills of the Trans-Ili Alatau, where fresh mountain air and natural surroundings become part of everyday life.",
        span: "col-1",
      },
      {
        id: "family",
        title: "Space for Family",
        description: "Modern playgrounds, walking areas, and landscaped grounds create a comfortable environment for relaxation, socialization, and happy family life.",
        span: "col-2",
      },
    ]
  },
  kz: {
    headerTitle: "ЖАЙЛЫ ӨМІР СҮРУГЕ АРНАЛҒАН БАРЛЫҚ ЖАҒДАЙ",
    items: [
      {
        id: "river",
        title: "Жеке өзен",
        description: "Кешен аумағынан өтетін көркем өзен тыныштық пен табиғатпен табиғи үйлесімділік атмосферасын жасайды.",
        span: "col-2",
      },
      {
        id: "security",
        title: "Жабық аумақ",
        description: "Кіруді бақылауы бар жеке кеңістік тұрғындар үшін қауіпсіздікті, тыныштық пен жайлылықты қамтамасыз етеді.",
        span: "col-1",
      },
      {
        id: "ecology",
        title: "Экологиялық орналасу",
        description: "Іле Алатауының бөктерінде орналасқан кешенде таза тау ауасы мен табиғи орта күнделікті өмірдің бір бөлігіне айналады.",
        span: "col-1",
      },
      {
        id: "family",
        title: "Отбасылық кеңістік",
        description: "Заманауи ойын алаңдары, серуендеу аймақтары және абаттандырылған аумақ бүкіл отбасының демалуы мен бақытты өмір сүруі үшін жайлы орта жасайды.",
        span: "col-2",
      },
    ]
  }
};

const customEase = [0.16, 1, 0.3, 1] as any;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, 
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

export function Advantages() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="advantages-section" className={styles.section}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: customEase }}
          >
            {t.headerTitle}
          </motion.h2>
        </header>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {t.items.map((adv) => (
            <motion.div
              key={adv.id}
              variants={itemVariants}
              className={`${styles.card} ${adv.span === "col-2" ? styles.col2 : ""}`}
            >
              <div className={styles.cardGlow} aria-hidden="true" />
              
              <div className={styles.cardContent}>
                {/* Подставляем иконку по ID из словаря ICONS */}
                <div className={styles.iconWrapper}>{ICONS[adv.id]}</div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>{adv.title}</h3>
                  <p className={styles.cardDescription}>{adv.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
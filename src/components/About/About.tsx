"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext"; // Импортируем наш хук
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

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  manifesto: ManifestoItem[];
  metrics: MetricItem[];
}> = {
  ru: {
    kicker: "О проекте",
    titleLine1: "Жизнь, где природа",
    titleLine2: "становится частью дома.",
    manifesto: [
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
    ],
    metrics: [
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
    ]
  },
  en: {
    kicker: "About the Project",
    titleLine1: "A life where nature",
    titleLine2: "becomes part of your home.",
    manifesto: [
      {
        number: "01",
        tag: "Philosophy",
        title: "Architecture\ndesigned for living",
        text: "Each villa is designed to fill the space with natural light, open up mountain views, and give a sense of freedom. Modern architecture emphasizes the project's status while maintaining harmony with the surrounding nature.",
      },
      {
        number: "02",
        tag: "Space",
        title: "Comfort\nin every detail",
        text: "High ceilings, panoramic windows, double-height living rooms, and functional layouts create spacious interiors that are easy to adapt to your own lifestyle.",
      },
    ],
    metrics: [
      {
        value: "5",
        label: "Club Villas",
        description: "A limited collection of residences. A closed community for those who value uncompromising privacy and status.",
      },
      {
        value: "6.8 m",
        label: "Ceiling height",
        description: "Spacious interiors with double-height ceilings, providing an incredible sense of volume and air.",
      },
      {
        value: "410 m²",
        label: "Total villa area",
        description: "Perfectly balanced living space. Flawless zoning includes a panoramic living room, spacious master bedrooms, and open terraces.",
      },
    ]
  },
  kz: {
    kicker: "Жоба туралы",
    titleLine1: "Табиғат үйдің бір бөлігіне",
    titleLine2: "айналатын өмір.",
    manifesto: [
      {
        number: "01",
        tag: "Философия",
        title: "Өмір сүруге\nарналған сәулет",
        text: "Әрбір вилла кеңістікті табиғи жарықпен толтырып, тау көріністерін ашып, еркіндік сезімін сыйлау үшін жобаланған. Заманауи сәулет қоршаған табиғатпен үйлесімділікті сақтай отырып, жобаның мәртебесін көрсетеді.",
      },
      {
        number: "02",
        tag: "Кеңістік",
        title: "Әр бөлшектегі\nжайлылық",
        text: "Биік төбелер, панорамалық терезелер, қонақ бөлмедегі екінші жарық және функционалды жоспарлау сіздің өмір салтыңызға оңай бейімделетін кең интерьер жасайды.",
      },
    ],
    metrics: [
      {
        value: "5",
        label: "Клуб вилласы",
        description: "Резиденциялардың шектеулі топтамасы. Ымырасыз құпиялылық пен мәртебені бағалайтындарға арналған жабық қауымдастық.",
      },
      {
        value: "6.8 м",
        label: "Төбе биіктігі",
        description: "Екінші жарығы бар кең интерьерлер, көлем мен ауаның керемет сезімін береді.",
      },
      {
        value: "410 м²",
        label: "Вилланың жалпы ауданы",
        description: "Өмір сүруге арналған тамаша теңдестірілген кеңістік. Мінсіз аймақтарға бөлу панорамалық қонақ бөлмені, кең шебер жатын бөлмелерін және ашық террассаларды қамтиды.",
      },
    ]
  }
};

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
  // Подключаем язык из контекста
  const { language } = useLanguage();
  const t = translations[language];

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
              {t.kicker}
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
                {t.titleLine1} <br />{t.titleLine2}
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
          {t.manifesto.map((item) => (
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
          {t.metrics.map((metric, idx) => (
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
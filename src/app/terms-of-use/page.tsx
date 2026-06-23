"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Legal.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
} as any;

export default function TermsOfUse() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <motion.a 
          href="/" 
          className={styles.backLink}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          ← Вернуться на главную
        </motion.a>

        <motion.h1 
          className={styles.title}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Пользовательское соглашение
        </motion.h1>
        
        <motion.span 
          className={styles.lastUpdated}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Последнее обновление: {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </motion.span>

        <motion.div 
          className={styles.contentBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>1. Юридическая оговорка (Не публичная оферта)</h2>
            <p className={styles.text}>
              Вся информация, представленная на данном веб-сайте, включая 3D-визуализации, планировки, генплан, текстовые описания и технические характеристики проекта V Club Village, носит исключительно информационный (ознакомительный) характер. Ни при каких условиях материалы сайта не являются публичной офертой, определяемой положениями гражданского законодательства.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>2. Иллюстративный характер материалов</h2>
            <p className={styles.text}>
              Рендеры, архитектурные эскизы и видеоматериалы являются художественным вымыслом и демонстрируют концептуальное видение проекта. Фактический внешний вид фасадов, материалы отделки, ландшафтный дизайн и благоустройство территории могут отличаться от представленных иллюстраций на этапе реализации проекта. Застройщик оставляет за собой право вносить изменения в проектную документацию без предварительного уведомления.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>3. Интеллектуальная собственность</h2>
            <p className={styles.text}>
              Все элементы дизайна, текст, графика, логотипы, видео, изображения и программный код являются интеллектуальной собственностью V Club Village или ее лицензиаров. Любое копирование, распространение или использование материалов сайта в коммерческих целях без письменного разрешения правообладателя строго запрещено и преследуется по закону.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp as any}>
            <h2 className={styles.sectionTitle}>4. Ограничение ответственности</h2>
            <p className={styles.text}>
              Администрация сайта не несет ответственности за любые прямые или косвенные убытки, упущенную выгоду или ущерб, возникшие в результате использования или невозможности использования данного сайта, а также в результате доверия к любой информации, размещенной на нем. Точные условия приобретения недвижимости фиксируются исключительно в индивидуальном договоре купли-продажи.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
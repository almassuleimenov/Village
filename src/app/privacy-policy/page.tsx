"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Legal.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}as any;

export default function PrivacyPolicy() {
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
          Политика конфиденциальности
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
            <h2 className={styles.sectionTitle}>1. Сбор персональных данных</h2>
            <p className={styles.text}>
              Мы уважаем вашу приватность. Оставляя заявку на сайте через форму "Станьте резидентом", вы даете свое согласие на сбор и обработку следующих данных:
            </p>
            <ul className={styles.list}>
              <li>Ваше имя (для персонального обращения).</li>
              <li>Номер контактного телефона (для связи с консьержем или отделом продаж).</li>
              <li>Технические данные (IP-адрес, файлы cookie) для улучшения работы сайта.</li>
            </ul>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>2. Цели использования данных</h2>
            <p className={styles.text}>
              Предоставленная вами информация используется строго по назначению:
            </p>
            <ul className={styles.list}>
              <li>Для обратного звонка и организации закрытого показа вилл.</li>
              <li>Для направления презентационных материалов по вашему запросу.</li>
              <li>Для уведомления о статусе строительства (только при вашем согласии).</li>
            </ul>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>3. Защита и передача информации</h2>
            <p className={styles.text}>
              Ваши данные хранятся на защищенных серверах с использованием современных протоколов шифрования. Мы гарантируем, что ваши контактные данные не будут проданы, переданы или раскрыты третьим лицам (маркетинговым агентствам, спам-базам), за исключением случаев, прямо предусмотренных действующим законодательством.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>4. Ваши права</h2>
            <p className={styles.text}>
              Вы имеете право в любой момент отозвать свое согласие на обработку персональных данных, запросить удаление вашего номера из нашей базы или изменить предоставленную информацию. Для этого достаточно сообщить об этом вашему персональному менеджеру или направить письмо на наш электронный адрес.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
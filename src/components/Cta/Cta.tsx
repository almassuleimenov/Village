"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "./Cta.module.css";
// Подключаем Magnetic
import { Magnetic } from "../Cursor/Magnetic";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as any;

// Строгая типизация анимаций
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const springItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: springTransition 
  },
};

export function Cta() {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus("loading");

    // Имитация асинхронного запроса (API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("success");
  };

  return (
    <section id="cta-section" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }} // Заменен пиксельный марджин на относительный
        >
          {/* Левая часть: Текст */}
          <div className={styles.textContent}>
            <motion.h2 variants={springItem} className={styles.title}>
              Станьте резидентом V Club Villas
            </motion.h2>
            <motion.p variants={springItem} className={styles.subtitle}>
              Оставьте заявку на закрытый показ. Наш консьерж свяжется с вами в течение 15 минут для обсуждения деталей.
            </motion.p>
          </div>

          {/* Правая часть: Форма */}
          <motion.div variants={springItem} className={styles.formWrapper}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springTransition}
                  className={styles.successState}
                >
                  <div className={styles.successIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3>Заявка принята</h3>
                  <p>Мы скоро свяжемся с вами.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  layout
                  onSubmit={handleSubmit}
                  className={styles.form}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={springTransition}
                >
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder=" "
                      required
                      autoComplete="name" // Вызов системного автозаполнения имени
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <label htmlFor="name" className={styles.label}>Ваше имя</label>
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder=" "
                      required
                      inputMode="tel" // Принудительный вызов цифровой клавиатуры на мобильных
                      autoComplete="tel" // Вызов системного автозаполнения телефона
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <label htmlFor="phone" className={styles.label}>Номер телефона</label>
                  </div>

                  <Magnetic strength={0.1}>
                    <motion.button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={status === "loading"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springTransition}
                    >
                      {status === "loading" ? (
                        <span className={styles.loader} />
                      ) : (
                        "Запросить показ"
                      )}
                    </motion.button>
                  </Magnetic>

                  <p className={styles.disclaimer}>
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
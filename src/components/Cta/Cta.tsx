"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "./Cta.module.css";
import { Magnetic } from "../Cursor/Magnetic";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as any;

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

    // Имитация асинхронного запроса
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("success");
  };

  return (
    <section id="cta-section" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Декоративное свечение внутри карточки */}
          <div className={styles.cardGlow} aria-hidden="true" />

          <div className={styles.grid}>
            {/* Левая часть: Премиальный Текст */}
            <div className={styles.textContent}>
              <motion.span variants={springItem} className={styles.kicker}>
                [ Закрытый показ ]
              </motion.span>
              <motion.h2 variants={springItem} className={styles.title}>
                Индивидуальная презентация
              </motion.h2>
              <motion.p variants={springItem} className={styles.subtitle}>
                Оставьте контактные данные. Персональный брокер свяжется с вами для организации приватного визита в резиденции V Club.
              </motion.p>
            </div>

            {/* Правая часть: Элегантная Форма */}
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
                    <h3>Ваша заявка принята</h3>
                    <p>Персональный брокер свяжется с вами в ближайшее время.</p>
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
                        autoComplete="name"
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
                        inputMode="tel"
                        autoComplete="tel"
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
                          <span className={styles.btnText}>Запланировать визит</span>
                        )}
                        {/* Водяной слой для эффекта наполнения */}
                        <div className={styles.liquid} aria-hidden="true" />
                      </motion.button>
                    </Magnetic>

                    <p className={styles.disclaimer}>
                      Гарантируем абсолютную конфиденциальность ваших данных.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
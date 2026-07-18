"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
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
    transition: springTransition,
  },
};

// Целевой номер WhatsApp в международном формате без плюса
const WHATSAPP_NUMBER = "77753159203";

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  kicker: string;
  title: string;
  subtitle: string;
  nameLabel: string;
  phoneLabel: string;
  submitBtn: string;
  disclaimer: string;
  successTitle: string;
  successDesc: string;
  // Функция для генерации сообщения на нужном языке
  generateMessage: (name: string, phone: string) => string;
}> = {
  ru: {
    kicker: "[ Закрытый показ ]",
    title: "Индивидуальная презентация",
    subtitle: "Оставьте контактные данные. Персональный брокер свяжется с вами для организации приватного визита в резиденции V Club.",
    nameLabel: "Ваше имя",
    phoneLabel: "Номер телефона",
    submitBtn: "Запланировать визит",
    disclaimer: "Гарантируем абсолютную конфиденциальность ваших данных.",
    successTitle: "Перенаправление в WhatsApp",
    successDesc: "Диалог с персональным брокером открыт в новой вкладке.",
    generateMessage: (name, phone) => `Здравствуйте! Я хочу запланировать индивидуальную презентацию резиденций V Club.\n\nИмя: ${name}\nТелефон: ${phone}`
  },
  en: {
    kicker: "[ Private Viewing ]",
    title: "Individual Presentation",
    subtitle: "Leave your contact details. A personal broker will contact you to arrange a private visit to the V Club residences.",
    nameLabel: "Your Name",
    phoneLabel: "Phone Number",
    submitBtn: "Schedule a Visit",
    disclaimer: "We guarantee absolute confidentiality of your data.",
    successTitle: "Redirecting to WhatsApp",
    successDesc: "A chat with your personal broker has opened in a new tab.",
    generateMessage: (name, phone) => `Hello! I would like to schedule an individual presentation of V Club residences.\n\nName: ${name}\nPhone: ${phone}`
  },
  kz: {
    kicker: "[ ЖАБЫҚ КӨРСЕТІЛІМ ]",
    title: "Жеке презентация",
    subtitle: "Байланыс мәліметтеріңізді қалдырыңыз. Жеке брокер V Club резиденцияларына жеке сапар ұйымдастыру үшін сізбен хабарласады.",
    nameLabel: "Есіміңіз",
    phoneLabel: "Телефон нөмірі",
    submitBtn: "Сапарды жоспарлау",
    disclaimer: "Деректеріңіздің толық құпиялылығына кепілдік береміз.",
    successTitle: "WhatsApp-қа өту",
    successDesc: "Жеке брокермен диалог жаңа бетте ашылды.",
    generateMessage: (name, phone) => `Сәлеметсіз бе! Мен V Club резиденцияларының жеке презентациясын жоспарлағым келеді.\n\nЕсімім: ${name}\nТелефон: ${phone}`
  }
};

export function Cta() {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus("loading");

    // Формируем текст сообщения через функцию из словаря
    const messageTemplate = t.generateMessage(formData.name, formData.phone);
    
    // Кодируем текст для безопасной передачи в URL
    const encodedMessage = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Важно: вызываем window.open синхронно, чтобы обойти блокировщики всплывающих окон (Popup Blockers)
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Переводим локальный UI в состояние успеха и очищаем форму
    setStatus("success");
    setFormData({ name: "", phone: "" });

    // Опционально: возвращаем форму в исходное состояние через 5 секунд, 
    // если пользователь вернется на вкладку с сайтом
    setTimeout(() => {
      setStatus("idle");
    }, 5000);
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
                {t.kicker}
              </motion.span>
              <motion.h2 variants={springItem} className={styles.title}>
                {t.title}
              </motion.h2>
              <motion.p variants={springItem} className={styles.subtitle}>
                {t.subtitle}
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={springTransition}
                    className={styles.successState}
                  >
                    <div className={styles.successIcon}>
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3>{t.successTitle}</h3>
                    <p>{t.successDesc}</p>
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
                      <label htmlFor="name" className={styles.label}>{t.nameLabel}</label>
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
                      <label htmlFor="phone" className={styles.label}>{t.phoneLabel}</label>
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
                          <span className={styles.btnText}>{t.submitBtn}</span>
                        )}
                        {/* Водяной слой для эффекта наполнения */}
                        <div className={styles.liquid} aria-hidden="true" />
                      </motion.button>
                    </Magnetic>

                    <p className={styles.disclaimer}>
                      {t.disclaimer}
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
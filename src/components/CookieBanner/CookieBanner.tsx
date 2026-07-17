"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "./CookieBanner.module.css";
import { useLanguage } from "@/context/LanguageContext";

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations = {
  ru: {
    text: "Мы используем файлы cookie для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей",
    policy: "Политикой конфиденциальности",
    decline: "Отказаться",
    accept: "Принять"
  },
  en: {
    text: "We use cookies to improve website functionality and analyze traffic. By continuing to use the site, you agree to our",
    policy: "Privacy Policy",
    decline: "Decline",
    accept: "Accept"
  },
  kz: {
    text: "Біз сайттың жұмысын жақсарту және трафикті талдау үшін cookie файлдарын қолданамыз. Сайтты пайдалануды жалғастыру арқылы сіз біздің",
    policy: "Құпиялылық саясатымен келісесіз",
    decline: "Бас тарту",
    accept: "Қабылдау"
  }
};

export default function CookieBanner() {
  const { language } = useLanguage();
  const t = translations[language];

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const consent = localStorage.getItem("vclub_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vclub_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("vclub_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.container}>
            <div className={styles.textBlock}>
              <p className={styles.text}>
                {t.text}{" "}
                <Link href="/privacy-policy" className={styles.link}>
                  {t.policy}
                </Link>.
              </p>
            </div>
            <div className={styles.actions}>
              <button onClick={handleDecline} className={styles.buttonDecline}>
                {t.decline}
              </button>
              <button onClick={handleAccept} className={styles.buttonAccept}>
                {t.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ru" | "kz" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  // Избегаем Hydration Mismatch: читаем localStorage только после маунта на клиенте
  useEffect(() => {
    const saved = localStorage.getItem("v_villas_lang") as Language;
    if (saved && ["ru", "kz", "en"].includes(saved)) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  // Синхронизируем стейт с DOM и LocalStorage
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.setAttribute("data-lang", language);
    localStorage.setItem("v_villas_lang", language);
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
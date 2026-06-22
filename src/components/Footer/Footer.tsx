// src/components/Footer/Footer.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  {
    title: "Пространства",
    links: [
      { label: "Виллы", href: "#" },
      { label: "Таунхаусы", href: "#" },
      { label: "Апартаменты", href: "#" },
      { label: "Планировки", href: "#" },
    ],
  },
  {
    title: "Клуб",
    links: [
      { label: "Инфраструктура", href: "#" },
      { label: "Ресторан", href: "#" },
      { label: "Спа & Фитнес", href: "#" },
      { label: "Консьерж", href: "#" },
    ],
  },
  {
    title: "Контакты",
    links: [
      { label: "Офис продаж", href: "#" },
      { label: "+7 700 000 00 00", href: "tel:+77000000000" },
      { label: "Instagram", href: "#" },
      { label: "Telegram", href: "#" },
    ],
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // 1. Анимация параллакса для гигантского текста
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"], // Анимация идет от момента появления футера до конца скролла
  });

  // Текст выезжает снизу вверх и плавно проявляется
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  // 2. Логика Spotlight эффекта (Linear style)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    
    // Вычисляем координаты мыши относительно самого футера
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Передаем координаты в CSS-переменные без ререндера React
    footerRef.current.style.setProperty("--mouse-x", `${x}px`);
    footerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <footer 
      ref={footerRef} 
      className={styles.footer}
      onMouseMove={handleMouseMove}
    >
      {/* Слой, который отвечает за свечение от курсора */}
      <div className={styles.spotlight} />

      <div className={styles.content}>
        {/* Верхняя часть: Описание и Колонки */}
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Простая векторная "V", можно заменить на логотип */}
              <path d="M20 30L8 10H14L20 22L26 10H32L20 30Z" fill="var(--color-accent, #e5d3b3)"/>
            </svg>
            <p className={styles.brandDesc}>
              Закрытый клубный поселок у подножия гор. Искусство жить в гармонии с природой и собой.
            </p>
          </div>

          <nav className={styles.grid}>
            {FOOTER_LINKS.map((column, idx) => (
              <div key={idx} className={styles.column}>
                <h4 className={styles.colHeading}>{column.title}</h4>
                {column.links.map((link, linkIdx) => (
                  <a key={linkIdx} href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Нижняя часть: Огромная типографика и копирайт */}
        <div className={styles.bottomSection}>


          <div className={styles.legalBar}>
            <span>© 2026 V Club Village. Все права защищены.</span>
            <div className={styles.legalLinks}>
              <a href="#">Политика конфиденциальности</a>
              <a href="#">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

// === Контент для выпадающих меню ===
const ResidencesMenu = () => (
  <div className={styles.menuGrid}>
    <div>
      <h4 className={styles.menuItemTitle}>Виллы</h4>
      <p className={styles.menuItemDesc}>Приватные резиденции с собственным участком и бассейном.</p>
    </div>
    <div>
      <h4 className={styles.menuItemTitle}>Таунхаусы</h4>
      <p className={styles.menuItemDesc}>Просторные дома для семейной жизни с видом на горы.</p>
    </div>
  </div>
);

const InfrastructureMenu = () => (
  <div className={styles.menuGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
    <div>
      <h4 className={styles.menuItemTitle}>Club House</h4>
      <p className={styles.menuItemDesc}>Ресторан, спа и фитнес-центр только для резидентов.</p>
    </div>
    <div>
      <h4 className={styles.menuItemTitle}>Ландшафт</h4>
      <p className={styles.menuItemDesc}>Многоуровневые парки и прогулочные аллеи.</p>
    </div>
    <div>
      <h4 className={styles.menuItemTitle}>Сервис</h4>
      <p className={styles.menuItemDesc}>Круглосуточный консьерж и охрана территории.</p>
    </div>
  </div>
);

const ArchitectureMenu = () => (
  <div>
    <h4 className={styles.menuItemTitle}>Философия дизайна</h4>
    <p className={styles.menuItemDesc} style={{ maxWidth: "300px" }}>
      Интеграция бетона, стекла и дерева в естественный рельеф. Мы стираем границы между экстерьером и интерьером.
    </p>
  </div>
);

const NAV_ITEMS = [
  { id: "residences", title: "Резиденции", content: <ResidencesMenu /> },
  { id: "infrastructure", title: "Инфраструктура", content: <InfrastructureMenu /> },
  { id: "architecture", title: "Архитектура", content: <ArchitectureMenu /> },
];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const prevMenu = useRef<string | null>(null);

  useEffect(() => {
    prevMenu.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      // Порог скролла 30px для быстрого отклика на поведение пользователя
      if (window.scrollY > 30) {
        if (!isScrolled) setIsScrolled(true);
      } else {
        if (isScrolled) setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const scrollToNextSection = () => {
    // Ищем компонент по ID, если он будет задан в будущем
    const nextComponent = document.getElementById("next-section");
    if (nextComponent) {
      nextComponent.scrollIntoView({ behavior: "smooth" });
    } else {
      // Резервный вариант: скролл ровно на один экран вниз
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className={isScrolled ? styles.headerScrolled : styles.headerTop}>
      <motion.nav 
        layout
        className={isScrolled ? styles.navContainerScrolled : styles.navContainerTop} 
        onMouseLeave={() => setActiveMenu(null)}
        transition={{ type: "spring", stiffness: 180, damping: 26, mass: 0.9 }}
      >
        {/* Левая часть хедера */}
        <div className={styles.logoZone}>
          <div className={styles.logo}>V</div>
        </div>

        {/* Центральная часть: Элементы меню */}
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className={styles.navItem} onMouseEnter={() => setActiveMenu(item.id)}>
              <button 
                className={styles.navButton} 
                data-active={activeMenu === item.id}
              >
                {item.title}
              </button>

              <div className={styles.dropdownWrapper}>
                <AnimatePresence>
                  {activeMenu === item.id && (
                    <motion.div
                      initial={prevMenu.current === null ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      className={styles.dropdownContent}
                    >
                      <motion.div
                        layoutId="nav-background"
                        className={styles.dropdownBackground}
                        initial={{ borderRadius: 20 }}
                        transition={{ type: "spring", stiffness: 250, damping: 22, mass: 0.8 }}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, filter: "blur(4px)", scale: 0.98 }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{ position: 'relative', zIndex: 2 }}
                      >
                        {item.content}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          ))}
        </ul>

        {/* Правая часть: Компонент действия (Иконка телефона) */}
        <div className={styles.actionZone}>
          <button 
            className={styles.phoneButton} 
            onClick={scrollToNextSection}
            aria-label="Перейти к контактам"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className={styles.phoneIcon}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.8} 
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" 
              />
            </svg>
          </button>
        </div>
      </motion.nav>
    </header>
  );
}
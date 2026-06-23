"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import styles from "./Navbar.module.css";

// === Контент тултипов (объяснение при наведении) ===
const ConceptMenu = () => (
  <div>
    <h4 className={styles.menuItemTitle}>О проекте</h4>
    <p className={styles.menuItemDesc} style={{ maxWidth: "260px" }}>
      Философия, ценности и наш бескомпромиссный подход к качеству строительства и инженерии.
    </p>
  </div>
);

const AdvantagesMenu = () => (
  <div className={styles.menuGrid}>
    <div>
      <h4 className={styles.menuItemTitle}>Приватность</h4>
      <p className={styles.menuItemDesc}>Скрытые маршруты и интеллектуальный контроль.</p>
    </div>
    <div>
      <h4 className={styles.menuItemTitle}>Архитектура</h4>
      <p className={styles.menuItemDesc}>Монументальный фасад и панорамное остекление.</p>
    </div>
  </div>
);

const LayoutMenu = () => (
  <div>
    <h4 className={styles.menuItemTitle}>Резиденции</h4>
    <p className={styles.menuItemDesc} style={{ maxWidth: "260px" }}>
      Интерактивный план пространств. Продуманная эргономика каждого квадратного метра.
    </p>
  </div>
);

const LocationMenu = () => (
  <div>
    <h4 className={styles.menuItemTitle}>Локация</h4>
    <p className={styles.menuItemDesc} style={{ maxWidth: "260px" }}>
      Экологически чистый предгорный район с идеальной транспортной доступностью.
    </p>
  </div>
);

// === Структура навигации ===
const NAV_ITEMS = [
  { id: "concept", title: "Концепция", targetId: "about-section", content: <ConceptMenu /> },
  { id: "advantages", title: "Стандарты", targetId: "advantages-section", content: <AdvantagesMenu /> },
  { id: "layout", title: "Планировки", targetId: "layout-section", content: <LayoutMenu /> },
  { id: "location", title: "Расположение", targetId: "location-section", content: <LocationMenu /> },
];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const prevMenu = useRef<string | null>(null);

  useEffect(() => {
    prevMenu.current = activeMenu;
  }, [activeMenu]);

  // Оптимизированный слушатель скролла: монтируется один раз (empty deps)
  useEffect(() => {
    const handleScroll = () => {
      // React автоматически отменит ререндер, если значение не изменилось
      setIsScrolled(window.scrollY > 30);
      
      // Скрываем меню при скролле. Опять же, если оно уже null, ререндера не будет.
      setActiveMenu(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // <-- Массив теперь пустой, никаких лишних переподключений

  // Функция навигации по сайту
  const scrollToSection = (targetId: string) => {
    setActiveMenu(null); // Прячем тултип при клике
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Дефолтный скролл к следующей секции для кнопки телефона/контактов
  const scrollToNextSection = () => {
    const element = document.getElementById("cta-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  // Apple-style spring для жесткого, но естественного поведения меню
  const layoutSpring: Transition = { 
    type: "spring", 
    duration: 0.5, 
    bounce: 0.15 
  };

  return (
    <header className={styles.headerWrapper}>
      <motion.nav 
        layout
        className={isScrolled ? styles.navContainerScrolled : styles.navContainerTop} 
        onMouseLeave={() => setActiveMenu(null)}
        transition={layoutSpring}
      >
        <div className={styles.logoZone}>
          <div className={styles.logo}>V</div>
        </div>

        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className={styles.navItem} onMouseEnter={() => setActiveMenu(item.id)}>
              <button 
                className={styles.navButton} 
                data-active={activeMenu === item.id}
                onClick={() => scrollToSection(item.targetId)}
                aria-label={`Перейти к разделу ${item.title}`}
              >
                {item.title}
              </button>

              <div className={styles.dropdownWrapper}>
                <AnimatePresence>
                  {activeMenu === item.id && (
                    <motion.div
                      className={styles.dropdownContent}
                      initial={{ 
                        opacity: 0, 
                        y: prevMenu.current === null ? 8 : 0, 
                        scale: prevMenu.current === null ? 0.95 : 1 
                      }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95, transition: { duration: 0.15, ease: "easeOut" } }}
                      transition={layoutSpring}
                    >
                      <motion.div
                        layoutId="nav-background"
                        className={styles.dropdownBackground}
                        initial={{ borderRadius: 20 }}
                        transition={layoutSpring}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.1 } }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
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

        <div className={styles.actionZone}>
          <button 
            className={styles.phoneButton} 
            onClick={scrollToNextSection}
            aria-label="Связаться с нами"
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
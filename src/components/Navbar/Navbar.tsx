"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
// Импортируем хук Lenis
import { useLenis } from "lenis/react";
import styles from "./Navbar.module.css";

// === Контент тултипов (оставляем без изменений) ===
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
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const prevMenu = useRef<string | null>(null);
  
  // Получаем инстанс Lenis
  const lenis = useLenis();

  useEffect(() => {
    prevMenu.current = hoveredMenu;
  }, [hoveredMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      setHoveredMenu(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px", 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.targetId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Идеально плавный скролл через Lenis
  const scrollToSection = (targetId: string) => {
    setHoveredMenu(null); 
    
    if (lenis) {
      // Lenis сам вычисляет позицию элемента и применяет offset!
      lenis.scrollTo(`#${targetId}`, { 
        offset: -120, // Оффсет для высоты шапки
        duration: 1.5, // Можно подкрутить скорость скролла
      });
    } else {
      // Fallback на случай, если Lenis еще не успел инициализироваться
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 120; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const scrollToNextSection = () => {
    if (lenis) {
      lenis.scrollTo("#cta-section", { offset: -120, duration: 1.5 });
    } else {
      const element = document.getElementById("cta-section");
      if (element) {
        const headerOffset = 120;
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    }
  };

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
        onMouseLeave={() => setHoveredMenu(null)}
        transition={layoutSpring}
      >
        <div className={styles.logoZone}>
          <div 
            className={styles.logo} 
            onClick={() => lenis ? lenis.scrollTo(0, { duration: 1.5 }) : window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            V
          </div>
        </div>

        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.targetId || hoveredMenu === item.id;

            return (
              <li key={item.id} className={styles.navItem} onMouseEnter={() => setHoveredMenu(item.id)}>
                <button 
                  className={styles.navButton} 
                  data-active={isActive}
                  onClick={() => scrollToSection(item.targetId)}
                  aria-label={`Перейти к разделу ${item.title}`}
                >
                  {item.title}
                </button>

                <div className={styles.dropdownWrapper}>
                  <AnimatePresence>
                    {hoveredMenu === item.id && (
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
            );
          })}
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
              strokeWidth={1.8} 
              className={styles.phoneIcon}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" 
              />
            </svg>
          </button>
        </div>
      </motion.nav>
    </header>
  );
}
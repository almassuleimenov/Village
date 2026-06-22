// src/components/Navbar/Navbar.tsx
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
  
  // Храним информацию о том, какое меню было открыто шаг назад.
  // Это позволит нам понять: мы открываем меню с нуля, или перемещаемся между вкладками?
  const prevMenu = useRef<string | null>(null);

  useEffect(() => {
    prevMenu.current = activeMenu;
  }, [activeMenu]);

  return (
    <header className={styles.header}>
      <nav 
        className={styles.nav} 
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className={styles.logo}>V</div>

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
                      // РЕШЕНИЕ: Если меню уже было открыто (prevMenu.current !== null), 
                      // мы форсируем opacity: 1 на старте. Фон больше не будет "пропадать" в невидимость.
                      initial={prevMenu.current === null ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      className={styles.dropdownContent}
                    >
                      {/* Сам фон, который морфится между пунктами */}
                      <motion.div
                        layoutId="nav-background"
                        className={styles.dropdownBackground}
                        initial={{ borderRadius: 20 }}
                        // Увеличиваем stiffness (жесткость) и снижаем damping (сопротивление), 
                        // чтобы фон моментально реагировал на перемещение мыши
                        transition={{ type: "spring", stiffness: 250, damping: 22, mass: 0.8 }}
                      />
                      
                      {/* Быстрое и премиальное появление контента (с блюром) */}
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
      </nav>
    </header>
  );
}
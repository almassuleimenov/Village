"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FloorPlan.module.css";

interface RoomSpec {
  name: string;
  area: string;
}

interface FloorData {
  id: "first" | "second";
  shortName: string;
  title: string;
  description: string;
  imageSrc: string;
  specs: RoomSpec[];
}

const FLOORS_DATA: FloorData[] = [
  {
    id: "first",
    shortName: "01 ЭТАЖ",
    title: "Пространство дневной активности",
    description: "Первый уровень спроектирован для масштабных сценариев жизни. Центром композиции является просторный зал, гармонично соседствующий с выделенной кухней-столовой и изолированной спальней. Развитая инфраструктура этажа включает вместительную кладовую, прихожую, два санузла и техническое помещение, а внешние террасы обеспечивают бесшовную связь с ландшафтом.",
    imageSrc: "/forsecond/Firstfloor.png",
    specs: [
      { name: "Зал", area: "60.0 м²" },
      { name: "Спальня", area: "25.8 м²" },
      { name: "Кухня-столовая", area: "24.0 м²" },
      { name: "Прихожая", area: "22.0 м²" },
      { name: "Кладовая", area: "12.0 м²" },
      { name: "Санузел (блок спальни)", area: "5.9 м²" },
      { name: "Санузел (гостевой)", area: "5.9 м²" },
      { name: "Вспомогательное помещение", area: "4.4 м²" },
      { name: "Летняя терраса (северная)", area: "47.0 м²" },
      { name: "Летняя терраса (южная)", area: "47.0 м²" },
      { name: "Лестничная площадка", area: "15.0 м²" }
    ]
  },
  {
    id: "second",
    shortName: "02 ЭТАЖ",
    title: "Приватная зона резидентов",
    description: "Второй уровень полностью изолирован от гостевых маршрутов и представляет собой приватное крыло для отдыха. Здесь расположены три независимые спальни, включая главную мастер-спальню с собственной гардеробной и выделенным санузлом. Пространство объединено центральным холлом, а каждая жилая комната имеет доступ к индивидуальным ванным комнатам.",
    imageSrc: "/forsecond/Secondfloor.png",
    specs: [
      { name: "Мастер-спальня", area: "31.2 м²" },
      { name: "Спальня (южная)", area: "25.9 м²" },
      { name: "Спальня (северная)", area: "25.8 м²" },
      { name: "Центральный холл", area: "18.1 м²" },
      { name: "Гардеробная мастер-спальни", area: "6.2 м²" },
      { name: "Санузел мастер-спальни", area: "6.2 м²" },
      { name: "Санузел (приватный №1)", area: "5.9 м²" },
      { name: "Санузел (приватный №2)", area: "5.9 м²" },
      { name: "Лестничная площадка", area: "15.0 м²" }

    ]
  }
];

const springConfig = {
  type: "spring",
  stiffness: 380,
  damping: 35,
};

export function FloorPlan() {
  const [activeFloorIndex, setActiveFloorIndex] = useState<number>(0);
  const currentFloor = FLOORS_DATA[activeFloorIndex];

  return (
    <section id="layout-section" className={styles.section}>
      <div className={styles.container}>
        
        <div className={styles.dashboard}>
          
          {/* СЕКЦИЯ 1: Заголовки, табы и описание (Всегда сверху) */}
          <div className={styles.topSection}>
            <header className={styles.header}>
              <span className={styles.tag}>[ ПЛАНИРОВОЧНЫЕ РЕШЕНИЯ ]</span>
              <h2 className={styles.mainTitle}>Архитектура внутреннего пространства</h2>
            </header>

            <div className={styles.tabsContainer}>
              {FLOORS_DATA.map((floor, idx) => (
                <button
                  key={floor.id}
                  onClick={() => setActiveFloorIndex(idx)}
                  className={styles.tabButton}
                  data-active={activeFloorIndex === idx}
                >
                  <span className={styles.tabIndex}>{floor.shortName}</span>
                  {activeFloorIndex === idx && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className={styles.tabIndicator}
                      transition={springConfig as any}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.metaRow}>
                <h3 className={styles.floorTitle}>{currentFloor.title}</h3>
                {/* Бейджик с общей площадью удален */}
              </div>
              <p className={styles.floorDescription}>{currentFloor.description}</p>
            </div>
          </div>

          {/* СЕКЦИЯ 2: Холст с чертежом (На десктопе справа, на мобилках посередине) */}
          <div className={styles.canvasPanel}>
            <div className={styles.blueprintGridOverlay} />
            <div className={styles.blueprintWrapper}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFloor.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, scale: 0.98, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.imageContainer}
                >
                  <Image
                    src={currentFloor.imageSrc}
                    alt={`Планировка резиденции V-Village — ${currentFloor.title}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.blueprintImage}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* СЕКЦИЯ 3: Экспликация помещений (На десктопе слева внизу, на мобилках в самом низу) */}
          <div className={styles.explicationSection}>
            <h4 className={styles.explicationHeading}>Экспликация помещений</h4>
            <ul className={styles.specList}>
              {currentFloor.specs.map((spec, i) => (
                <li key={i} className={styles.specItem}>
                  <span className={styles.specName}>{spec.name}</span>
                  <span className={styles.specDots} />
                  <span className={styles.specArea}>{spec.area}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
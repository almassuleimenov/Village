"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
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

// === ЛОКАЛЬНЫЙ СЛОВАРЬ ПЕРЕВОДОВ ===
const translations: Record<string, {
  kicker: string;
  mainTitle: string;
  explicationTitle: string;
  floors: FloorData[];
}> = {
  ru: {
    kicker: "[ ПЛАНИРОВОЧНЫЕ РЕШЕНИЯ ]",
    mainTitle: "Архитектура внутреннего пространства",
    explicationTitle: "Экспликация помещений",
    floors: [
      {
        id: "first",
        shortName: "01 ЭТАЖ",
        title: "Пространство дневной активности",
        description: "Первый уровень спроектирован для масштабных сценариев жизни. Центром композиции является просторный зал, гармонично соседствующий с выделенной кухней-столовой и изолированной спальней. Развитая инфраструктура этажа включает вместительную кладовую, прихожую, два санузла и техническое помещение, а внешние террасы обеспечивают бесшовную связь с ландшафтом.",
        imageSrc: "/forsecond/Firstfloor.webp",
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
        imageSrc: "/forsecond/Secondfloor.webp",
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
    ]
  },
  en: {
    kicker: "[ FLOOR PLANS ]",
    mainTitle: "Interior Architecture",
    explicationTitle: "Room Explication",
    floors: [
      {
        id: "first",
        shortName: "01 FLOOR",
        title: "Daytime Activity Space",
        description: "The first level is designed for large-scale living scenarios. The center of the composition is a spacious hall, harmoniously adjacent to a dedicated kitchen-dining room and an isolated bedroom. The developed infrastructure of the floor includes a spacious pantry, hallway, two bathrooms, and a utility room, while external terraces provide a seamless connection with the landscape.",
        imageSrc: "/forsecond/Firstfloor.webp",
        specs: [
          { name: "Living Room", area: "60.0 m²" },
          { name: "Bedroom", area: "25.8 m²" },
          { name: "Kitchen & Dining", area: "24.0 m²" },
          { name: "Hallway", area: "22.0 m²" },
          { name: "Pantry", area: "12.0 m²" },
          { name: "Bathroom (Bedroom)", area: "5.9 m²" },
          { name: "Bathroom (Guest)", area: "5.9 m²" },
          { name: "Utility Room", area: "4.4 m²" },
          { name: "Summer Terrace (North)", area: "47.0 m²" },
          { name: "Summer Terrace (South)", area: "47.0 m²" },
          { name: "Staircase", area: "15.0 m²" }
        ]
      },
      {
        id: "second",
        shortName: "02 FLOOR",
        title: "Private Resident Zone",
        description: "The second level is completely isolated from guest routes and represents a private wing for relaxation. There are three independent bedrooms here, including the main master bedroom with its own dressing room and a dedicated bathroom. The space is united by a central hall, and each living room has access to individual bathrooms.",
        imageSrc: "/forsecond/Secondfloor.webp",
        specs: [
          { name: "Master Bedroom", area: "31.2 m²" },
          { name: "Bedroom (South)", area: "25.9 m²" },
          { name: "Bedroom (North)", area: "25.8 m²" },
          { name: "Central Hall", area: "18.1 m²" },
          { name: "Master Walk-in Closet", area: "6.2 m²" },
          { name: "Master Bathroom", area: "6.2 m²" },
          { name: "Bathroom (Private #1)", area: "5.9 m²" },
          { name: "Bathroom (Private #2)", area: "5.9 m²" },
          { name: "Staircase", area: "15.0 m²" }
        ]
      }
    ]
  },
  kz: {
    kicker: "[ ЖОСПАРЛАУ ШЕШІМДЕРІ ]",
    mainTitle: "Ішкі кеңістік сәулеті",
    explicationTitle: "Бөлмелер экспликациясы",
    floors: [
      {
        id: "first",
        shortName: "01 ҚАБАТ",
        title: "Күндізгі белсенділік кеңістігі",
        description: "Бірінші деңгей ауқымды өмір сүру сценарийлеріне арналған. Композицияның орталығы – бөлінген ас үй-асхана мен оқшауланған жатын бөлмемен үйлесімді орналасқан кең зал. Қабаттың дамыған инфрақұрылымы кең қойманы, кіреберісті, екі жуынатын бөлмені және техникалық бөлмені қамтиды, ал сыртқы террасалар ландшафтпен үздіксіз байланысты қамтамасыз етеді.",
        imageSrc: "/forsecond/Firstfloor.webp",
        specs: [
          { name: "Зал", area: "60.0 м²" },
          { name: "Жатын бөлме", area: "25.8 м²" },
          { name: "Ас үй-асхана", area: "24.0 м²" },
          { name: "Кіреберіс", area: "22.0 м²" },
          { name: "Қойма", area: "12.0 м²" },
          { name: "Жуынатын бөлме (жатын бөлме блогы)", area: "5.9 м²" },
          { name: "Жуынатын бөлме (қонақтарға арналған)", area: "5.9 м²" },
          { name: "Қосалқы бөлме", area: "4.4 м²" },
          { name: "Жазғы терраса (солтүстік)", area: "47.0 м²" },
          { name: "Жазғы терраса (оңтүстік)", area: "47.0 м²" },
          { name: "Баспалдақ алаңы", area: "15.0 м²" }
        ]
      },
      {
        id: "second",
        shortName: "02 ҚАБАТ",
        title: "Резиденттердің жеке аймағы",
        description: "Екінші деңгей қонақтар бағыттарынан толығымен оқшауланған және демалуға арналған жеке қанатты білдіреді. Мұнда үш тәуелсіз жатын бөлме орналасқан, соның ішінде жеке киім-кешек бөлмесі және бөлінген жуынатын бөлмесі бар негізгі шебер жатын бөлме. Кеңістік орталық залмен біріктірілген және әрбір тұрғын бөлменің жеке жуынатын бөлмелерге кіру мүмкіндігі бар.",
        imageSrc: "/forsecond/Secondfloor.webp",
        specs: [
          { name: "Шебер жатын бөлмесі", area: "31.2 м²" },
          { name: "Жатын бөлме (оңтүстік)", area: "25.9 м²" },
          { name: "Жатын бөлме (солтүстік)", area: "25.8 м²" },
          { name: "Орталық зал", area: "18.1 м²" },
          { name: "Шебер жатын бөлмесінің гардеробы", area: "6.2 м²" },
          { name: "Шебер жатын бөлмесінің жуынатын бөлмесі", area: "6.2 м²" },
          { name: "Жуынатын бөлме (жеке №1)", area: "5.9 м²" },
          { name: "Жуынатын бөлме (жеке №2)", area: "5.9 м²" },
          { name: "Баспалдақ алаңы", area: "15.0 м²" }
        ]
      }
    ]
  }
};

const springConfig = {
  type: "spring",
  stiffness: 380,
  damping: 35,
};

export function FloorPlan() {
  const { language } = useLanguage();
  const t = translations[language];

  const [activeFloorIndex, setActiveFloorIndex] = useState<number>(0);
  const currentFloor = t.floors[activeFloorIndex];

  return (
    <section id="layout-section" className={styles.section}>
      <div className={styles.container}>
        
        <div className={styles.dashboard}>
          
          {/* СЕКЦИЯ 1: Заголовки, табы и описание */}
          <div className={styles.topSection}>
            <header className={styles.header}>
              <span className={styles.tag}>{t.kicker}</span>
              <h2 className={styles.mainTitle}>{t.mainTitle}</h2>
            </header>

            <div className={styles.tabsContainer}>
              {t.floors.map((floor, idx) => (
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
              </div>
              <p className={styles.floorDescription}>{currentFloor.description}</p>
            </div>
          </div>

          {/* СЕКЦИЯ 2: Холст с чертежом */}
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
                    alt={`${t.mainTitle} — ${currentFloor.title}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.blueprintImage}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* СЕКЦИЯ 3: Экспликация помещений */}
          <div className={styles.explicationSection}>
            <h4 className={styles.explicationHeading}>{t.explicationTitle}</h4>
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
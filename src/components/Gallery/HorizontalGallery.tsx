"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
  motion, 
  useMotionValue, 
  useTransform, 
  useSpring, 
  AnimatePresence,
  useScroll,
  useMotionValueEvent
} from "framer-motion";
import { Magnetic } from "@/components/Cursor/Magnetic"; 
import { useLanguage } from "@/context/LanguageContext";
import styles from "./HorizontalGallery.module.css";

const baseImages = [
  "/Corona1.jpg.webp", "/Corona2.jpg.webp", "/Corona3.jpg.webp",
  "/Corona4.jpg.webp", "/Corona5.jpg.webp", "/Corona6.webp",
  "/Corona8.webp", "/01 render.webp", "/02 render.webp",
  "/03 render.webp", "/04 render.webp", "/05 render.webp",
];

const infiniteImages = [...baseImages, ...baseImages, ...baseImages];

const translations: Record<string, {
  tag: string; title: string; dragHint: string;
  imgAlt: string; fullscreenAlt: string; closeAria: string;
}> = {
  ru: {
    tag: "[ ВИЗУАЛЬНАЯ ЭСТЕТИКА ]", title: "Архитектура в деталях",
    dragHint: "Двойной клик для увеличения", imgAlt: "Ракурс виллы V-Village",
    fullscreenAlt: "Полноэкранный просмотр", closeAria: "Закрыть фото"
  },
  en: {
    tag: "[ VISUAL AESTHETICS ]", title: "Architecture in detail",
    dragHint: "Double click to enlarge", imgAlt: "V-Village villa view",
    fullscreenAlt: "Fullscreen view", closeAria: "Close photo"
  },
  kz: {
    tag: "[ ВИЗУАЛДЫ ЭСТЕТИКА ]", title: "Сәулет өнері бөлшектерде",
    dragHint: "Үлкейту үшін екі рет басыңыз", imgAlt: "V-Village вилласының көрінісі",
    fullscreenAlt: "Толық экранды көру", closeAria: "Фотоны жабу"
  }
};

export function HorizontalGallery() {
  const { language } = useLanguage();
  const t = translations[language];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<{src: string, index: number} | null>(null);
  const [isMeasured, setIsMeasured] = useState(false);
  
  const x = useMotionValue(0);
  const originalWidthRef = useRef(0);
  
  // ФЛАГ СОСТОЯНИЯ: Изолируем логику drag от логики scroll
  const isDragging = useRef(false);

  useEffect(() => {
    const calcWidth = () => {
      if (carouselRef.current) {
        const oneSetWidth = carouselRef.current.scrollWidth / 3;
        originalWidthRef.current = oneSetWidth;

        if (!isMeasured) {
          x.set(-oneSetWidth);
          setIsMeasured(true);
        }
      }
    };
    
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, [isMeasured, x]);

  // Проверка границ вынесена в отдельную функцию, чтобы использовать и в хуке, и при onDragEnd
  const checkBounds = useCallback((currentX: number) => {
    const w = originalWidthRef.current;
    if (!w) return;

    if (currentX > 0) {
      x.set(currentX - w);
    } else if (currentX <= -w * 2) {
      x.set(currentX + w);
    }
  }, [x]);

  // === БЕСКОНЕЧНЫЙ ЦИКЛ ===
  useMotionValueEvent(x, "change", (latest) => {
    if (!isMeasured) return;
    
    // КРИТИЧНО: Запрещаем телепортацию координат, пока палец на экране
    // Это устраняет резкие рывки при свайпах назад/вперед
    if (isDragging.current) return;
    
    checkBounds(latest);
  });

  // === СВЯЗЬ СО СКРОЛЛОМ МЫШИ ===
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    // КРИТИЧНО: Блокируем влияние вертикального скролла, если активен свайп
    if (isDragging.current) return;

    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    x.set(x.get() - delta * 1.5);
  });

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);

  const progressSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const progress = useTransform(progressSpring, (latest) => {
    const w = originalWidthRef.current;
    if (!w) return 0;
    const positiveX = Math.abs(latest);
    const normalized = positiveX % w;
    return (normalized / w) * 100;
  });

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>{t.tag}</span>
        <h2 className={styles.title}>{t.title}</h2>
      </header>

      <div className={styles.carouselWrapper} ref={carouselRef}>
        <motion.div 
          className={styles.track}
          drag="x"
          data-cursor="drag"
          dragConstraints={{ left: -100000, right: 100000 }}
          dragElastic={0}
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
          // Включаем и выключаем флаг свайпа
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={() => {
            isDragging.current = false;
            // Делаем ручную проверку границ после отпускания пальца
            checkBounds(x.get());
          }}
        >
          {infiniteImages.map((src, index) => (
            <motion.div 
              key={`${src}-${index}`} 
              className={styles.card}
              onDoubleClick={() => setSelectedImage({ src, index })}
            >
              <motion.div layoutId={`wrapper-${src}-${index}`} className={styles.imageContainer}>
                <Image 
                  src={src} 
                  alt={`${t.imgAlt} ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 70vw, 60vw"
                  // КРИТИЧНО: Мы начинаем со 2-го сета! Поэтому грузим индексы 12-16 в первую очередь.
                  priority={index >= 12 && index <= 16}
                  quality={90}
                  className={styles.image}
                  draggable={false} 
                />
                <div className={styles.imageOverlay} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill} 
            style={{ width: useTransform(progress, v => `${v}%`) }} 
          />
        </div>
        <div className={styles.dragHint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18M17.25 15.75L21 12m0 0l-3.75-3.75" />
          </svg>
          {t.dragHint}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedImage(null)}
          >
            <div className={styles.closeBtnWrapper} onClick={(e) => e.stopPropagation()}>
              <Magnetic strength={0.5}>
                <button 
                  className={styles.closeBtn} 
                  onClick={() => setSelectedImage(null)}
                  aria-label={t.closeAria}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </Magnetic>
            </div>

            <motion.div 
              className={styles.fullscreenImageContainer}
              layoutId={`wrapper-${selectedImage.src}-${selectedImage.index}`}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <Image 
                src={selectedImage.src}
                alt={t.fullscreenAlt}
                fill
                quality={100}
                style={{ objectFit: "contain" }}
                sizes="100vw"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
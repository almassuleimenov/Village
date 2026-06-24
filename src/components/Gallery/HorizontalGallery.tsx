"use client";

import { useRef, useState, useEffect } from "react";
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
import styles from "./HorizontalGallery.module.css";

const images = [
  "/Corona1.jpg.jpeg",
  "/Corona2.jpg.jpeg",
  "/Corona3.jpg.jpeg",
  "/Corona4.jpg.jpeg",
  "/Corona5.jpg.jpeg",
  "/Corona6.jpg",
];

export function HorizontalGallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Motion-значение для X-координаты. Будет управляться И свайпом, И скроллом.
  const x = useMotionValue(0);
  // Используем Ref для ширины, чтобы не триггерить зависимости внутри scroll-ивента
  const dragWidthRef = useRef(0);

  // Динамический пересчет доступной ширины при ресайзе
  useEffect(() => {
    const calcWidth = () => {
      if (carouselRef.current) {
        const width = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
        setDragWidth(width);
        dragWidthRef.current = width;
      }
    };
    
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, []);

  // Блокировка скролла страницы при открытии фото
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // === МАГИЯ AWWWARDS: Связываем вертикальный скролл с горизонтальным движением ===
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Получаем предыдущее значение скролла для расчета ускорения (delta)
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    
    // Коэффициент 1.2 делает движение чуть динамичнее самого скролла
    let newX = x.get() - delta * 1.2; 
    
    // Жестко ограничиваем вылет за границы галереи (Clamping)
    const maxLeft = -dragWidthRef.current;
    if (newX > 0) newX = 0;
    if (newX < maxLeft) newX = maxLeft;
    
    x.set(newX);
  });

  // Физика пружины для индикатора прогресса (чтобы он двигался плавно)
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  const progress = useTransform(springX, [0, -dragWidth], [0, 100]);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>[ ВИЗУАЛЬНАЯ ЭСТЕТИКА ]</span>
        <h2 className={styles.title}>Архитектура в деталях</h2>
      </header>

      {/* Контейнер, ограничивающий видимую область */}
      <div className={styles.carouselWrapper} ref={carouselRef}>
        
        {/* Интерактивный трек */}
        <motion.div 
          className={styles.track}
          drag="x"
          data-cursor="drag"
          dragConstraints={{ right: 0, left: -dragWidth }}
          dragElastic={0.15}
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
        >
          {images.map((src, index) => (
            <motion.div 
              key={src} 
              className={styles.card}
              onClick={() => setSelectedImage(src)}
            >
              <motion.div layoutId={`wrapper-${src}`} className={styles.imageContainer}>
                <Image 
                  src={src} 
                  alt={`Ракурс виллы V-Village ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 60vw"
                  priority={index < 2}
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

      {/* Индикатор прогресса галереи */}
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
          Тяните для просмотра
        </div>
      </div>

      {/* Полноэкранный Lightbox (Модальное окно) */}
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
                  aria-label="Закрыть фото"
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
              layoutId={`wrapper-${selectedImage}`}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <Image 
                src={selectedImage}
                alt="Полноэкранный просмотр"
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
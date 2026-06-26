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

const baseImages = [
  "/Corona1.jpg.jpeg",
  "/Corona2.jpg.jpeg",
  "/Corona3.jpg.jpeg",
  "/Corona4.jpg.jpeg",
  "/Corona5.jpg.jpeg",
  "/Corona6.jpg",
  "/Corona8.jpeg",
  "/01 render.png",
  "/02 render.png",
  "/03 render.png",
  "/04 render.png",
  "/05 render.png",
];

// Умножаем массив на 3 для создания бесшовной иллюзии бесконечности
const infiniteImages = [...baseImages, ...baseImages, ...baseImages];

export function HorizontalGallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Храним не только ссылку, но и уникальный индекс, чтобы layoutId работал корректно
  const [selectedImage, setSelectedImage] = useState<{src: string, index: number} | null>(null);
  const [isMeasured, setIsMeasured] = useState(false);
  
  // Координата X
  const x = useMotionValue(0);
  const originalWidthRef = useRef(0);

  // Высчитываем ширину ОДНОГО оригинального сета картинок
  useEffect(() => {
    const calcWidth = () => {
      if (carouselRef.current) {
        // Делим общую ширину скролла на 3 (количество сетов)
        const oneSetWidth = carouselRef.current.scrollWidth / 3;
        originalWidthRef.current = oneSetWidth;

        // При первой загрузке центрируем галерею на втором сете (чтобы можно было листать влево)
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

  // === БЕСКОНЕЧНЫЙ ЦИКЛ (WRAPPER) ===
  useMotionValueEvent(x, "change", (latest) => {
    if (!isMeasured) return;
    const w = originalWidthRef.current;

    // Если ушли слишком далеко вправо (в 1-й сет) -> кидаем обратно во 2-й
    if (latest > 0) {
      x.set(latest - w);
    } 
    // Если ушли слишком далеко влево (в 3-й сет) -> кидаем обратно во 2-й
    else if (latest < -w * 2) {
      x.set(latest + w);
    }
  });

  // === СВЯЗЬ СО СКРОЛЛОМ МЫШИ ===
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    x.set(x.get() - delta * 1.5); // Коэффициент 1.5 дает легкое ускорение
  });

  // Блокировка скролла страницы при открытии фото
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);

  // Вычисляем бесконечный прогресс-бар через деление по модулю
  const progressSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const progress = useTransform(progressSpring, (latest) => {
    const w = originalWidthRef.current;
    if (!w) return 0;
    // Нормализуем значение от 0 до 100% в рамках одного сета
    const positiveX = Math.abs(latest);
    const normalized = positiveX % w;
    return (normalized / w) * 100;
  });

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.tag}>[ ВИЗУАЛЬНАЯ ЭСТЕТИКА ]</span>
        <h2 className={styles.title}>Архитектура в деталях</h2>
      </header>

      <div className={styles.carouselWrapper} ref={carouselRef}>
        <motion.div 
          className={styles.track}
          drag="x"
          data-cursor="drag"
          // Огромные лимиты, чтобы свайп не блокировался
          dragConstraints={{ left: -100000, right: 100000 }}
          dragElastic={0} // Убираем резиновый эффект для идеального цикла
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
        >
          {infiniteImages.map((src, index) => (
            <motion.div 
              key={`${src}-${index}`} 
              className={styles.card}
              // ЗАМЕНИЛИ onClick на onDoubleClick для предотвращения мисскликов при скролле
              onDoubleClick={() => setSelectedImage({ src, index })}
            >
              <motion.div layoutId={`wrapper-${src}-${index}`} className={styles.imageContainer}>
                <Image 
                  src={src} 
                  alt={`Ракурс виллы V-Village ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 70vw, 60vw"
                  priority={index > 5 && index < 12} // Приоритет для центрального сета
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
          Двойной клик для увеличения
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
              // Привязываем layoutId к конкретному индексу, чтобы картинка летела именно туда, куда нажали
              layoutId={`wrapper-${selectedImage.src}-${selectedImage.index}`}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <Image 
                src={selectedImage.src}
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
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import styles from "./HorizontalGallery.module.css";

const images = [
  "/Corona1.jpg.jpeg",
  "/Corona3.jpg.jpeg",
  "/Corona4.jpg.jpeg",
  "/Corona5.jpg.jpeg",
  "/Corona6.jpg.jpeg",
];

export function HorizontalGallery() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, (p) => `calc(-${p * 100}% + ${p * 100}vw)`);

  return (
    <section ref={targetRef} className={styles.scrollContainer}>
      <div className={styles.stickyViewport}>
        <motion.div 
          className={styles.horizontalTrack} 
          style={{ x }}
        >
          {images.map((src, index) => (
            <div key={src} className={styles.cardWrapper}>
              {/* Родитель ДОЛЖЕН иметь position: relative в CSS модуле */}
              <div className={styles.imageContainer}>
                <Image 
                  src={src} 
                  alt={`Презентация V-Village, ракурс ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  // Атрибут sizes критически важен: он говорит Next.js, 
                  // какие версии картинки генерировать для разных экранов
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                  // Первые две картинки грузятся немедленно с высоким приоритетом для LCP,
                  // остальные — лениво по мере скролла
                  priority={index < 2}
                  // quality={85} — золотая середина между весом и качеством для рендеров
                  quality={85}
                />
              </div>
              <div className={styles.cardBackdrop} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
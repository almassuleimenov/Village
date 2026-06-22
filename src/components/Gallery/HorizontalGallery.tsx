"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import styles from "./HorizontalGallery.module.css";

const images = [
  "/image 400.png",
  "/image 402.png",
  "/image 401.png",
  "/image 404.png",
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

  // ИСПРАВЛЕНИЕ 1: Используем callback-функцию.
  // Это гарантирует, что Framer Motion передает чистое число в CSS, 
  // а браузер сам вычисляет calc() без конфликтов парсера строк.
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
              <div className={styles.imageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={src} 
                  alt={`Gallery image ${index + 1}`} 
                  className={styles.image}
                  loading={index < 2 ? "eager" : "lazy"} 
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
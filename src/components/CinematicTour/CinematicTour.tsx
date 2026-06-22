"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CanvasScrubber } from "./CanvasScrubber";
import styles from "./CinematicTour.module.css";

const FRAMES_SEQ1 = 91; 
const FRAMES_SEQ2 = 91;
const FRAMES_SEQ3 = 91;

export function CinematicTour() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Виртуальная пружина для идеальной плавности скраббинга
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  /* ================= ФАЗА 1: Въезд (0.0 -> 0.25) ================= */
  const seq1Progress = useTransform(scrollYProgress, [0, 0.25], [0, 1], { clamp: true });
  const seq1Opacity = useTransform(scrollYProgress, [0, 0.20, 0.25], [1, 1, 0], { clamp: true });
  const seq1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 1.15], { clamp: true });
  const seq1Filter = useTransform(scrollYProgress, [0.20, 0.25], ["blur(0px)", "blur(24px)"], { clamp: true });

  const panel1Opacity = useTransform(scrollYProgress, [0.02, 0.05, 0.15, 0.18], [0, 1, 1, 0], { clamp: true });
  const panel1Y = useTransform(scrollYProgress, [0.02, 0.18], ["40px", "-40px"], { clamp: true }); 

  /* ================= ФАЗА 2: Парк (0.25 -> 0.50) ================= */
  const seq2Progress = useTransform(scrollYProgress, [0.20, 0.50], [0, 1], { clamp: true });
  const seq2Opacity = useTransform(scrollYProgress, [0.20, 0.25, 0.45, 0.50], [0, 1, 1, 0], { clamp: true });
  const seq2Scale = useTransform(scrollYProgress, [0.20, 0.50], [0.95, 1.10], { clamp: true });
  const seq2Filter = useTransform(scrollYProgress, [0.20, 0.25, 0.45, 0.50], ["blur(24px)", "blur(0px)", "blur(0px)", "blur(24px)"], { clamp: true });

  const panel2Opacity = useTransform(scrollYProgress, [0.27, 0.30, 0.40, 0.43], [0, 1, 1, 0], { clamp: true });
  const panel2Y = useTransform(scrollYProgress, [0.27, 0.43], ["40px", "-40px"], { clamp: true });

  /* ================= ФАЗА 3: Архитектура (0.50 -> 0.75) ================= */
  const seq3Progress = useTransform(scrollYProgress, [0.45, 0.75], [0, 1], { clamp: true });
  // Видео 3 почти гаснет к финалу, оставляя лишь призрачный фон для титров
  const seq3Opacity = useTransform(scrollYProgress, [0.45, 0.50, 0.75, 0.90], [0, 1, 1, 0.1], { clamp: true });
  const seq3Scale = useTransform(scrollYProgress, [0.45, 0.75], [0.95, 1.10], { clamp: true });
  const seq3Filter = useTransform(scrollYProgress, [0.45, 0.50, 0.70, 0.85], ["blur(24px)", "blur(0px)", "blur(0px)", "blur(30px)"], { clamp: true });

  const panel3Opacity = useTransform(scrollYProgress, [0.52, 0.55, 0.65, 0.68], [0, 1, 1, 0], { clamp: true });
  const panel3Y = useTransform(scrollYProgress, [0.52, 0.68], ["40px", "-40px"], { clamp: true });

  /* ================= ФИНАЛ: КИНЕМАТОГРАФИЧНОЕ ЗАТЕМНЕНИЕ (0.75 -> 1.0) ================= */
  // Плавный черный градиент, который накрывает сцену
  const finalOverlayOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1], { clamp: true });
  
  // Элегантный текст, выплывающий из темноты
  const finalContentOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1], { clamp: true });
  const finalContentY = useTransform(scrollYProgress, [0.82, 0.92], ["40px", "0px"], { clamp: true });

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.stickyArea}>
        
        {/* === СЦЕНА 1 === */}
        <div className={styles.scene}>
          <motion.div 
            className={styles.canvasWrapper} 
            style={{ opacity: seq1Opacity, scale: seq1Scale, filter: seq1Filter }}
          >
            <CanvasScrubber sequenceName="seq1" frameCount={FRAMES_SEQ1} progress={seq1Progress} />
          </motion.div>
          
          <motion.div 
            className={`${styles.glassPanel} ${styles.panelRight}`}
            style={{ opacity: panel1Opacity, y: panel1Y }}
          >
            <h3 className={styles.panelTitle}>01. Въездная группа</h3>
            <p className={styles.panelText}>
              Природные материалы и монументальные формы создают первое впечатление тихой роскоши и приватности.
            </p>
          </motion.div>
        </div>

        {/* === СЦЕНА 2 === */}
        <div className={styles.scene}>
          <motion.div 
            className={styles.canvasWrapper} 
            style={{ opacity: seq2Opacity, scale: seq2Scale, filter: seq2Filter }}
          >
            <CanvasScrubber sequenceName="seq2" frameCount={FRAMES_SEQ2} progress={seq2Progress} />
          </motion.div>
          
          <motion.div 
            className={`${styles.glassPanel} ${styles.panelLeft}`}
            style={{ opacity: panel2Opacity, y: panel2Y }}
          >
            <h3 className={styles.panelTitle}>02. Ландшафтный парк</h3>
            <p className={styles.panelText}>
              Интеграция комплекса в естественный рельеф предгорий. Каждое дерево сохранено и подчеркнуто светом.
            </p>
          </motion.div>
        </div>

        {/* === СЦЕНА 3 === */}
        <div className={styles.scene}>
          <motion.div 
            className={styles.canvasWrapper} 
            style={{ opacity: seq3Opacity, scale: seq3Scale, filter: seq3Filter }}
          >
            <CanvasScrubber sequenceName="seq3" frameCount={FRAMES_SEQ3} progress={seq3Progress} />
          </motion.div>
          
          <motion.div 
            className={`${styles.glassPanel} ${styles.panelRight}`}
            style={{ opacity: panel3Opacity, y: panel3Y }}
          >
            <h3 className={styles.panelTitle}>03. Архитектура среды</h3>
            <p className={styles.panelText}>
              Мы не строим дома, мы формируем образ жизни. Чистые линии, панорамные окна и террасы с видом на Алатау.
            </p>
          </motion.div>
        </div>

        {/* === ФИНАЛ: ЗАТЕМНЕНИЕ === */}
        <motion.div 
          className={styles.finalOverlay}
          style={{ opacity: finalOverlayOpacity }}
        />
        
        <motion.div 
          className={styles.finalContentWrapper}
          style={{ opacity: finalContentOpacity, y: finalContentY }}
        >
          <h2 className={styles.finalTitle}>Истинная привилегия — это пространство.</h2>
          <p className={styles.finalSubtitle}>
            Откройте для себя новый стандарт жизни в V Club Village. 
            Безупречная эстетика и абсолютный комфорт.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
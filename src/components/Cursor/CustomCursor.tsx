// components/Cursor/CustomCursor.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

// Физика пружины для разного "веса" курсора
const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<"default" | "hover" | "drag">("default");
  
  // Сырые координаты
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Сглаженные координаты (пружина)
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Включаем скрытие нативного курсора только если устройство поддерживает мышь
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.classList.add("custom-cursor-active");
    }

    const moveCursor = (e: MouseEvent) => {
      // Обновляем позицию $O(1)$ без ререндера React
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Проверяем, есть ли под мышкой элемент с атрибутом data-cursor
      const target = e.target as HTMLElement;
      const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor") as "hover" | "drag" | null;
      
      // Меняем стейт только если он изменился (React batching)
      if (cursorType === "drag" && cursorState !== "drag") setCursorState("drag");
      else if (cursorType === "hover" && cursorState !== "hover") setCursorState("hover");
      else if (!cursorType && cursorState !== "default") setCursorState("default");
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [cursorState, mouseX, mouseY]);

  // Варианты трансформации курсора
  const variants = {
    default: { width: 12, height: 12, opacity: 1 },
    hover: { width: 48, height: 48, opacity: 0.5 }, // Увеличивается и становится прозрачнее над кнопками
    drag: { width: 80, height: 80, opacity: 1 },    // Превращается в большую белую таблетку
  };

  return (
    <motion.div
      className={styles.cursorWrapper}
      style={{
        // Центрируем курсор относительно координат
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className={styles.dot}
        variants={variants as any}
        animate={cursorState}
        transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
      />
      
      {/* Появляющийся текст "DRAG" */}
      <motion.div 
        className={styles.cursorText}
        animate={{ opacity: cursorState === "drag" ? 1 : 0, scale: cursorState === "drag" ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        Drag
      </motion.div>
    </motion.div>
  );
}
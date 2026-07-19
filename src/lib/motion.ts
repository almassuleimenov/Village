// D:\Project\react_projects\v-villas-brochure\src\lib\motion.ts
"use client"; // Защита от случайного выполнения на стороне сервера

import type { Transition, Variants } from "framer-motion"; // Строгий импорт типов для SWC

export const springSlow: Transition = {
  type: "spring",
  stiffness: 40,
  damping: 20,
  restDelta: 0.001
};

export const springCustom: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 15,
  mass: 1.2
};

export const textRevealVariant: Variants = {
  initial: { 
    y: 100, 
    opacity: 0,
    rotate: 2
  },
  animate: { 
    y: 0, 
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.8
    }
  }
};
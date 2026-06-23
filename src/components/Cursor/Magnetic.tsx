// components/Cursor/Magnetic.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // Сила притяжения (чем больше, тем сильнее тянется)
}

export function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Мягкая, тяжелая пружина для самой кнопки
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    // Получаем координаты кнопки
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Вычисляем центр кнопки
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Вычисляем дистанцию от мыши до центра кнопки и применяем коэффициент силы
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Возвращаем кнопку точно на место
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x: springX, y: springY }}
      // Задаем атрибут, чтобы глобальный курсор понял, что он над кликабельным элементом
      data-cursor="hover" 
    >
      {children}
    </motion.div>
  );
}
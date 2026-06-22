"use client"
import React, { useRef } from 'react';
import styles from './About.module.css';

// Строгая типизация данных
interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Статические данные вынесены из компонента (O(1) Memory allocation)
const CORE_VALUES: CoreValue[] = [
  {
    id: 'craft',
    title: 'Focus on craft',
    description: 'Мы уделяем внимание каждой детали. Качество продукта отражает качество мышления нашей команды.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
  },
  {
    id: 'velocity',
    title: 'Velocity is a feature',
    description: 'Скорость доставки ценности определяет победителя. Мы строим системы, которые позволяют двигаться быстро без потери стабильности.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    )
  },
  {
    id: 'ownership',
    title: 'Extreme ownership',
    description: 'Никаких оправданий. Каждый инженер несет полную ответственность за архитектуру, код и конечный опыт пользователя.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    id: 'clarity',
    title: 'Radical clarity',
    description: 'Простота масштабируется, сложность — нет. Мы пишем код и общаемся так, чтобы нас было невозможно не понять.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  }
];

export const About: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Обработка движения мыши для создания эффекта свечения (Linear-style hover)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    const cards = gridRef.current.getElementsByClassName(styles.card);
    for (const card of Array.from(cards)) {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        
        <header className={styles.hero}>
          <h1 className={styles.title}>
            Building the standard.
          </h1>
          <p className={styles.subtitle}>
            Мы не просто пишем код. Мы создаем надежную, масштабируемую инфраструктуру и интерфейсы, которые формируют индустрию. Инженерия как искусство.
          </p>
        </header>

        <div 
          className={styles.bentoGrid} 
          ref={gridRef} 
          onMouseMove={handleMouseMove}
        >
          {CORE_VALUES.map((value, index) => (
            <article 
              key={value.id} 
              className={styles.card}
              style={{ '--animation-order': index } as React.CSSProperties}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  {value.icon}
                </div>
                <h3 className={styles.cardTitle}>{value.title}</h3>
                <p className={styles.cardDescription}>{value.description}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
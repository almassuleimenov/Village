"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloorPlan.module.css';

// Строгая типизация узлов плана
interface PlanNode {
  id: string;
  title: string;
  area: number;
  description: string;
  coordinates: { x: number; y: number }; // Проценты от верхнего левого угла картинки
}

// Статические данные. O(1) Memory allocation.
// ВНИМАНИЕ: Настрой координаты x и y под твою картинку Group 133.png
const PLAN_NODES: PlanNode[] = [
  {
    id: 'living',
    title: 'Гостиная-столовая',
    area: 84.5,
    description: 'Просторное сердце дома с панорамным остеклением, выходом на террасу и зоной для камина. Идеально для приемов.',
    coordinates: { x: 35, y: 45 } 
  },
  {
    id: 'master-bed',
    title: 'Master Bedroom',
    area: 42.0,
    description: 'Приватный блок владельцев с собственной гардеробной комнатой и просторной ванной, оборудованной двойной раковиной.',
    coordinates: { x: 70, y: 30 }
  },
  {
    id: 'kitchen',
    title: 'Кухня',
    area: 24.2,
    description: 'Эргономичное пространство с "черновой" зоной для готовки и островом для утреннего кофе.',
    coordinates: { x: 25, y: 20 }
  },
  {
    id: 'terrace',
    title: 'Терраса',
    area: 65.0,
    description: 'Летнее продолжение гостиной. Зона для BBQ, отдыха и созерцания ландшафтного дизайна комплекса.',
    coordinates: { x: 50, y: 80 }
  }
];

export function FloorPlan() {
  // По умолчанию активна первая зона
  const [activeNode, setActiveNode] = useState<PlanNode>(PLAN_NODES[0]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Левая панель: Инфо (Master-Detail pattern) */}
        <div className={styles.infoPanel}>
          <div className={styles.header}>
            <h2 className={styles.title}>The Layout.</h2>
            <p className={styles.subtitle}>
              Продуманная эргономика каждого квадратного метра. 
              Архитектура, подчиненная сценариям вашей жизни.
            </p>
            
            <div className={styles.globalStats}>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Общая площадь</span>
                <span className={styles.statValue}>320 m²</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Высота потолков</span>
                <span className={styles.statValue}>3.6 m</span>
              </div>
            </div>
          </div>

          <div className={styles.activeDetails}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={styles.detailCard}
              >
                <div className={styles.detailHeader}>
                  <h3 className={styles.detailTitle}>{activeNode.title}</h3>
                  <span className={styles.detailArea}>{activeNode.area} m²</span>
                </div>
                <p className={styles.detailDescription}>{activeNode.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Правая панель: Интерактивный план */}
        <div className={styles.planContainer}>
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/forsecond/Group 133.png" 
              alt="Планировка резиденции" 
              className={styles.planImage}
            />

            {/* Рендер интерактивных точек */}
            {PLAN_NODES.map((node) => {
              const isActive = activeNode.id === node.id;
              
              return (
                <button
                  key={node.id}
                  className={`${styles.pin} ${isActive ? styles.pinActive : ''}`}
                  style={{ 
                    left: `${node.coordinates.x}%`, 
                    top: `${node.coordinates.y}%` 
                  }}
                  onClick={() => setActiveNode(node)}
                  aria-label={`Показать информацию о ${node.title}`}
                >
                  <span className={styles.pinInner} />
                  {/* Эффект пульсации (Ping) для неактивных элементов */}
                  {!isActive && <span className={styles.pinPing} />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
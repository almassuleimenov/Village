"use client";

import React from "react";
import styles from "./Atmosphere.module.css";

export function Atmosphere() {
  // Компонент не имеет состояния и не требует ререндеров.
  // Это чистый визуальный слой поверх всего DOM-дерева.
  return (
    <>
      {/* Слой с кинематографичной виньеткой (затемнение по краям) */}
      <div className={styles.vignette} aria-hidden="true" />
      
      {/* Слой с шумом (Film Grain) */}
      <div className={styles.noise} aria-hidden="true" />
    </>
  );
}
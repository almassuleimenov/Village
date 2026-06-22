import React from 'react';
import styles from './Cta.module.css';

interface CtaProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const Cta: React.FC<CtaProps> = ({
  title = "Готовы стать частью V-Village?",
  description = "Оставьте заявку на персональную презентацию проекта. Мы свяжемся с вами в течение 15 минут, чтобы обсудить детали и ответить на все вопросы.",
  buttonText = "Получить презентацию",
  onButtonClick,
}) => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        
        <div className={styles.actionWrapper}>
          <button 
            className={styles.button} 
            onClick={onButtonClick}
            type="button"
            aria-label={buttonText}
          >
            <span className={styles.buttonText}>{buttonText}</span>
            <span className={styles.buttonIcon}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
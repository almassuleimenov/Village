// components/Video/AdaptiveVideo.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AdaptiveVideoProps {
  desktopSrc: string;
  mobileSrc: string;
  poster?: string;
  mobileBreakpoint?: number;
  className?: string;
}

export function AdaptiveVideo({
  desktopSrc,
  mobileSrc,
  poster,
  mobileBreakpoint = 768,
  className = "",
}: AdaptiveVideoProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    // Используем matchMedia для более точного определения ширины, включая скроллбары
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setVideoSrc(e.matches ? mobileSrc : desktopSrc);
    };

    // Инициализация $O(1)$
    handleMediaChange(mediaQuery);

    // Слушатель изменений (например, при повороте планшета)
    mediaQuery.addEventListener("change", handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [desktopSrc, mobileSrc, mobileBreakpoint]);

  // Во время SSR или до первого рендера на клиенте показываем fallback (например, цвет фона или постер)
  if (!isMounted || !videoSrc) {
    return (
      <div 
        className={`w-full h-full bg-[#0a0a0a] ${className}`} 
        style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative overflow-hidden ${className}`}
    >
      <video
        // Ключ заставляет React пересоздать DOM-узел при смене источника. 
        // Это гарантирует, что автоплей сработает корректно на всех устройствах.
        key={videoSrc}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        disablePictureInPicture
      >
        <source src={videoSrc} type="video/mp4" />
        Ваш браузер не поддерживает тег video.
      </video>
    </motion.div>
  );
}
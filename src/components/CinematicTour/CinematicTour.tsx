"use client";

import { useState, useEffect } from "react";
import { DesktopCinematic } from "./DesktopCinematic";
import { MobileCinematic } from "./MobileCinematic";

export function CinematicTour() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Определяем мобильное устройство (ширина до 768px)
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Защита от Hydration Mismatch (предотвращает Layout Shift)
  if (isMobile === null) {
    return <div style={{ height: "100svh", width: "100%", backgroundColor: "#050505" }} />;
  }

  return isMobile ? <MobileCinematic /> : <DesktopCinematic />;
}
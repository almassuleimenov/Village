import type { Metadata } from "next";
import { 
  Cormorant_Garamond, 
  Manrope,
  Playfair_Display,
  Outfit,
  Lora,
  Montserrat
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import { Preloader } from "@/components/Preloader/Preloader";
import { Atmosphere } from "@/components/Atmosphere/Atmosphere";
import { CustomCursor } from "@/components/Cursor/CustomCursor";
import { LanguageProvider } from "@/context/LanguageContext";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { Analytics } from "@vercel/analytics/react";

// --- БАЗОВЫЕ ШРИФТЫ (RU) ---
const serif = Cormorant_Garamond({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: 'swap'
});

const manrope = Manrope({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: 'swap'
});

// --- ШРИФТЫ ДЛЯ АНГЛИЙСКОГО (EN) ---
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["400", "500"],
  variable: "--font-playfair", 
  display: 'swap' 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit", 
  display: 'swap' 
});

// --- ШРИФТЫ ДЛЯ КАЗАХСКОГО (KZ) ---
const lora = Lora({ 
  subsets: ["cyrillic", "cyrillic-ext"], 
  weight: ["400", "500"],
  variable: "--font-lora", 
  display: 'swap' 
});

const montserrat = Montserrat({ 
  subsets: ["cyrillic", "cyrillic-ext", "latin"], 
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat", 
  display: 'swap' 
});

export const metadata: Metadata = {
  title: "V Club Village | Жизнь в гармонии с природой",
  description: "Элитный жилой комплекс у подножия гор.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="ru" 
      data-lang="ru" 
      className={`
        ${serif.variable} 
        ${manrope.variable} 
        ${playfair.variable} 
        ${outfit.variable} 
        ${lora.variable} 
        ${montserrat.variable}
      `}
    >
      <body>
        <LanguageProvider>
          <Atmosphere />
          <CustomCursor />
          <Preloader />
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <CookieBanner />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
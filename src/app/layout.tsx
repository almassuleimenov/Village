import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import { Preloader } from "@/components/Preloader/Preloader";
import { Atmosphere } from "@/components/Atmosphere/Atmosphere";
import { CustomCursor } from "@/components/Cursor/CustomCursor";

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
    // Инжектим обе CSS-переменные в корневой тег html
    <html lang="ru" className={`${serif.variable} ${manrope.variable}`}>
      <body>
        <Atmosphere />
        <CustomCursor />
        <Preloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
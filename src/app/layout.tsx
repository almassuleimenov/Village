import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import { Preloader } from "@/components/Preloader/Preloader";
//D:\Project\react_projects\v-village-brochure\src\app\layout.tsx
const serif = Cormorant_Garamond({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: 'swap'
});

const sans = Inter({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["300", "400"],
  variable: "--font-sans",
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
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Preloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
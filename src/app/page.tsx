import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { Footer } from "@/components/Footer/Footer";

// Импорт нашего нового глобального виджета
import { FloatingSocials } from "@/components/FloatingSocials/FloatingSocials";

// Асинхронная подгрузка тяжелых компонентов
const CinematicTour = dynamic(() => 
  import("@/components/CinematicTour/CinematicTour").then((mod) => mod.CinematicTour)
);

const FloorPlan = dynamic(() => 
  import("@/components/FloorPlan/FloorPlan").then((mod) => mod.FloorPlan)
);

const Advantages = dynamic(() => 
  import("@/components/Advantages/Advantages").then((mod) => mod.Advantages)
);

const HorizontalGallery = dynamic(() => 
  import("@/components/Gallery/HorizontalGallery").then((mod) => mod.HorizontalGallery)
);

const Location = dynamic(() => 
  import("@/components/Location/Location").then((mod) => mod.Location)
);

const Cta = dynamic(() => 
  import("@/components/Cta/Cta").then((mod) => mod.Cta)
);

// Для VR Journey отключаем SSR, чтобы избежать конфликтов при инъекции iframe
const VrJourney = dynamic(() => 
  import("@/components/VrJourney/VrJourney").then((mod) => mod.VrJourney),
);

export default function Home() {
  return (
    <main>
      <Navbar />
      
      {/* Критически важный контент (грузится сразу) */}
      <Hero />
      <About />
      
      {/* Ленивая загрузка по мере скролла */}
      <CinematicTour />
      <FloorPlan />
      <Advantages />
      <HorizontalGallery />
      <Cta />
      <Location />
      <VrJourney />
      
      <Footer />

      {/* Глобальный плавающий виджет соцсетей (рендерится поверх всего) */}
      <FloatingSocials />
    </main>
  );
}
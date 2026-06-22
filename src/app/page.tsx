import { CinematicTour } from "@/components/CinematicTour/CinematicTour";
import { Footer } from "@/components/Footer/Footer";
import { HorizontalGallery } from "@/components/Gallery/HorizontalGallery";
import { Hero } from "@/components/Hero/Hero";
import { Navbar } from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <CinematicTour />
      <HorizontalGallery />

      <Footer/>
      
    </main>
  );
}
import { About } from "@/components/About/About";
import { Advantages } from "@/components/Advantages/Advantages";
import { CinematicTour } from "@/components/CinematicTour/CinematicTour";
import { Cta } from "@/components/Cta/Cta";
import { FloorPlan } from "@/components/FloorPlan/FloorPlan";
import { Footer } from "@/components/Footer/Footer";
import { HorizontalGallery } from "@/components/Gallery/HorizontalGallery";
import { Hero } from "@/components/Hero/Hero";
import { Navbar } from "@/components/Navbar/Navbar";
import { Location } from "@/components/Location/Location";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      

      <CinematicTour />
      <FloorPlan />
      <Advantages />
      <HorizontalGallery />
      <Cta/>
      <Location/>
      

      <Footer/>
      
    </main>
  );
}
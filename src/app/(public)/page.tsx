import Hero from "../../components/home/Hero";
import ImpactSection from "../../components/home/ImpactSection";
import MobilePreviewSection from "../../components/home/MobilePreviewSection";
import FoodTruckHeroSection from "../../components/home/FoodTruckHeroSection";
import VideoMessageSection from "../../components/home/VideoMessageSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ImpactSection />
      <MobilePreviewSection />
      <FoodTruckHeroSection />
      <VideoMessageSection />
    </div>
  );
}
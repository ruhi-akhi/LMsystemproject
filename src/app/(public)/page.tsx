import Hero from "@/components/Home/Hero";
import ImpactSection from "@/components/Home/ImpactSection";
import MobilePreviewSection from "@/components/Home/MobilePreviewSection";
import FoodTruckHeroSection from "@/components/Home/FoodTruckHeroSection";
import VideoMessageSection from "@/components/Home/VideoMessageSection";

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

import Hero from "@/components/marketing/Hero";
import ImpactSection from "@/components/marketing/ImpactSection";
import MobilePreviewSection from "@/components/marketing/MobilePreviewSection";
import FoodTruckHeroSection from "@/components/marketing/FoodTruckHeroSection";
import VideoMessageSection from "@/components/marketing/VideoMessageSection";

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

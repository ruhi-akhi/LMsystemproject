import Hero from "../../components/Home/Hero";
import ImpactSection from "../../components/Home/ImpactSection";
import MobilePreviewSection from "../../components/Home/MobilePreviewSection";
import ProblemSolution from "../../components/Home/ProblemSolution";
import VideoMessageSection from "../../components/Home/VideoMessageSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ImpactSection />
      <MobilePreviewSection />
      <ProblemSolution />
      <VideoMessageSection />
    </div>
  );
}
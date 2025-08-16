import Banner from "@/components/Home/Banner";
import HiddenGemsSection from "@/components/Home/HiddenGemsSection";
import { OverviewSection } from "@/components/Home/OverviewSection";
import TasteOfBangladeshSection from "@/components/Home/TasteOfBangladeshSection";
import TourismAndTravelGuideSection from "@/components/Home/TourismAndTravelGuideSection";
import TouristStoriesSection from "@/components/Home/TouristStoriesSection";

export default function Home() {
  return (
    <>
      <Banner />
      <OverviewSection />
      <TouristStoriesSection />
      <TourismAndTravelGuideSection />
      <HiddenGemsSection />
      <TasteOfBangladeshSection />
    </>
  );
}

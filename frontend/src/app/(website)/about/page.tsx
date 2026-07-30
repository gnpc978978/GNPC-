import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",
};
import AboutIntro from "@/components/about/AboutIntro";
import MissionVision from "@/components/about/MissionVision";
import Objectives from "@/components/about/Objectives";
import PresidentMessage from "@/components/about/PresidentMessage";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import AboutCTA from "@/components/about/AboutCTA";
import AboutHero from "@/components/about/AboutHero";

export default function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />

      <AboutIntro />
      <MissionVision />
      <Objectives />
      <PresidentMessage />
      <WhyChooseUs />
      <AboutCTA />
    </main>
  );
}

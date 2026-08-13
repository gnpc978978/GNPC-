import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";

import AboutIntro from "@/components/about/AboutIntro";
import MissionVision from "@/components/about/MissionVision";
import Objectives from "@/components/about/Objectives";
import PresidentMessage from "@/components/about/PresidentMessage";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="About Greater Noida Press Club"
        title="About Us"
        description="Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism."
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "About Us",
          },
        ]}
      />

      <AboutIntro />

      <MissionVision />

      <Objectives />

      <PresidentMessage />

      <WhyChooseUs />

      <AboutCTA />
    </main>
  );
}

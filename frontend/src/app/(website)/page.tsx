import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Objectives from "@/components/home/Objectives";
import Gallery from "@/components/home/Gallery";
import LatestUpdates from "@/components/home/LatestUpdates";
import PressConference from "@/components/home/PressConference";
import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";
import OfficeBearersSection from "@/components/home/OfficeBearersSection";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <Objectives />

      <Gallery />

      <LatestUpdates />

      <PressConference />

      <ExecutiveCommitteeSection
        limit={4}
        showViewAll
      />

      <OfficeBearersSection />

      <CTA />
    </>
  );
}

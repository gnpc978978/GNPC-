import About from "@/components/home/About";
import CTA from "@/components/home/CTA";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import LatestUpdates from "@/components/home/LatestUpdates";
import Objectives from "@/components/home/Objectives";
import OfficeBearersSection from "@/components/home/OfficeBearersSection";
import PressConference from "@/components/home/PressConference";

export default function HomePage() {
  return (
    <>
      {/* =====================================================
          HERO
          ===================================================== */}

      <Hero />

      {/* =====================================================
          ABOUT
          ===================================================== */}

      <About />

      {/* =====================================================
          OBJECTIVES
          ===================================================== */}

      <Objectives />

      {/* =====================================================
          LATEST UPDATES
          ===================================================== */}

      <LatestUpdates />

      {/* =====================================================
          OFFICE BEARERS
          ===================================================== */}

      <OfficeBearersSection />

      {/* =====================================================
          PRESS CONFERENCES
          ===================================================== */}

      <PressConference />

      {/* =====================================================
          GALLERY
          ===================================================== */}

      <Gallery />

      {/* =====================================================
          CALL TO ACTION
          ===================================================== */}

      <CTA />
    </>
  );
}

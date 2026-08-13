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
    <div className="w-full overflow-x-hidden bg-white">
      {/* =================================================
          HERO
          ================================================= */}

      <Hero />

      {/* =================================================
          ABOUT GNPC
          ================================================= */}

      <section
        id="about"
        className="bg-white"
      >
        <About />
      </section>

      {/* =================================================
          OBJECTIVES
          ================================================= */}

      <section
        id="objectives"
        className="bg-slate-50"
      >
        <Objectives />
      </section>

      {/* =================================================
          LATEST UPDATES
          
          Press Releases
          Announcements
          Events
          ================================================= */}

      <section
        id="latest-updates"
        className="bg-white"
      >
        <LatestUpdates />
      </section>

      {/* =================================================
          GALLERY
          ================================================= */}

      <section
        id="gallery"
        className="bg-slate-50"
      >
        <Gallery />
      </section>

      {/* =================================================
          PRESS CONFERENCES
          ================================================= */}

      <section
        id="press-conferences"
        className="bg-white"
      >
        <PressConference />
      </section>

      {/* =================================================
          EXECUTIVE COMMITTEE
          ================================================= */}

      <section
        id="executive-committee"
        className="bg-slate-50"
      >
        <ExecutiveCommitteeSection
          limit={4}
          showViewAll
        />
      </section>

      {/* =================================================
          OFFICE BEARERS
          ================================================= */}

      <section
        id="office-bearers"
        className="bg-white"
      >
        <OfficeBearersSection />
      </section>

      {/* =================================================
          MEMBERSHIP / CONTACT CTA
          ================================================= */}

      <section
        id="membership"
        className="bg-slate-50"
      >
        <CTA />
      </section>
    </div>
  );
}

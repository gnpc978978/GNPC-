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
    <main className="home-page w-full overflow-x-hidden bg-white">
      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <section
        id="about"
        data-home-section
        className="home-section bg-white"
      >
        <About />
      </section>

      {/* OBJECTIVES */}
      <section
        id="objectives"
        data-home-section
        className="home-section bg-slate-50"
      >
        <Objectives />
      </section>

      {/* LATEST UPDATES */}
      <section
        id="latest-updates"
        data-home-section
        className="home-section bg-white"
      >
        <LatestUpdates />
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        data-home-section
        className="home-section bg-slate-50"
      >
        <Gallery />
      </section>

      {/* PRESS CONFERENCES */}
      <section
        id="press-conferences"
        data-home-section
        className="home-section bg-white"
      >
        <PressConference />
      </section>

      {/* EXECUTIVE COMMITTEE */}
      <section
        id="executive-committee"
        data-home-section
        className="home-section bg-slate-50"
      >
        <ExecutiveCommitteeSection
          limit={4}
          showViewAll
        />
      </section>

      {/* OFFICE BEARERS */}
      <section
        id="office-bearers"
        data-home-section
        className="home-section bg-white"
      >
        <OfficeBearersSection />
      </section>

      {/* JOIN / CONTACT CTA */}
      <section
        id="membership"
        data-home-section
        className="home-section bg-slate-50"
      >
        <CTA />
      </section>

      <style jsx global>{`
        /* =========================================================
           GNPC HOMEPAGE SECTION SYSTEM
           ========================================================= */

        .home-page {
          --gnpc-blue: #1769ff;
          --gnpc-heading: #0f172a;
          --gnpc-muted: #64748b;
        }

        /* Consistent section spacing */
        .home-page .home-section {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        /* =========================================================
           SECTION HEADINGS
           Center the main heading area across homepage sections.
           ========================================================= */

        .home-page
          .home-section
          > div
          > h2:first-of-type,
        .home-page
          .home-section
          > div
          > div:first-child
          > h2:first-of-type,
        .home-page
          .home-section
          > div
          > div:first-child
          > div:first-child
          > h2:first-of-type {
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        /* Main section descriptions */
        .home-page
          .home-section
          > div
          > h2:first-of-type
          + p,
        .home-page
          .home-section
          > div
          > div:first-child
          > h2:first-of-type
          + p,
        .home-page
          .home-section
          > div
          > div:first-child
          > div:first-child
          > h2:first-of-type
          + p {
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        /* Section eyebrow / label immediately before heading */
        .home-page
          .home-section
          > div
          > p:has(+ h2),
        .home-page
          .home-section
          > div
          > div:first-child
          > p:has(+ h2),
        .home-page
          .home-section
          > div
          > div:first-child
          > div:first-child
          > p:has(+ h2) {
          justify-content: center !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        /* Center the small blue heading line + label */
        .home-page
          .home-section
          p:has(+ h2) {
          text-align: center !important;
        }

        /* =========================================================
           BLUE EYEBROW / LABEL
           ========================================================= */

        .home-page
          .home-section
          p:has(+ h2)::before {
          content: "";
          display: inline-block;
          width: 38px;
          height: 3px;
          margin-right: 14px;
          vertical-align: middle;
          border-radius: 999px;
          background: var(--gnpc-blue);
        }

        /* Avoid creating a second line where the component already
           provides its own decorative line */
        .home-page
          .home-section
          p[class*="uppercase"]:has(+ h2)::before {
          display: inline-block;
        }

        /* =========================================================
           MAIN HEADING TYPOGRAPHY
           ========================================================= */

        .home-page
          .home

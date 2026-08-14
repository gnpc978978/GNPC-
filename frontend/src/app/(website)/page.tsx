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
      <Hero />

      <section id="about" data-home-section className="home-section bg-white">
        <About />
      </section>

      <section id="objectives" data-home-section className="home-section bg-slate-50">
        <Objectives />
      </section>

      <section id="latest-updates" data-home-section className="home-section bg-white">
        <LatestUpdates />
      </section>

      <section id="gallery" data-home-section className="home-section bg-slate-50">
        <Gallery />
      </section>

      <section id="press-conferences" data-home-section className="home-section bg-white">
        <PressConference />
      </section>

      <section id="executive-committee" data-home-section className="home-section bg-slate-50">
        <ExecutiveCommitteeSection limit={3} showViewAll />
      </section>

      <section id="office-bearers" data-home-section className="home-section bg-white">
        <OfficeBearersSection />
      </section>

      <section id="membership" data-home-section className="home-section bg-slate-50">
        <CTA />
      </section>
    </main>
  );
}

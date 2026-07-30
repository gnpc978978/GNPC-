import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Objectives from "@/components/home/Objectives";
import Gallery from "@/components/home/Gallery";
import PressConference from "@/components/home/PressConference";
import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";
import LatestUpdates from "@/components/home/LatestUpdates";
import OfficeBearersSection from "@/components/home/OfficeBearersSection";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <About />
      <Objectives />
      <Gallery />
      <LatestUpdates />
      <PressConference />
      <ExecutiveCommitteeSection limit={4} showViewAll />
      <OfficeBearersSection />
      <CTA />
      <Footer />
    </>
  );
}

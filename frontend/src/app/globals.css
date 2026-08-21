"use client";

import About from "@/components/home/About";
import CTA from "@/components/home/CTA";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import LatestUpdates from "@/components/home/LatestUpdates";
import Objectives from "@/components/home/Objectives";
import OfficeBearersSection from "@/components/home/OfficeBearersSection";
import PressConference from "@/components/home/PressConference";
import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";

import {
  mergeHomeSettings,
  type HomeSectionKey,
} from "@/types/homeSettings";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function Home() {
  const { settings } =
    useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const orderedSections =
    (
      Object.keys(
        home.sections
      ) as HomeSectionKey[]
    )
      .filter(
        (key) =>
          home.sections[key]
            .enabled
      )
      .sort(
        (a, b) =>
          home.sections[a].order -
          home.sections[b].order
      );

  const renderSection = (
    key: HomeSectionKey
  ) => {
    const section =
      home.sections[key];

    /*
     * Keep the CMS background setting
     * available to every homepage section.
     *
     * Individual redesigned components
     * can still use their own visual system,
     * but the CMS remains the source of truth
     * for section visibility/order.
     */

    const wrapperClass = [
      "gnpc-section-shell",
      section.background === "slate"
        ? "gnpc-shell-muted"
        : "gnpc-shell-paper",
    ].join(" ");

    switch (key) {
      case "hero":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <Hero />
          </div>
        );

      case "about":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <About />
          </div>
        );

      case "objectives":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <Objectives />
          </div>
        );

      case "latestUpdates":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <LatestUpdates />
          </div>
        );

      case "gallery":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <Gallery />
          </div>
        );

      case "pressConferences":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <PressConference />
          </div>
        );

      case "executiveCommittee":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <ExecutiveCommitteeSection
              limit={
                home
                  .executiveCommittee
                  .displayCount
              }
              showViewAll={
                home
                  .executiveCommittee
                  .showViewAll
              }
              title={
                home
                  .executiveCommittee
                  .title
              }
              settings={
                settings.pageSettings
                  ?.executiveCommittee
              }
            />
          </div>
        );

      case "officeBearers":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <OfficeBearersSection />
          </div>
        );

      case "membership":
        return (
          <div
            key={key}
            className={wrapperClass}
          >
            <CTA />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {orderedSections.map(
        renderSection
      )}
    </>
  );
}

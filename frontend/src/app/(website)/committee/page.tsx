"use client";

import PageHero from "@/components/ui/PageHero";
import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

export default function ExecutiveCommitteePage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).executiveCommittee;

  return (
    <main>
      <PageHero
        eyebrow={pageSettings.pageEyebrow}
        title={pageSettings.pageTitle}
        description={pageSettings.pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: pageSettings.pageTitle },
        ]}
      />

      <ExecutiveCommitteeSection settings={pageSettings} />
    </main>
  );
}

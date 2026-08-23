"use client";

import PageHero from "@/components/ui/PageHero";
import MembersSection from "@/components/website/MembersSection";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

export default function MembersPage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).members;

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

      <MembersSection settings={pageSettings} />
    </main>
  );
}

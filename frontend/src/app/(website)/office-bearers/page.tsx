"use client";

import PageHero from "@/components/ui/PageHero";
import OfficeBearersPage from "@/components/office-bearers/OfficeBearersPage";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

export default function OfficeBearersRoute() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).officeBearers;

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

      <OfficeBearersPage settings={pageSettings} />
    </main>
  );
}

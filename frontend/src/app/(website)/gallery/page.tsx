"use client";

import PageHero from "@/components/ui/PageHero";
import PublicGallery from "@/components/gallery/PublicGallery";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

export default function GalleryPage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).gallery;

  return (
    <main className="bg-white">
      <PageHero
        eyebrow={pageSettings.pageEyebrow}
        title={pageSettings.pageTitle}
        description={pageSettings.pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: pageSettings.pageTitle },
        ]}
      />

      <PublicGallery settings={pageSettings} />
    </main>
  );
}


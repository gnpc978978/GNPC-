"use client";

import PressConferenceList from "@/components/website/PressConferenceList";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

export default function PressConferencePage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).pressConference;

  return (
    <PressConferenceList settings={pageSettings} />
  );
}


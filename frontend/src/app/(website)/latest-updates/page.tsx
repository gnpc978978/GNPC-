import PageHero from "@/components/ui/PageHero";
import LatestUpdatesPage from "@/components/latest-updates/LatestUpdatesPage";

export default function LatestUpdates() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Latest Updates"
        title="Latest News & Updates"
        description="Stay updated with the latest announcements, press releases and events from Greater Noida Press Club."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Latest Updates" },
        ]}
      />

      <LatestUpdatesPage />
    </main>
  );
}

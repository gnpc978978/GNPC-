import PageHero from "@/components/ui/PageHero";
import OfficeBearersPage from "@/components/office-bearers/OfficeBearersPage";

export default function OfficeBearers() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Office Bearers"
        title="Our Office Bearers"
        description="Meet the office bearers of Greater Noida Press Club and learn more about the team leading the organization."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Office Bearers" },
        ]}
      />

      <OfficeBearersPage />
    </main>
  );
}

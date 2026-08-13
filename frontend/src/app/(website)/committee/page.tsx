import PageHero from "@/components/ui/PageHero";
import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";

export default function CommitteePage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Executive Committee"
        title="Our Executive Committee"
        description="Meet the office bearers and executive committee members of Greater Noida Press Club."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Executive Committee" },
        ]}
      />

      <ExecutiveCommitteeSection />
    </main>
  );
}

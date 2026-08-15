import AboutSectionForm from "@/components/admin/settings/AboutSectionForm";

export default function AboutSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        About Section
      </h1>

      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Edit the complete About page from one CMS screen, including the hero,
        introduction, commitment, mission, vision, objectives, president
        message, reasons to join and CTA content.
      </p>

      <AboutSectionForm />
    </div>
  );
}


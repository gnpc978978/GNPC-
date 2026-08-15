import HomeSectionForm from "@/components/admin/settings/HomeSectionForm";

export default function HomeSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Home Section
      </h1>

      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Control the complete homepage from one CMS screen:
        section order, visibility, headings, descriptions,
        buttons, card counts, objective cards and homepage media.
      </p>

      <HomeSectionForm />
    </div>
  );
}

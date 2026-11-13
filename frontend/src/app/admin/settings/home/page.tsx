import HomeSectionForm from "@/components/admin/settings/HomeSectionForm";

export default function HomeSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Home Section
      </h1>

      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Manage the redesigned homepage below the existing Hero. Set section order,
        visibility and surface style, then edit each section's headings,
        descriptions, cards, media and calls to action from the panels below.
      </p>

      <HomeSectionForm />
    </div>
  );
}

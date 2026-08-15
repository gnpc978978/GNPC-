import PageSettingsForm from "@/components/admin/settings/PageSettingsForm";

export default function PressConferenceSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Press Conference Section
      </h1>
      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Control the public page heading, display options, filters and card
        limits. Use the linked content manager to edit the actual records.
      </p>
      <PageSettingsForm pageKey="press-conference" />
    </div>
  );
}


import PageSettingsForm from "@/components/admin/settings/PageSettingsForm";

export default function OfficeBearersSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Office Bearers Section
      </h1>

      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Control the public Office Bearers page heading, description, display
        limits, search, filters and pagination. Use the linked content manager
        to edit the actual office bearer records.
      </p>

      <PageSettingsForm pageKey="officeBearers" />
    </div>
  );
}

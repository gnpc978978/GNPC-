import PageSettingsForm from "@/components/admin/settings/PageSettingsForm";

export default function LatestUpdatesSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Latest Updates Section
      </h1>

      <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-500">
        Control the public Latest Updates page heading, description, display
        limits, search, filters, sorting, tabs and pagination. Use the linked
        content managers to edit the actual updates, announcements, press
        releases and events.
      </p>

      <PageSettingsForm pageKey="latestUpdates" />
    </div>
  );
}

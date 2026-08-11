"use client";

import SettingsSidebar from "@/components/admin/settings/SettingsSidebar";

export default function WebsiteSettings() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Website Settings
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Settings Options */}
        <div className="md:col-span-1">
          <SettingsSidebar />
        </div>

        {/* Empty settings content area */}
        <div className="hidden md:block md:col-span-2" />
      </div>
    </div>
  );
}

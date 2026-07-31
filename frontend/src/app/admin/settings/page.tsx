"use client";

import SettingsSidebar from "@/components/admin/settings/SettingsSidebar";

export default function WebsiteSettings() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Website Settings
      </h1>

      <div className="max-w-sm">
        <SettingsSidebar />
      </div>
    </div>
  );
}

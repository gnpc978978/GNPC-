import { redirect } from "next/navigation";

export default function LegacyHeroSettingsPage() {
  redirect("/admin/settings/home");
}

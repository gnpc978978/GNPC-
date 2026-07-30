import type { Metadata } from "next";
import OfficeBearersPage from "@/components/office-bearers/OfficeBearersPage";
export const metadata: Metadata = { title: "Office Bearers", description: "Meet the office bearers of Greater Noida Press Club." };
export default function Page() { return <OfficeBearersPage />; }

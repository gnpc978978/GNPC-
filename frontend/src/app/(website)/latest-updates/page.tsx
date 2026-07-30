import type { Metadata } from "next";
import LatestUpdatesPage from "@/components/latest-updates/LatestUpdatesPage";

export const metadata: Metadata = { title: "Latest Updates", description: "Latest Press Releases, Announcements and Events from Greater Noida Press Club." };

export default function Page() { return <LatestUpdatesPage />; }

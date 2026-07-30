import ExecutiveCommitteeSection from "@/components/website/ExecutiveCommitteeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Committee",
  description: "Meet the Executive Committee of Greater Noida Press Club.",
};

export default function CommitteePage() {
  return <ExecutiveCommitteeSection title="Executive Committee" />;
}

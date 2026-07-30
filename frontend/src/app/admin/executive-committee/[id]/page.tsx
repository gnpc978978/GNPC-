"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getExecutiveCommitteeMember } from "@/services/executiveCommitteeService";
import type { ExecutiveCommittee } from "@/types/executiveCommittee";

export default function ExecutiveMemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<ExecutiveCommittee | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getExecutiveCommitteeMember(id).then(setMember).catch((error) => setError(error instanceof Error ? error.message : "Failed to load member.")); }, [id]);
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!member) return <p className="p-6 text-gray-500">Loading member...</p>;
  return <div className="mx-auto max-w-2xl space-y-5 p-6"><Link href="/admin/executive-committee" className="text-blue-700 hover:underline">← Back to members</Link><div className="rounded-lg bg-white p-6 shadow">{member.photo && <img src={member.photo} alt={member.name} className="mb-5 h-32 w-32 rounded-full object-cover" />}<h1 className="text-2xl font-bold">{member.name}</h1><p className="text-gray-500">{member.designation}</p><dl className="mt-5 grid gap-3 sm:grid-cols-2"><div><dt className="text-sm text-gray-500">Email</dt><dd>{member.email}</dd></div><div><dt className="text-sm text-gray-500">Phone</dt><dd>{member.phone}</dd></div><div><dt className="text-sm text-gray-500">Display Order</dt><dd>{member.displayOrder}</dd></div><div><dt className="text-sm text-gray-500">Status</dt><dd className="capitalize">{member.status}</dd></div></dl></div></div>;
}

"use client";

import { motion } from "framer-motion";
import type { Member } from "@/types/member";
import PersonCard from "@/components/ui/PersonCard";

export default function OfficeBearerCard({ member }: { member: Member }) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <PersonCard
        href={`/office-bearers/${member._id}`}
        name={member.fullName}
        photo={member.photo}
        designation={member.designation}
        organization={member.organization}
        state={member.state}
      />
    </motion.article>
  );
}

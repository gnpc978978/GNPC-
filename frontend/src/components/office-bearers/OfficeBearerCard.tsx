"use client";

import { motion } from "framer-motion";
import type { OfficeBearer } from "@/types/officeBearer";
import PersonCard from "@/components/ui/PersonCard";

export default function OfficeBearerCard({ officeBearer }: { officeBearer: OfficeBearer }) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <PersonCard
        href={`/office-bearers/${officeBearer._id}`}
        name={officeBearer.fullName}
        photo={officeBearer.photo}
        designation={officeBearer.designation}
        organization={officeBearer.organization}
        state={officeBearer.state}
      />
    </motion.article>
  );
}

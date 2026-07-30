"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl"
    >
      {/* Badge */}
      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
        ⭐ Official Press Organization
      </span>

      {/* Heading */}
      <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl xl:text-7xl">
        <span className="text-slate-900">
          Empowering
        </span>

        <br />

        <span className="bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
          Journalism
        </span>

        <br />

        <span className="text-slate-900">
          With Integrity
        </span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
        Greater Noida Press Club is committed to strengthening journalism,
        supporting media professionals, and promoting ethical reporting through
        collaboration, training, and community engagement.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-4">

        <Link href="/news">
          <Button className="border border-blue-700 bg-red text-red-700 hover:bg-blue-700 hover:text-white">
            Press Confrence
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

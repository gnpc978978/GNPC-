"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GalleryCategoriesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/gallery");
  }, [router]);

  return <p className="p-6">Opening live gallery management…</p>;
}

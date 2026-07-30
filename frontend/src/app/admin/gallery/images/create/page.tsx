"use client";

import { useRouter } from "next/navigation";
import ImageForm from "@/components/admin/gallery/ImageForm";

export default function CreateImagePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Image</h1>

      <ImageForm
        onSubmit={(data) => {
          console.log(data);
          router.push("/admin/gallery/images");
        }}
      />
    </div>
  );
}
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

import PressReleaseForm from "@/components/admin/press-releases/PressReleaseForm";


export default function CreatePressReleasePage() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Press Release
          </h1>

          <p className="text-gray-500">
            Add a new press release
          </p>
        </div>


        <Link
          href="/admin/press-releases"
          className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>


      <PressReleaseForm />

    </div>
  );
}
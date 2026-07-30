import Link from "next/link";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import StatusBadge from "@/components/admin/press-releases/StatusBadge";
import { pressReleases } from "@/data/pressReleases";


interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default async function ViewPressReleasePage({
  params,
}: Props) {

  const { id } = await params;


  const pressRelease = pressReleases.find(
    (item) => item.id === Number(id)
  );


  if (!pressRelease) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-xl font-bold">
          Press Release Not Found
        </h1>
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            View Press Release
          </h1>

          <p className="text-gray-500">
            Preview press release details
          </p>
        </div>


        <div className="flex gap-3">

          <Link
            href="/admin/press-releases"
            className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"
          >
            <FaArrowLeft />
            Back
          </Link>


          <Link
            href={`/admin/press-releases/edit/${pressRelease.id}`}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <FaEdit />
            Edit
          </Link>

        </div>

      </div>


      {/* Content Card */}
      <div className="rounded-xl bg-white p-8 shadow">

        <h2 className="text-2xl font-bold text-gray-900">
          {pressRelease.title}
        </h2>


        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">

          <span>
            Category: {pressRelease.category}
          </span>


          <span>
            Author: {pressRelease.author}
          </span>


          <span>
            Date: {pressRelease.date}
          </span>


          <StatusBadge
            status={pressRelease.status}
          />

        </div>


        <hr className="my-6" />


        <div>

          <h3 className="mb-2 text-lg font-semibold">
            Short Description
          </h3>

          <p className="text-gray-600">
            {pressRelease.description}
          </p>

        </div>


        <div className="mt-6">

          <h3 className="mb-2 text-lg font-semibold">
            Content
          </h3>

          <p className="leading-7 text-gray-700">
            {pressRelease.content}
          </p>

        </div>


      </div>

    </div>
  );
}
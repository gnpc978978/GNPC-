import Image from "next/image";
import { FaFilePdf } from "react-icons/fa";

import { PressConference } from "@/types/pressConference";
import PressConferenceActions from "./PressConferenceActions";

interface PressConferenceTableProps {
  data: PressConference[];
  onDelete: (id: string) => void;
}

export default function PressConferenceTable({
  data,
  onDelete,
}: PressConferenceTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">
              Title
            </th>

            <th className="px-4 py-3 text-left">
              Venue
            </th>

            <th className="px-4 py-3 text-left">
              Date
            </th>

            <th className="px-4 py-3 text-left">
              Image
            </th>

            <th className="px-4 py-3 text-left">
              PDF
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>
          </tr>
        </thead>


        <tbody>

          {data.length > 0 ? (
            data.map((conference) => (
              <tr
                key={conference._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-4 py-3 font-medium">
                  {conference.title}
                </td>


                <td className="px-4 py-3">
                  {conference.venue}
                </td>


                <td className="px-4 py-3">
                  {conference.date}
                </td>


                <td className="px-4 py-3">

                  {conference.featuredImage ? (
                    <Image
                      src={conference.featuredImage}
                      alt={conference.title}
                      width={70}
                      height={45}
                      className="rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">
                      No Image
                    </span>
                  )}

                </td>


                <td className="px-4 py-3">

                  {conference.pdfFile ? (
                    <a
                      href={conference.pdfFile}
                      target="_blank"
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <FaFilePdf />
                      PDF
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      No PDF
                    </span>
                  )}

                </td>


                <td className="px-4 py-3">
                  <PressConferenceActions
                    id={conference._id}
                    onDelete={onDelete}
                  />
                </td>

              </tr>
            ))
          ) : (

            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-gray-500"
              >
                No Press Conferences Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

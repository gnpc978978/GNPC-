"use client";
import { deleteEvent } from "@/services/eventService";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { Event } from "@/types/event";
import StatusBadge from "./StatusBadge";


interface EventTableProps {
  events: Event[];
}


export default function EventTable({
  events,
}: EventTableProps) {

const handleDelete = async (
  id: string
) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this event?"
    );


  if (!confirmDelete) return;


  try {

    await deleteEvent(id);

    window.location.reload();


  } catch (error) {

    console.log(
      "Delete event failed",
      error
    );

  }

};
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">
          <tr>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Banner
            </th>


            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Title
            </th>


            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Date
            </th>


            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Location
            </th>


            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Status
            </th>


            <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
              Actions
            </th>

          </tr>
        </thead>



        <tbody>

          {events.length > 0 ? (

            events.map((event) => (

              <tr
                key={event._id}
                className="border-t border-gray-200 transition hover:bg-gray-50"
              >


                <td className="px-5 py-4">

                  {event.banner ? (

                    <Image
                      src={event.banner}
                      alt={event.title}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover"
                    />

                  ) : (

                    <div className="flex h-[60px] w-[80px] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      No Image
                    </div>

                  )}

                </td>



                <td className="px-5 py-4">

                  <div className="font-semibold text-gray-900">
                    {event.title}
                  </div>


                  <div className="mt-1 text-xs text-gray-500">
                    {event.description.slice(0, 50)}...
                  </div>

                </td>




                <td className="px-5 py-4 text-sm text-gray-700">

                  {new Date(event.date).toLocaleDateString(
                    "en-GB"
                  )}

                </td>




                <td className="px-5 py-4 text-sm text-gray-700">

                  {event.location}

                </td>




                <td className="px-5 py-4">

                  <StatusBadge
                    status={event.status}
                  />

                </td>




                <td className="px-5 py-4">

                  <div className="flex items-center justify-center gap-2">


                    <Link
                      href={`/admin/events/${event._id}`}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                      title="View"
                    >
                      <FaEye />
                    </Link>



                    <Link
                      href={`/admin/events/${event._id}/edit`}
                      className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-200"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>



                  <button
  type="button"
  onClick={() =>
    handleDelete(event._id)
  }
  className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
  title="Delete"
>
  <FaTrash />
</button>


                  </div>

                </td>


              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                No events found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}
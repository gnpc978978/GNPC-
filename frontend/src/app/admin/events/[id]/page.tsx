import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

import StatusBadge from "@/components/admin/events/StatusBadge";
import { events } from "@/data/events";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const event = events.find((item) => item._id === id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-blue-600">
              Dashboard
            </Link>

            <span>/</span>

            <Link
              href="/admin/events"
              className="hover:text-blue-600"
            >
              Events
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-800">
              Event Details
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {event.title}
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/events"
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100"
          >
            <FaArrowLeft />
            Back
          </Link>

          <Link
            href={`/admin/events/${event._id}/edit`}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <FaEdit />
            Edit
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Image
          src={event.banner}
          alt={event.title}
          width={1400}
          height={600}
          className="h-[400px] w-full object-cover"
        />
      </div>

      {/* Information */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">
              Description
            </h2>

            <p className="leading-7 text-gray-700">
              {event.description}
            </p>
          </div>

          {/* Content */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">
              Event Content
            </h2>

            <div className="prose max-w-none">
              {event.content || event.description}
            </div>
          </div>

          {/* Gallery */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              Gallery
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {event.gallery.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  width={400}
                  height={250}
                  className="h-44 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              Event Information
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">Date</p>

                  <p className="font-semibold">
                    {event.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">Time</p>

                  <p className="font-semibold">
                    {event.time || "To be announced"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="font-semibold">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Organizer
                  </p>

                  <p className="font-semibold">
                    {event.organizer || "Greater Noida Press Club"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-500">
                  Status
                </p>

                <StatusBadge status={event.status} />
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-500">
                  Slug
                </p>

                <p className="rounded-lg bg-gray-100 p-2 text-sm break-all">
                  {event.slug || event._id}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-500">
                  Created At
                </p>

                <p className="font-semibold">
                  {event.createdAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

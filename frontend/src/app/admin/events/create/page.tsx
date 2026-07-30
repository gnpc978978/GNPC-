import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import EventForm from "@/components/admin/events/EventForm";

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Create Event
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Event
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new event for the Press Club website.
          </p>
        </div>

        <Link
          href="/admin/events"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <EventForm />
      </div>
    </div>
  );
}
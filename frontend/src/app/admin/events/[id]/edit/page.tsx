"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

import EventForm from "@/components/admin/events/EventForm";

import { getEvents } from "@/services/eventService";

import { Event } from "@/types/event";

export default function EditEventPage() {
  const params = useParams();

  const id = params.id as string;

  const [event, setEvent] =
    useState<Event | null>(null);

  const [notFound, setNotFound] =
    useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setNotFound(false);

        const response =
          await getEvents();

        const foundEvent =
          response.data.find(
            (item: Event) =>
              item._id === id
          );

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setEvent(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error(
          "Failed to load event",
          error
        );

        setEvent(null);
        setNotFound(true);
      }
    };

    if (id) {
      void fetchEvent();
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">
          Event not found
        </h2>

        <p className="mt-2 text-gray-600">
          The requested event could not
          be found.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-10 text-center">
        Loading event...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Event
        </h1>

        <p className="mt-2 text-gray-600">
          Update event details
        </p>
      </div>

      <EventForm
        isEdit={true}
        initialData={{
          title: event.title,
          location: event.location,
          date: event.date,
          status: event.status,
          description: event.description,
          banner: event.banner,
          gallery: event.gallery,
        }}
      />
    </div>
  );
}

import { Event } from "@/types/event";

export const events: Event[] = [
  {
    _id: "1",
    title: "Annual Press Meet 2026",
    banner: "/images/events/event1.jpg",
    gallery: [
      "/images/events/event1-1.jpg",
      "/images/events/event1-2.jpg",
      "/images/events/event1-3.jpg",
    ],
    description: "Annual gathering of journalists and media professionals.",
    location: "Greater Noida Press Club",
    date: "26 July 2026",
    status: "published",
    createdAt: "26 July 2026",
    updatedAt: "26 July 2026",
  },
  {
    _id: "2",
    title: "Media Workshop",
    banner: "/images/events/event2.jpg",
    gallery: [
      "/images/events/event2-1.jpg",
      "/images/events/event2-2.jpg",
    ],
    description: "Workshop for young journalists.",
    location: "Noida",
    date: "15 August 2026",
    status: "published",
    createdAt: "20 July 2026",
    updatedAt: "20 July 2026",
  },
  {
    _id: "3",
    title: "Press Freedom Seminar",
    banner: "/images/events/event3.jpg",
    gallery: [
      "/images/events/event3-1.jpg",
      "/images/events/event3-2.jpg",
    ],
    description: "Seminar on freedom of the press.",
    location: "Delhi",
    date: "5 September 2026",
    status: "published",
    createdAt: "15 June 2026",
    updatedAt: "15 June 2026",
  },
];
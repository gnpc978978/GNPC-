export interface PressRelease {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  status: string;
  description: string;
  content: string;
}


export const pressReleases: PressRelease[] = [
  {
    id: 1,
    title: "Greater Noida Press Club Annual Meeting",
    category: "Event",
    author: "Admin",
    date: "26 July 2026",
    status: "Published",
    description:
      "Annual meeting organized with members and press club representatives.",
    content:
      "Greater Noida Press Club annual meeting was successfully organized with all members.",
  },
  {
    id: 2,
    title: "New GNPC Members Announced",
    category: "Announcement",
    author: "Admin",
    date: "20 July 2026",
    status: "Published",
    description:
      "New GNPC Members have been announced by Greater Noida Press Club.",
    content:
      "The new GNPC Members have been announced by Greater Noida Press Club.",
  },
  {
    id: 3,
    title: "Press Club Membership Drive Started",
    category: "Notice",
    author: "Admin",
    date: "15 July 2026",
    status: "Draft",
    description:
      "Membership registration drive has been started for new members.",
    content:
      "Membership registration drive has been started for new members.",
  },
];

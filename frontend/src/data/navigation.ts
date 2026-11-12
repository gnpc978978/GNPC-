export type NavigationChild = {
  name: string;
  href: string;
};

export type NavigationItem = {
  name: string;
  href: string;
  children?: NavigationChild[];
};

export const navigation: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Newsroom",
    href: "/latest-updates",
    children: [
      {
        name: "Latest Updates",
        href: "/latest-updates",
      },
      {
        name: "Press Releases",
        href: "/latest-updates?tab=press-releases",
      },
      {
        name: "Press Conferences",
        href: "/latest-updates?tab=press-conferences",
      },
      {
        name: "Announcements",
        href: "/latest-updates?tab=announcements",
      },
    ],
  },
  {
    name: "Events & Activities",
    href: "/events",
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "Office Bearers",
    href: "/office-bearers",
  },
  {
    name: "Members",
    href: "/members",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

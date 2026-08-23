export type CmsPageKey =
  | "about"
  | "gallery"
  | "latestUpdates"
  | "pressConference"
  | "officeBearers"
  | "members";

export type CommonPageSettings = {
  pageEyebrow: string;
  pageTitle: string;
  pageDescription: string;
};

export type AboutPageSettings = CommonPageSettings;

export type GalleryPageSettings = CommonPageSettings & {
  pageSize: number;
  showCategoryFilter: boolean;
  showPagination: boolean;
};

export type LatestUpdatesPageSettings = CommonPageSettings & {
  showSearch: boolean;
  showCalendar: boolean;
  showSort: boolean;
  pageSize: number;
  allTabLabel: string;
  pressReleasesTabLabel: string;
  announcementsTabLabel: string;
  eventsTabLabel: string;
  searchPlaceholder: string;
  readMoreLabel: string;
};

export type PressConferencePageSettings = CommonPageSettings & {
  pageSize: number;
  showPagination: boolean;
};

export type OfficeBearersPageSettings = CommonPageSettings & {
  pageSize: number;
  showSearch: boolean;
  showFilters: boolean;
};

export type MembersPageSettings = CommonPageSettings & {
  pageSize: number;
  showSearch: boolean;
  showFilters: boolean;
};

export type PageSettings = {
  about: AboutPageSettings;
  gallery: GalleryPageSettings;
  latestUpdates: LatestUpdatesPageSettings;
  pressConference: PressConferencePageSettings;
  officeBearers: OfficeBearersPageSettings;
  members: MembersPageSettings;
};

export const defaultPageSettings: PageSettings = {
  about: {
    pageEyebrow: "About Greater Noida Press Club",
    pageTitle: "About Us",
    pageDescription:
      "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",
  },
  gallery: {
    pageEyebrow: "Media & Memories",
    pageTitle: "Gallery",
    pageDescription:
      "Explore recent events, press activities and memorable moments from Greater Noida Press Club.",
    pageSize: 12,
    showCategoryFilter: true,
    showPagination: true,
  },
  latestUpdates: {
    pageEyebrow: "News & Updates",
    pageTitle: "Latest Updates",
    pageDescription:
      "Stay informed with the latest press releases, announcements, events and press conferences from Greater Noida Press Club.",
    showSearch: true,
    showCalendar: true,
    showSort: true,
    pageSize: 12,
    allTabLabel: "All",
    pressReleasesTabLabel: "Press Releases",
    announcementsTabLabel: "Announcements",
    eventsTabLabel: "Events",
    searchPlaceholder: "Search updates",
    readMoreLabel: "Read More",
  },
  pressConference: {
    pageEyebrow: "Media & Journalism",
    pageTitle: "Press Conferences",
    pageDescription:
      "Stay informed about media interactions, public briefings and official announcements from Greater Noida Press Club.",
    pageSize: 12,
    showPagination: false,
  },
  officeBearers: {
    pageEyebrow: "Our People",
    pageTitle: "Office Bearers",
    pageDescription:
      "Meet the people leading Greater Noida Press Club.",
    pageSize: 12,
    showSearch: true,
    showFilters: true,
  },
  members: {
    pageEyebrow: "Our Strength",
    pageTitle: "Members",
    pageDescription:
      "Meet the members of Greater Noida Press Club.",
    pageSize: 100,
    showSearch: true,
    showFilters: true,
  },
};

export function mergePageSettings(
  value?: Partial<PageSettings>
): PageSettings {
  const source = value || {};

  return {
    about: {
      ...defaultPageSettings.about,
      ...(source.about || {}),
    },
    gallery: {
      ...defaultPageSettings.gallery,
      ...(source.gallery || {}),
    },
    latestUpdates: {
      ...defaultPageSettings.latestUpdates,
      ...(source.latestUpdates || {}),
    },
    pressConference: {
      ...defaultPageSettings.pressConference,
      ...(source.pressConference || {}),
    },
    officeBearers: {
      ...defaultPageSettings.officeBearers,
      ...(source.officeBearers || {}),
    },
    members: {
      ...defaultPageSettings.members,
      ...(source.members || {}),
    },
  };
}

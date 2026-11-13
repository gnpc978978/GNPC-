export type HomeSectionKey =
  | "hero"
  | "about"
  | "latestUpdates"
  | "gallery"
  | "pressConferences"
  | "officeBearers"
;

export type HomeSection = {
  enabled: boolean;
  order: number;
  background: "white" | "slate";
};

export type HomeCard = {
  icon: string;
  title: string;
  description: string;
};

export type HomeSectionMediaKey = Exclude<
  HomeSectionKey,
  "hero"
>;

export type HomeSettings = {
  sections: Record<
    HomeSectionKey,
    HomeSection
  >;

  hero: {
    eyebrow: string;
    identityLabel: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    quickLinks: Array<{
      label: string;
      href: string;
    }>;
  };

  about: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    features: string[];
    showStats: boolean;
    statsLabels: [
      string,
      string,
      string
    ];
    media: string[];
  };

  objectives: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    cards: HomeCard[];
    media: string[];
  };

  latestUpdates: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    media: string[];
  };

  gallery: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    media: string[];
  };

  pressConferences: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    media: string[];
  };

  members: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    showViewAll: boolean;
    media: string[];
  };

  officeBearers: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    showViewAll: boolean;
    media: string[];
  };

  membership: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    media: string[];
  };
};

export const defaultHomeSettings: HomeSettings = {
  sections: {
    hero: {
      enabled: true,
      order: 1,
      background: "white",
    },

    about: {
      enabled: true,
      order: 2,
      background: "white",
    },

    officeBearers: {
      enabled: true,
      order: 3,
      background: "white",
    },

    latestUpdates: {
      enabled: true,
      order: 4,
      background: "white",
    },

    pressConferences: {
      enabled: true,
      order: 5,
      background: "slate",
    },

    gallery: {
      enabled: true,
      order: 6,
      background: "white",
    },
  },

  hero: {
    eyebrow:
      "Greater Noida Press Club",

    identityLabel:
      "Journalism • Media • Community",

    title:
      "Connecting Journalism, Media & Community",

    description:
      "A professional platform for journalists, media professionals and the community of Greater Noida.",

    primaryLabel:
      "Become a Member",

    secondaryLabel:
      "Latest Updates",

    quickLinks: [
      {
        label: "Press Releases",
        href: "/latest-updates?tab=press-releases",
      },
      {
        label: "Press Conferences",
        href: "/latest-updates?tab=press-conferences",
      },
      {
        label: "Events",
        href: "/events",
      },
    ],
  },

  about: {
    eyebrow: "About Us",

    title:
      "Greater Noida Press Club",

    description:
      "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",

    buttonLabel:
      "Learn More About GNPC",

    buttonHref:
      "/about",

    features: [],

    showStats: true,

    statsLabels: [
      "Members",
      "Press Release",
      "Active Events",
    ],

    media: [],
  },

  objectives: {
    eyebrow:
      "Our Objectives",

    title:
      "Empowering Journalism & Media Community",

    description:
      "Greater Noida Press Club works towards promoting ethical journalism, professional growth and stronger media collaboration.",

    buttonLabel:
      "View All Objectives",

    buttonHref:
      "/about",

    displayCount: 3,

    cards: [
      {
        icon: "Newspaper",
        title:
          "Ethical Journalism",
        description:
          "Promoting responsible, transparent and truthful journalism with integrity.",
      },
      {
        icon: "Users",
        title:
          "Professional Networking",
        description:
          "Building a strong network among journalists and media professionals.",
      },
      {
        icon: "Mic",
        title:
          "Press Conferences",
        description:
          "Organizing press conferences, media interactions and public discussions.",
      },
      {
        icon: "GraduationCap",
        title:
          "Media Development",
        description:
          "Supporting skill development and knowledge sharing for journalists.",
      },
      {
        icon: "Award",
        title:
          "Recognition & Excellence",
        description:
          "Recognizing contributions and achievements in the field of journalism.",
      },
      {
        icon: "Images",
        title:
          "Media Documentation",
        description:
          "Preserving important events, activities and press club memories.",
      },
    ],

    media: [],
  },

  latestUpdates: {
    eyebrow:
      "Latest Updates",

    title:
      "News from Greater Noida Press Club",

    description:
      "Stay updated with the latest announcements, events, press releases and press conferences.",

    buttonLabel:
      "View All Updates",

    buttonHref:
      "/latest-updates",

    displayCount: 3,

    media: [],
  },

  gallery: {
    eyebrow:
      "Gallery",

    title:
      "Moments from GNPC",

    description:
      "Explore recent events, press activities and memorable moments.",

    buttonLabel:
      "View Full Gallery",

    buttonHref:
      "/gallery",

    displayCount: 3,

    media: [],
  },

  pressConferences: {
    eyebrow:
      "What's Coming Up",

    title:
      "Upcoming Events & Activities",

    description:
      "Discover upcoming workshops, meetings, seminars and activities organised by Greater Noida Press Club.",

    buttonLabel:
      "View All Events",

    buttonHref:
      "/events",

    displayCount: 3,

    media: [],
  },

  members: {
    eyebrow:
      "Our Strength",

    title:
      "Members",

    description:
      "Meet the members of Greater Noida Press Club.",

    buttonLabel:
      "View All",

    buttonHref:
      "/members",

    displayCount: 3,

    showViewAll: true,

    media: [],
  },

  officeBearers: {
    eyebrow:
      "Our People",

    title:
      "Office Bearers",

    description:
      "Meet the people leading Greater Noida Press Club.",

    buttonLabel:
      "View All",

    buttonHref:
      "/office-bearers",

    displayCount: 3,

    showViewAll: true,

    media: [],
  },

  membership: {
    eyebrow:
      "Membership",

    title:
      "Become a Part of the Press Club",

    description:
      "Join a growing community of journalists, media professionals, and aspiring reporters. Expand your network, attend exclusive events, and strengthen your voice in journalism.",

    primaryLabel:
      "Download Form",

    primaryHref:
      "/membership",

    secondaryLabel:
      "Contact Us",

    secondaryHref:
      "/contact",

    media: [],
  },
};

const normalizeMedia = (
  value: unknown
): string[] =>
  Array.isArray(value)
    ? value.filter(
        (
          item
        ): item is string =>
          typeof item ===
            "string" &&
          item.trim().length >
            0
      )
    : [];

export function mergeHomeSettings(
  value?: Partial<HomeSettings> | null
): HomeSettings {
  const source =
    value || {};

  const legacySectionOrder: Record<HomeSectionKey, number> = {
    hero: 1,
    about: 2,
    officeBearers: 4,
    latestUpdates: 5,
    pressConferences: 6,
    gallery: 7,
  };

  const usesLegacyDefaultOrder = (
    Object.entries(legacySectionOrder) as [HomeSectionKey, number][]
  ).every(([key, order]) => {
    const configured = source.sections?.[key]?.order;
    return configured === undefined || configured === order;
  });

  const mergeSection = <
    T extends Record<
      string,
      unknown
    >
  >(
    fallback: T,
    incoming?: Partial<T>
  ): T => {
    const incomingRecord =
      (incoming ||
        {}) as Record<
        string,
        unknown
      >;

    return {
      ...fallback,
      ...incomingRecord,

      media: normalizeMedia(
        incomingRecord.media
      ),
    } as T;
  };

  const configuredUpcomingEvents = mergeSection(
    defaultHomeSettings.pressConferences,
    source.pressConferences
  );

  const pressConferences = {
    ...configuredUpcomingEvents,
    eyebrow:
      configuredUpcomingEvents.eyebrow === "Media & Journalism"
        ? defaultHomeSettings.pressConferences.eyebrow
        : configuredUpcomingEvents.eyebrow,
    title:
      configuredUpcomingEvents.title === "Latest Press Conference"
        ? defaultHomeSettings.pressConferences.title
        : configuredUpcomingEvents.title,
    description:
      configuredUpcomingEvents.description === "The latest media interaction and official briefing from Greater Noida Press Club."
        ? defaultHomeSettings.pressConferences.description
        : configuredUpcomingEvents.description,
    buttonLabel:
      configuredUpcomingEvents.buttonLabel === "View All"
        ? defaultHomeSettings.pressConferences.buttonLabel
        : configuredUpcomingEvents.buttonLabel,
    buttonHref:
      configuredUpcomingEvents.buttonHref === "/press-conference"
        ? defaultHomeSettings.pressConferences.buttonHref
        : configuredUpcomingEvents.buttonHref,
  };

  return {
    ...defaultHomeSettings,

    ...source,

    sections:
      Object.fromEntries(
        Object.entries(
          defaultHomeSettings.sections
        ).map(
          ([
            key,
            fallback,
          ]) => [
            key,
            {
              ...fallback,
              ...(source.sections?.[
                key as HomeSectionKey
              ] || {}),
              ...(usesLegacyDefaultOrder
                ? { order: fallback.order }
                : {}),
            },
          ]
        )
      ) as HomeSettings["sections"],

    hero: {
      ...defaultHomeSettings.hero,
      ...(source.hero || {}),

      quickLinks:
        Array.isArray(
          source.hero?.quickLinks
        )
          ? source.hero!
              .quickLinks
          : defaultHomeSettings
              .hero
              .quickLinks,
    },

    about: mergeSection(
      defaultHomeSettings.about,
      source.about
    ),

    objectives: {
      ...defaultHomeSettings.objectives,
      ...(source.objectives ||
        {}),

      cards:
        Array.isArray(
          source.objectives?.cards
        )
          ? source.objectives
              .cards
          : defaultHomeSettings
              .objectives
              .cards,

      media: normalizeMedia(
        source.objectives?.media
      ),
    },

    latestUpdates:
      mergeSection(
        defaultHomeSettings.latestUpdates,
        source.latestUpdates
      ),

    gallery:
      mergeSection(
        defaultHomeSettings.gallery,
        source.gallery
      ),

    pressConferences,

    members: {
      ...defaultHomeSettings.members,
      ...(source.members ||
        {}),

      media: normalizeMedia(
        source
          .members
          ?.media
      ),
    },

    officeBearers: {
      ...defaultHomeSettings.officeBearers,
      ...(source.officeBearers ||
        {}),

      media: normalizeMedia(
        source.officeBearers
          ?.media
      ),
    },

    membership: {
      ...defaultHomeSettings.membership,
      ...(source.membership ||
        {}),

      media: normalizeMedia(
        source.membership?.media
      ),

      primaryHref:
        source.membership
          ?.primaryHref ||
        defaultHomeSettings
          .membership
          .primaryHref,
    },
  };
}

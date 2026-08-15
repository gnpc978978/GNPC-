export type HomeSectionKey =
  | "hero"
  | "about"
  | "objectives"
  | "latestUpdates"
  | "gallery"
  | "pressConferences"
  | "executiveCommittee"
  | "officeBearers"
  | "membership";

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

export type HomeSettings = {
  sections: Record<HomeSectionKey, HomeSection>;

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
    statsLabels: [string, string, string];
  };

  objectives: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    cards: HomeCard[];
  };

  latestUpdates: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
  };

  gallery: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
  };

  pressConferences: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
  };

  executiveCommittee: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    showViewAll: boolean;
  };

  officeBearers: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    displayCount: number;
    showViewAll: boolean;
  };

  membership: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
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

    objectives: {
      enabled: true,
      order: 3,
      background: "slate",
    },

    latestUpdates: {
      enabled: true,
      order: 4,
      background: "white",
    },

    gallery: {
      enabled: true,
      order: 5,
      background: "slate",
    },

    pressConferences: {
      enabled: true,
      order: 6,
      background: "white",
    },

    executiveCommittee: {
      enabled: true,
      order: 7,
      background: "slate",
    },

    officeBearers: {
      enabled: true,
      order: 8,
      background: "white",
    },

    membership: {
      enabled: true,
      order: 9,
      background: "slate",
    },
  },

  hero: {
    eyebrow: "Greater Noida Press Club",

    identityLabel: "Journalism • Media • Community",

    title:
      "Connecting Journalism, Media & Community",

    description:
      "A professional platform for journalists, media professionals and the community of Greater Noida.",

    primaryLabel: "Become a Member",

    secondaryLabel: "Latest Updates",

    quickLinks: [
      {
        label: "Press Releases",
        href: "/press-releases",
      },
      {
        label: "Press Conferences",
        href: "/press-conference",
      },
      {
        label: "Events",
        href: "/events",
      },
    ],
  },

  about: {
    eyebrow: "About Us",

    title: "Greater Noida Press Club",

    description:
      "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",

    buttonLabel: "Learn More",

    buttonHref: "/about",

    features: [],

    showStats: true,

    statsLabels: [
      "Members",
      "Press Release",
      "Active Events",
    ],
  },

  objectives: {
    eyebrow: "Our Objectives",

    title:
      "Empowering Journalism & Media Community",

    description:
      "Greater Noida Press Club works towards promoting ethical journalism, professional growth and stronger media collaboration.",

    buttonLabel: "Learn More",

    buttonHref: "/about",

    displayCount: 3,

    cards: [
      {
        icon: "Newspaper",
        title: "Ethical Journalism",
        description:
          "Promoting responsible, transparent and truthful journalism with integrity.",
      },

      {
        icon: "Users",
        title: "Professional Networking",
        description:
          "Building a strong network among journalists and media professionals.",
      },

      {
        icon: "Mic",
        title: "Press Conferences",
        description:
          "Organizing press conferences, media interactions and public discussions.",
      },

      {
        icon: "GraduationCap",
        title: "Media Development",
        description:
          "Supporting skill development and knowledge sharing for journalists.",
      },

      {
        icon: "Award",
        title: "Recognition & Excellence",
        description:
          "Recognizing contributions and achievements in the field of journalism.",
      },

      {
        icon: "Images",
        title: "Media Documentation",
        description:
          "Preserving important events, activities and press club memories.",
      },
    ],
  },

  latestUpdates: {
    eyebrow: "Latest Updates",

    title:
      "News from Greater Noida Press Club",

    description:
      "Stay updated with the latest announcements, events, press releases and press conferences.",

    buttonLabel: "View All Updates",

    buttonHref: "/latest-updates",

    displayCount: 3,
  },

  gallery: {
    eyebrow: "Gallery",

    title: "Moments from GNPC",

    description:
      "Explore recent events, press activities and memorable moments.",

    buttonLabel: "View Gallery",

    buttonHref: "/gallery",

    displayCount: 3,
  },

  pressConferences: {
    eyebrow: "Media & Journalism",

    title: "Latest Press Conference",

    description:
      "The latest media interaction and official briefing from Greater Noida Press Club.",

    buttonLabel: "View All",

    buttonHref: "/press-conference",

    displayCount: 3,
  },

  executiveCommittee: {
    eyebrow: "Our Strength",

    title: "Executive Committee",

    description:
      "Meet the executive committee of Greater Noida Press Club.",

    buttonLabel: "View All",

    buttonHref: "/committee",

    displayCount: 3,

    showViewAll: true,
  },

  officeBearers: {
    eyebrow: "Our People",

    title: "Office Bearers",

    description:
      "Meet the people leading Greater Noida Press Club.",

    buttonLabel: "View All",

    buttonHref: "/office-bearers",

    displayCount: 3,

    showViewAll: true,
  },

  membership: {
    eyebrow: "Membership",

    title:
      "Become a Part of the Press Club",

    description:
      "Join a growing community of journalists, media professionals, and aspiring reporters. Expand your network, attend exclusive events, and strengthen your voice in journalism.",

    primaryLabel: "Download Form",

    secondaryLabel: "Contact Us",

    secondaryHref: "/contact",
  },
};

export function mergeHomeSettings(
  value?: Partial<HomeSettings> | null
): HomeSettings {
  const source = value || {};

  return {
    ...defaultHomeSettings,

    ...source,

    sections: Object.fromEntries(
      Object.entries(
        defaultHomeSettings.sections
      ).map(([key, fallback]) => [
        key,
        {
          ...fallback,
          ...(source.sections?.[
            key as HomeSectionKey
          ] || {}),
        },
      ])
    ) as HomeSettings["sections"],

    hero: {
      ...defaultHomeSettings.hero,
      ...(source.hero || {}),
    },

    about: {
      ...defaultHomeSettings.about,
      ...(source.about || {}),

      statsLabels: (source.about?.statsLabels ||
        defaultHomeSettings.about
          .statsLabels) as [
        string,
        string,
        string
      ],

      features: Array.isArray(
        source.about?.features
      )
        ? source.about.features
        : defaultHomeSettings.about.features,
    },

    objectives: {
      ...defaultHomeSettings.objectives,
      ...(source.objectives || {}),

      cards: Array.isArray(
        source.objectives?.cards
      )
        ? source.objectives.cards
        : defaultHomeSettings.objectives.cards,
    },

    latestUpdates: {
      ...defaultHomeSettings.latestUpdates,
      ...(source.latestUpdates || {}),
    },

    gallery: {
      ...defaultHomeSettings.gallery,
      ...(source.gallery || {}),
    },

    pressConferences: {
      ...defaultHomeSettings.pressConferences,
      ...(source.pressConferences || {}),
    },

    executiveCommittee: {
      ...defaultHomeSettings.executiveCommittee,
      ...(source.executiveCommittee || {}),
    },

    officeBearers: {
      ...defaultHomeSettings.officeBearers,
      ...(source.officeBearers || {}),
    },

    membership: {
      ...defaultHomeSettings.membership,
      ...(source.membership || {}),
    },
  };
}

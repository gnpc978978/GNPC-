import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface ISocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface ISeoSettings {
  title?: string;
  description?: string;
  keywords?: string[];
}

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

export interface IHomeSettings {
  sections: Record<
    HomeSectionKey,
    {
      enabled: boolean;
      order: number;
      background:
        | "white"
        | "slate";
    }
  >;

  hero: Record<string, unknown>;
  about: Record<string, unknown>;
  objectives: Record<string, unknown>;
  latestUpdates: Record<string, unknown>;
  gallery: Record<string, unknown>;
  pressConferences: Record<string, unknown>;
  executiveCommittee: Record<string, unknown>;
  officeBearers: Record<string, unknown>;
  membership: Record<string, unknown>;
}

export type CmsPageKey =
  | "about"
  | "gallery"
  | "latestUpdates"
  | "pressConference"
  | "officeBearers"
  | "executiveCommittee";

export interface IPageSettings {
  about: Record<string, unknown>;
  gallery: Record<string, unknown>;
  latestUpdates: Record<string, unknown>;
  pressConference: Record<string, unknown>;
  officeBearers: Record<string, unknown>;
  executiveCommittee: Record<string, unknown>;
}

export const DEFAULT_PAGE_SETTINGS: IPageSettings = {
  about: {
    pageEyebrow: "About Greater Noida Press Club",
    pageTitle: "About Us",
    pageDescription: "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",
  },
  gallery: {
    pageEyebrow: "Media & Memories",
    pageTitle: "Gallery",
    pageDescription: "Explore recent events, press activities and memorable moments from Greater Noida Press Club.",
    pageSize: 12,
    showCategoryFilter: true,
    showPagination: true,
  },
  latestUpdates: {
    pageEyebrow: "News & Updates",
    pageTitle: "Latest Updates",
    pageDescription: "Stay informed with the latest press releases, announcements, events and press conferences from Greater Noida Press Club.",
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
    pageDescription: "Stay informed about media interactions, public briefings and official announcements from Greater Noida Press Club.",
    pageSize: 12,
    showPagination: false,
  },
  officeBearers: {
    pageEyebrow: "Our People",
    pageTitle: "Office Bearers",
    pageDescription: "Meet the people leading Greater Noida Press Club.",
    pageSize: 12,
    showSearch: true,
    showFilters: true,
  },
  executiveCommittee: {
    pageEyebrow: "Our Strength",
    pageTitle: "Executive Committee",
    pageDescription: "Meet the executive committee of Greater Noida Press Club.",
    pageSize: 100,
    showSearch: true,
    showFilters: true,
  },
};

export interface IWebsiteSettings
  extends Document {
  siteName: string;

  heroTitle?: string;
  heroDescription?: string;

  email?: string;
  phone?: string;
  address?: string;

  whatsappNumber?: string;
  whatsappLabel?: string;

  logo?: string;
  favicon?: string;
  heroImage?: string;
  aboutImage?: string;
  membershipPdf?: string;

  socialLinks?: ISocialLinks;

  seo?: ISeoSettings;

  home?: IHomeSettings;

  pageSettings?: IPageSettings;

  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_HOME_SETTINGS: IHomeSettings =
  {
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

      title:
        "Greater Noida Press Club",

      description:
        "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",

      buttonLabel:
        "Learn More",

      buttonHref:
        "/about",

      features: [],

      showStats: true,

      statsLabels: [
        "Members",
        "Press Release",
        "Active Events",
      ],
    },

    objectives: {
      eyebrow:
        "Our Objectives",

      title:
        "Empowering Journalism & Media Community",

      description:
        "Greater Noida Press Club works towards promoting ethical journalism, professional growth and stronger media collaboration.",

      buttonLabel:
        "Learn More",

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
    },

    gallery: {
      eyebrow:
        "Gallery",

      title:
        "Moments from GNPC",

      description:
        "Explore recent events, press activities and memorable moments.",

      buttonLabel:
        "View Gallery",

      buttonHref:
        "/gallery",

      displayCount: 3,
    },

    pressConferences: {
      eyebrow:
        "Media & Journalism",

      title:
        "Latest Press Conference",

      description:
        "The latest media interaction and official briefing from Greater Noida Press Club.",

      buttonLabel:
        "View All",

      buttonHref:
        "/press-conference",

      displayCount: 3,
    },

    executiveCommittee: {
      eyebrow:
        "Our Strength",

      title:
        "Executive Committee",

      description:
        "Meet the executive committee of Greater Noida Press Club.",

      buttonLabel:
        "View All",

      buttonHref:
        "/committee",

      displayCount: 3,

      showViewAll: true,
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

      secondaryLabel:
        "Contact Us",

      secondaryHref:
        "/contact",
    },
  };

const SocialLinksSchema =
  new Schema<ISocialLinks>(
    {
      facebook: {
        type: String,
        trim: true,
        default: "",
      },

      twitter: {
        type: String,
        trim: true,
        default: "",
      },

      instagram: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      youtube: {
        type: String,
        trim: true,
        default: "",
      },

      whatsapp: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const SeoSchema =
  new Schema<ISeoSettings>(
    {
      title: {
        type: String,
        trim: true,
        default: "",
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      keywords: {
        type: [String],
        default: [],
      },
    },
    {
      _id: false,
    }
  );

const WebsiteSettingsSchema =
  new Schema<IWebsiteSettings>(
    {
      siteName: {
        type: String,
        trim: true,
        default: "",
      },

      heroTitle: {
        type: String,
        trim: true,
        default: "",
      },

      heroDescription: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      whatsappNumber: {
        type: String,
        trim: true,
        default: "",
      },

      whatsappLabel: {
        type: String,
        trim: true,
        default: "WhatsApp",
        maxlength: 40,
      },

      logo: {
        type: String,
        trim: true,
        default: "",
      },

      favicon: {
        type: String,
        trim: true,
        default: "",
      },

      heroImage: {
        type: String,
        trim: true,
        default: "",
      },

      aboutImage: {
        type: String,
        trim: true,
        default: "",
      },

      membershipPdf: {
        type: String,
        trim: true,
        default: "",
      },

      socialLinks: {
        type: SocialLinksSchema,
        default: () => ({}),
      },

      seo: {
        type: SeoSchema,
        default: () => ({}),
      },

      home: {
        type: Schema.Types.Mixed,

        default: () =>
          DEFAULT_HOME_SETTINGS,
      },

      pageSettings: {
        type: Schema.Types.Mixed,

        default: () =>
          DEFAULT_PAGE_SETTINGS,
      },
    },

    {
      timestamps: true,
      collection:
        "website_settings",
    }
  );

const WebsiteSettings: Model<IWebsiteSettings> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>(
    "WebsiteSettings",
    WebsiteSettingsSchema
  );

export default WebsiteSettings;

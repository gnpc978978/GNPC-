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

export interface IWebsiteSettings extends Document {
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

  createdAt: Date;
  updatedAt: Date;
}

const SocialLinksSchema = new Schema<ISocialLinks>(
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

const SeoSchema = new Schema<ISeoSettings>(
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
    },
    {
      timestamps: true,
      collection: "website_settings",
    }
  );

const WebsiteSettings: Model<IWebsiteSettings> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>(
    "WebsiteSettings",
    WebsiteSettingsSchema
  );

export default WebsiteSettings;

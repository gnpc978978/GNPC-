import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IAboutObjective {
  title: string;
  description: string;
  icon?: string;
}

export interface IAboutReason {
  title: string;
  description: string;
  icon?: string;
}

export interface IAboutSettings extends Document {
  /*
   * About hero
   */
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  /*
   * About introduction
   */
  image?: string;
  heading: string;
  description: string;
  secondaryDescription: string;

  /*
   * Commitment card
   */
  commitmentTitle: string;
  commitmentDescription: string;

  /*
   * Mission / Vision
   */
  foundationEyebrow: string;
  foundationTitle: string;
  foundationDescription: string;

  missionTitle: string;
  missionDescription: string;

  visionTitle: string;
  visionDescription: string;

  /*
   * Objectives
   */
  objectivesEyebrow: string;
  objectivesTitle: string;
  objectivesDescription: string;
  objectives: IAboutObjective[];

  /*
   * President message
   */
  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto?: string;

  /*
   * Why choose us
   */
  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: IAboutReason[];

  /*
   * About CTA
   */
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  createdAt: Date;
  updatedAt: Date;
}

const ObjectiveSchema =
  new Schema<IAboutObjective>(
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

      /*
       * Icons remain controlled by the frontend.
       * This value allows the CMS to select a known
       * icon identifier without storing JSX.
       */
      icon: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const ReasonSchema =
  new Schema<IAboutReason>(
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

      icon: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const AboutSettingsSchema =
  new Schema<IAboutSettings>(
    {
      /*
       * About hero
       */
      heroEyebrow: {
        type: String,
        trim: true,
        default: "About Greater Noida Press Club",
      },

      heroTitle: {
        type: String,
        trim: true,
        default: "About Us",
      },

      heroDescription: {
        type: String,
        trim: true,
        default:
          "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",
      },

      /*
       * About introduction
       */
      image: {
        type: String,
        trim: true,
        default: "",
      },

      heading: {
        type: String,
        trim: true,
        default:
          "Empowering Journalists & Strengthening Independent Media",
      },

      description: {
        type: String,
        trim: true,
        default:
          "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",
      },

      secondaryDescription: {
        type: String,
        trim: true,
        default:
          "We believe in freedom of expression, responsible reporting, and creating opportunities that help journalists grow, collaborate, and contribute to society.",
      },

      /*
       * Commitment
       */
      commitmentTitle: {
        type: String,
        trim: true,
        default: "Our Commitment",
      },

      commitmentDescription: {
        type: String,
        trim: true,
        default:
          "We are committed to protecting journalistic values, encouraging transparency, and building a stronger media community through education, collaboration, and innovation.",
      },

      /*
       * Mission / Vision
       */
      foundationEyebrow: {
        type: String,
        trim: true,
        default: "Our Foundation",
      },

      foundationTitle: {
        type: String,
        trim: true,
        default: "Mission & Vision",
      },

      foundationDescription: {
        type: String,
        trim: true,
        default:
          "We are committed to ethical journalism, professional excellence, and empowering media professionals through collaboration and innovation.",
      },

      missionTitle: {
        type: String,
        trim: true,
        default: "Our Mission",
      },

      missionDescription: {
        type: String,
        trim: true,
        default:
          "To support journalists with professional development, transparency, ethical reporting, and a strong platform that protects press freedom.",
      },

      visionTitle: {
        type: String,
        trim: true,
        default: "Our Vision",
      },

      visionDescription: {
        type: String,
        trim: true,
        default:
          "To build a trusted community where journalists collaborate, innovate, and contribute to an informed and democratic society.",
      },

      /*
       * Objectives
       */
      objectivesEyebrow: {
        type: String,
        trim: true,
        default: "Our Objectives",
      },

      objectivesTitle: {
        type: String,
        trim: true,
        default: "What We Aim To Achieve",
      },

      objectivesDescription: {
        type: String,
        trim: true,
        default:
          "Our primary objective is to strengthen journalism through education, collaboration, innovation, and ethical reporting.",
      },

      objectives: {
        type: [ObjectiveSchema],
        default: [],
      },

      /*
       * President
       */
      presidentName: {
        type: String,
        trim: true,
        default: "",
      },

      presidentDesignation: {
        type: String,
        trim: true,
        default: "",
      },

      presidentMessage: {
        type: String,
        trim: true,
        default: "",
      },

      presidentPhoto: {
        type: String,
        trim: true,
        default: "",
      },

      /*
       * Why Choose Us
       */
      whyChooseUsEyebrow: {
        type: String,
        trim: true,
        default: "Why Choose Us",
      },

      whyChooseUsTitle: {
        type: String,
        trim: true,
        default:
          "Why Greater Noida Press Club Matters",
      },

      whyChooseUsDescription: {
        type: String,
        trim: true,
        default:
          "We provide a trusted platform for journalists to connect, collaborate, and grow while maintaining the highest standards of journalism.",
      },

      reasons: {
        type: [ReasonSchema],
        default: [],
      },

      /*
       * CTA
       */
      ctaTitle: {
        type: String,
        trim: true,
        default:
          "Become a Part of Our Greater Noida Press Club",
      },

      ctaDescription: {
        type: String,
        trim: true,
        default:
          "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists.",
      },

      ctaPrimaryLabel: {
        type: String,
        trim: true,
        default: "Become a Member",
      },

      ctaSecondaryLabel: {
        type: String,
        trim: true,
        default: "Meet Our Office Bearers",
      },

      ctaSecondaryHref: {
        type: String,
        trim: true,
        default: "/office-bearers",
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.AboutSettings ||
  mongoose.model<IAboutSettings>(
    "AboutSettings",
    AboutSettingsSchema
  );

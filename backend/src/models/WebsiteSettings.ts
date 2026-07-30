import mongoose, { Schema, Document } from "mongoose";


export interface IWebsiteSettings extends Document {

  siteName: string;

  logo?: string;

  favicon?: string;


  heroTitle?: string;

  heroDescription?: string;

  heroImage?: string;
  aboutImage?: string;


  email?: string;

  phone?: string;

  address?: string;


  socialLinks: {

    facebook?: string;

    twitter?: string;

    instagram?: string;

    linkedin?: string;

  };


  membershipPdf?: string;


  seo: {

    title?: string;

    description?: string;

    keywords?: string[];

  };


  createdAt: Date;

  updatedAt: Date;

}



const WebsiteSettingsSchema =
new Schema<IWebsiteSettings>(

{

  siteName: {

    type: String,

    required: true,
    default: "Greater Noida Press Club",

  },


  logo: {

    type: String,

  },


  favicon: {

    type: String,

  },


  heroTitle: {

    type: String,

  },


  heroDescription: {

    type: String,

  },


  heroImage: {

    type: String,

  },

  aboutImage: {
    type: String,
  },


  email: {

    type: String,

  },


  phone: {

    type: String,

  },


  address: {

    type: String,

  },


  socialLinks: {

    facebook: {

      type: String,

    },


    twitter: {

      type: String,

    },


    instagram: {

      type: String,

    },


    linkedin: {

      type: String,

    },

  },


  membershipPdf: {

    type: String,

  },


  seo: {

    title: {

      type: String,

    },


    description: {

      type: String,

    },


    keywords: [

      {

        type: String,

      }

    ],

  },


},

{

  timestamps: true,

}

);



export default mongoose.model<IWebsiteSettings>(
  "WebsiteSettings",
  WebsiteSettingsSchema
);

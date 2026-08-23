import {
  Request,
  Response,
} from "express";

import WebsiteSettings, {
  DEFAULT_HOME_SETTINGS,
  DEFAULT_PAGE_SETTINGS,
  IHomeSettings,
  IPageSettings,
} from "../models/WebsiteSettings";

const mergeHomeSettings = (
  value?: Partial<IHomeSettings> | null
): IHomeSettings => {
  const source = value || {};

  return {
    ...DEFAULT_HOME_SETTINGS,

    ...source,

    sections:
      Object.fromEntries(
        Object.entries(
          DEFAULT_HOME_SETTINGS.sections
        ).map(
          ([key, fallback]) => [
            key,
            {
              ...fallback,

              ...(
                (
                  source.sections as
                    | Record<
                        string,
                        unknown
                      >
                    | undefined
                )?.[key] as object ||
                {}
              ),
            },
          ]
        )
      ) as IHomeSettings["sections"],

    hero: {
      ...DEFAULT_HOME_SETTINGS.hero,
      ...((source.hero as object) ||
        {}),
    },

    about: {
      ...DEFAULT_HOME_SETTINGS.about,
      ...((source.about as object) ||
        {}),
    },

    objectives: {
      ...DEFAULT_HOME_SETTINGS.objectives,
      ...((source.objectives as object) ||
        {}),
    },

    latestUpdates: {
      ...DEFAULT_HOME_SETTINGS.latestUpdates,
      ...((source.latestUpdates as object) ||
        {}),
    },

    gallery: {
      ...DEFAULT_HOME_SETTINGS.gallery,
      ...((source.gallery as object) ||
        {}),
    },

    pressConferences: {
      ...DEFAULT_HOME_SETTINGS.pressConferences,
      ...((source.pressConferences as object) ||
        {}),
    },

    members: {
      ...DEFAULT_HOME_SETTINGS.members,
      ...((source.members as object) ||
        {}),
    },

    officeBearers: {
      ...DEFAULT_HOME_SETTINGS.officeBearers,
      ...((source.officeBearers as object) ||
        {}),
    },

    membership: {
      ...DEFAULT_HOME_SETTINGS.membership,
      ...((source.membership as object) ||
        {}),
    },
  };
};

const mergePageSettings = (
  value?: IPageSettings | Record<string, unknown> | null
) => {
  const source = (value || {}) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(DEFAULT_PAGE_SETTINGS).map(([key, fallback]) => [
      key,
      {
        ...fallback,
        ...((source as Record<string, unknown>)[key] as object || {}),
      },
    ])
  ) as typeof DEFAULT_PAGE_SETTINGS;
};

export const getSettings =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      let settings =
        await WebsiteSettings.findOne();

      if (!settings) {
        settings =
          await WebsiteSettings.create({
            siteName: "",
            heroTitle: "",
            heroDescription: "",

            email: "",
            phone: "",
            address: "",

            whatsappNumber: "",
            whatsappLabel: "WhatsApp",

            logo: "",
            favicon: "",
            heroImage: "",
            aboutImage: "",
            membershipPdf: "",

            socialLinks: {},
            seo: {},

            home:
              DEFAULT_HOME_SETTINGS,
            pageSettings:
              DEFAULT_PAGE_SETTINGS,
          });
      }

      const home =
        mergeHomeSettings(
          settings.home
        );

      return res.status(200).json({
        success: true,

        data: {
          ...settings.toObject(),

          home,
          pageSettings: mergePageSettings(
            settings.pageSettings
          ),
        },
      });
    } catch (error) {
      console.error(
        "Failed to fetch website settings:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch website settings.",
      });
    }
  };

export const updateSettings =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        siteName,
        heroTitle,
        heroDescription,

        email,
        phone,
        address,

        whatsappNumber,
        whatsappLabel,

        logo,
        favicon,
        heroImage,
        aboutImage,
        membershipPdf,

        socialLinks,
        seo,

        home,
        pageSettings,
      } = req.body;

      let settings =
        await WebsiteSettings.findOne();

      if (!settings) {
        settings =
          new WebsiteSettings();
      }

      if (
        siteName !== undefined
      ) {
        settings.siteName =
          siteName;
      }

      if (
        heroTitle !== undefined
      ) {
        settings.heroTitle =
          heroTitle;
      }

      if (
        heroDescription !==
        undefined
      ) {
        settings.heroDescription =
          heroDescription;
      }

      if (email !== undefined) {
        settings.email = email;
      }

      if (phone !== undefined) {
        settings.phone = phone;
      }

      if (address !== undefined) {
        settings.address = address;
      }

      if (
        whatsappNumber !==
        undefined
      ) {
        const cleanedNumber =
          String(
            whatsappNumber
          ).replace(
            /\D/g,
            ""
          );

        if (
          cleanedNumber.length !==
            0 &&
          (cleanedNumber.length <
            7 ||
            cleanedNumber.length >
              15)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "WhatsApp number must contain between 7 and 15 digits.",
          });
        }

        settings.whatsappNumber =
          cleanedNumber;
      }

      if (
        whatsappLabel !==
        undefined
      ) {
        const label =
          String(
            whatsappLabel
          ).trim();

        if (label.length > 40) {
          return res.status(400).json({
            success: false,
            message:
              "WhatsApp button label cannot exceed 40 characters.",
          });
        }

        settings.whatsappLabel =
          label || "WhatsApp";
      }

      if (logo !== undefined) {
        settings.logo = logo;
      }

      if (
        favicon !== undefined
      ) {
        settings.favicon =
          favicon;
      }

      if (
        heroImage !== undefined
      ) {
        settings.heroImage =
          heroImage;
      }

      if (
        aboutImage !== undefined
      ) {
        settings.aboutImage =
          aboutImage;
      }

      if (
        membershipPdf !==
        undefined
      ) {
        settings.membershipPdf =
          membershipPdf;
      }

      if (
        socialLinks !==
        undefined
      ) {
        settings.socialLinks = {
          ...(settings.socialLinks ||
            {}),
          ...socialLinks,
        };
      }

      if (seo !== undefined) {
        settings.seo = {
          ...(settings.seo || {}),
          ...seo,
        };
      }

      if (home !== undefined) {
        if (
          !home ||
          typeof home !==
            "object" ||
          Array.isArray(home)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Home settings must be an object.",
          });
        }

        settings.home =
          mergeHomeSettings(
            home
          );
      } else {
        settings.home =
          mergeHomeSettings(
            settings.home
          );
      }

      if (pageSettings !== undefined) {
        if (
          !pageSettings ||
          typeof pageSettings !== "object" ||
          Array.isArray(pageSettings)
        ) {
          return res.status(400).json({
            success: false,
            message: "Page settings must be an object.",
          });
        }

        settings.pageSettings = mergePageSettings(
          pageSettings as Record<string, unknown>
        );
      } else {
        settings.pageSettings = mergePageSettings(
          settings.pageSettings
        );
      }

      await settings.save();

      return res.status(200).json({
        success: true,

        message:
          "Website settings updated successfully.",

        data: {
          ...settings.toObject(),

          home:
            mergeHomeSettings(
              settings.home
            ),
          pageSettings: mergePageSettings(
            settings.pageSettings
          ),
        },
      });
    } catch (error) {
      console.error(
        "Failed to update website settings:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update website settings.",
      });
    }
  };

export const downloadMembershipForm =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const settings =
        await WebsiteSettings.findOne();

      if (
        !settings?.membershipPdf
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Membership form is not configured.",
        });
      }

      return res.redirect(
        settings.membershipPdf
      );
    } catch (error) {
      console.error(
        "Failed to download membership form:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to download membership form.",
      });
    }
  };

export const getWebsiteSettings =
  getSettings;

export const updateWebsiteSettings =
  updateSettings;

import { Request, Response } from "express";
import WebsiteSettings from "../models/WebsiteSettings";

/**
 * Get public website settings.
 *
 * This endpoint is intentionally safe for the public website.
 * Only settings that are meant to be displayed publicly are
 * returned.
 */
export const getWebsiteSettings = async (
  req: Request,
  res: Response
) => {
  try {
    let settings = await WebsiteSettings.findOne();

    /*
     * Create the settings document if this is the first request.
     */
    if (!settings) {
      settings = await WebsiteSettings.create({
        siteName: "",
        heroTitle: "",
        heroDescription: "",
        email: "",
        phone: "",
        address: "",
        whatsappNumber: "",
        whatsappLabel: "WhatsApp",
        socialLinks: {},
        seo: {},
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to fetch website settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch website settings.",
    });
  }
};

/**
 * Update website settings from the CMS.
 *
 * Every field below is explicitly whitelisted.
 * This prevents arbitrary request properties from being
 * written directly into MongoDB.
 */
export const updateWebsiteSettings = async (
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

      /*
       * WhatsApp CMS fields.
       */
      whatsappNumber,
      whatsappLabel,

      socialLinks,
      seo,
    } = req.body;

    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = new WebsiteSettings();
    }

    /*
     * Only update fields that were actually supplied.
     * This prevents one CMS section from accidentally
     * clearing values belonging to another section.
     */
    if (siteName !== undefined) {
      settings.siteName = siteName;
    }

    if (heroTitle !== undefined) {
      settings.heroTitle = heroTitle;
    }

    if (heroDescription !== undefined) {
      settings.heroDescription = heroDescription;
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

    /*
     * WhatsApp number.
     *
     * Store a clean value while still allowing the CMS
     * administrator to enter:
     *
     * +91 98765 43210
     * 91-9876543210
     * 919876543210
     */
    if (whatsappNumber !== undefined) {
      const cleanedNumber = String(
        whatsappNumber
      ).replace(/\D/g, "");

      if (
        cleanedNumber.length !== 0 &&
        (cleanedNumber.length < 7 ||
          cleanedNumber.length > 15)
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

    /*
     * WhatsApp floating-button label.
     */
    if (whatsappLabel !== undefined) {
      const label = String(whatsappLabel).trim();

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

    if (socialLinks !== undefined) {
      settings.socialLinks = {
        ...(settings.socialLinks || {}),
        ...socialLinks,
      };
    }

    if (seo !== undefined) {
      settings.seo = {
        ...(settings.seo || {}),
        ...seo,
      };
    }

    await settings.save();

    /*
     * Return the complete current settings document so
     * the CMS can immediately refresh its local state.
     */
    return res.status(200).json({
      success: true,
      message: "Website settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to update website settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update website settings.",
    });
  }
};

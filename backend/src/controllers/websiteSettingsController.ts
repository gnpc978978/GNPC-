import { Request, Response } from "express";
import WebsiteSettings from "../models/WebsiteSettings";

/**
 * Get public website settings.
 */
export const getSettings = async (
  req: Request,
  res: Response
) => {
  try {
    let settings = await WebsiteSettings.findOne();

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
        logo: "",
        favicon: "",
        heroImage: "",
        aboutImage: "",
        membershipPdf: "",
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
 */
export const updateSettings = async (
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
    } = req.body;

    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = new WebsiteSettings();
    }

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

      settings.whatsappNumber = cleanedNumber;
    }

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

    if (logo !== undefined) {
      settings.logo = logo;
    }

    if (favicon !== undefined) {
      settings.favicon = favicon;
    }

    if (heroImage !== undefined) {
      settings.heroImage = heroImage;
    }

    if (aboutImage !== undefined) {
      settings.aboutImage = aboutImage;
    }

    if (membershipPdf !== undefined) {
      settings.membershipPdf = membershipPdf;
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

    return res.status(200).json({
      success: true,
      message:
        "Website settings updated successfully.",
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

/**
 * Download the membership form configured in CMS.
 */
export const downloadMembershipForm = async (
  req: Request,
  res: Response
) => {
  try {
    const settings =
      await WebsiteSettings.findOne();

    if (!settings?.membershipPdf) {
      return res.status(404).json({
        success: false,
        message:
          "Membership form is not configured.",
      });
    }

    return res.redirect(settings.membershipPdf);
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

/*
 * Backward-compatible aliases.
 *
 * These prevent existing imports elsewhere in the
 * backend from breaking if they still use the old names.
 */
export const getWebsiteSettings = getSettings;
export const updateWebsiteSettings = updateSettings;

import { Request, Response } from "express";
import AboutSettings from "../models/AboutSettings";

/**
 * GET /api/settings/about
 *
 * Public + CMS endpoint.
 */
export const getAboutSettings = async (
  _req: Request,
  res: Response
) => {
  try {
    let settings =
      await AboutSettings.findOne();

    if (!settings) {
      settings =
        await AboutSettings.create({});
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to fetch About settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch About page content.",
    });
  }
};

/**
 * PUT /api/settings/about
 *
 * Update About page text/content.
 */
export const updateAboutSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      heroEyebrow,
      heroTitle,
      heroDescription,

      image,
      heading,
      description,
      secondaryDescription,

      commitmentTitle,
      commitmentDescription,

      foundationEyebrow,
      foundationTitle,
      foundationDescription,

      missionTitle,
      missionDescription,

      visionTitle,
      visionDescription,

      objectivesEyebrow,
      objectivesTitle,
      objectivesDescription,
      objectives,

      presidentName,
      presidentDesignation,
      presidentMessage,
      presidentPhoto,

      whyChooseUsEyebrow,
      whyChooseUsTitle,
      whyChooseUsDescription,
      reasons,

      ctaTitle,
      ctaDescription,
      ctaPrimaryLabel,
      ctaSecondaryLabel,
    } = req.body;

    let settings =
      await AboutSettings.findOne();

    if (!settings) {
      settings =
        new AboutSettings();
    }

    /*
     * HERO
     */
    if (heroEyebrow !== undefined) {
      settings.heroEyebrow =
        String(heroEyebrow).trim();
    }

    if (heroTitle !== undefined) {
      settings.heroTitle =
        String(heroTitle).trim();
    }

    if (heroDescription !== undefined) {
      settings.heroDescription =
        String(heroDescription).trim();
    }

    /*
     * INTRODUCTION
     */
    if (image !== undefined) {
      settings.image =
        String(image).trim();
    }

    if (heading !== undefined) {
      settings.heading =
        String(heading).trim();
    }

    if (description !== undefined) {
      settings.description =
        String(description).trim();
    }

    if (
      secondaryDescription !==
      undefined
    ) {
      settings.secondaryDescription =
        String(
          secondaryDescription
        ).trim();
    }

    /*
     * COMMITMENT
     */
    if (commitmentTitle !== undefined) {
      settings.commitmentTitle =
        String(
          commitmentTitle
        ).trim();
    }

    if (
      commitmentDescription !==
      undefined
    ) {
      settings.commitmentDescription =
        String(
          commitmentDescription
        ).trim();
    }

    /*
     * FOUNDATION
     */
    if (
      foundationEyebrow !== undefined
    ) {
      settings.foundationEyebrow =
        String(
          foundationEyebrow
        ).trim();
    }

    if (
      foundationTitle !== undefined
    ) {
      settings.foundationTitle =
        String(
          foundationTitle
        ).trim();
    }

    if (
      foundationDescription !==
      undefined
    ) {
      settings.foundationDescription =
        String(
          foundationDescription
        ).trim();
    }

    /*
     * MISSION
     */
    if (missionTitle !== undefined) {
      settings.missionTitle =
        String(
          missionTitle
        ).trim();
    }

    if (
      missionDescription !==
      undefined
    ) {
      settings.missionDescription =
        String(
          missionDescription
        ).trim();
    }

    /*
     * VISION
     */
    if (visionTitle !== undefined) {
      settings.visionTitle =
        String(
          visionTitle
        ).trim();
    }

    if (
      visionDescription !==
      undefined
    ) {
      settings.visionDescription =
        String(
          visionDescription
        ).trim();
    }

    /*
     * OBJECTIVES
     */
    if (
      objectivesEyebrow !== undefined
    ) {
      settings.objectivesEyebrow =
        String(
          objectivesEyebrow
        ).trim();
    }

    if (
      objectivesTitle !== undefined
    ) {
      settings.objectivesTitle =
        String(
          objectivesTitle
        ).trim();
    }

    if (
      objectivesDescription !==
      undefined
    ) {
      settings.objectivesDescription =
        String(
          objectivesDescription
        ).trim();
    }

    if (objectives !== undefined) {
      if (!Array.isArray(objectives)) {
        return res.status(400).json({
          success: false,
          message:
            "Objectives must be an array.",
        });
      }

      settings.objectives =
        objectives.map(
          (item) => ({
            title: String(
              item?.title || ""
            ).trim(),

            description: String(
              item?.description || ""
            ).trim(),

            icon: String(
              item?.icon || ""
            ).trim(),
          })
        );
    }

    /*
     * PRESIDENT
     */
    if (presidentName !== undefined) {
      settings.presidentName =
        String(
          presidentName
        ).trim();
    }

    if (
      presidentDesignation !==
      undefined
    ) {
      settings.presidentDesignation =
        String(
          presidentDesignation
        ).trim();
    }

    if (
      presidentMessage !==
      undefined
    ) {
      settings.presidentMessage =
        String(
          presidentMessage
        ).trim();
    }

    if (
      presidentPhoto !== undefined
    ) {
      settings.presidentPhoto =
        String(
          presidentPhoto
        ).trim();
    }

    /*
     * WHY CHOOSE US
     */
    if (
      whyChooseUsEyebrow !==
      undefined
    ) {
      settings.whyChooseUsEyebrow =
        String(
          whyChooseUsEyebrow
        ).trim();
    }

    if (
      whyChooseUsTitle !==
      undefined
    ) {
      settings.whyChooseUsTitle =
        String(
          whyChooseUsTitle
        ).trim();
    }

    if (
      whyChooseUsDescription !==
      undefined
    ) {
      settings.whyChooseUsDescription =
        String(
          whyChooseUsDescription
        ).trim();
    }

    if (reasons !== undefined) {
      if (!Array.isArray(reasons)) {
        return res.status(400).json({
          success: false,
          message:
            "Why Choose Us items must be an array.",
        });
      }

      settings.reasons =
        reasons.map(
          (item) => ({
            title: String(
              item?.title || ""
            ).trim(),

            description: String(
              item?.description || ""
            ).trim(),

            icon: String(
              item?.icon || ""
            ).trim(),
          })
        );
    }

    /*
     * CTA
     */
    if (ctaTitle !== undefined) {
      settings.ctaTitle =
        String(
          ctaTitle
        ).trim();
    }

    if (
      ctaDescription !==
      undefined
    ) {
      settings.ctaDescription =
        String(
          ctaDescription
        ).trim();
    }

    if (
      ctaPrimaryLabel !==
      undefined
    ) {
      settings.ctaPrimaryLabel =
        String(
          ctaPrimaryLabel
        ).trim();
    }

    if (
      ctaSecondaryLabel !==
      undefined
    ) {
      settings.ctaSecondaryLabel =
        String(
          ctaSecondaryLabel
        ).trim();
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "About page content updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to update About settings:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update About page content.",
    });
  }
};

/**
 * POST /api/settings/about/upload
 *
 * Upload About page images.
 *
 * Supported multipart fields:
 * - image
 * - presidentPhoto
 */
export const uploadAboutSettingsFiles =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const files =
        req.files as
          | {
              [fieldname: string]:
                | Express.Multer.File[]
                | undefined;
            }
          | undefined;

      const image =
        files?.image?.[0];

      const presidentPhoto =
        files?.presidentPhoto?.[0];

      if (
        !image &&
        !presidentPhoto
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No About image was uploaded.",
        });
      }

      let settings =
        await AboutSettings.findOne();

      if (!settings) {
        settings =
          new AboutSettings();
      }

      if (image) {
        settings.image =
          image.path ||
          image.secure_url ||
          image.url ||
          "";
      }

      if (presidentPhoto) {
        settings.presidentPhoto =
          presidentPhoto.path ||
          presidentPhoto.secure_url ||
          presidentPhoto.url ||
          "";
      }

      await settings.save();

      return res.status(200).json({
        success: true,
        message:
          "About image uploaded successfully.",
        data: settings,
        url:
          image?.path ||
          image?.secure_url ||
          image?.url ||
          presidentPhoto?.path ||
          presidentPhoto?.secure_url ||
          presidentPhoto?.url ||
          "",
      });
    } catch (error) {
      console.error(
        "Failed to upload About settings:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to upload About page image.",
      });
    }
  };

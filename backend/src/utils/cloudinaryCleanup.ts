import cloudinary from "../config/cloudinary";

const getPublicId = (assetUrl: string): string | null => {
  try {
    const { hostname, pathname } = new URL(assetUrl);

    if (!hostname.endsWith("cloudinary.com")) {
      return null;
    }

    const segments = pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    const assetSegments = segments.slice(uploadIndex + 1);
    const versionIndex = assetSegments.findIndex((segment) =>
      /^v\d+$/.test(segment)
    );

    const publicId = assetSegments
      .slice(versionIndex === -1 ? 0 : versionIndex + 1)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    return publicId ? decodeURIComponent(publicId) : null;
  } catch {
    return null;
  }
};

const destroyAsset = async (publicId: string) => {
  const resourceTypes: Array<"image" | "raw" | "video"> = [
    "image",
    "raw",
    "video",
  ];

  for (const resourceType of resourceTypes) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: resourceType,
      });

      if (result.result === "ok" || result.result === "not found") {
        return;
      }
    } catch {
      // Try the next resource type
    }
  }

  throw new Error(`Unable to delete Cloudinary asset: ${publicId}`);
};

export const deleteCloudinaryAssets = async (
  assetUrls: Array<string | null | undefined>
): Promise<string[]> => {
  const publicIds = [
    ...new Set(
      assetUrls
        .filter((url): url is string => Boolean(url))
        .map(getPublicId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  if (publicIds.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    publicIds.map((publicId) => destroyAsset(publicId))
  );

  return results.flatMap((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Cloudinary cleanup failed for asset ${publicIds[index]}:`,
        result.reason
      );
      return [publicIds[index]];
    }

    return [];
  });
};
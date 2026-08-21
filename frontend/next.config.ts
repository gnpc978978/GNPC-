import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Vercel traces from the repository root. Keeping Turbopack on the same
    // root avoids the production-build warning and makes local/CI resolution
    // consistent without changing any application routes or runtime behavior.
    root: path.resolve(__dirname, ".."),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

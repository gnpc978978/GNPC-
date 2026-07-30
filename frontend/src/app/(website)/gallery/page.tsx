import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photos and memories of Greater Noida Press Club events and activities.",
};
import GalleryHero from "@/components/gallery/GalleryHero";
import PublicGallery from "@/components/gallery/PublicGallery";
import GalleryCTA from "@/components/gallery/GalleryCTA";

export default function GalleryPage() {
  return (
    <>
      <GalleryHero />
      <PublicGallery />
      <GalleryCTA />
    </>
  );
}

import type { Metadata } from "next";
import PublicGallery from "@/components/gallery/PublicGallery";

type Props = {
  params: Promise<{ category: string }>;
};

function readableCategory(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const title = readableCategory(category);

  return {
    title: title + " Gallery | Greater Noida Press Club",
    description: "Explore photographs and albums from the " + title + " collection of Greater Noida Press Club.",
  };
}

export default async function GalleryCategoryPage({ params }: Props) {
  const { category } = await params;

  return (
    <main className="min-h-[50vh] bg-[#f8fafc]">
      <PublicGallery categorySlug={category} />
    </main>
  );
}

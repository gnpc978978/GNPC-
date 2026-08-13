import PageHero from "@/components/ui/PageHero";
import PublicGallery from "@/components/gallery/PublicGallery";

export default function GalleryPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Gallery"
        title="Photo Gallery"
        description="Explore moments, events and activities from Greater Noida Press Club."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />

      <PublicGallery />
    </main>
  );
}

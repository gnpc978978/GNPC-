"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

type GalleryItem = {
  _id: string;
  title: string;
  category: string;
  coverImage: string;
  images?: string[];
  status: string;
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
        const data = await response.json();
        if (response.ok && Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery.filter((item: GalleryItem) => item.status !== "inactive").slice(0, 6));
        }
      } catch {
        setGalleryItems([]);
      }
    };

    loadGallery();
  }, []);

  return (
    <section id="gallery" className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          badge="Media Gallery"
          title="Capturing Every Important Moment"
          description="Explore memorable moments from press conferences, media events, workshops, and community activities."
        />

        <div className="mt-9 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => {
            const image = item.coverImage || item.images?.[0];

            return image ? (
            <Card
              key={item._id}
              className="
                group
                cursor-pointer
                overflow-hidden
                border-0
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-2xl
              "
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-56 overflow-hidden sm:h-72">

                <Image
                  src={image}
                  alt={item.title}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-end
                    bg-gradient-to-t
                    from-black/70
                    via-black/20
                    to-transparent
                    opacity-100
                    transition-opacity
                    duration-300
                    sm:opacity-0
                    sm:group-hover:opacity-100
                  "
                >
                  <div className="p-4 text-white sm:p-5">
                    <p className="text-sm text-gray-200">
                      {item.category}
                    </p>

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>
                  </div>
                </div>

              </div>
            </Card>
            ) : null;
          })}
        </div>

        <div className="mt-10 text-center"><Link href="/gallery" className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-700/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">Explore the Gallery <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></Link></div>

      </Container>


      {/* Lightbox Modal */}

      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-sm
            p-4
          "
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="
              absolute
              right-6
              top-6
              text-4xl
              font-bold
              text-white
              hover:text-gray-300
            "
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>


          <div
            className="
              relative
              h-[85vh]
              w-full
              max-w-5xl
            "
            onClick={(e) => e.stopPropagation()}
          >

            <Image
              src={selectedImage}
              alt="Selected Gallery Image"
              fill
              className="
                rounded-xl
                object-contain
              "
            />

          </div>

        </div>
      )}

    </section>
  );
}

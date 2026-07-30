import Image from "next/image";

const images = [
  {
    id: 1,
    src: "https://picsum.photos/600/400?random=1",
    title: "Press Conference",
  },
  {
    id: 2,
    src: "https://picsum.photos/600/400?random=2",
    title: "Media Event",
  },
  {
    id: 3,
    src: "https://picsum.photos/600/400?random=3",
    title: "Award Ceremony",
  },
  {
    id: 4,
    src: "https://picsum.photos/600/400?random=4",
    title: "News Coverage",
  },
  {
    id: 5,
    src: "https://picsum.photos/600/400?random=5",
    title: "Journalist Meet",
  },
  {
    id: 6,
    src: "https://picsum.photos/600/400?random=6",
    title: "Annual Function",
  },
];

export default function GalleryGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}
        <div className="mb-14 text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Gallery
          </span>


          <h2 className="mt-5 text-4xl font-extrabold text-slate-900">
            Our Memories
          </h2>


          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Explore moments, events and activities from our press club.
          </p>

        </div>




        {/* Gallery */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">


          {images.map((image) => (

            <div
              key={image.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >


              {/* Image */}
              <div className="relative h-72 overflow-hidden">


                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />


                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />


                <div className="absolute bottom-5 left-5 translate-y-5 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                  <h3 className="text-xl font-bold">
                    {image.title}
                  </h3>

                </div>


              </div>



              {/* Title */}
              <div className="p-5">

                <h3 className="text-lg font-bold text-slate-900">
                  {image.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Greater Noida Press Club
                </p>

              </div>


            </div>

          ))}


        </div>


      </div>
    </section>
  );
}
export default function GalleryHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">


        {/* Badge */}
        <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-600/20 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-blue-200">
          Our Gallery
        </span>



        {/* Heading */}
        <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white md:text-6xl">

          Capturing Moments,

          <br />

          <span className="text-blue-400">
            Creating Memories
          </span>

        </h1>



        {/* Description */}
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
          Explore photographs from press conferences, media events,
          workshops and activities of Greater Noida Press Club.
        </p>



        {/* Bottom Line */}
        <div className="mx-auto mt-10 h-1 w-24 rounded-full bg-blue-500" />


      </div>

    </section>
  );
}
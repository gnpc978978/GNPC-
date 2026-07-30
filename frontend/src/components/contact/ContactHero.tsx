export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-slate-950" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Contact Us
        </span>

        <h1 className="mt-6 text-4xl font-extrabold text-white md:text-6xl">
          Get In Touch
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          We'd love to hear from you. Whether you're a journalist,
          media professional, or visitor, feel free to reach out to us.
        </p>
      </div>
    </section>
  );
}
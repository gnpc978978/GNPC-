import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">

      {/* Background Decoration */}
      <div className="absolute -left-5 -top-5 h-32 w-32 rounded-3xl bg-blue-100 blur-2xl"></div>
      <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-red-100 blur-3xl"></div>

      {/* Image Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">

        <div className="relative h-[500px] overflow-hidden rounded-2xl">

          <Image
            src="/images/press club.png"
            alt="Greater Noida Press Club"
            fill
            priority
            className="object-cover transition duration-700 hover:scale-105"
          />

        </div>

        {/* Floating Badge */}
        <div className="absolute left-8 top-8 rounded-xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">

          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Latest Update
          </p>

          <h3 className="mt-1 text-sm font-bold text-slate-800">
            Press Conference
          </h3>

        </div>

      </div>

    </div>
  );
}
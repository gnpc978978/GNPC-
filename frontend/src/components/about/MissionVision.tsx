import { FaBullseye, FaEye } from "react-icons/fa";

export default function MissionVision() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}
        <div className="mb-16 text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Our Foundation
          </span>


          <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
            Mission & Vision
          </h2>


          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            We are committed to ethical journalism, professional excellence,
            and empowering media professionals through collaboration and
            innovation.
          </p>

        </div>




        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-2">


          {/* Mission */}
          <div className="group rounded-3xl border border-blue-100 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-xl">


            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white transition group-hover:scale-110">

              <FaBullseye className="text-3xl" />

            </div>


            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Our Mission
            </h3>


            <p className="leading-8 text-slate-600">
              To support journalists with professional development,
              transparency, ethical reporting, and a strong platform that
              protects press freedom.
            </p>


          </div>





          {/* Vision */}
          <div className="group rounded-3xl border border-green-100 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-xl">


            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white transition group-hover:scale-110">

              <FaEye className="text-3xl" />

            </div>


            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Our Vision
            </h3>


            <p className="leading-8 text-slate-600">
              To build a trusted community where journalists collaborate,
              innovate, and contribute to an informed and democratic society.
            </p>


          </div>


        </div>


      </div>
    </section>
  );
}

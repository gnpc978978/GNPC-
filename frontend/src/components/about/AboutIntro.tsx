export default function AboutIntro() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">


          {/* Left Content */}
          <div>

            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-700">
              Greater Noida Press Club
            </div>


            <h2 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Empowering Journalists &
              <span className="text-blue-600">
                {" "}Strengthening Independent Media
              </span>
            </h2>


            <p className="mb-5 text-lg leading-8 text-slate-600">
              Greater Noida Press Club is a professional organization dedicated to
              supporting journalists, promoting ethical journalism, and
              providing a strong platform for media professionals.
            </p>


            <p className="text-lg leading-8 text-slate-600">
              We believe in freedom of expression, responsible reporting,
              and creating opportunities that help journalists grow,
              collaborate, and contribute to society.
            </p>


          </div>




          {/* Commitment Card */}
          <div className="group rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">


            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              ✓
            </div>


            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Our Commitment
            </h3>


            <p className="leading-8 text-slate-600">
              We are committed to protecting journalistic values,
              encouraging transparency, and building a stronger media
              community through education, collaboration, and innovation.
            </p>


          </div>


        </div>

      </div>
    </section>
  );
}
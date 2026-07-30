import {
  FaUsers,
  FaNewspaper,
  FaHandshake,
  FaGraduationCap,
} from "react-icons/fa";

const objectives = [
  {
    icon: <FaUsers />,
    title: "Support Journalists",
    description:
      "Provide a strong platform where journalists can collaborate, learn, and grow professionally.",
  },
  {
    icon: <FaNewspaper />,
    title: "Promote Ethical Journalism",
    description:
      "Encourage responsible reporting, transparency, and the highest journalistic standards.",
  },
  {
    icon: <FaHandshake />,
    title: "Build Strong Community",
    description:
      "Connect media professionals through networking events, discussions, and collaborations.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Training & Development",
    description:
      "Organize workshops, seminars, and skill development programs for media professionals.",
  },
];

export default function Objectives() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}
        <div className="text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Our Objectives
          </span>


          <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
            What We Aim To Achieve
          </h2>


          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Our primary objective is to strengthen journalism through
            education, collaboration, innovation, and ethical reporting.
          </p>

        </div>




        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {objectives.map((item, index) => (

            <div
              key={index}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:border-blue-200 hover:shadow-xl"
            >


              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white transition duration-300 group-hover:scale-110">

                {item.icon}

              </div>



              <h3 className="mb-4 text-xl font-bold text-slate-900">
                {item.title}
              </h3>



              <p className="leading-7 text-slate-600">
                {item.description}
              </p>


            </div>

          ))}

        </div>


      </div>
    </section>
  );
}

import {
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaAward,
} from "react-icons/fa";

const reasons = [
  {
    icon: <FaShieldAlt />,
    title: "Ethical Journalism",
    description:
      "Promoting responsible reporting, transparency, and professional journalistic values.",
  },
  {
    icon: <FaUsers />,
    title: "Strong Community",
    description:
      "Connecting journalists and media professionals through collaboration and networking.",
  },
  {
    icon: <FaGlobe />,
    title: "Media Excellence",
    description:
      "Creating opportunities for learning, innovation, and growth in the media industry.",
  },
  {
    icon: <FaAward />,
    title: "Professional Recognition",
    description:
      "Supporting journalists and celebrating achievements in the field of journalism.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}
        <div className="text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Why Choose Us
          </span>


          <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Why Greater Noida Press Club Matters
          </h2>


          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            We provide a trusted platform for journalists to connect,
            collaborate, and grow while maintaining the highest standards
            of journalism.
          </p>

        </div>




        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {reasons.map((item, index) => (

            <div
              key={index}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-xl"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white transition group-hover:scale-110">
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
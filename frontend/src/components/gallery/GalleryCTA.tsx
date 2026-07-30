import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function GalleryCTA() {
  return (
    <section className="relative overflow-hidden bg-blue-900 py-20">

      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />


      <div className="relative mx-auto max-w-7xl px-6 text-center">


        <h2 className="text-3xl font-extrabold text-white md:text-5xl">
          Want to Be Part of Our Journey?
        </h2>


        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
          Join our press club community and stay connected with latest
          events, media activities and updates.
        </p>



        <div className="mt-10 flex justify-center">


          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-white px-8 py-4 font-bold text-blue-800 transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
          >
            Contact Us

            <FaArrowRight className="ml-3" />

          </Link>


        </div>


      </div>


    </section>
  );
}
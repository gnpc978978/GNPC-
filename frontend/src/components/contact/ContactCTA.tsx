import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="bg-blue-700 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-4xl font-bold text-white">
          Ready to Connect With Us?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
          Whether you're a journalist, media organization, or interested in
          becoming a member, we'd love to hear from you.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="rounded-lg border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
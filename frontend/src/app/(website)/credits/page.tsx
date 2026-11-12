import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Website Credits | Greater Noida Press Club",
  description:
    "Meet Ayush Chauhan and Shreyansh Mishra, the developers and collaborators behind the Greater Noida Press Club website, with acknowledgement to Ayzent Solutions.",
};

const contributors = [
  {
    name: "Ayush Chauhan",
    role: "Website Developer (@ Ayzent Solution)",
    linkedin: "https://www.linkedin.com/in/itxayushrajput",
  },
  {
    name: "Shreyansh Mishra",
    role: "Website Developer & Project Collaborator",
    linkedin: "https://www.linkedin.com/in/shreyansh-mishra-66615437b",
  },
];

export default function CreditsPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#fbfaf7] text-[#172333]">
      <div className="gnpc-container mx-auto flex w-full flex-col justify-center py-12 sm:py-16 lg:min-h-[620px] lg:py-20">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a1844e]">
            Greater Noida Press Club
          </p>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-[#586474] transition-colors hover:text-[#a1844e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b99a60]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to GNPC
          </Link>
        </div>

        <header className="mt-12 max-w-2xl sm:mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1844e]">
            Website Credits
          </p>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-[-0.035em] text-[#14243a] sm:text-4xl lg:text-[2.75rem]">
            The People Behind GNPC
          </h1>
        </header>

        <section
          aria-label="Website contributors"
          className="mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5"
        >
          {contributors.map((contributor) => (
            <article
              key={contributor.name}
              className="flex min-h-[132px] items-center justify-between gap-5 rounded-xl border border-[#e8e4db] bg-white px-5 py-5 transition-colors duration-200 hover:border-[#cbb88f] sm:px-6"
            >
              <div className="min-w-0">
                <h2 className="font-serif text-xl font-medium tracking-tight text-[#172333] sm:text-[1.35rem]">
                  {contributor.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#78818b]">
                  {contributor.role}
                </p>
              </div>
              <a
                href={contributor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${contributor.name}'s LinkedIn profile (opens in a new tab)`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8e4db] text-[#8c754b] transition-colors hover:border-[#b99a60] hover:bg-[#f8f5ed] hover:text-[#172333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b99a60]"
              >
                <FaLinkedinIn size={15} aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>

        <p className="mt-8 border-t border-[#e9e5dd] pt-5 text-xs leading-6 text-[#858b91] sm:mt-9 sm:text-sm">
          Website developed in collaboration with{" "}
          <a
            href="https://www.linkedin.com/in/ayzent-solutions-983a86432"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#947747] transition-colors hover:text-[#172333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b99a60]"
          >
            Ayzent Solutions
          </a>
          .
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#657080] transition-colors hover:text-[#a1844e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b99a60]"
          >
            Return to GNPC
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}

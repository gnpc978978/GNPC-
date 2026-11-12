
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Linkedin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Website Credits",
  description:
    "Meet the developers behind the Greater Noida Press Club website. A collaborative digital project by Ayush Chauhan and Shreyansh Mishra, with Ayzent Solutions attribution.",
};

type Contributor = {
  number: string;
  name: string;
  designation: string;
  affiliation: string;
  initials: string;
  bio: string;
  contribution: string;
  linkedin: string;
};

const contributors: Contributor[] = [
  {
    number: "01",
    name: "Ayush Chauhan",
    designation: "Website Developer",
    affiliation: "Ayzent Solutions",
    initials: "AC",
    bio:
      "Ayush Chauhan contributed to the GNPC website as its developer, bringing together website design, development and implementation as part of the collaborative project.",
    contribution:
      "Website design, development and implementation.",
    linkedin:
      "https://www.linkedin.com/in/itxayushrajput",
  },
  {
    number: "02",
    name: "Shreyansh Mishra",
    designation: "Website Developer & Project Collaborator",
    affiliation: "Independent Project Collaborator",
    initials: "SM",
    bio:
      "Shreyansh Mishra contributed to the GNPC website as a website developer and project collaborator, working alongside the project team to bring its digital experience together.",
    contribution:
      "Collaborative website design, development and implementation.",
    linkedin:
      "https://www.linkedin.com/in/shreyansh-mishra-66615437b",
  },
];

function ContributorCard({
  contributor,
}: {
  contributor: Contributor;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#e5e2dc] bg-white shadow-[0_12px_45px_rgba(30,35,40,0.045)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c9b88f] hover:shadow-[0_24px_65px_rgba(30,35,40,0.09)] motion-reduce:transform-none motion-reduce:transition-none">

      {/* Portrait */}
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#eae8e3]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), transparent 38%), linear-gradient(145deg, #eeece6 0%, #dedbd2 100%)",
          }}
        />
        <div
          aria-label={`Portrait placeholder for ${contributor.name}`}
          role="img"
          className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#c9b88f] bg-white/75 font-serif text-5xl tracking-tight text-[#9b8359] shadow-[0_14px_40px_rgba(35,39,43,0.08)] transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
        >
          {contributor.initials}
        </div>
        <p className="absolute bottom-20 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777064]">
          Portrait placeholder
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/[0.04]"
        />

        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-white/35 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            Contributor {contributor.number}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-7">
          <span className="text-xs font-medium tracking-wide text-white/90">
            GNPC Website Project
          </span>

          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-[#20242a]"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>

      {/* Profile Information */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1844e]">
              {contributor.designation}
            </p>

            <h2 className="mt-3 break-words font-serif text-3xl font-semibold tracking-tight text-[#20242a] sm:text-[34px]">
              {contributor.name}
            </h2>
          </div>

          <a
            href={contributor.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${contributor.name} on LinkedIn`}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e2da] text-[#656565] transition-all hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#20242a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a1844e]"
          >
            <Linkedin size={17} />
          </a>

        </div>

        <p className="mt-2 text-sm font-medium text-[#8a806e]">
          {contributor.affiliation}
        </p>

        <p className="mt-6 text-sm leading-7 text-[#686b70]">
          {contributor.bio}
        </p>

        {/* Contribution */}
        <div className="mt-auto pt-8">

          <div className="border-t border-[#ebe8e2] pt-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1844e]">
              Contribution
            </p>

            <p className="mt-3 text-sm font-medium leading-6 text-[#35383d]">
              {contributor.contribution}
            </p>

          </div>

        </div>

      </div>

    </article>
  );
}

export default function CreditsPage() {
  return (
    <div className="overflow-hidden bg-[#f8f7f4] text-[#20242a]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate overflow-hidden border-b border-[#e9e6df]">

        {/* Subtle Background Treatment */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 85% 20%, rgba(199,180,142,0.14), transparent 34%), radial-gradient(ellipse at 5% 100%, rgba(190,190,185,0.13), transparent 35%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-44 h-[470px] w-[470px] rounded-full border border-[#dcd6c9]/60"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-28 h-[340px] w-[340px] rounded-full border border-[#dcd6c9]/45"
        />

        <div className="gnpc-container relative py-16 sm:py-24 lg:py-28">

          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#dedbd4] bg-white/70 px-4 py-2.5 text-xs font-semibold tracking-wide text-[#55585d] transition-all hover:border-[#b9a477] hover:bg-white hover:text-[#20242a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a1844e]"
          >
            <ArrowLeft size={15} />
            Back to GNPC
          </Link>

          {/* Heading */}
          <div className="mt-14 max-w-5xl sm:mt-20">

            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#a88b55]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#95794a]">
                Behind The Digital Experience
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl font-serif text-[clamp(2.8rem,7.5vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#20242a]">
              The People Behind
              <br />

              <span className="text-[#9b8359]">
                the Website.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#747474] sm:text-lg sm:leading-9">
              Every digital experience is shaped by the people
              who bring ideas to life. This website represents
              a collaborative effort in design, development
              and technology.
            </p>

          </div>

          {/* Hero Bottom Information */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-[#dfdcd5] pt-6 sm:mt-20">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858078]">
              Greater Noida Press Club
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858078]">
              Design · Development · Collaboration
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTRIBUTORS
      ====================================================== */}

      <section
        id="contributors"
        className="bg-[#f8f7f4] py-16 sm:py-24 lg:py-28"
      >

        <div className="gnpc-container">

          {/* Section Heading */}
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#a88b55]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#95794a]">
                  The Contributors
                </p>
              </div>

              <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#20242a] sm:text-5xl">
                People & Perspectives
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#777a7d]">
              Two contributors, working together to shape
              the digital experience of GNPC.
            </p>

          </div>

          {/* Equal Profile Cards */}
          <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:gap-9">

            {contributors.map((contributor) => (
              <ContributorCard
                key={contributor.name}
                contributor={contributor}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROJECT ACKNOWLEDGEMENT
      ====================================================== */}

      <section className="border-y border-[#e6e2da] bg-[#efeee9]">

        <div className="gnpc-container py-16 sm:py-24">

          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">

            {/* Main Copy */}
            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#a88b55]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#95794a]">
                  Project Acknowledgement
                </p>
              </div>

              <h2 className="mt-6 max-w-xl font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#20242a] sm:text-5xl lg:text-6xl">
                Built Through
                <br />
                Collaboration.
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-8 text-[#747474] sm:text-base">
                The GNPC website is the result of a collaborative
                effort, bringing together ideas, design and
                development to create its digital experience.
              </p>

            </div>

            {/* Acknowledgement Details */}
            <div className="rounded-[22px] border border-[#dedbd3] bg-white p-7 shadow-[0_12px_40px_rgba(30,35,40,0.035)] sm:p-9">

              <div className="border-b border-[#ebe8e2] pb-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1844e]">
                  Website Project
                </p>

                <h3 className="mt-3 font-serif text-2xl font-medium text-[#26292e] sm:text-3xl">
                  Greater Noida Press Club
                </h3>

                <p className="mt-2 text-sm text-[#858585]">
                  Official Digital Website
                </p>

              </div>

              <div className="grid gap-6 border-b border-[#ebe8e2] py-6 sm:grid-cols-2">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#a1844e]">
                    Contributors
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#36393e]">
                    Ayush Chauhan
                  </p>

                  <p className="mt-1 text-sm text-[#777]">
                    Shreyansh Mishra
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#a1844e]">
                    Development Attribution
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#36393e]">
                    Ayzent Solutions
                  </p>

                  <p className="mt-1 text-sm text-[#777]">
                    Ayush Chauhan's affiliation
                  </p>
                </div>

              </div>

              <p className="pt-5 text-sm leading-7 text-[#777]">
                Our appreciation to both contributors for
                their collaborative work in the design,
                development and implementation of the
                GNPC website.
              </p>

            </div>

          </div>

          {/* Return Link */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-[#dcd9d1] pt-7">

            <p className="text-xs text-[#88857e]">
              Made possible through collaborative effort.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#d3c9b6] bg-white px-5 py-3 text-xs font-bold tracking-wide text-[#353535] transition-all hover:border-[#a88b55] hover:bg-[#f9f7f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a1844e]"
            >
              Return to GNPC

              <ArrowUpRight size={15} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

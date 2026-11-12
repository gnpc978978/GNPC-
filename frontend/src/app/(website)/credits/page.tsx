import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Credits | Greater Noida Press Club",
  description:
    "Meet the creative and development team behind the Greater Noida Press Club website.",
};

type Contributor = {
  name: string;
  initials: string;
  title: string;
  contribution: string;
  linkedin: string;
  photo: string | null;
  featured?: boolean;
};

const contributors: Contributor[] = [
  {
    name: "Ayush Chauhan",
    initials: "AC",
    title: "FOUNDER — AYZENT SOLUTIONS",
    contribution: "DESIGN · DEVELOPMENT · DIGITAL STRATEGY",
    linkedin: "https://www.linkedin.com/in/itxayushrajput",
    // Add Ayush's supplied portrait at this path when it is provided.
    photo: "/images/credits/ayush-chauhan.png",
    featured: true,
  },
  {
    name: "Shreyansh Mishra",
    initials: "SM",
    title: "CREATIVE & DEVELOPMENT COLLABORATOR",
    contribution: "DESIGN · DEVELOPMENT · COLLABORATION",
    linkedin: "https://www.linkedin.com/in/shreyansh-mishra-66615437b",
    // Add Shreyansh's supplied portrait at this path when it is provided.
    photo: "/images/credits/shreyansh-mishra.jpeg",
  },
];

// These contact destinations were not present in the repository. Keep them
// empty until Ayzent Solutions supplies its official public contact links.
const ayzentContact = {
  instagram: "https://www.instagram.com/ayzent.in/",
  whatsapp: "https://wa.me/919870970278",
  email: "ayzentsolutions@gmail.com",
};

const ayzentWebsite = "https://ayzent-solutions.vercel.app";

function Portrait({ person }: { person: Contributor }) {
  return (
    <div className="relative isolate aspect-[5/4] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#102844]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,164,92,.23),transparent_48%),linear-gradient(145deg,#173654,#091a30)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[#c9a45c]/20"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full border border-white/10"
      />

      {person.photo ? (
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-7xl font-medium tracking-[-0.08em] text-[#ead8ae] sm:text-8xl">
            {person.initials}
          </span>
          <span className="mt-3 text-[9px] font-bold uppercase tracking-[.28em] text-white/40">
            Portrait
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07182b]/75 to-transparent" />
      <div className="absolute bottom-4 left-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c9a45c]" />
        <span className="text-[9px] font-semibold uppercase tracking-[.22em] text-white/75">
          GNPC Website Team
        </span>
      </div>
    </div>
  );
}

function LinkedInLink({ person }: { person: Contributor }) {
  return (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${person.name}'s LinkedIn profile in a new tab`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[.04] text-white/80 transition hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3c783]"
    >
      <FaLinkedinIn size={16} aria-hidden="true" />
    </a>
  );
}

function AyzentContactLinks() {
  const links = [
    ayzentContact.instagram
      ? {
          label: "Instagram",
          href: ayzentContact.instagram,
          icon: <FaInstagram size={15} aria-hidden="true" />,
        }
      : null,
    ayzentContact.whatsapp
      ? {
          label: "WhatsApp",
          href: ayzentContact.whatsapp,
          icon: <FaWhatsapp size={15} aria-hidden="true" />,
        }
      : null,
    ayzentContact.email
      ? {
          label: "Email",
          href: `mailto:${ayzentContact.email}`,
          icon: <Mail size={15} aria-hidden="true" />,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!links.length) return null;

  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#c9a45c]">
        Ayzent Solutions
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-[#c9a45c]/60 hover:text-[#ead8ae]"
          >
            {item.icon}
            {item.label}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ContributorCard({ person }: { person: Contributor }) {
  return (
    <article
      className={[
        "group min-w-0 rounded-[1.8rem] border p-4 shadow-[0_24px_70px_rgba(0,0,0,.18)] transition duration-300 sm:p-5",
        person.featured
          ? "border-[#c9a45c]/45 bg-[linear-gradient(145deg,rgba(30,56,82,.98),rgba(10,28,49,.98))] hover:border-[#d8ba79]/75"
          : "border-white/12 bg-[linear-gradient(145deg,rgba(22,45,69,.98),rgba(9,26,46,.98))] hover:border-white/25",
      ].join(" ")}
    >
      <Portrait person={person} />

      <div className="px-1 pb-1 pt-6 sm:px-2 sm:pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#c9a45c]">
              {person.title}
            </p>
            <h2 className="mt-3 font-serif text-[1.8rem] font-medium leading-tight tracking-[-.04em] text-white sm:text-[2.1rem]">
              {person.name}
            </h2>
          </div>
          <LinkedInLink person={person} />
        </div>

        <p className="mt-4 max-w-sm text-[10px] font-semibold leading-6 tracking-[.11em] text-white/55 sm:text-[11px]">
          {person.contribution}
        </p>

        {person.featured ? (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={ayzentWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#c9a45c] px-4 py-2.5 text-xs font-bold text-[#0b1f3a] transition hover:bg-[#e7d3a2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3c783]"
              >
                Ayzent Solutions
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <span className="text-[10px] font-medium text-white/35">
                Founder
              </span>
            </div>
            <AyzentContactLinks />
          </>
        ) : null}
      </div>
    </article>
  );
}

export default function CreditsPage() {
  const [ayush, shreyansh] = contributors;

  return (
    <main className="gnpc-credits-page relative isolate min-h-[calc(100vh-8rem)] overflow-hidden bg-[#071629] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-[#c9a45c]/[.07] blur-3xl" />
        <div className="absolute -right-40 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-sky-400/[.06] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />
      </div>

      <div className="gnpc-container relative mx-auto w-full py-10 sm:py-14 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#c9a45c] sm:text-[10px]">
            Greater Noida Press Club
          </p>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3.5 py-2.5 text-xs font-semibold text-white/65 transition hover:border-[#c9a45c]/50 hover:text-[#ead8ae] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3c783]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to GNPC
          </Link>
        </div>

        <header className="mx-auto mt-14 max-w-3xl text-center sm:mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/25 bg-[#c9a45c]/[.07] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[.22em] text-[#e4cd9c]">
            <Sparkles size={12} aria-hidden="true" />
            Website Credits
          </div>
          <h1 className="mt-6 font-serif text-[2.55rem] font-medium leading-[1.04] tracking-[-.055em] text-white sm:text-5xl lg:text-[4.25rem]">
            Built through
            <span className="block text-[#d8ba79]">collaboration.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            A shared effort in design, development and digital direction —
            bringing the Greater Noida Press Club website to life.
          </p>
        </header>

        <section
          aria-label="Website designers and developers"
          className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 items-center gap-5 md:mt-14 md:grid-cols-[minmax(0,1fr)_52px_minmax(0,1fr)] md:gap-3 lg:gap-5"
        >
          <ContributorCard person={ayush} />

          <div className="flex items-center justify-center py-1 md:py-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a45c]/35 bg-[#c9a45c]/[.08] font-serif text-2xl text-[#d8ba79]">
              ×
            </span>
          </div>

          <ContributorCard person={shreyansh} />
        </section>

        <footer className="mx-auto mt-10 flex max-w-[1180px] flex-col gap-3 border-t border-white/10 pt-5 text-center sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[10px] font-medium uppercase tracking-[.16em] text-white/35">
            Designed & developed with intent.
          </p>
          <a
            href={ayzentWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#d8ba79] transition hover:text-[#f0dfb6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3c783]"
          >
            Ayzent Solutions
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
}

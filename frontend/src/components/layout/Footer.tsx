"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import Container from "@/components/ui/Container";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Announcements", href: "/announcements" },
  { name: "Press Conferences", href: "/press-conference" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const socialIcons = [
  {
    icon: FaFacebookF,
    name: "facebook",
  },
  {
    icon: FaTwitter,
    name: "twitter",
  },
  {
    icon: FaInstagram,
    name: "instagram",
  },
  {
    icon: FaLinkedinIn,
    name: "linkedin",
  },
];

export default function Footer() {
  const { settings } = useWebsiteSettings();

  const socialLinks = settings.socialLinks || {};

  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const [feedbackStatus, setFeedbackStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFeedbackSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name = feedback.name.trim();
    const email = feedback.email.trim();
    const message = feedback.message.trim();

    if (!name || !email || !message) {
      setFeedbackStatus({
        type: "error",
        message: "Please fill all feedback fields.",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFeedbackStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setSending(true);
      setFeedbackStatus(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject: "Website Feedback",
            message,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to send feedback."
        );
      }

      setFeedback({
        name: "",
        email: "",
        message: "",
      });

      setFeedbackStatus({
        type: "success",
        message: "Thank you. Your feedback has been sent.",
      });
    } catch (error) {
      setFeedbackStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send feedback.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <footer
      id="contact"
      className="bg-slate-950 text-slate-300"
    >
      <Container>
        {/* Main Footer */}
        <div className="grid gap-10 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* About + Logo */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                <Image
                  src={settings.logo || "/Logo.png"}
                  alt={
                    settings.siteName ||
                    "Greater Noida Press Club"
                  }
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold leading-tight text-white">
                  {settings.siteName ||
                    "Greater Noida Press Club"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Official Website
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              Empowering journalists through ethical
              journalism, networking, training and media
              excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white">
              Quick Links
            </h4>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white">
              Contact
            </h4>

            <ul className="mt-5 space-y-4 text-sm leading-6">
              <li className="font-medium text-slate-300">
                {settings.siteName || "Press Club"}
              </li>

              <li>
                <span className="mr-2">📍</span>
                {settings.address || "Address coming soon"}
              </li>

              <li>
                <span className="mr-2">📞</span>
                {settings.phone || "Phone coming soon"}
              </li>

              <li className="break-all">
                <span className="mr-2">📧</span>
                {settings.email || "Email coming soon"}
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white">
                Follow Us
              </h5>

              <div className="mt-3 flex gap-3">
                {socialIcons
                  .filter((social) =>
                    Boolean(socialLinks[social.name])
                  )
                  .map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.name}
                        href={socialLinks[social.name]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.name}
                        className="rounded-full bg-slate-800 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
                      >
                        <Icon />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div id="feedback">
            <h4 className="text-lg font-semibold text-white">
              Send Feedback
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Help us improve the Greater Noida Press Club
              website.
            </p>

            <form
              onSubmit={handleFeedbackSubmit}
              className="mt-5 space-y-3"
            >
              <input
                type="text"
                placeholder="Your name"
                value={feedback.name}
                onChange={(event) =>
                  setFeedback({
                    ...feedback,
                    name: event.target.value,
                  })
                }
                disabled={sending}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <input
                type="email"
                placeholder="Your email"
                value={feedback.email}
                onChange={(event) =>
                  setFeedback({
                    ...feedback,
                    email: event.target.value,
                  })
                }
                disabled={sending}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <textarea
                placeholder="Your feedback..."
                rows={4}
                value={feedback.message}
                onChange={(event) =>
                  setFeedback({
                    ...feedback,
                    message: event.target.value,
                  })
                }
                disabled={sending}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              {feedbackStatus && (
                <p
                  className={`rounded-lg px-3 py-2 text-xs ${
                    feedbackStatus.type === "success"
                      ? "bg-green-950 text-green-300"
                      : "bg-red-950 text-red-300"
                  }`}
                >
                  {feedbackStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 py-7 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            {settings.siteName || "Greater Noida Press Club"}.
            All Rights Reserved.
          </p>

          <p className="mt-3 text-sm text-slate-400">
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/itxayushrajput"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-300 transition hover:text-blue-400"
            >
              Ayush Chauhan
            </a>{" "}
            &{" "}
            <a
              href="https://www.linkedin.com/in/shreyansh-mishra-66615437b"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-300 transition hover:text-blue-400"
            >
              Shreyansh Mishra
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

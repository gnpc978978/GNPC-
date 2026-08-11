"use client";

import Link from "next/link";
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
  { name: "About", href: "#about" },
  { name: "News", href: "#news" },
  { name: "Gallery", href: "#gallery" },
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
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">

      <Container>
        <div className="grid gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-white">
              {settings.siteName || "Press Club"}
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-400 sm:mt-5 sm:text-base sm:leading-7">
              Empowering journalists through ethical journalism,
              networking, training and media excellence.
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
                    className="
                      transition
                      hover:text-blue-400
                    "
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

            <ul className="mt-5 space-y-3 text-sm leading-6">
              <li>
                {settings.siteName || "Press Club"}
              </li>

              <li>
                📍 {settings.address || "Address coming soon"}
              </li>

              <li>
                📞 {settings.phone || "Phone coming soon"}
              </li>

              <li>
                📧 {settings.email || "Email coming soon"}
              </li>
            </ul>
          </div>


          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white">
              Follow Us
            </h4>

            <div className="mt-5 flex gap-4">
              {socialIcons.filter((social) => Boolean(socialLinks[social.name])).map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={socialLinks[social.name]}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      rounded-full
                      bg-slate-800
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-blue-600
                    "
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

        </div>


        {/* Bottom */}
        <div
          className="
            border-t
            border-slate-800
            py-6
            text-center
            text-sm
            text-slate-500
          "
        >
          <p>© {new Date().getFullYear()} {settings.siteName || "Press Club"}. All Rights Reserved.</p>
          <p className="mt-2 text-slate-400">Crafted with precision by <a href="https://www.linkedin.com/in/itxayushrajput" target="_blank" rel="noopener noreferrer" className="transition hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Ayush Chauhan</a> & <a href="https://www.linkedin.com/in/shreyansh-mishra-66615437b" target="_blank" rel="noopener noreferrer" className="transition hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Shreyansh Mishra</a></p>
        </div>

      </Container>

    </footer>
  );
}

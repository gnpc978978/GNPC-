import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { WebsiteSettingsProvider } from "@/context/WebsiteSettingsContext";
export const metadata: Metadata = {
  title: {
    default: "Greater Noida Press Club | Official Website",
    template: "%s | Greater Noida Press Club",
  },

  description:
    "Official website of Greater Noida Press Club. Get latest news, events, journalist updates, media activities and press club information.",

  keywords: [
    "Greater Noida Press Club",
    "Press Club",
    "Greater Noida News",
    "Journalists",
    "Media Updates",
    "News Portal",
  ],

  authors: [
    {
      name: "Greater Noida Press Club",
    },
  ],

  creator: "Greater Noida Press Club",

  category: "News",

  openGraph: {
    title: "Greater Noida Press Club",
    description:
      "Latest news, events and media updates from Greater Noida Press Club.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Greater Noida Press Club",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Greater Noida Press Club",
    description:
      "Latest news, events and media updates from Greater Noida Press Club.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F4C81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider><AuthProvider><WebsiteSettingsProvider>{children}</WebsiteSettingsProvider></AuthProvider></QueryProvider>

<Toaster
  position="top-right"
  richColors
/>
      </body>
    </html>
  );
}

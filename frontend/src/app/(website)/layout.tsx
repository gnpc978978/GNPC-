"use client";

import { usePathname } from "next/navigation";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/layout/FloatingContactButton";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { WebsiteThemeProvider } from "@/context/WebsiteThemeContext";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({
  children,
}: WebsiteLayoutProps) {
  const pathname = usePathname();

  const isContactPage =
    pathname === "/contact" ||
    pathname.startsWith("/contact/");


  return (
    <WebsiteThemeProvider>
    <div className="min-h-screen">
      <AnalyticsTracker />
      {/* =====================================================
          FIXED GLOBAL WEBSITE HEADER

          TOP BAR
             ↓
          NAVBAR
             ↓
          WEBSITE CONTENT

          Both remain fixed together while scrolling.
          ===================================================== */}

      <header className="gnpc-site-header fixed inset-x-0 top-0 z-[200] w-full">
        {/* TOP BAR */}
        <TopBar />

        {/* NAVBAR */}
        <Navbar />
      </header>

      {/* =====================================================
          HEADER OFFSET

          TopBar ≈ 42px
          Navbar ≈ 76px
          Total ≈ 118px

          Keeps hero/content from going underneath the header.
          ===================================================== */}

      <div
        aria-hidden="true"
        className="h-[70px] sm:h-[118px] lg:h-[120px]"
      />

      {/* =====================================================
          MAIN WEBSITE CONTENT
          ===================================================== */}

      <main>{children}</main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer />

      {/* =====================================================
          FLOATING CONTACT ACTION
          ===================================================== */}

      {!isContactPage && (
        <FloatingContactButton />
      )}
    </div>
    </WebsiteThemeProvider>
  );
}

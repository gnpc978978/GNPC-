"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/layout/FloatingContactButton";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({
  children,
}: WebsiteLayoutProps) {
  const pathname = usePathname();

  /*
   * -------------------------------------------------------
   * WEBSITE TRAFFIC TRACKING
   * -------------------------------------------------------
   */

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured."
      );

      return;
    }

    let sessionId =
      localStorage.getItem("gnpc_traffic_session");

    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2)}`;

      localStorage.setItem(
        "gnpc_traffic_session",
        sessionId
      );
    }

    const sendHeartbeat = async () => {
      try {
        await fetch(
          `${apiUrl}/dashboard/traffic`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              sessionId,
              page: window.location.pathname,
            }),
          }
        );
      } catch (error) {
        /*
         * Analytics must never break the public website.
         */
        console.error(
          "Traffic heartbeat error:",
          error
        );
      }
    };

    void sendHeartbeat();

    const interval = window.setInterval(
      sendHeartbeat,
      30_000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * -------------------------------------------------------
   * CONTACT PAGE
   * -------------------------------------------------------
   */

  const isContactPage =
    pathname === "/contact" ||
    pathname.startsWith("/contact/");

  return (
    <div
      className={[
        "gnpc-public",
        "min-h-screen",
        "bg-white",
        "text-slate-900",
      ].join(" ")}
    >
      {/* ===================================================
          GLOBAL WEBSITE HEADER
          ===================================================

          The TopBar and Navbar are now treated as ONE
          fixed header system.

          This prevents the Navbar from covering the
          TopBar and prevents page content from hiding
          underneath the combined header.
          =================================================== */}

      <header
        className={[
          "fixed",
          "inset-x-0",
          "top-0",
          "z-[100]",
        ].join(" ")}
      >
        {/* -----------------------------------------------
            TOP BAR
            ----------------------------------------------- */}

        <div className="relative z-[110]">
          <TopBar />
        </div>

        {/* -----------------------------------------------
            MAIN NAVIGATION
            ----------------------------------------------- */}

        <div className="relative z-[100]">
          <Navbar />
        </div>
      </header>

      {/* ===================================================
          HEADER SPACER
          ===================================================

          The complete header consists of:

          TopBar
          +
          Navbar

          Current TopBar:
          approximately 40px on desktop

          Current Navbar:
          72px / 76px

          We reserve the combined space here so the Hero
          and every other public page begins below the
          complete header.

          The extra responsive spacing accounts for the
          TopBar wrapping on smaller screens.
          =================================================== */}

      <div
        aria-hidden="true"
        className={[
          "h-[116px]",

          "sm:h-[116px]",

          "lg:h-[116px]",
        ].join(" ")}
      />

      {/* ===================================================
          MAIN CONTENT
          =================================================== */}

      <main>{children}</main>

      {/* ===================================================
          GLOBAL FOOTER
          =================================================== */}

      <Footer />

      {/* ===================================================
          FLOATING CONTACT ACTION
          =================================================== */}

      {!isContactPage && (
        <FloatingContactButton />
      )}
    </div>
  );
}

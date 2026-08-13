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
   *
   * Keeps the existing traffic heartbeat functionality.
   * It is intentionally kept inside the website layout so
   * all public pages are tracked consistently.
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
         * Traffic analytics must never break the public
         * website if the analytics API is unavailable.
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
   *
   * The floating "Get in touch" button appears everywhere
   * except the Contact page.
   */
  const isContactPage =
    pathname === "/contact" ||
    pathname.startsWith("/contact/");

  return (
    <div className="gnpc-public min-h-screen bg-white text-slate-900">
      {/*
       * ---------------------------------------------------
       * GLOBAL PUBLIC HEADER
       * ---------------------------------------------------
       *
       * TopBar is part of the global website header.
       * Navbar is the primary navigation.
       */}
      <header>
        <TopBar />
        <Navbar />
      </header>

      {/*
       * ---------------------------------------------------
       * MAIN CONTENT
       * ---------------------------------------------------
       *
       * Navbar is fixed, therefore public content gets
       * enough top spacing from Navbar itself.
       */}
      <main>{children}</main>

      {/*
       * ---------------------------------------------------
       * GLOBAL FOOTER
       * ---------------------------------------------------
       */}
      <Footer />

      {/*
       * ---------------------------------------------------
       * FLOATING CONTACT ACTION
       * ---------------------------------------------------
       */}
      {!isContactPage && (
        <FloatingContactButton />
      )}
    </div>
  );
}

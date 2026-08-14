"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/layout/FloatingContactButton";
import { apiFetch } from "@/services/api";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({
  children,
}: WebsiteLayoutProps) {
  const pathname = usePathname();

  /*
   * =========================================================
   * WEBSITE TRAFFIC TRACKING
   * =========================================================
   */

  useEffect(() => {
    let sessionId =
      localStorage.getItem(
        "gnpc_traffic_session"
      );

    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID ===
          "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2)}`;

      localStorage.setItem(
        "gnpc_traffic_session",
        sessionId
      );
    }

    const sendHeartbeat =
      async () => {
        try {
          await apiFetch("/dashboard/traffic", {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                sessionId,
                page:
                  window.location.pathname,
              }),
            }
          );
        } catch (error) {
          /*
           * Analytics must never
           * break the website.
           */
          console.error(
            "Traffic heartbeat error:",
            error
          );
        }
      };

    void sendHeartbeat();

    const interval =
      window.setInterval(
        sendHeartbeat,
        30_000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * =========================================================
   * CONTACT PAGE
   * =========================================================
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
      {/* =====================================================
          GLOBAL WEBSITE HEADER
          ===================================================== */}

      <header
        className={[
          "fixed",
          "inset-x-0",
          "top-0",
          "z-[100]",
          "w-full",
        ].join(" ")}
      >
        <TopBar />
        <Navbar />
      </header>

      {/* =====================================================
          HEADER SPACE RESERVATION
          =====================================================

          TopBar:
          42px

          Navbar:
          74px

          Total:
          116px

          This value is kept synchronized with the actual
          desktop header dimensions.
          ===================================================== */}

      <div
        aria-hidden="true"
        className="h-[116px]"
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
  );
}

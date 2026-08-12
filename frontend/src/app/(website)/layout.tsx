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

  const isContactPage =
    pathname === "/contact" ||
    pathname.startsWith("/contact/");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <div className="pt-16 sm:pt-[76px]">
        <TopBar />

        <main>{children}</main>
      </div>

      <Footer />

      {!isContactPage && (
        <FloatingContactButton />
      )}
    </div>
  );
}

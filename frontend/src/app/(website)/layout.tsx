"use client";

import { useEffect } from "react";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured"
      );
      return;
    }

    let sessionId =
      localStorage.getItem(
        "gnpc_traffic_session"
      );

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
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              sessionId,
              page:
                window.location.pathname,
            }),

            credentials: "include",
          }
        );
      } catch (error) {
        console.error(
          "Traffic heartbeat error:",
          error
        );
      }
    };

    // Initial visit
    sendHeartbeat();

    // Keep visitor online
    const interval = setInterval(
      sendHeartbeat,
      30000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="pt-16 sm:pt-[76px]">
        <TopBar />

        <main>
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

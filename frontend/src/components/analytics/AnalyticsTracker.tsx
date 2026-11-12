"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/services/api";

type AnalyticsEventType =
  | "page_view"
  | "page_duration"
  | "section_view"
  | "button_click"
  | "link_click"
  | "registration"
  | "download"
  | "feature";

const newId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

function getIdentity() {
  let visitorId = "";
  let sessionId = "";
  const now = Date.now();

  try {
    const storedVisitor = localStorage.getItem("gnpc_analytics_visitor");
    const parsedVisitor = storedVisitor ? JSON.parse(storedVisitor) : null;
    if (parsedVisitor?.id && parsedVisitor.expiresAt > now) {
      visitorId = parsedVisitor.id;
    } else {
      visitorId = newId();
      localStorage.setItem(
        "gnpc_analytics_visitor",
        JSON.stringify({ id: visitorId, expiresAt: now + 400 * 86400000 })
      );
    }

    const storedSession = sessionStorage.getItem("gnpc_analytics_session");
    const parsedSession = storedSession ? JSON.parse(storedSession) : null;
    if (parsedSession?.id && now - parsedSession.lastSeenAt < 30 * 60 * 1000) {
      sessionId = parsedSession.id;
    } else {
      sessionId = newId();
    }
    sessionStorage.setItem(
      "gnpc_analytics_session",
      JSON.stringify({ id: sessionId, lastSeenAt: now })
    );
  } catch {
    visitorId = newId();
    sessionId = newId();
  }

  return { visitorId, sessionId };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/admin" || pathname.startsWith("/admin/")) return;

    const { visitorId, sessionId } = getIdentity();
    const path = pathname.split(/[?#]/, 1)[0].slice(0, 200) || "/";
    const startedAt = Date.now();
    let durationSent = false;

    const post = (endpoint: string, payload: Record<string, unknown>) => {
      void apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ visitorId, sessionId, path, ...payload }),
      }).catch(() => undefined);
    };

    const heartbeat = () => {
      try {
        sessionStorage.setItem(
          "gnpc_analytics_session",
          JSON.stringify({ id: sessionId, lastSeenAt: Date.now() })
        );
      } catch {
        // Tracking must never interfere with website navigation.
      }

      post("/analytics/heartbeat", {
        referrer: document.referrer || "",
      });
    };

    const sendEvent = (
      eventType: AnalyticsEventType,
      label = "",
      durationSeconds?: number
    ) => {
      post("/analytics/event", {
        eventId: newId(),
        eventType,
        label: label.slice(0, 80),
        ...(durationSeconds !== undefined ? { durationSeconds } : {}),
        referrer: document.referrer || "",
      });
    };

    const sendDuration = () => {
      if (durationSent) return;
      durationSent = true;
      const seconds = Math.min(1800, Math.floor((Date.now() - startedAt) / 1000));
      if (seconds > 0) sendEvent("page_duration", "", seconds);
    };

    sendEvent("page_view");
    const heartbeatTimer = window.setInterval(heartbeat, 25_000);

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const element = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-analytics]"
      );
      if (!element) return;

      const explicit = element.dataset.analytics;
      const explicitEvent = element.dataset.analyticsEvent;
      const label =
        element.dataset.analyticsLabel ||
        element.getAttribute("aria-label") ||
        element.textContent?.replace(/\s+/g, " ").trim() ||
        "";

      let eventType: AnalyticsEventType = "button_click";
      if (explicitEvent && ["feature", "registration", "download", "button_click", "link_click"].includes(explicitEvent)) {
        eventType = explicitEvent as AnalyticsEventType;
      } else if (explicit === "registration" || /register|membership|become a member|join (?:the )?press club/i.test(label)) {
        eventType = "registration";
      } else if (element instanceof HTMLAnchorElement) {
        const href = element.getAttribute("href") || "";
        eventType = element.hasAttribute("download") || /download/i.test(label) || /\.(pdf|zip|docx?|xlsx?|pptx?)(?:$|[?#])/i.test(href)
          ? "download"
          : "link_click";
      } else if (explicit === "feature") {
        eventType = "feature";
      }

      if (label) sendEvent(eventType, label);
    };

    const handleSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const marker = `${form.id} ${form.getAttribute("name") || ""} ${form.dataset.analytics || ""}`;
      if (/registration|register|membership/i.test(marker)) {
        sendEvent("registration", form.dataset.analyticsLabel || form.id || "Membership registration");
      } else {
        sendEvent(
          "feature",
          form.dataset.analyticsLabel ||
            form.id ||
            form.getAttribute("aria-label") ||
            "Public form submission"
        );
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };

    const viewedSections = new Set<string>();
    const sectionObserver = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target as HTMLElement;
            const sectionName =
              section.dataset.analyticsSection ||
              section.id ||
              section.getAttribute("aria-label") ||
              "";
            if (sectionName && !viewedSections.has(sectionName)) {
              viewedSections.add(sectionName);
              sendEvent("section_view", sectionName);
            }
          });
        }, { threshold: 0.35 })
      : null;

    if (sectionObserver) {
      document.querySelectorAll<HTMLElement>("main section[id], main [data-analytics-section]")
        .forEach((section) => sectionObserver.observe(section));
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", sendDuration);

    return () => {
      sectionObserver?.disconnect();
      window.clearInterval(heartbeatTimer);
      sendDuration();
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [pathname]);

  return null;
}

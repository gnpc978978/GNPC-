"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type WebsiteSettings = {
  siteName?: string;
  logo?: string;
  favicon?: string;

  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  aboutImage?: string;

  email?: string;
  phone?: string;
  address?: string;

  /*
   * CMS-controlled WhatsApp floating button.
   *
   * whatsappNumber:
   * Stores the WhatsApp number, including country code.
   *
   * Example:
   * 919876543210
   *
   * whatsappLabel:
   * Text displayed beside the WhatsApp icon.
   *
   * Example:
   * Chat on WhatsApp
   */
  whatsappNumber?: string;
  whatsappLabel?: string;

  membershipPdf?: string;

  socialLinks?: Record<string, string | undefined>;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

type WebsiteSettingsContextValue = {
  settings: WebsiteSettings;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
};

const WebsiteSettingsContext =
  createContext<WebsiteSettingsContextValue | null>(null);

export function WebsiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<WebsiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings`
      );

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error("Unable to load website settings");
      }

      setSettings(payload.data || {});
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();

    const handleSettingsUpdated = () => {
      void refresh();
    };

    window.addEventListener(
      "website-settings-updated",
      handleSettingsUpdated
    );

    return () =>
      window.removeEventListener(
        "website-settings-updated",
        handleSettingsUpdated
      );
  }, []);

  useEffect(() => {
    if (!settings.seo?.title) return;

    document.title = settings.seo.title;

    const description = document.querySelector(
      'meta[name="description"]'
    );

    if (description && settings.seo.description) {
      description.setAttribute(
        "content",
        settings.seo.description
      );
    }
  }, [settings.seo?.description, settings.seo?.title]);

  return (
    <WebsiteSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);

  if (!context) {
    throw new Error(
      "useWebsiteSettings must be used within WebsiteSettingsProvider"
    );
  }

  return context;
}

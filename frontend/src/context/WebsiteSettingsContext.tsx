"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

import type {
  HomeSettings,
} from "@/types/homeSettings";

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

  whatsappNumber?: string;
  whatsappLabel?: string;

  membershipPdf?: string;

  pageContent?: Record<
    string,
    {
      title?: string;
      description?: string;
      eyebrow?: string;
      image?: string;
    }
  >;

  socialLinks?: Record<
    string,
    string | undefined
  >;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  home?: HomeSettings;
};

type WebsiteSettingsContextValue =
  {
    settings: WebsiteSettings;

    loading: boolean;

    error: boolean;

    refresh: () => Promise<void>;
  };

const WebsiteSettingsContext =
  createContext<WebsiteSettingsContextValue | null>(
    null
  );

export function WebsiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] =
    useState<WebsiteSettings>({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const refresh = async () => {
    setLoading(true);

    try {
      const response =
        await apiFetch("/settings");

      const payload =
        await responseJson<{
          success?: boolean;
          data?: WebsiteSettings;
          message?: string;
        }>(response);

      if (
        payload.success === false
      ) {
        throw new Error(
          payload.message ||
            "Unable to load website settings."
        );
      }

      setSettings(
        payload.data || {}
      );

      setError(false);
    } catch (error) {
      console.error(
        "Failed to load website settings:",
        error
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();

    const handleSettingsUpdated =
      () => {
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
    if (
      !settings.seo?.title
    ) {
      return;
    }

    document.title =
      settings.seo.title;

    const description =
      document.querySelector(
        'meta[name="description"]'
      );

    if (
      description &&
      settings.seo.description
    ) {
      description.setAttribute(
        "content",
        settings.seo.description
      );
    }
  }, [
    settings.seo?.title,
    settings.seo?.description,
  ]);

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
  const context =
    useContext(
      WebsiteSettingsContext
    );

  if (!context) {
    throw new Error(
      "useWebsiteSettings must be used within WebsiteSettingsProvider"
    );
  }

  return context;
}

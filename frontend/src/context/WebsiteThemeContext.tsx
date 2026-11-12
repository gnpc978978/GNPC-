"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WebsiteTheme = "light" | "dark";

type WebsiteThemeContextValue = {
  theme: WebsiteTheme;
  toggleTheme: () => void;
  setTheme: (theme: WebsiteTheme) => void;
};

const WebsiteThemeContext = createContext<WebsiteThemeContextValue | null>(null);
const STORAGE_KEY = "gnpc-website-theme";

export function WebsiteThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<WebsiteTheme>("light");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        setThemeState(saved);
      }
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still works for the current page when storage is unavailable.
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: WebsiteTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => current === "light" ? "dark" : "light");
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <WebsiteThemeContext.Provider value={value}>
      <div
        className="gnpc-public min-h-screen bg-white text-slate-900"
        data-theme={theme}
        data-theme-ready="true"
      >
        {children}
      </div>
    </WebsiteThemeContext.Provider>
  );
}

export function useWebsiteTheme() {
  const context = useContext(WebsiteThemeContext);
  if (!context) {
    throw new Error("useWebsiteTheme must be used inside WebsiteThemeProvider.");
  }
  return context;
}

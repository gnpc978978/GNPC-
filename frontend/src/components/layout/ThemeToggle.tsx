"use client";

import { Moon, Sun } from "lucide-react";
import { useWebsiteTheme } from "@/context/WebsiteThemeContext";

export default function ThemeToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { theme, toggleTheme } = useWebsiteTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b06a] focus-visible:ring-offset-2",
        compact ? "h-10 w-10" : "h-10 px-3",
        "border-white/15 bg-white/[0.07] text-white hover:border-[#c9a45c] hover:bg-white/[0.13]",
      ].join(" ")}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      {!compact && (
        <span className="text-xs font-bold">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
}

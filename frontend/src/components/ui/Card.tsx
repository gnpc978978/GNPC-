import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;

  className?: string;

  padding?: "none" | "sm" | "md" | "lg";

  /*
   * Public cards use hover elevation by default.
   */
  hover?: boolean;

  onClick?: () => void;
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = true,
  onClick,
}: CardProps) {
  const paddingClass =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-4"
        : padding === "lg"
          ? "p-6 sm:p-8"
          : "p-5 sm:p-6";

  return (
    <div
      onClick={onClick}
      className={[
        /*
         * GNPC standard card.
         *
         * rounded-2xl
         * border
         * white
         * subtle shadow
         */
        "gnpc-card",

        /*
         * Controlled hover elevation.
         */
        hover ? "gnpc-card-hover" : "",

        /*
         * Standard internal spacing.
         */
        paddingClass,

        /*
         * Clickable cards.
         */
        onClick ? "cursor-pointer" : "",

        /*
         * Page-specific layout classes are still allowed
         * through className, but the visual foundation
         * remains GNPC-standardized.
         */
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;

  className?: string;

  padding?: "none" | "sm" | "md" | "lg";

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
        "group",
        "relative",
        "overflow-hidden",
        "border",
        "border-slate-200/80",
        "bg-white",
        "shadow-[0_4px_18px_rgba(15,23,42,0.045)]",
        "transition-all",
        "duration-300",
        "ease-out",

        hover
          ? [
              "hover:-translate-y-1",
              "hover:border-slate-300",
              "hover:shadow-[0_16px_38px_rgba(15,23,42,0.09)]",
            ].join(" ")
          : "",

        paddingClass,

        onClick
          ? "cursor-pointer"
          : "",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Subtle top highlight */}

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "left-0",
          "right-0",
          "top-0",
          "h-px",
          "bg-gradient-to-r",
          "from-transparent",
          "via-[#155eef]/20",
          "to-transparent",
          "opacity-0",
          "transition-opacity",
          "duration-300",
          hover
            ? "group-hover:opacity-100"
            : "",
        ].join(" ")}
      />

      {children}
    </div>
  );
}

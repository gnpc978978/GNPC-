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
        "gnpc-card",
        hover ? "gnpc-card-hover" : "",
        paddingClass,
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

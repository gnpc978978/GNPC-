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
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        ${paddingStyles[padding]}
        ${
          hover
            ? `
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-slate-300
              hover:shadow-md
            `
            : ""
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

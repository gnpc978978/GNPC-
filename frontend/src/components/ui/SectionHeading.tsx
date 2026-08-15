import type { ReactNode } from "react";

type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  action?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  size = "md",
  action,
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  const headingSize =
    size === "sm"
      ? "text-3xl sm:text-4xl"
      : size === "lg"
        ? "text-4xl sm:text-5xl lg:text-7xl"
        : "text-4xl sm:text-5xl lg:text-6xl";

  const content = (
    <div
      className={[
        "relative min-w-0",
        centered
          ? "mx-auto max-w-5xl text-center"
          : "text-left",
      ].join(" ")}
    >
      {badge && (
        <div
          className={[
            "mb-5 flex items-center gap-3",
            centered
              ? "justify-center"
              : "justify-start",
          ].join(" ")}
        >
          <span className="h-[3px] w-10 rounded-full bg-[#d7193f]" />

          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d7193f]">
            {badge}
          </span>

          <span className="hidden h-px w-12 bg-[#155eef]/30 sm:block" />
        </div>
      )}

      <h2
        className={[
          "font-black leading-[0.95] tracking-[-0.055em]",
          "text-[#07111f]",
          headingSize,
        ].join(" ")}
      >
        {title}
      </h2>

      {description && (
        <p
          className={[
            "mt-5 max-w-2xl text-[15px] leading-8 text-slate-500 sm:text-base",
            centered ? "mx-auto" : "",
          ].join(" ")}
        >
          {description}
        </p>
      )}
    </div>
  );

  return (
    <header
      className={[
        "w-full",
        action
          ? "sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-8"
          : "",
        className,
      ].join(" ")}
    >
      {action ? (
        <>
          <div className="hidden sm:block" />

          {content}

          <div className="mt-6 flex justify-center sm:mt-0 sm:justify-end">
            {action}
          </div>
        </>
      ) : (
        content
      )}
    </header>
  );
}

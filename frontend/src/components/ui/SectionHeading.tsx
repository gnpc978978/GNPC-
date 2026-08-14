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
  const isCentered = align === "center";

  const headingSize =
    size === "sm"
      ? "text-2xl sm:text-3xl"
      : size === "lg"
        ? "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
        : "text-3xl sm:text-4xl lg:text-5xl";

  const content = (
    <div
      className={[
        "min-w-0",
        isCentered ? "mx-auto max-w-5xl text-center" : "text-left",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badge ? (
        <div
          className={[
            "mb-3 flex items-center gap-3",
            isCentered ? "justify-center" : "justify-start",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="h-[3px] w-10 shrink-0 rounded-full bg-blue-600"
          />

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
            {badge}
          </span>
        </div>
      ) : null}

      <h2
        className={[
          "font-bold leading-[1.08] tracking-tight text-slate-950",
          headingSize,
        ].join(" ")}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={[
            "mt-4 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8",
            isCentered ? "mx-auto text-center" : "text-left",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );

  return (
    <header
      className={[
        "w-full",
        action
          ? "sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-6"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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

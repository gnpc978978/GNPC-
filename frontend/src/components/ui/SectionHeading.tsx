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
      ? "text-2xl sm:text-[1.75rem]"
      : size === "lg"
        ? "text-3xl sm:text-4xl lg:text-[3rem]"
        : "text-3xl sm:text-[2.25rem] lg:text-[2.65rem]";

  const headingContent = (
    <div
      className={[
        "gnpc-text-composition min-w-0",
        isCentered
          ? "mx-auto items-center text-center"
          : "items-start text-left",
      ].join(" ")}
    >
      {badge && (
        <div
          className={[
            "gnpc-composition-eyebrow gap-3",
            isCentered
              ? "justify-center"
              : "justify-start",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="h-0.5 w-8 rounded-full bg-[#155eef]"
          />
          <span className="gnpc-composition-eyebrow-text">
            {badge}
          </span>
        </div>
      )}

      <h2 className={["gnpc-section-title", headingSize].join(" ")}>
        {title}
      </h2>

      {description && (
        <p className="gnpc-composition-description">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <header
      className={["relative w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {action ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {headingContent}
          <div className="flex shrink-0 items-center lg:pb-0">
            {action}
          </div>
        </div>
      ) : (
        headingContent
      )}
    </header>
  );
}

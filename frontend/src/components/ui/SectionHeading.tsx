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

  return (
    <header
      className={[
        "mx-auto w-full",
        isCentered ? "text-center" : "text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badge && (
        <div
          className={[
            "flex",
            isCentered ? "justify-center" : "justify-start",
          ].join(" ")}
        >
          <span className="gnpc-eyebrow">
            {badge}
          </span>
        </div>
      )}

      <div className="mt-3">
        <h2
          className={[
            "gnpc-section-title",
            headingSize,
            isCentered ? "mx-auto text-center" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h2>

        {description && (
          <p
            className={[
              "gnpc-section-description",
              "mx-auto",
              "text-center",
            ].join(" ")}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div
          className={[
            "mt-6 flex justify-center sm:mt-8",
            isCentered ? "" : "sm:justify-start",
          ].join(" ")}
        >
          {action}
        </div>
      )}
    </header>
  );
}

import type { ReactNode } from "react";

type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  size?: "sm" | "md" | "lg";
  action?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  size = "md",
  action,
  className = "",
}: SectionHeadingProps) {
  const headingSize = {
    sm: "text-2xl sm:text-3xl",
    md: "text-3xl sm:text-4xl lg:text-5xl",
    lg: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
  };

  const centered = align === "center";

  return (
    <div
      className={`
        ${centered ? "mx-auto text-center" : "text-left"}
        ${className}
      `}
    >
      <div
        className={`
          ${
            centered
              ? "flex flex-col items-center"
              : "flex flex-col"
          }
        `}
      >
        {badge && (
          <span className="gnpc-eyebrow">
            {badge}
          </span>
        )}

        <div
          className={`
            mt-3
            ${
              action
                ? "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
                : ""
            }
          `}
        >
          <div>
            <h2
              className={`
                gnpc-section-title
                ${headingSize[size]}
                ${centered ? "text-center" : ""}
              `}
            >
              {title}
            </h2>

            {description && (
              <p
                className={`
                  gnpc-section-description
                  ${
                    centered
                      ? "mx-auto text-center"
                      : ""
                  }
                `}
              >
                {description}
              </p>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

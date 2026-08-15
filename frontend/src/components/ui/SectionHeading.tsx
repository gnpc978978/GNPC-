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
        ? "text-3xl sm:text-5xl lg:text-6xl"
        : "text-3xl sm:text-4xl lg:text-5xl";

  return (
    <header
      className={[
        "relative w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {action ? (
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div
            className={[
              "min-w-0",
              "max-w-4xl",
              isCentered
                ? "lg:text-left"
                : "text-left",
            ].join(" ")}
          >
            {badge && (
              <div className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative h-[3px] w-12 overflow-hidden rounded-full bg-[#c8102e]"
                >
                  <span className="absolute inset-y-0 left-0 w-1/2 bg-[#c49a3a]" />
                </span>

                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#17324d]">
                  {badge}
                </span>
              </div>
            )}

            <h2
              className={[
                "font-black leading-[1.02] tracking-[-0.045em] text-[#18222d]",
                headingSize,
              ].join(" ")}
            >
              {title}
            </h2>

            {description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#697582] sm:text-lg sm:leading-8">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center lg:pb-1">
            {action}
          </div>
        </div>
      ) : (
        <div
          className={[
            "max-w-4xl",
            isCentered
              ? "mx-auto text-center"
              : "text-left",
          ].join(" ")}
        >
          {badge && (
            <div
              className={[
                "mb-4 flex items-center gap-3",
                isCentered
                  ? "justify-center"
                  : "justify-start",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="h-[3px] w-12 rounded-full bg-gradient-to-r from-[#c8102e] to-[#c49a3a]"
              />

              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#17324d]">
                {badge}
              </span>
            </div>
          )}

          <h2
            className={[
              "font-black leading-[1.02] tracking-[-0.045em] text-[#18222d]",
              headingSize,
            ].join(" ")}
          >
            {title}
          </h2>

          {description && (
            <p
              className={[
                "mt-5 max-w-3xl text-base leading-7 text-[#697582] sm:text-lg sm:leading-8",
                isCentered
                  ? "mx-auto"
                  : "",
              ].join(" ")}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </header>
  );
}

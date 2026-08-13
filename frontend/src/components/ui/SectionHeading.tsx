import type { ReactNode } from "react";

type SectionHeadingProps = {
  /*
   * Small uppercase label above the main heading.
   */
  badge?: string;

  /*
   * Main section heading.
   */
  title: string;

  /*
   * Supporting copy.
   */
  description?: string;

  /*
   * Standard alignment.
   */
  align?: "left" | "center";

  /*
   * Standard heading sizes.
   */
  size?: "sm" | "md" | "lg";

  /*
   * Optional action:
   *
   * Example:
   * <Button>View All</Button>
   */
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
        "w-full",
        isCentered ? "text-center" : "text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/*
       * EYEBROW
       *
       * Standard:
       * small uppercase label
       * GNPC Navy
       * horizontal accent line
       */}
      {badge ? (
        <div
          className={
            isCentered
              ? "flex justify-center"
              : "flex justify-start"
          }
        >
          <span className="gnpc-eyebrow">
            {badge}
          </span>
        </div>
      ) : null}

      {/*
       * Main heading + optional action.
       */}
      <div
        className={[
          "mt-3",

          action
            ? [
                "flex",
                "flex-col",
                "gap-5",
                "sm:flex-row",
                "sm:items-end",
                "sm:justify-between",
              ].join(" ")
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            isCentered ? "mx-auto" : "",
            "min-w-0",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <h2
            className={[
              "gnpc-section-title",
              headingSize,
              isCentered ? "text-center" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {title}
          </h2>

          {description ? (
            <p
              className={[
                "gnpc-section-description",
                isCentered ? "mx-auto text-center" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {description}
            </p>
          ) : null}
        </div>

        {/*
         * Optional section action.
         *
         * Example:
         * View All
         * Explore Gallery
         * See All Events
         */}
        {action ? (
          <div
            className={[
              "shrink-0",

              isCentered
                ? "sm:flex sm:justify-center"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {action}
          </div>
        ) : null}
      </div>
    </header>
  );
}

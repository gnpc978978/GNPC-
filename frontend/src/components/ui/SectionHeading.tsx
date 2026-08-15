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
        ? "text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
        : "text-3xl sm:text-4xl lg:text-[3.1rem]";

  const content = (
    <div
      className={[
        "min-w-0",
        isCentered
          ? "mx-auto max-w-4xl text-center"
          : "text-left",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badge ? (
        <div
          className={[
            "mb-4",
            "flex",
            "items-center",
            "gap-3",
            isCentered
              ? "justify-center"
              : "justify-start",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "h-px",
              "w-8",
              "shrink-0",
              "bg-[#155eef]",
              "sm:w-10",
            ].join(" ")}
          />

          <span
            className={[
              "text-[10px]",
              "font-extrabold",
              "uppercase",
              "tracking-[0.2em]",
              "text-[#155eef]",
              "sm:text-xs",
            ].join(" ")}
          >
            {badge}
          </span>

          {isCentered && (
            <span
              aria-hidden="true"
              className={[
                "h-px",
                "w-8",
                "shrink-0",
                "bg-[#155eef]",
                "sm:w-10",
              ].join(" ")}
            />
          )}
        </div>
      ) : null}

      <h2
        className={[
          "font-black",
          "leading-[1.08]",
          "tracking-[-0.035em]",
          "text-[#0b1f33]",
          headingSize,
        ].join(" ")}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={[
            "mt-4",
            "max-w-3xl",
            "text-[15px]",
            "leading-7",
            "text-slate-500",
            "sm:text-base",
            "sm:leading-8",
            isCentered
              ? "mx-auto text-center"
              : "text-left",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}

      {/* Editorial accent */}

      <div
        aria-hidden="true"
        className={[
          "mt-5",
          "flex",
          "items-center",
          "gap-1.5",
          isCentered
            ? "justify-center"
            : "justify-start",
        ].join(" ")}
      >
        <span className="h-1 w-9 rounded-full bg-[#155eef]" />

        <span className="h-1 w-2 rounded-full bg-[#c8102e]" />

        <span className="h-px w-12 bg-slate-200" />
      </div>
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

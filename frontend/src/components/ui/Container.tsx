import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;

  className?: string;

  size?: "sm" | "md" | "lg" | "xl" | "full";

  as?: "div" | "section" | "main";
};

export default function Container({
  children,
  className = "",
  size = "xl",
  as = "div",
}: ContainerProps) {
  const Component = as;

  const sizeClass =
    size === "sm"
      ? "max-w-3xl"
      : size === "md"
        ? "max-w-5xl"
        : size === "lg"
          ? "max-w-6xl"
          : size === "full"
            ? "max-w-full"
            : "max-w-7xl";

  return (
    <Component
      className={[
        /*
         * Global GNPC content container.
         */
        "mx-auto",
        "w-full",

        sizeClass,

        /*
         * Responsive page padding.
         */
        "px-4",
        "sm:px-6",
        "lg:px-8",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}

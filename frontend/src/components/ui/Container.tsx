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
            ? "max-w-none"
            : "max-w-[1280px]";

  return (
    <Component
      className={[
        "mx-auto w-full",
        sizeClass,
        "px-4",
        "sm:px-6",
        "md:px-8",
        "lg:px-10",
        "xl:px-12",
        "2xl:px-14",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}

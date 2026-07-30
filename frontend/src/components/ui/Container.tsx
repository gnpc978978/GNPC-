import { ReactNode } from "react";

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

  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <Component
      className={`
        mx-auto
        w-full
        ${sizes[size]}
        px-4
        sm:px-6
        lg:px-8
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;

  /*
   * GNPC public design system:
   * only two button variants.
   */
  variant?: "primary" | "outline";

  size?: "sm" | "md" | "lg";

  type?: "button" | "submit" | "reset";

  disabled?: boolean;

  loading?: boolean;
};

export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "gnpc-btn-primary"
      : "gnpc-btn-outline";

  const sizeClass =
    size === "sm"
      ? "gnpc-btn-sm"
      : size === "lg"
        ? "gnpc-btn-lg"
        : "gnpc-btn-md";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "gnpc-btn",
        variantClass,
        sizeClass,

        /*
         * Accessibility.
         */
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#0f4c81]",
        "focus-visible:ring-offset-2",

        /*
         * Disabled state.
         */
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className={[
              "h-4",
              "w-4",
              "animate-spin",
              "rounded-full",
              "border-2",
              "border-current",
              "border-t-transparent",
            ].join(" ")}
          />

          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

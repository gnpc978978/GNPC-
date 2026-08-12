import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  const variants = {
    primary: `
      border
      border-[#0f4c81]
      bg-[#0f4c81]
      text-white
      hover:border-[#0a3a61]
      hover:bg-[#0a3a61]
      hover:shadow-md
    `,

    secondary: `
      border
      border-slate-800
      bg-slate-800
      text-white
      hover:border-slate-900
      hover:bg-slate-900
      hover:shadow-md
    `,

    outline: `
      border
      border-[#0f4c81]
      bg-white
      text-[#0f4c81]
      hover:bg-[#0f4c81]
      hover:text-white
    `,

    ghost: `
      border
      border-transparent
      bg-transparent
      text-[#0f4c81]
      hover:bg-[#eaf3fa]
    `,
  };

  const sizes = {
    sm:
      "min-h-9 px-3.5 py-2 text-sm",

    md:
      "min-h-11 px-5 py-2.5 text-sm sm:text-base",

    lg:
      "min-h-12 px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition-all
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#0f4c81]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-current
              border-t-transparent
            "
          />

          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

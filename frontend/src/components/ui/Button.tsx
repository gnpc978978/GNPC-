"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "outline"
  | "soft"
  | "inverse"
  | "danger"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  className?: string;
};

type ButtonElementProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

type LinkElementProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
    href: string;
  };

export type ButtonProps = ButtonElementProps | LinkElementProps;

/**
 * GNPC public CTA system.
 *
 * Keep the actual geometry here so every CTA that uses <Button />
 * has the same height, radius, typography, icon spacing and motion.
 */
const baseClasses = [
  "gnpc-btn",
  "group",
  "relative",
  "inline-flex",
  "max-w-full",
  "min-h-11",
  "min-w-0",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "select-none",
  "rounded-[0.9rem]",
  "border",
  "px-5",
  "py-3",
  "text-sm",
  "font-bold",
  "leading-none",
  "tracking-[-0.01em]",
  "transition-all",
  "duration-200",
  "ease-out",
  "focus-visible:outline-none",
  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "[&_svg]:shrink-0",
  "[&_svg]:transition-transform",
  "[&_svg]:duration-200",
  "hover:[&_svg]:translate-x-0.5",
].join(" ");

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2.5 text-xs",
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-12 px-6 py-3.5 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[#d4b06a] bg-[#d4b06a] text-[#071a2e] shadow-[0_10px_28px_rgba(212,176,106,0.24)] hover:-translate-y-0.5 hover:border-[#e2c27d] hover:bg-[#e2c27d] hover:shadow-[0_15px_38px_rgba(212,176,106,0.30)]",
  outline:
    "border-[#b9c5d2] bg-white/85 text-[#0b1728] shadow-[0_8px_22px_rgba(7,26,46,0.06)] hover:-translate-y-0.5 hover:border-[#d4b06a] hover:bg-white hover:text-[#0b1728]",
  soft:
    "border-[#d8e1ea] bg-[#eaf0f6] text-[#0b1f3a] shadow-sm hover:-translate-y-0.5 hover:border-[#d4b06a]/60 hover:bg-white hover:shadow-md",
  inverse:
    "border-white/80 bg-white text-[#071a2e] shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:border-[#e2c27d] hover:bg-[#e2c27d] hover:text-[#071a2e]",
  danger:
    "border-red-600 bg-red-600 text-white shadow-sm hover:-translate-y-0.5 hover:border-red-700 hover:bg-red-700 hover:shadow-md",
  ghost:
    "border-transparent bg-transparent text-[#0b1f3a] shadow-none hover:bg-[#eaf0f6] hover:text-[#071a2e]",
};

function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    loadingText = "Loading...",
    className,
  } = props;

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = loading ? (
    <>
      <LoadingIndicator />
      <span className="min-w-0 truncate whitespace-nowrap">
        {loadingText}
      </span>
    </>
  ) : (
    <span className="relative z-10 inline-flex min-w-0 max-w-full items-center justify-center gap-2 whitespace-nowrap [&>svg]:shrink-0 [&>span]:min-w-0 [&>span]:truncate">
      {children}
    </span>
  );

  if ("href" in props && props.href) {
    const {
      href,
      target,
      rel,
      ariaLabel,
      ...linkProps
    } = props as LinkElementProps & {
      ariaLabel?: string;
    };

    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    disabled = false,
    onClick,
    ...buttonProps
  } = props as ButtonElementProps;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

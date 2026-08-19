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

export type ButtonProps =
  | ButtonElementProps
  | LinkElementProps;

const baseClasses = [
  "gnpc-btn",
  "group",
  "relative",
  "inline-flex",
  "min-h-12",
  "min-w-[11.5rem]",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "shrink-0",
  "select-none",
  "overflow-hidden",
  "rounded-full",
  "border",
  "px-6",
  "py-3.5",
  "text-sm",
  "font-extrabold",
  "leading-none",
  "tracking-[-0.01em]",
  "transition-all",
  "duration-300",
  "ease-out",
  "shadow-[0_10px_28px_rgba(23,23,23,0.10)]",
  "hover:-translate-y-0.5",
  "hover:shadow-[0_16px_36px_rgba(23,23,23,0.15)]",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-[#839669]",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
].join(" ");

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 min-w-[9.5rem] px-4 py-2.5 text-xs",
  md: "min-h-11 min-w-[10.5rem] px-5 py-3 text-sm",
  lg: "min-h-12 min-w-[11.5rem] px-6 py-3.5 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-black/10 bg-white text-[#171717] hover:bg-[#f7f2e9]",
  outline:
    "border-black/10 bg-white/75 text-[#171717] backdrop-blur-md hover:border-black/15 hover:bg-white",
  soft:
    "border-white/20 bg-white/90 text-[#171717] backdrop-blur-md hover:bg-white",
  inverse:
    "border-white/10 bg-white text-[#171717] hover:bg-[#f7f2e9]",
  danger:
    "border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
  ghost:
    "border-black/10 bg-white/70 text-[#171717] hover:bg-white",
};

function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function Button(
  props: ButtonProps
) {
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
      <span className="truncate">
        {loadingText}
      </span>
    </>
  ) : (
    <span className="relative z-10 inline-flex min-w-0 items-center gap-2 truncate">
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

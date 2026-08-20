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
  "max-w-full",
  "min-h-11",
  "min-w-0",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "select-none",
  "overflow-hidden",
  "rounded-lg",
  "border",
  "px-5",
  "py-3",
  "text-sm",
  "font-extrabold",
  "leading-none",
  "tracking-[-0.01em]",
  "transition-all",
  "duration-300",
  "ease-out",
  "shadow-[0_6px_18px_rgba(15,23,42,0.10)]",
  "hover:-translate-y-0.5",
  "hover:shadow-[0_12px_24px_rgba(15,23,42,0.14)]",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-[#155eef]",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
].join(" ");

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2.5 text-xs",
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-12 px-6 py-3.5 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[#155eef] bg-[#155eef] text-white hover:border-[#004eeb] hover:bg-[#004eeb]",
  outline:
    "border-[#155eef] bg-white text-[#155eef] hover:bg-blue-50",
  soft:
    "border-blue-100 bg-blue-50 text-[#0b3b83] hover:bg-blue-100",
  inverse:
    "border-white bg-white text-[#0b3b83] hover:bg-blue-50",
  danger:
    "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700",
  ghost:
    "border-transparent bg-transparent text-[#155eef] shadow-none hover:bg-blue-50",
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

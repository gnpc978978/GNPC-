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

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

type BaseProps = {
  children: ReactNode;

  variant?: ButtonVariant;
  size?: ButtonSize;

  loading?: boolean;
  loadingText?: string;

  className?: string;
};

type ButtonElementProps =
  BaseProps &
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "children"
    > & {
      href?: never;
    };

type LinkElementProps =
  BaseProps &
    Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "children"
    > & {
      href: string;
    };

export type ButtonProps =
  | ButtonElementProps
  | LinkElementProps;

const baseClasses = [
  "group",
  "relative",
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "overflow-hidden",
  "font-bold",
  "tracking-[-0.01em]",
  "transition-all",
  "duration-200",
  "ease-out",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-[#155eef]",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-55",
].join(" ");

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary: [
    "border",
    "border-[#0f4c81]",
    "bg-[#0f4c81]",
    "text-white",
    "shadow-[0_6px_18px_rgba(15,76,129,0.15)]",
    "hover:-translate-y-0.5",
    "hover:bg-[#0b3d68]",
    "hover:shadow-[0_10px_25px_rgba(15,76,129,0.22)]",
  ].join(" "),

  outline: [
    "border",
    "border-slate-200",
    "bg-white",
    "text-[#0f4c81]",
    "shadow-[0_2px_8px_rgba(15,23,42,0.035)]",
    "hover:-translate-y-0.5",
    "hover:border-[#b8c8d8]",
    "hover:bg-slate-50",
    "hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]",
  ].join(" "),

  soft: [
    "border",
    "border-blue-100",
    "bg-blue-50",
    "text-[#0f4c81]",
    "hover:-translate-y-0.5",
    "hover:border-blue-200",
    "hover:bg-blue-100/70",
  ].join(" "),

  inverse: [
    "border",
    "border-white/20",
    "bg-white",
    "text-[#0f4c81]",
    "shadow-[0_6px_20px_rgba(0,0,0,0.10)]",
    "hover:-translate-y-0.5",
    "hover:bg-slate-50",
  ].join(" "),

  danger: [
    "border",
    "border-red-600",
    "bg-red-600",
    "text-white",
    "shadow-[0_6px_18px_rgba(220,38,38,0.12)]",
    "hover:-translate-y-0.5",
    "hover:bg-red-700",
    "hover:shadow-[0_10px_25px_rgba(220,38,38,0.18)]",
  ].join(" "),

  ghost: [
    "border",
    "border-transparent",
    "bg-transparent",
    "text-slate-600",
    "hover:bg-slate-100",
    "hover:text-[#0f4c81]",
  ].join(" "),
};

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: [
    "min-h-9",
    "rounded-lg",
    "px-3.5",
    "text-xs",
  ].join(" "),

  md: [
    "min-h-11",
    "rounded-lg",
    "px-4.5",
    "text-sm",
    "sm:px-5",
  ].join(" "),

  lg: [
    "min-h-12",
    "rounded-xl",
    "px-5",
    "text-sm",
    "sm:px-6",
    "sm:text-[15px]",
  ].join(" "),
};

function getClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function LoadingIndicator() {
  return (
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

  const classes = getClassName(
    variant,
    size,
    className
  );

  const content = loading ? (
    <>
      <LoadingIndicator />

      <span>{loadingText}</span>
    </>
  ) : (
    <>
      <span className="relative z-10">
        {children}
      </span>

      {/* Premium hover sheen */}

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "-left-1/2",
          "top-0",
          "h-full",
          "w-1/3",
          "skew-x-[-20deg]",
          "bg-white/10",
          "opacity-0",
          "transition-all",
          "duration-500",
          "group-hover:left-[120%]",
          "group-hover:opacity-100",
        ].join(" ")}
      />
    </>
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
      disabled={
        disabled || loading
      }
      onClick={onClick}
      className={classes}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

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

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary: "gnpc-btn-primary",

  outline: "gnpc-btn-outline",

  soft: "gnpc-btn-soft",

  inverse: "gnpc-btn-inverse",

  danger: "gnpc-btn-danger",

  ghost: "gnpc-btn-ghost",
};

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: "gnpc-btn-sm",

  md: "gnpc-btn-md",

  lg: "gnpc-btn-lg",
};

function getClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return [
    "gnpc-btn",
    variantClasses[variant],
    sizeClasses[size],
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#c49a3a]",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
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
        "relative z-10",
        "h-4 w-4",
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

      <span className="relative z-10">
        {loadingText}
      </span>
    </>
  ) : (
    <span className="relative z-10">
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

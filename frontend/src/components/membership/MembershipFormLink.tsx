"use client";

import type {
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import {
  API_BASE_URL,
  apiUrl,
} from "@/services/api";

type MembershipFormLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children"
> & {
  children: ReactNode;
  unavailableLabel?: string;
  unavailableClassName?: string;
  className?: string;
};

const defaultAvailableClassName = [
  "gnpc-btn",
  "gnpc-btn-primary",
  "gnpc-btn-md",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-[#0f4c81]",
  "focus-visible:ring-offset-2",
].join(" ");

const defaultUnavailableClassName = [
  "gnpc-btn",
  "gnpc-btn-soft",
  "gnpc-btn-md",
  "cursor-not-allowed",
  "opacity-60",
].join(" ");

export default function MembershipFormLink({
  children,
  unavailableLabel = "Membership Form Coming Soon",
  unavailableClassName,
  className,
  ...props
}: MembershipFormLinkProps) {
  const {
    settings,
    loading,
    error,
  } = useWebsiteSettings();

  if (loading) {
    return (
      <span
        aria-disabled="true"
        className={
          unavailableClassName ||
          defaultUnavailableClassName
        }
      >
        Loading membership form...
      </span>
    );
  }

  const membershipAvailable =
    Boolean(
      settings.membershipPdf &&
        API_BASE_URL
    );

  if (
    error ||
    !membershipAvailable
  ) {
    return (
      <span
        aria-disabled="true"
        className={
          unavailableClassName ||
          defaultUnavailableClassName
        }
      >
        {unavailableLabel}
      </span>
    );
  }

  let membershipFormUrl: string;

  try {
    membershipFormUrl = apiUrl(
      "/settings/membership-form"
    );
  } catch {
    return (
      <span
        aria-disabled="true"
        className={
          unavailableClassName ||
          defaultUnavailableClassName
        }
      >
        {unavailableLabel}
      </span>
    );
  }

  return (
    <a
      href={membershipFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        defaultAvailableClassName
      }
      {...props}
    >
      {children}
    </a>
  );
}

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

type MembershipFormLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  children: ReactNode;
  unavailableLabel?: string;
  unavailableClassName?: string;
};

const membershipFormEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/settings/membership-form`;

export default function MembershipFormLink({
  children,
  unavailableLabel = "Membership Form Coming Soon",
  unavailableClassName,
  className,
  ...props
}: MembershipFormLinkProps) {
  const { settings, loading, error } = useWebsiteSettings();

  if (loading) {
    return <span aria-disabled="true" className={unavailableClassName}>{"Loading membership form..."}</span>;
  }

  if (error || !settings.membershipPdf) {
    return <span aria-disabled="true" className={unavailableClassName}>{unavailableLabel}</span>;
  }

  return <a href={membershipFormEndpoint} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}</a>;
}

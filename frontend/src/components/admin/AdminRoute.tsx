"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

interface Props {
  children: React.ReactNode;
}

type AuthResponse = {
  success: boolean;
  data?: {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

export default function AdminRoute({
  children,
}: Props) {
  const router = useRouter();
  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        if (
          process.env.NODE_ENV !==
          "production"
        ) {
          console.debug(
            "[auth] requesting /auth/me",
            {
              hasToken: Boolean(token),
            }
          );
        }

        const response =
          await authenticatedApiFetch(
            "/auth/me",
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const payload =
          await responseJson<AuthResponse>(
            response
          );

        if (
          cancelled
        ) {
          return;
        }

        if (
          !payload.success ||
          !payload.data
        ) {
          localStorage.removeItem(
            "token"
          );
          localStorage.removeItem(
            "user"
          );

          router.replace(
            "/admin/login"
          );

          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify(
            payload.data
          )
        );

        setChecking(false);
      } catch (error) {
        if (
          process.env.NODE_ENV !==
          "production"
        ) {
          console.debug(
            "[auth] /auth/me failed",
            error
          );
        }

        if (!cancelled) {
          localStorage.removeItem(
            "token"
          );
          localStorage.removeItem(
            "user"
          );

          router.replace(
            "/admin/login"
          );
        }
      }
    };

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Checking Authentication...
      </div>
    );
  }

  return <>{children}</>;
}

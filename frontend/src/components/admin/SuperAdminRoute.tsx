"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

type AuthenticatedUser = {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
};

type AuthResponse = {
  success: boolean;
  data?: AuthenticatedUser;
};

function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg border bg-white p-8 text-center shadow">
        <h1 className="mb-2 text-2xl font-bold">
          Access Denied
        </h1>

        <p className="text-gray-600">
          Admin Management is available only
          to Super Admin accounts. Please
          contact a Super Admin if you need
          access.
        </p>
      </div>
    </div>
  );
}

export default function SuperAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkRole = async () => {
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
            "[auth] requesting /auth/me for role check",
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

        setAllowed(
          payload.data.role ===
            "SUPER_ADMIN"
        );

        setChecking(false);
      } catch (error) {
        if (
          process.env.NODE_ENV !==
          "production"
        ) {
          console.debug(
            "[auth] role check failed",
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

    void checkRole();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Checking permissions...
      </div>
    );
  }

  return allowed ? (
    <>{children}</>
  ) : (
    <AccessDenied />
  );
}

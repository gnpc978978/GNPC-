"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (process.env.NODE_ENV !== "production") {
          console.debug("[auth] requesting /auth/me", {
            hasToken: Boolean(token),
          });
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const payload = await response.json();

        if (process.env.NODE_ENV !== "production") {
          console.debug("[auth] /auth/me completed", {
            status: response.status,
            success: payload.success,
          });
        }

        if (!response.ok || !payload.success || !payload.data) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/admin/login");
          return;
        }

        // Keep localStorage in sync
        localStorage.setItem(
          "user",
          JSON.stringify(payload.data)
        );

        setChecking(false);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[auth] /auth/me failed", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/admin/login");
      }
    };

    checkAuth();
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
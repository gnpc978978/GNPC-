"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthenticatedUser = {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
};

function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg border bg-white p-8 text-center shadow">
        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600">
          Admin Management is available only to Super Admin accounts.
          Please contact a Super Admin if you need access.
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

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem("token");

        if (process.env.NODE_ENV !== "production") {
          console.debug("[auth] requesting /auth/me for role check", {
            hasToken: Boolean(token),
          });
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
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
          console.debug("[auth] role check completed", {
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

        const user = payload.data;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setAllowed(user.role === "SUPER_ADMIN");
        setChecking(false);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[auth] role check failed", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/admin/login");
      }
    };

    checkRole();
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Checking permissions...
      </div>
    );
  }

  return allowed ? <>{children}</> : <AccessDenied />;
}
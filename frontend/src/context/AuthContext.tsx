"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role:
    | "ADMIN"
    | "SUPER_ADMIN";
  status?:
    | "ACTIVE"
    | "INACTIVE";
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: (
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState("");

  useEffect(() => {
    const storedToken =
      localStorage.getItem(
        "token"
      );

    if (!storedToken) {
      return;
    }

    setToken(storedToken);

    const verifySession =
      async () => {
        try {
          const response =
            await authenticatedApiFetch(
              "/auth/me"
            );

          const payload =
            await responseJson<{
              success: boolean;
              data: User;
            }>(response);

          if (
            !payload.success ||
            !payload.data
          ) {
            throw new Error(
              "Session expired"
            );
          }

          localStorage.setItem(
            "user",
            JSON.stringify(
              payload.data
            )
          );

          setUser(
            payload.data
          );
        } catch {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          setToken("");
          setUser(null);
        }
      };

    void verifySession();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const response =
        await apiFetch(
          "/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Login failed"
        );
      }

      if (!data.token) {
        throw new Error(
          "Token not received"
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      setToken(data.token);
      setUser(data.user);

      router.replace(
        "/admin/dashboard"
      );

      return true;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return false;
    }
  };

  const logout = () => {
    void apiFetch(
      "/auth/logout",
      {
        method: "POST",
      }
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken("");
    setUser(null);

    router.replace(
      "/admin/login"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return context;
}

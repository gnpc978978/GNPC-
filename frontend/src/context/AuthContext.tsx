"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status?: "ACTIVE" | "INACTIVE";
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
      localStorage.getItem("token");

    if (!storedToken) {
      return;
    }

    setToken(storedToken);

    // Always verify the user against
    // the database instead of trusting
    // cached localStorage role data.
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        credentials: "include",
        headers: {
          Authorization:
            `Bearer ${storedToken}`,
        },
      }
    )
      .then(async (response) => {
        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.data
        ) {
          throw new Error(
            "Session expired"
          );
        }

        return data.data;
      })
      .then((freshUser) => {
        localStorage.setItem(
          "user",
          JSON.stringify(freshUser)
        );

        setUser(freshUser);
      })
      .catch(() => {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setToken("");
        setUser(null);
      });
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const res =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email:
                email.trim().toLowerCase(),
              password,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
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
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      router.replace(
        "/admin/dashboard"
      );

      return true;
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      return false;
    }
  };

  const logout = () => {
    void fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
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

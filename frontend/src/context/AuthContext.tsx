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
  role: string;
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
  createContext<AuthContextType | null>(null);


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string>("");


  useEffect(() => {

    const storedToken =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");


    if (storedToken) {
      setToken(storedToken);
    }


    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }

  }, []);



  const login = async (
    email: string,
    password: string
  ) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
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


      // Save token
      localStorage.setItem(
        "token",
        data.token
      );


      // Save user
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
    void fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: "POST", credentials: "include" });

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

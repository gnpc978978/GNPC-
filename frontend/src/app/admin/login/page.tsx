"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  console.log(
    "API:",
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
  );

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      }
    );


    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);


    if (response.ok && typeof data.token === "string" && data.token) {

  console.log("BEFORE REDIRECT");


  localStorage.setItem(
    "token",
    data.token
  );


  localStorage.setItem("user", JSON.stringify(data.user ?? null));


  router.replace(
    "/admin/dashboard"
  );


  router.refresh();


  console.log("AFTER REDIRECT");

} else {

  alert(data.message || "Login Failed: no authentication token received.");

}


  } catch (error) {

    console.error("Login Error:", error);

    alert("Something went wrong");

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-white px-6 py-10">

      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl"></div>

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid-cols-2">

        {/* LEFT PANEL */}

        <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-14 text-white lg:flex lg:flex-col lg:justify-between">

          <div>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
              <FaUserShield className="text-4xl text-blue-400" />
            </div>

            <h1 className="mt-10 text-5xl font-bold leading-tight">
              Press Club
              <br />
              Admin Portal
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Manage press releases, press conferences,
              events, Executive Committee,
              gallery, advertisements and website settings
              from one secure dashboard.
            </p>

          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              <FaCheckCircle className="text-xl text-green-400" />
              <div>
                <h3 className="font-semibold">
                  Secure Authentication
                </h3>
                <p className="text-sm text-slate-300">
                  JWT based login security.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              <FaCheckCircle className="text-xl text-green-400" />
              <div>
                <h3 className="font-semibold">
                  Role Based Access
                </h3>
                <p className="text-sm text-slate-300">
                  Super Admin & Admin permissions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              <FaCheckCircle className="text-xl text-green-400" />
              <div>
                <h3 className="font-semibold">
                  Media Management

                </h3>
                <p className="text-sm text-slate-300">
                 Publish and manage press activities efficiently.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400">
                Greater Noida Press Club
              </p>

              <p className="mt-2 text-xs text-slate-500">
                © 2026 All Rights Reserved
                Official Administration Portal
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center p-8 lg:p-14">

          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl">
                <FaUserShield className="text-4xl" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="mt-3 text-slate-500">
              Sign in to continue to the Press Club Admin Panel
            </p>

            <form
             onSubmit={handleLogin}
             className="mt-10 space-y-6">
                          {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      bg-white
                      py-4
                      pl-12
                      pr-4
                      text-slate-700
                      outline-none
                      transition
                      focus:border-blue-600
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      bg-white
                      py-4
                      pl-12
                      pr-14
                      text-slate-700
                      outline-none
                      transition
                      focus:border-blue-600
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Remember Me
                </label>

                <button
                  type="button"
                  onClick={() => router.push("/admin/forgot-password")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  bg-blue-600
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>


          </div>

        </div>

      </div>

    </div>
  );
}

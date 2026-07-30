"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");


    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }


    setLoading(true);


    const success = await login(
      email,
      password
    );


    if (!success) {
      setError(
        "Invalid email or password"
      );
    }


    setLoading(false);
  };


  return (
    <div
      className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-8
        shadow-xl
      "
    >

      <div className="text-center">

        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-blue-100
            text-blue-600
          "
        >
          <Lock size={28} />
        </div>


        <h1
          className="
            mt-5
            text-3xl
            font-extrabold
            text-slate-900
          "
        >
          Admin Login
        </h1>


        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Greater Noida Press Club Admin Panel
        </p>

      </div>


      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Email Address
          </label>


          <div className="relative">

            <Mail
              size={20}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@example.com"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

        </div>



        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Password
          </label>


          <div className="relative">

            <Lock
              size={20}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-12
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                hover:text-slate-700
              "
            >
              {
                showPassword
                ?
                <EyeOff size={20}/>
                :
                <Eye size={20}/>
              }

            </button>

          </div>

        </div>


        {
          error && (
            <p
              className="
                text-sm
                font-medium
                text-red-600
              "
            >
              {error}
            </p>
          )
        }


        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Login
        </Button>


      </form>

    </div>
  );
}
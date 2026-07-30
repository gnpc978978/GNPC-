import Link from "next/link";
import { FaHome, FaShieldAlt } from "react-icons/fa";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <FaShieldAlt className="text-xl" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Forgot your password? Please contact the administrator.
        </p>

        <div className="mt-7 flex items-center justify-center gap-5 text-sm font-medium">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700 hover:underline"
          >
            <FaHome aria-hidden="true" />
            Back to Home
          </Link>
          <Link href="/admin/login" className="text-blue-700 hover:underline">
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

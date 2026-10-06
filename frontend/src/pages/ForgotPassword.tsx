import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Development only.
  // We'll remove this once real reset emails are connected.
  const [developmentToken, setDevelopmentToken] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setDevelopmentToken("");

    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email: cleanEmail,
        }
      );

      setMessage(
        response.data.message ||
          "Password reset instructions have been requested."
      );

      if (
        response.data.development?.resetToken
      ) {
        setDevelopmentToken(
          response.data.development.resetToken
        );
      }
    } catch (error: any) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* Left branding panel */}
      <section className="hidden lg:flex lg:w-[46%] bg-[#0f172a] text-white p-14 xl:p-16 flex-col justify-between relative overflow-hidden">

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-cyan-400/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                CareerTrack SA
              </h1>
              <p className="text-xs text-slate-400">
                Career Management Platform
              </p>
            </div>
          </div>

          <div className="mt-24 max-w-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
              <KeyRound
                className="text-blue-400"
                size={26}
              />
            </div>

            <h2 className="mt-7 text-4xl font-bold leading-tight">
              Recover access to your
              <span className="text-blue-400">
                {" "}career workspace.
              </span>
            </h2>

            <p className="mt-5 text-slate-300 text-lg leading-8">
              Request a secure password reset
              and get back to managing your
              applications, interviews and
              opportunities.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={17} />
          Password reset links expire for your
          protection
        </div>
      </section>


      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h1 className="font-bold text-[#0f172a]">
                CareerTrack SA
              </h1>
              <p className="text-xs text-[#64748b]">
                Career Management Platform
              </p>
            </div>
          </div>


          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-blue-600 mb-8"
          >
            <ArrowLeft size={17} />
            Back to sign in
          </Link>


          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600 mb-2">
              PASSWORD RECOVERY
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              Forgot your password?
            </h2>

            <p className="mt-3 text-[#64748b] leading-7">
              Enter the email address associated
              with your account and we'll help
              you reset your password.
            </p>
          </div>


          {error && (
            <div
              role="alert"
              className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </div>
          )}


          {message && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-xl">
              <div className="flex gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                />

                <div>
                  <p className="font-semibold text-sm">
                    Request received
                  </p>
                  <p className="text-sm mt-1">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#334155] mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 pl-11 pr-4 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send reset instructions
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>


          {/* DEVELOPMENT ONLY */}
          {developmentToken && (
            <div className="mt-6 border border-amber-200 bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900">
                Development mode
              </p>

              <p className="text-sm text-amber-800 mt-1">
                Email delivery is not connected
                yet. Continue to the reset page
                using the temporary development
                token.
              </p>

              <Link
                to={`/reset-password/${developmentToken}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Continue to reset password
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
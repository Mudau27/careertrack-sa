import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSearch,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(
    Boolean(localStorage.getItem("rememberedEmail"))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("No authentication token returned.");
      }

      localStorage.setItem("token", token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", cleanEmail);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* =========================================
            LEFT SIDE - PRODUCT / BRAND
        ========================================== */}
        <section className="hidden lg:flex relative overflow-hidden bg-[#0f172a] text-white p-12 xl:p-16 flex-col justify-between">

          {/* Background decoration */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10" />
          <div className="absolute bottom-10 -left-32 w-96 h-96 rounded-full bg-cyan-400/5" />

          <div className="relative z-10">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-950/30">
                <BriefcaseBusiness
                  size={23}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  CareerTrack SA
                </h1>

                <p className="text-xs text-slate-400">
                  Career Management Platform
                </p>
              </div>
            </div>

            {/* Hero */}
            <div className="mt-20 max-w-xl">

              <div className="inline-flex items-center gap-2 border border-blue-400/20 bg-blue-500/10 rounded-full px-3 py-1.5 text-sm text-blue-200">
                <Sparkles size={15} />
                Your career, organized
              </div>

              <h2 className="mt-6 text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Turn your job search into a
                <span className="text-blue-400">
                  {" "}clear career strategy.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300 max-w-lg">
                Discover opportunities, track applications,
                prepare for interviews and improve your CV
                from one workspace.
              </p>

              {/* Features */}
              <div className="mt-10 grid gap-5">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <BriefcaseBusiness
                      size={19}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Organize every application
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Keep jobs, application statuses and
                      interviews together.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileSearch
                      size={19}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Analyze your CV
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Compare your CV with job descriptions
                      using ATS-style analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <BarChart3
                      size={19}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Understand your progress
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Use your dashboard to follow application
                      activity and interview progress.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck size={17} />
            Secure authentication and protected account access
          </div>
        </section>


        {/* =========================================
            RIGHT SIDE - LOGIN
        ========================================== */}
        <main className="flex items-center justify-center px-5 sm:px-8 py-10">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
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


            {/* Heading */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-[#64748b]">
                Continue managing your applications,
                interviews and career progress.
              </p>
            </div>


            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 border border-red-200 bg-red-50 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}


            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
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
                    className="w-full h-12 pl-11 pr-4 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>


              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#334155]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full h-12 pl-11 pr-12 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>


              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 rounded border-[#cbd5e1] accent-blue-600"
                  />

                  <span className="text-sm text-[#475569]">
                    Remember my email
                  </span>
                </label>
              </div>


              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>


            {/* Create account */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#64748b]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>


            {/* Security */}
            <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
              <div className="flex justify-center items-center gap-2 text-xs text-[#94a3b8]">
                <CheckCircle2 size={14} />
                Secure access to your CareerTrack SA account
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
};

export default Login;
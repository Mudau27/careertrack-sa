import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSearch,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
      });

      /*
       * Registration currently does not return
       * a JWT, so send the new user to login.
       */
      navigate("/login", {
        state: {
          registered: true,
          email: cleanEmail,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* =========================================
            LEFT SIDE
        ========================================== */}

        <section className="hidden lg:flex relative overflow-hidden bg-[#0f172a] text-white p-12 xl:p-16 flex-col justify-between">

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
                Build your career workspace
              </div>

              <h2 className="mt-6 text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Take control of your
                <span className="text-blue-400">
                  {" "}career journey.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300 max-w-lg">
                Create your workspace to discover
                jobs, track applications, prepare
                for interviews and improve your CV.
              </p>

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
                      Track your opportunities
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Save jobs and follow every
                      application from one place.
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
                      Improve your CV
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Compare your CV against job
                      descriptions using ATS-style
                      analysis.
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
                      Measure your progress
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Follow your applications,
                      interviews and career activity.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck size={17} />
            Secure account creation and protected access
          </div>
        </section>


        {/* =========================================
            REGISTER FORM
        ========================================== */}

        <main className="flex items-center justify-center px-5 sm:px-8 py-10">

          <div className="w-full max-w-md">

            {/* Mobile brand */}

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

            <div className="mb-7">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                GET STARTED
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
                Create your account
              </h2>

              <p className="mt-3 text-[#64748b]">
                Start organizing your job search
                and career progress.
              </p>
            </div>


            {error && (
              <div
                role="alert"
                className="mb-5 border border-red-200 bg-red-50 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}


            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#334155] mb-2"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Your full name"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>


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
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#334155] mb-2"
                >
                  Password
                </label>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a password"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>


              {/* Confirm password */}

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-[#334155] mb-2"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    required
                    className="w-full h-12 pl-11 pr-12 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>


              {/* Password indicators */}

              {password && (
                <div className="grid grid-cols-2 gap-2 text-xs">

                  <div
                    className={`flex items-center gap-1.5 ${
                      hasEightCharacters
                        ? "text-emerald-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <Check size={14} />
                    8+ characters
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      hasUppercase
                        ? "text-emerald-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <Check size={14} />
                    Uppercase letter
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      hasLowercase
                        ? "text-emerald-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <Check size={14} />
                    Lowercase letter
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      hasNumber
                        ? "text-emerald-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <Check size={14} />
                    Number
                  </div>

                  <div
                    className={`col-span-2 flex items-center gap-1.5 ${
                      passwordsMatch
                        ? "text-emerald-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <Check size={14} />
                    Passwords match
                  </div>

                </div>
              )}


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>


            {/* Login link */}

            <div className="mt-7 text-center">
              <p className="text-sm text-[#64748b]">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>


            <div className="mt-7 pt-6 border-t border-[#e2e8f0]">
              <div className="flex justify-center items-center gap-2 text-xs text-[#94a3b8]">
                <CheckCircle2 size={14} />
                Your password is securely encrypted
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
};

export default Register;
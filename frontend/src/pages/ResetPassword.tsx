import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const hasEightCharacters =
    password.length >= 8;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(true);

      // Send user back to login shortly
      // after successful password reset.
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (error: any) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* Branding */}
      <section className="hidden lg:flex lg:w-[46%] bg-[#0f172a] text-white p-14 xl:p-16 flex-col justify-between relative overflow-hidden">

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10" />

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
              <LockKeyhole
                size={26}
                className="text-blue-400"
              />
            </div>

            <h2 className="mt-7 text-4xl font-bold leading-tight">
              Create a new
              <span className="text-blue-400">
                {" "}secure password.
              </span>
            </h2>

            <p className="mt-5 text-lg text-slate-300 leading-8">
              Choose a new password for your
              CareerTrack SA account and continue
              managing your career journey.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={17} />
          Your reset token can only be used once
        </div>
      </section>


      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">

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


          {!success ? (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  RESET PASSWORD
                </p>

                <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                  Choose a new password
                </h2>

                <p className="mt-3 text-[#64748b]">
                  Enter and confirm your new
                  account password.
                </p>
              </div>


              {error && (
                <div
                  role="alert"
                  className="mb-5 border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </div>
              )}


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-semibold text-[#334155] mb-2"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                    />

                    <input
                      id="new-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Create a new password"
                      required
                      className="w-full h-12 pl-11 pr-12 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
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


                {/* Confirm */}
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
                      placeholder="Confirm your new password"
                      required
                      className="w-full h-12 pl-11 pr-12 border border-[#cbd5e1] rounded-xl bg-white text-[#0f172a] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
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


                {/* Requirements */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-[#334155]">
                    Password requirements
                  </p>

                  <div
                    className={`flex items-center gap-2 text-sm ${
                      hasEightCharacters
                        ? "text-emerald-600"
                        : "text-[#64748b]"
                    }`}
                  >
                    <Check size={16} />
                    At least 8 characters
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordsMatch
                        ? "text-emerald-600"
                        : "text-[#64748b]"
                    }`}
                  >
                    <Check size={16} />
                    Passwords match
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>
            </>
          ) : (
            <div className="text-center">

              <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={31} />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-[#0f172a]">
                Password updated
              </h2>

              <p className="mt-3 text-[#64748b] leading-7">
                Your password has been reset
                successfully. Redirecting you to
                sign in...
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in now
                <ArrowRight size={17} />
              </Link>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
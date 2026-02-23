"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/features";
import { selectAuth } from "@/lib/features/auth/selectors";
import { clearError } from "@/lib/features/auth";
import { signUp } from "@/lib/features/auth/thunks";
import { selectAuthForm, setField, setErrors, resetForm } from "@/lib/features/forms/signUpForm";
import { AppleIcon, EyeIcon, EyeOffIcon, GoogleIcon, Spinner } from "@/components/ui/icons";

function SignUpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectAuth);
  const form = useSelector(selectAuthForm);
  const {
    firstName,
    lastName, username,
    email,
    password,
    confirmPw,
    showPassword,
    capsLock,
    fieldErrors
  } = form;

  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  // hydration-safe loading UI
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLoadingUI = mounted && loading;

  useEffect(() => { firstRef.current?.focus(); }, []);

  function validate() {
    const errs: typeof fieldErrors = {};
    if (!firstName.trim()) errs.first = "Please enter your first name.";
    if (!lastName.trim()) errs.last = "Please enter your last name.";
    if (!username.trim()) errs.user = "Please choose a username.";
    if (!email.trim()) errs.mail = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.mail = "Please enter a valid email address.";
    if (!password) errs.pwd = "Please create a password.";
    if (password && password.length < 8) errs.pwd = "Password must be at least 8 characters.";
    if (!confirmPw) errs.cpwd = "Please confirm your password.";
    if (password && confirmPw && password !== confirmPw) errs.cpwd = "Passwords do not match.";

    dispatch(setErrors(errs));
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (error) dispatch(clearError());
    if (!validate()) return;

    const result = await dispatch(signUp({ firstName, lastName, username, email, password }));
    if (signUp.fulfilled.match(result)) {
      dispatch(resetForm());
      router.push(redirect);
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0a0e16] to-black text-slate-100 text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <header className="mb-6 text-center sm:mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create account</h1>
              <p className="mt-2 text-sm text-slate-400">Join us — fill in your details to continue.</p>
            </header>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400 px-3 pb-3">sign up with email</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {/* First & last name */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm text-slate-300">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={firstRef}
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => dispatch(setField({ field: "firstName", value: e.target.value }))}
                    aria-invalid={!!fieldErrors.first}
                    aria-describedby={fieldErrors.first ? "first-err" : undefined}
                    className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.first ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                      }`}
                    placeholder="John"
                    required
                  />
                  {fieldErrors.first && <p id="first-err" className="mt-1 text-xs text-red-300">{fieldErrors.first}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm text-slate-300">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={lastRef}
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => dispatch(setField({ field: "lastName", value: e.target.value }))}
                    aria-invalid={!!fieldErrors.last}
                    aria-describedby={fieldErrors.last ? "last-err" : undefined}
                    className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.last ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                      }`}
                    placeholder="Doe"
                    required
                  />
                  {fieldErrors.last && <p id="last-err" className="mt-1 text-xs text-red-300">{fieldErrors.last}</p>}
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-1 block text-sm text-slate-300">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => dispatch(setField({ field: "username", value: e.target.value }))}
                  aria-invalid={!!fieldErrors.user}
                  aria-describedby={fieldErrors.user ? "user-err" : undefined}
                  className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.user ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                    }`}
                  placeholder="johndoe"
                  required
                />
                {fieldErrors.user && <p id="user-err" className="mt-1 text-xs text-red-300">{fieldErrors.user}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => dispatch(setField({ field: "email", value: e.target.value }))}
                  aria-invalid={!!fieldErrors.mail}
                  aria-describedby={fieldErrors.mail ? "mail-err" : undefined}
                  className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.mail ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                    }`}
                  placeholder="you@example.com"
                  required
                />
                {fieldErrors.mail && <p id="mail-err" className="mt-1 text-xs text-red-300">{fieldErrors.mail}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm text-slate-300">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => dispatch(setField({ field: "showPassword", value: !showPassword }))}
                    className="text-xs text-slate-400 hover:text-slate-200"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => dispatch(setField({ field: "password", value: e.target.value }))}
                    onKeyUp={(e) =>
                      dispatch(setField({ field: "capsLock", value: (e as any).getModifierState?.("CapsLock") || false }))
                    }
                    aria-invalid={!!fieldErrors.pwd}
                    aria-describedby={fieldErrors.pwd ? "pwd-err" : capsLock ? "capswarn" : undefined}
                    className={`block w-full rounded-xl border bg-black/30 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.pwd ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                      }`}
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setField({ field: "showPassword", value: !showPassword }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {capsLock && !fieldErrors.pwd && (
                  <p id="capswarn" className="mt-1 text-xs text-amber-300">Caps Lock is on.</p>
                )}
                {fieldErrors.pwd && <p id="pwd-err" className="mt-1 text-xs text-red-300">{fieldErrors.pwd}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm" className="mb-1 block text-sm text-slate-300">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPw}
                  onChange={(e) => dispatch(setField({ field: "confirmPw", value: e.target.value }))}
                  aria-invalid={!!fieldErrors.cpwd}
                  aria-describedby={fieldErrors.cpwd ? "cpwd-err" : undefined}
                  className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.cpwd ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                    }`}
                  placeholder="••••••••"
                  required
                />
                {fieldErrors.cpwd && <p id="cpwd-err" className="mt-1 text-xs text-red-300">{fieldErrors.cpwd}</p>}
              </div>

              {/* Error box from Redux auth */}
              <div aria-live="polite" className="min-h-[1.5rem]">
                {error && (
                  <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                    <button
                      type="button"
                      onClick={() => dispatch(clearError())}
                      className="ml-3 text-xs underline decoration-red-400/60 underline-offset-4 hover:text-red-100"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoadingUI}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2" role={isLoadingUI ? "status" : undefined} aria-live={isLoadingUI ? "polite" : undefined}>
                  {isLoadingUI ? (
                    <>
                      <Spinner /> Creating account...
                    </>
                  ) : (
                    <>
                      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current opacity-90">
                        <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3z" />
                      </svg>
                      Create account
                    </>
                  )}
                </span>
              </button>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = encodeURIComponent(redirect);
                    window.location.href = `${API_BASE}/api/v1/auth/signin/google/start?next=${next}`;
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm hover:bg-black/40"
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm opacity-50"
                  title="Coming soon"
                >
                  <AppleIcon /> Continue with Apple
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline decoration-slate-600 underline-offset-4 hover:text-slate-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline decoration-slate-600 underline-offset-4 hover:text-slate-300">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center text-slate-300">Loading…</main>}>
      <SignUpClient />
    </Suspense>
  );
}

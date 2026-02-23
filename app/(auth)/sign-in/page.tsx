"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/features";
import { selectAuth } from "@/lib/features/auth/selectors";
import { clearError } from "@/lib/features/auth";
import { signIn } from "@/lib/features/auth/thunks";
import { selectSignInForm, setField, setErrors, resetForm } from "@/lib/features/forms/signInForm";
import { EyeIcon, EyeOffIcon, GoogleIcon, Spinner } from "@/components/ui/icons";

function SignInClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector(selectAuth);
    const { identifier, password, rememberMe, showPassword, capsLock, fieldErrors } =
        useSelector(selectSignInForm);

    const idRef = useRef<HTMLInputElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    // hydration-safe loading UI + stable DOM
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isLoadingUI = mounted && loading;

    // focus first field
    useEffect(() => { idRef.current?.focus(); }, []);

    // sync rememberMe with localStorage (UX nicety)
    useEffect(() => {
        const v = localStorage.getItem("rememberMe");
        if (v !== null) dispatch(setField({ field: "rememberMe", value: v === "true" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        localStorage.setItem("rememberMe", String(rememberMe));
    }, [rememberMe]);

    function validate() {
        const errs: typeof fieldErrors = {};
        if (!identifier.trim()) errs.id = "Please enter your email or username.";
        if (!password) errs.pwd = "Please enter your password.";
        dispatch(setErrors(errs));
        return Object.keys(errs).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        if (error) dispatch(clearError());

        if (!validate()) {
            // focus first invalid
            if (!identifier.trim()) idRef.current?.focus();
            else if (!password) pwdRef.current?.focus();
            return;
        }

        const result = await dispatch(signIn({ identifier: identifier.trim(), password, rememberMe }));
        if (signIn.fulfilled.match(result)) {
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
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sign in</h1>
                            <p className="mt-2 text-sm text-slate-400">Welcome back to creaive.ai.</p>
                        </header>

                        {/* SSO: Google */}
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const next = encodeURIComponent(redirect);
                                    window.location.href = `${API_BASE}/api/v1/auth/signin/google/start?next=${next}`;
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm hover:bg-black/40"
                            >
                                <GoogleIcon /> Continue with Google
                            </button>
                        </div>

                        <div className="my-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs text-slate-400 px-3 pb-3">sign in with email</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <form onSubmit={onSubmit} noValidate className="space-y-4">
                            {/* Identifier */}
                            <div>
                                <label htmlFor="identifier" className="mb-1 block text-sm text-slate-300">
                                    Email or Username
                                </label>
                                <input
                                    ref={idRef}
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    autoComplete="username email"
                                    value={identifier}
                                    onChange={(e) => dispatch(setField({ field: "identifier", value: e.target.value }))}
                                    onKeyDown={(e) => { if (e.key === "Enter") pwdRef.current?.focus(); }}
                                    aria-invalid={!!fieldErrors.id}
                                    aria-describedby={fieldErrors.id ? "id-error" : undefined}
                                    className={`block w-full rounded-xl border bg-black/30 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${fieldErrors.id ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400"
                                        }`}
                                    placeholder="you@example.com or johndoe"
                                />
                                {fieldErrors.id && (
                                    <p id="id-error" className="mt-1 text-xs text-red-300">{fieldErrors.id}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm text-slate-300">Password</label>
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
                                        ref={pwdRef}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => dispatch(setField({ field: "password", value: e.target.value }))}
                                        onKeyUp={(e) => dispatch(setField({
                                            field: "capsLock",
                                            value: (e as any).getModifierState?.("CapsLock") || false
                                        }))}
                                        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(e as any); }}
                                        aria-invalid={!!fieldErrors.pwd}
                                        aria-describedby={fieldErrors.pwd ? "pwd-error" : capsLock ? "capswarn" : undefined}
                                        className={`block w-full rounded-xl border bg-black/30 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fieldErrors.pwd ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40"
                                            }`}
                                        placeholder="••••••••"
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
                                {fieldErrors.pwd && (
                                    <p id="pwd-error" className="mt-1 text-xs text-red-300">{fieldErrors.pwd}</p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => dispatch(setField({ field: "rememberMe", value: e.target.checked }))}
                                        className="h-4 w-4 rounded border-white/10 bg-black/30 text-indigo-500 focus:ring-indigo-500"
                                    />
                                    Remember me
                                </label>
                                {/* <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot password?</Link> */}
                            </div>

                            {/* Error from auth slice */}
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

                            {/* Stable button structure to avoid hydration mismatch */}
                            <button
                                type="submit"
                                disabled={isLoadingUI}
                                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="inline-flex items-center gap-2" role={isLoadingUI ? "status" : undefined} aria-live={isLoadingUI ? "polite" : undefined}>
                                    {isLoadingUI ? (
                                        <>
                                            <Spinner /> Signing in...
                                        </>
                                    ) : (
                                        <>Continue</>
                                    )}
                                </span>
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<main className="min-h-screen grid place-items-center text-slate-300">Loading…</main>}>
            <SignInClient />
        </Suspense>
    );
}

// =============================================
// components/SignOutButton.tsx — Client component
// =============================================
"use client";
import React from "react";
import { useRouter } from "next/navigation";


export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);


    async function onSignOut() {
        try {
            setLoading(true);
            await fetch("/api/v1/auth/signout", { method: "POST", credentials: "include" });
            router.push("/auth/sign-in");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }


    return (
        <button
            onClick={onSignOut}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 shadow hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? (
                <>
                    <Spinner /> Signing out...
                </>
            ) : (
                <>
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current opacity-90"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H10a2 2 0 0 0-2 2v4h2V5h10v14H10v-4H8v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" /></svg>
                    Sign out
                </>
            )}
        </button>
    );
}


function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
    );
}
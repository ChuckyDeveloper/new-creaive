// app/(app)/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/app/api/v1/lib/jwt";
import AuthHydrator from "./AuthHydrator";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    noStore();

    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        redirect("/sign-in?redirect=/dashboard");
    }

    let claims: { sub: string; role: string; username?: string; email: string };
    try {
        claims = verifySession(token);
    } catch {
        redirect("/sign-in?redirect=/dashboard");
    }

    const allowed = ['user', 'admin', 'manager', 'master'];
    if (!allowed.includes(claims.role)) redirect('/403');

    const user = {
        _id: claims.sub,
        name: claims.username || (claims.email?.split("@")[0] ?? "User"),
        email: claims.email,
        roles: [claims.role].filter(Boolean),
    };

    return (
        <>
            <AuthHydrator user={user} />

            <div className="space-y-6 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
                    <h1 className="text-2xl font-semibold">
                        Welcome back, {user.name}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        You are signed in as <span className="font-medium text-slate-200">{user.email}</span>{' '}
                        ({user.roles.join(", ") || "user"}).
                    </p>
                </div>
            </div>
        </>
    );
}

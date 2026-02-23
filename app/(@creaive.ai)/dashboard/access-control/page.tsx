// app/(...)/dashboard/access-control/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "../../../../app/api/v1/lib/jwt";
import UsersTable from "./user-table";


export const dynamic = "force-dynamic";

export default function AccessControlPage() {
  const token = cookies().get("session")?.value || null;
  if (!token) redirect("/sign-in");

  let role: string | null = null;
  try {
    const claims = verifySession(token);
    role = (claims as any)?.role || null;
  } catch {
    redirect("/sign-in");
  }

  if (role !== "master") {
    // อนุญาตเฉพาะ master
    redirect("/dashboard/");
  }

  return (
    <main className="text-slate-100 text-white">
      <h1 className="text-2xl font-semibold">Access Control</h1>
      <p className="mt-1 text-sm text-slate-400">Manage user roles (master only).</p>
      <div className="lg:mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur">
        <UsersTable />
      </div>
    </main>
  );
}
"use client";
export type Role = "user" | "manager" | "admin" | "master";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  FaHome,
  FaInbox,
  FaRegImage,
  FaUserShield,
  FaBloggerB,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

import { MdContentCopy } from "react-icons/md";

type NavItem = {
  href: string;
  label: string;
  icon: JSX.Element;
  roles: Role[]; // which roles can see this item
};

const items: NavItem[] = [
  {
    href: "/dashboard/",
    label: "OVERVIEW",
    icon: <FaHome className="w-5 h-5" />,
    roles: ["manager", "admin", "master"],
  },
  {
    href: "/dashboard/mailbox",
    label: "MAILS BOX",
    icon: <FaInbox className="w-5 h-5" />,
    roles: ["master"],
  },
  {
    href: "/dashboard/felicitate",
    label: "FELICITATE",
    icon: <FaRegImage className="w-5 h-5" />,
    roles: ["manager", "admin", "master"],
  },
  // { href: "/dashboard/blog", label: "BLOG", icon: <FaBloggerB className="w-5 h-5" />, roles: ["admin", "master"] },
  {
    href: "/dashboard/brands",
    label: "BRAND LIST",
    icon: <FaUserGroup className="w-5 h-5" />,
    roles: ["admin", "master"],
  },
  {
    href: "/dashboard/product-content",
    label: "PRODUCT CONTENT",
    icon: <MdContentCopy className="w-5 h-5" />,
    roles: ["admin", "master"],
  },
  {
    href: "/dashboard/access-control",
    label: "ACCESS CONTROL",
    icon: <FaUserShield className="w-5 h-5" />,
    roles: ["admin", "master"],
  },
];

function Sidebar({
  role,
  onLinkClick,
}: {
  role: Role | null;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const visibleItems = role
    ? items.filter((it) => it.roles.includes(role))
    : [];

  return (
    <aside className="h-full bg-black lg:bg-white/[0.04] border-r border-white/10 text-slate-200 text-white">
      <div className="px-5 py-4 text-[1.2rem] tracking-[0.18em] text-slate-400">
        DASHBOARD
      </div>
      <nav className="pb-4">
        {visibleItems.map((it) => {
          const norm = (p: string) =>
            p.endsWith("/") && p !== "/" ? p.replace(/\/+$/, "") : p;
          const active = norm(pathname) === norm(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onLinkClick}
              className={[
                "relative mx-2 mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
                active
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                  : "hover:bg-white/10 text-slate-300 border border-transparent",
              ].join(" ")}
            >
              <span
                className={[
                  "shrink-0",
                  active
                    ? "text-indigo-300"
                    : "text-slate-400 group-hover:text-slate-300",
                ].join(" ")}
              >
                {it.icon}
              </span>
              <span className="truncate">{it.label}</span>
              {active && (
                <span className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-indigo-400/70" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const checkAuth = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/v1/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal,
      });
      console.debug("[auth/me] status:", res.status);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.warn("[auth/me] not ok:", res.status, txt);
        setUserName(null);
        setUserEmail(null);
        setRole(null);
        // Redirect to sign-in if unauthorized
        if (res.status === 401 || res.status === 403) {
          router.replace("/sign-in");
        }
        return;
      }
      const data = await res.json().catch(() => ({} as any));

      const name =
        data?.user?.username ||
        data?.user?.name ||
        data?.username ||
        data?.name ||
        data?.user?.email ||
        null;
      setUserName(data?.user.name || null);
      setUserEmail(data?.user?.email || null);
      setRole((data?.user?.role as Role) || null);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("[auth/me] error:", e);
      }
    }
  }, [router]);

  useEffect(() => {
    const ac = new AbortController();
    checkAuth(ac.signal);
    return () => ac.abort();
  }, [checkAuth]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_signout" && e.newValue) {
        // Another tab signed out, check auth state
        checkAuth();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userName) {
        // Tab became visible, verify auth state is still valid
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAuth, userName]);

  // Client-side route guard based on role
  useEffect(() => {
    if (!role) return; // wait until role is known
    const path = typeof window !== "undefined" ? window.location.pathname : "/";

    const isAllowed = (p: string, r: Role) => {
      if (r === "master") return true; // master can access all
      // deny access-control path for manager as requested
      if (p.startsWith("/dashboard/accesscontrol"))
        return ["admin", "master"].includes(r);
      // user can access only mailbox
      if (r === "user") return p.startsWith("/dashboard/");
      // manager/admin default allow
      return true;
    };

    if (!isAllowed(path, role)) {
      const fallback = role === "user" ? "/dashboard/" : "/dashboard/";
      router.replace(fallback);
    }
  }, [role, router]);

  const firstChar = (
    (userName || userEmail || "User").trim()[0] || "U"
  ).toUpperCase();

  return (
    <div lang="en">
      <div className="min-h-screen bg-gradient-to-b from-[#070b14] via-[#0a0f1c] to-black text-slate-100">
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.08),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]"
        />

        {/* Top bar */}
        <header className="sticky top-0 z-50 h-14 sm:h-16 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <div className="mx-auto flex h-full max-w-screen items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="">
                <button
                  onClick={toggle}
                  aria-label="Toggle sidebar"
                  className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/15 focus:outline-none  "
                >
                  <div aria-hidden>
                    <span className="block w-5 h-[2px] bg-white mb-[5px] rounded" />
                    <span className="block w-5 h-[2px] bg-white mb-[5px] rounded" />
                    <span className="block w-5 h-[2px] bg-white rounded" />
                  </div>
                </button>
              </div>
              <Link
                href="/"
                className="shrink-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/creaive/Creaive Logo Final 06.png"
                  alt="CREAiVE"
                  className="w-[100px] xl:w-[120px]"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex min-w-0 flex-col text-left md:text-right">
                {/* Mobile: 1 character */}
                <div
                  className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white font-semibold uppercase"
                  aria-label={userName || userEmail || "User"}
                  title={userName || userEmail || "User"}
                >
                  {firstChar}
                </div>

                {/* Desktop/tablet: full text */}
                <div className="hidden md:flex min-w-0 flex-col">
                  <div
                    className="max-w-[320px] truncate text-lg font-medium text-white uppercase leading-tight"
                    title={userName ?? "User"}
                  >
                    {userName ?? "User"}
                  </div>
                  <div
                    className="max-w-[320px] truncate text-sm text-slate-300 leading-snug text-white"
                    title={userEmail ?? "User"}
                  >
                    {userEmail ?? "User"}
                  </div>
                </div>
              </div>
              <Link
                href={"/"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white/0 border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/20 cursor-pointer"
              >
                Home
              </Link>
              <button
                onClick={async () => {
                  // 1) Ask server to invalidate cookies (httpOnly)
                  try {
                    await fetch("/api/v1/auth/signout", {
                      method: "POST",
                      credentials: "include",
                      headers: { Accept: "application/json" },
                      cache: "no-store",
                    });
                  } catch (e) {
                    console.warn("/auth/signout failed:", e);
                  }

                  // 2) Best-effort client cleanup for any non-httpOnly cookies & local/session storage
                  const kill = (name: string) => {
                    try {
                      // Path scoping
                      document.cookie = `${name}=; Max-Age=0; path=/;`;
                      // SameSite variant
                      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
                    } catch {}
                  };
                  [
                    "access_token",
                    "refresh_token",
                    "token",
                    "session",
                    "creaive_auth",
                  ].forEach(kill);

                  try {
                    localStorage.clear();
                  } catch {}
                  try {
                    sessionStorage.clear();
                  } catch {}

                  // 3) Verify sign-out status; if server returns 401/403, we know cookies are gone
                  try {
                    const check = await fetch("/api/v1/auth/me", {
                      method: "GET",
                      credentials: "include",
                      cache: "no-store",
                      headers: { Accept: "application/json" },
                    });
                    if (check.status === 401 || check.status === 403) {
                      window.location.replace("/sign-in");
                      return;
                    }
                  } catch {}

                  // Fallback redirect regardless
                  window.location.replace("/sign-in");
                }}
                className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* App Shell */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] max-w-screen">
          {/* Mobile overlay */}
          <button
            aria-hidden={!open}
            aria-label="Close sidebar overlay"
            onClick={close}
            className={[
              "fixed inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity lg:hidden",
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            ].join(" ")}
          />

          {/* Sidebar */}
          <div
            className={[
              "fixed top-14 sm:top-16 bottom-0 left-0 z-50 w-72",
              "transform transition-transform duration-200 ease-out lg:transform-none lg:static lg:w-72",
              open ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
          >
            <div className="h-full overflow-y-auto">
              <Sidebar role={role} onLinkClick={close} />
            </div>
          </div>

          {/* Main */}
          <main
            className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8"
            onClick={() => {
              if (open) close();
            }}
          >
            {/* <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 lg:p-8 shadow-xl backdrop-blur">
                            {children}
                        </div> */}

            <div className="">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

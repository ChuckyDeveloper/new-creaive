"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "manager" | "admin" | "master";
type UserItem = {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  provider?: string;
  createdAt?: string;
};

export default function UsersTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<Role[]>(["user", "manager", "admin", "master"]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/v1/controllers/access-control?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Load failed (${res.status})`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      if (Array.isArray(data.roles)) setRoles(data.roles);
    } catch (e: any) {
      setErr(e?.message || "Load error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="space-y-4 text-white">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email, username, name"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none placeholder:text-slate-500 focus:border-indigo-400/40"
        />
        <button
          onClick={() => { setPage(1); load(); }}
          className="rounded-lg bg-indigo-500/90 px-4 py-2 text-white hover:bg-indigo-500"
          disabled={loading}
        >
          Search
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="lg:min-w-full text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Username</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Provider</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => {
              const [first, last] = [u.firstName || "", u.lastName || ""];
              return (
                <tr key={u._id} className="border-t border-white/10 relative w-full">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.username}</td>
                  <td className="px-3 py-2">{[first, last].filter(Boolean).join(" ") || "-"}</td>
                  <td className="px-3 py-2">{u.provider || "-"}</td>
                  <td className="min-w-[100px] px-3 py-2 ">
                    <RoleSelect user={u} roles={roles} onChanged={() => load()} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={async () => {
                        if (confirm(`Delete user ${u.username}?`)) {
                          try {
                            const res = await fetch(`/api/v1/controllers/access-control/${u._id}/role`, {
                              method: "DELETE",
                              credentials: "include",
                            });
                            if (!res.ok) throw new Error("Delete failed");
                            load();
                          } catch (err) {
                            console.error("Delete failed", err);
                            alert("Failed to delete user.");
                          }
                        }
                      }}
                      className="rounded border border-red-400/30 px-3 py-1 text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>
          Page {page} / {pages} — {total} users
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= pages || loading}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="rounded border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleSelect({ user, roles, onChanged }: {
  user: UserItem; roles: Role[]; onChanged: () => void;
}) {
  const [value, setValue] = useState<Role>(user.role);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // custom dropdown state
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const btnEl = btnRef.current;
      const menuEl = menuRef.current;
      if (!btnEl || !menuEl) return;
      if (e.target instanceof Node && (btnEl === e.target || btnEl.contains(e.target))) return;
      if (e.target instanceof Node && (menuEl === e.target || menuEl.contains(e.target))) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleRoleSelect = async (r: Role) => {
    setValue(r);
    setOpen(false);
    if (r !== user.role) {
      try {
        const res = await fetch(`/api/v1/controllers/access-control/${user._id}/role`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: r }),
        });
        if (!res.ok) throw new Error("Update failed");
        onChanged();
      } catch (e) {
        console.error("Update error", e);
        setErr("Update failed");
      }
    }
  };

  return (
    <div className="relative flex items-center gap-2 text-white">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs hover:bg-white/10"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-medium">{value.toUpperCase()}</span>
        <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden>
          <path fill="currentColor" d="M5.5 7.5L10 12l4.5-4.5z" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute mt-24 rounded-md border border-white/10 bg-black/90 p-1 shadow-xl backdrop-blur text-white z-50"
        >
          <ul role="listbox" className="max-h-56 overflow-visible text-xs">
            {roles.map((r) => {
              const active = r === value;
              return (
                <li
                  key={r}
                  role="option"
                  aria-selected={active}
                  onClick={() => handleRoleSelect(r)}
                  className={[
                    "cursor-pointer select-none rounded px-3 py-1.5",
                    active ? "bg-indigo-600 text-white" : "text-slate-200 hover:bg-white/10"
                  ].join(" ")}
                >
                  {r.toUpperCase()}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {err && <span className="text-xs text-red-300">{err}</span>}
    </div>
  );
}
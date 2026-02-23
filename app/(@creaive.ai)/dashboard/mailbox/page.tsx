"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Mail {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  subject?: string;
  detail?: string;
  company?: string;
  createdAt: string;
  unread: boolean;
}

function truncate(text: string | undefined, max = 140) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-4 border border-white/10 rounded-md bg-black/30 p-3 animate-pulse">
    <div className="col-span-12 md:col-span-2 h-4 bg-white/10 rounded" />
    <div className="col-span-12 md:col-span-2 h-4 bg-white/10 rounded" />
    <div className="col-span-12 md:col-span-2 h-4 bg-white/10 rounded" />
    <div className="col-span-12 md:col-span-4 h-4 bg-white/10 rounded" />
    <div className="col-span-12 md:col-span-2 h-4 bg-white/10 rounded" />
    <div className="col-span-12 h-4 mt-3 bg-white/10 rounded" />
  </div>
);

const MailBox = () => {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  type TabKey = "unread" | "read" | "hide";
  const [activeTab, setActiveTab] = useState<TabKey>("unread");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markAsRead = async (id: string) => {
    setMails((prev) => prev.map((m) => (m._id === id ? { ...m, unread: false } : m)));
    // try {
    //   await fetch("/api/v1/controllers/mail", {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ id, unread: false }),
    //   });
    // } catch (e) {
    //   // Rollback on failure
    //   setMails((prev) => prev.map((m) => (m._id === id ? { ...m, unread: true } : m)));
    //   fetchMails();
    // }

    await fetch("/api/v1/controllers/mail", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, unread: false }),
    });
  };

  const hideMail = (id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  };

  const fetchMails = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/controllers/mail?all=1", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
      const data = await res.json();

      console.log(data)
      setMails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMails();
  }, [fetchMails]);

  const lists = useMemo(() => {
    const matcher = (m: Mail) =>
      [m.firstName || "", m.lastName || "", m.email || "", m.subject || "", m.detail || "", m.company || ""]
        .join(" ")
        .toLowerCase();
    const q = search.trim().toLowerCase();

    const visible = mails.filter((m) => !hiddenIds.has(m._id));
    const hidden = mails.filter((m) => hiddenIds.has(m._id));
    const unreadVisible = visible.filter((m) => m.unread);
    const readVisible = visible.filter((m) => !m.unread);

    const filterByQuery = (arr: Mail[]) => (!q ? arr : arr.filter((m) => matcher(m).includes(q)));

    const unreadList = filterByQuery(unreadVisible);
    const readList = filterByQuery(readVisible);
    const hideList = filterByQuery(hidden);

    return {
      unread: unreadList,
      read: readList,
      hide: hideList,
      counts: {
        unread: unreadVisible.length,
        read: readVisible.length,
        hide: hidden.length,
      },
    } as const;
  }, [mails, search, hiddenIds]);

  const copyEmail = async (id: string, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch { }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur">
      <div className="p-2 md:p-2 min-h-screen text-white">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">📬 Mailbox</h1>
              <p className="text-slate-400 text-sm mt-1">
                {loading ? "Loading…" : `${lists[activeTab].length} message${lists[activeTab].length === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(["unread", "read"] as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-md border text-xs uppercase tracking-wide transition ${activeTab === key
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  title={key === "unread" ? "Unread" : key === "read" ? "Read" : "Hidden"}
                >
                  {key === "unread" ? "Unread" : key === "read" ? "Read" : "Hide"}
                  <span className="ml-2 text-[10px] opacity-80">{lists.counts[key]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, subject…"
                className="w-full bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>
            <button
              onClick={fetchMails}
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2 hover:bg-white/10 transition whitespace-nowrap"
            >
              <span className={`w-2 h-2 rounded-full ${refreshing ? "bg-indigo-400 animate-pulse" : "bg-slate-400"}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 border border-red-500/30 bg-red-500/10 text-red-300 rounded-md px-4 py-3">
            <div className="font-medium">Unable to load messages</div>
            <div className="text-sm opacity-90 mt-1">{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && lists[activeTab].length === 0 && (
          <div className="border border-white/10 rounded-xl bg-black/30 p-8 text-center">
            <div className="text-slate-300">No mails found</div>
            <div className="text-slate-500 text-sm mt-1">Try adjusting your search.</div>
          </div>
        )}

        {/* Table Head */}
        {!loading && !error && lists[activeTab].length > 0 && (
          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs uppercase tracking-wide text-slate-400 font-semibold border-b border-white/10 pb-2 mb-2">
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-4">Subject</div>
              <div className="col-span-2">{activeTab === "hide" ? "Date / Actions" : "Date"}</div>
            </div>

            {lists[activeTab].map((mail) => (
              <div
                key={mail._id}
                onClick={() => toggleExpand(mail._id)}
                role="button"
                aria-expanded={expandedIds.has(mail._id)}
                className={`group grid grid-cols-12 gap-4 text-sm border border-white/10 rounded-md p-3 hover:bg-white/5 transition cursor-pointer ${!mail.unread ? "bg-black/20 opacity-90" : "bg-black/30"}`}
              >
                {/* Name */}
                <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                  <div className="hidden md:block w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40" />
                  <div className="truncate text-slate-200">
                    {(mail.firstName || "").trim()} {(mail.lastName || "").trim()}
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                  <span className="truncate text-slate-300">{mail.email}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyEmail(mail._id, mail.email); }}
                    title={copiedId === mail._id ? "Copied!" : "Copy email"}
                    className="ml-auto md:ml-0 text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    {copiedId === mail._id ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Company */}
                <div className="col-span-12 md:col-span-2">
                  <div className="truncate text-slate-200">{mail.company || "-"}</div>
                </div>

                {/* Subject */}
                <div className="col-span-12 md:col-span-4">
                  <div className="font-medium text-slate-100 truncate">{truncate(mail.subject, 90)}</div>
                </div>

                {/* Date and action buttons */}
                <div className="col-span-12 md:col-span-2 text-xs text-slate-500 md:text-right flex items-center md:justify-end gap-2">
                  <span className="whitespace-nowrap">{formatDate(mail.createdAt)}</span>
                  <div className="flex flex-col">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mail.unread) {
                          markAsRead(mail._id);
                        }
                      }}
                      disabled={!mail.unread}
                      className={`px-2 py-1 rounded border text-[11px] transition hidden md:inline-flex ${!mail.unread ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 cursor-default" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}
                      title={!mail.unread ? "Already read" : "Mark as read"}
                    >
                      {!mail.unread ? "Read" : "Mark Read"}
                    </button>
                    {/* 
                    <button
                      onClick={() => hideMail(mail._id)}
                      className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] text-slate-300 hover:bg-white/10 transition hidden md:inline-flex"
                      title="Hide this message"
                    >
                      Hide
                    </button> 
                    */}
                  </div>
                  {activeTab === "hide" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); setHiddenIds((prev) => {
                          const next = new Set(prev);
                          next.delete(mail._id);
                          return next;
                        });
                      }}
                      className="px-2 py-1 rounded border border-indigo-500/40 bg-indigo-500/10 text-[11px] text-indigo-200 hover:bg-indigo-500/20 transition hidden md:inline-flex"
                      title="Unhide this message"
                    >
                      Unhide
                    </button>
                  )}
                </div>

                {/* Detail (full width under row) */}

                {expandedIds.has(mail._id) && (
                  <>
                    <div className="col-span-12 text-slate-300 pt-2 border-t border-white/10 mt-2">
                      {truncate(mail.detail, 220)}
                    </div>
                    <div className="col-span-12 flex md:hidden items-center justify-end gap-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); if (mail.unread) markAsRead(mail._id); }}
                        disabled={!mail.unread}
                        className={`px-2 py-1 rounded border text-[11px] transition ${!mail.unread ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}
                      >
                        {!mail.unread ? "Read" : "Mark Read"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); hideMail(mail._id); }}
                        className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] text-slate-300 hover:bg-white/10 transition"
                      >
                        Hide
                      </button>
                      {activeTab === "hide" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); setHiddenIds((prev) => {
                              const next = new Set(prev);
                              next.delete(mail._id);
                              return next;
                            });
                          }}
                          className="px-2 py-1 rounded border border-indigo-500/40 bg-indigo-500/10 text-[11px] text-indigo-200 hover:bg-indigo-500/20 transition"
                        >
                          Unhide
                        </button>
                      )}
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailBox;
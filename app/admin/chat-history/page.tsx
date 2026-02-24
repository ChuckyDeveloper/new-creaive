"use client";

import { useCallback, useEffect, useState } from "react";

/* ── Types ── */
interface ChatRecord {
  _id: string;
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  createdAt: string;
  ip: string;
  userAgent: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SessionInfo {
  _id: string; // sessionId
  messageCount: number;
  lastActivity: string;
  firstActivity: string;
}

/* ── Main Admin Page ── */
export default function AdminChatHistory() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatRecord | null>(null);
  const [tab, setTab] = useState<"chats" | "sessions">("chats");

  /* ── Fetch chat history ── */
  const fetchChats = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "50",
        });
        if (search) params.set("search", search);
        if (filterSession) params.set("sessionId", filterSession);

        const res = await fetch(`/api/chat/history?${params}`, {
          headers: { "x-admin-secret": secret },
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
          setAuthError("Session expired, please re-authenticate.");
          return;
        }

        const data = await res.json();
        setChats(data.chats || []);
        setPagination(data.pagination || pagination);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    },
    [secret, search, filterSession, pagination],
  );

  /* ── Fetch sessions ── */
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/sessions", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [secret]);

  /* ── Delete a chat ── */
  const deleteChat = async (id: string) => {
    if (!confirm("ลบข้อความนี้?")) return;
    try {
      await fetch("/api/chat/history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ id }),
      });
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (selectedChat?._id === id) setSelectedChat(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ── Auth ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;
    setIsAuthenticated(true);
    setAuthError("");
  };

  /* ── Load data on auth ── */
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats(1);
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /* ── Login screen ── */
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0e113f] to-[#1a1040] p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-md border border-white/10"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">🔒 Admin Login</h1>
            <p className="mt-1 text-sm text-white/50">
              CODEE Chat History Dashboard
            </p>
          </div>

          {authError && (
            <p className="mb-4 text-center text-sm text-rose-400">
              {authError}
            </p>
          )}

          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter admin secret"
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#782a90]/50 border border-white/10"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#782a90] to-[#47c2cb] py-3 font-semibold text-white transition-all hover:brightness-110"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e113f] to-[#1a1040] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">💬 CODEE Chat History</h1>
            <p className="text-sm text-white/40">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              Total: {pagination.total} messages
            </span>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setSecret("");
              }}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-all hover:bg-white/20"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("chats")}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              tab === "chats"
                ? "bg-[#782a90] text-white shadow-lg shadow-[#782a90]/30"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            📝 Chat Messages
          </button>
          <button
            onClick={() => {
              setTab("sessions");
              fetchSessions();
            }}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              tab === "sessions"
                ? "bg-[#782a90] text-white shadow-lg shadow-[#782a90]/30"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            👥 Sessions ({sessions.length})
          </button>
        </div>

        {/* ═══════ CHATS TAB ═══════ */}
        {tab === "chats" && (
          <div className="flex gap-6">
            {/* Left: Chat List */}
            <div className="flex-1">
              {/* Search & Filter */}
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchChats(1)}
                    placeholder="🔍 ค้นหาข้อความ..."
                    className="w-full rounded-xl bg-white/10 px-4 py-3 pr-20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#782a90]/40 border border-white/10"
                  />
                  <button
                    onClick={() => fetchChats(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#782a90] px-3 py-1.5 text-xs font-medium text-white"
                  >
                    ค้นหา
                  </button>
                </div>

                {filterSession && (
                  <button
                    onClick={() => {
                      setFilterSession("");
                      fetchChats(1);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-amber-500/20 px-4 py-2 text-sm text-amber-300"
                  >
                    Session: {filterSession.slice(0, 16)}…
                    <span className="text-white/50">✕</span>
                  </button>
                )}

                <button
                  onClick={() => fetchChats(1)}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm transition-all hover:bg-white/20"
                >
                  🔄 รีเฟรช
                </button>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#782a90] border-t-transparent" />
                  </div>
                ) : chats.length === 0 ? (
                  <div className="py-20 text-center text-white/30">
                    ไม่พบข้อมูลแชท
                  </div>
                ) : (
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-white/10 text-white/60">
                        <tr>
                          <th className="px-4 py-3 font-medium">เวลา</th>
                          <th className="px-4 py-3 font-medium">Session</th>
                          <th className="px-4 py-3 font-medium">
                            ข้อความผู้ใช้
                          </th>
                          <th className="px-4 py-3 font-medium">คำตอบ CODEE</th>
                          <th className="px-4 py-3 font-medium w-20">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {chats.map((chat) => (
                          <tr
                            key={chat._id}
                            onClick={() => setSelectedChat(chat)}
                            className={`cursor-pointer transition-colors hover:bg-white/5 ${
                              selectedChat?._id === chat._id
                                ? "bg-[#782a90]/10"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                              {new Date(chat.createdAt).toLocaleString("th-TH")}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilterSession(chat.sessionId);
                                  fetchChats(1);
                                }}
                                className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50 hover:bg-white/20 font-mono"
                              >
                                {chat.sessionId.slice(0, 12)}…
                              </button>
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-white/80">
                              {chat.userMessage}
                            </td>
                            <td className="max-w-[250px] truncate px-4 py-3 text-white/50">
                              {chat.assistantMessage}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(chat._id);
                                }}
                                className="rounded-md bg-rose-500/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/30"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                    <span className="text-xs text-white/30">
                      หน้า {pagination.page} / {pagination.totalPages} (
                      {pagination.total} ข้อความ)
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchChats(pagination.page - 1)}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs disabled:opacity-30"
                      >
                        ← ก่อนหน้า
                      </button>
                      <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchChats(pagination.page + 1)}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs disabled:opacity-30"
                      >
                        ถัดไป →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Detail Panel */}
            {selectedChat && (
              <div className="w-[380px] shrink-0">
                <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white/80">
                      📋 รายละเอียด
                    </h3>
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="text-white/30 hover:text-white/60"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-xs text-white/40">
                        Session ID
                      </label>
                      <p className="mt-1 font-mono text-xs text-white/60 break-all">
                        {selectedChat.sessionId}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-white/40">เวลา</label>
                      <p className="mt-1 text-white/60">
                        {new Date(selectedChat.createdAt).toLocaleString(
                          "th-TH",
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-white/40">IP</label>
                      <p className="mt-1 font-mono text-xs text-white/60">
                        {selectedChat.ip}
                      </p>
                    </div>

                    <hr className="border-white/10" />

                    <div>
                      <label className="mb-2 block text-xs text-white/40">
                        💬 ข้อความผู้ใช้
                      </label>
                      <div className="rounded-xl bg-gradient-to-br from-[#782a90]/20 to-[#9355a6]/20 p-3 text-white/80">
                        {selectedChat.userMessage}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-white/40">
                        🤖 คำตอบ CODEE
                      </label>
                      <div className="max-h-60 overflow-y-auto rounded-xl bg-white/10 p-3 text-white/70 whitespace-pre-line">
                        {selectedChat.assistantMessage}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-white/40">
                        User Agent
                      </label>
                      <p className="mt-1 text-[10px] text-white/30 break-all leading-relaxed">
                        {selectedChat.userAgent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ SESSIONS TAB ═══════ */}
        {tab === "sessions" && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {sessions.length === 0 ? (
              <div className="py-20 text-center text-white/30">
                ไม่พบข้อมูล Sessions
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-white/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">Session ID</th>
                    <th className="px-4 py-3 font-medium">จำนวนข้อความ</th>
                    <th className="px-4 py-3 font-medium">เริ่มต้น</th>
                    <th className="px-4 py-3 font-medium">ล่าสุด</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.map((s) => (
                    <tr
                      key={s._id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-white/60">
                        {s._id}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-[#782a90]/20 px-2.5 py-0.5 text-xs text-[#c084fc]">
                          {s.messageCount} messages
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/40">
                        {new Date(s.firstActivity).toLocaleString("th-TH")}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/40">
                        {new Date(s.lastActivity).toLocaleString("th-TH")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setFilterSession(s._id);
                            setTab("chats");
                            fetchChats(1);
                          }}
                          className="rounded-lg bg-[#782a90]/30 px-3 py-1.5 text-xs text-[#c084fc] hover:bg-[#782a90]/50"
                        >
                          ดูข้อความ →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

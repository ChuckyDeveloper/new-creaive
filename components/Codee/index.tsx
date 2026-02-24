"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Types ── */
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

/* ── Constants ── */
const ASSISTANT_NAME = "CODEE";

const FAQ_LIST = [
  { emoji: "🚀", text: "What is CREAiVE?" },
  { emoji: "🤖", text: "How is AI Human used?" },
  { emoji: "🌐", text: "Tell me about AI Microsite" },
  { emoji: "🧪", text: "What can AI Lab do?" },
  { emoji: "🔮", text: "Tell me about HOLOVUE" },
  { emoji: "💰", text: "Pricing & timelines?" },
];

/* ── Generate a new session id for each page load ── */
function createSessionId(): string {
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Typing dots component ── */
function TypingIndicator() {
  return (
    <div className="codee-fade-in flex items-start gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#782a90] to-[#47c2cb] shadow-md">
        <Image
          src="/creaive/codee.png"
          alt="CODEE"
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span
            className="codee-dot h-2 w-2 rounded-full bg-[#782a90]/60"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="codee-dot h-2 w-2 rounded-full bg-[#782a90]/60"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="codee-dot h-2 w-2 rounded-full bg-[#782a90]/60"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function CODEE() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string>(createSessionId());

  /* ── Scroll to bottom ── */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  /* ── Focus input when panel opens ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /* ── Send message with streaming ── */
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      // Create a placeholder for the assistant message
      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInputValue("");
      setIsTyping(true);

      // Abort any previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Build conversation history for context (last 20 messages)
        const history = [...messages, userMsg]
          .slice(-20)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            sessionId: sessionIdRef.current,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data: ")) continue;

            try {
              const data = JSON.parse(trimmedLine.slice(6));

              if (data.done) break;
              if (data.error) throw new Error(data.error);

              if (data.content) {
                // Append token to the assistant message
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + data.content }
                      : m,
                  ),
                );
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        // Show error in the assistant bubble
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    m.content ||
                    "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง 🙏",
                }
              : m,
          ),
        );
      } finally {
        setIsTyping(false);
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    },
    [isTyping, isOpen, messages],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    void sendMessage(inputValue);
  };

  const handleFaqClick = useCallback(
    (text: string) => {
      if (!isOpen) {
        setIsOpen(true);
        setUnreadCount(0);
      }
      void sendMessage(text);
    },
    [isOpen, sendMessage],
  );

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const hasMessages = messages.length > 0;

  /* ── Render ── */
  return (
    <>
      {/* Inline styles for animations */}
      <style jsx global>{`
        @keyframes codee-panel-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes codee-fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes codee-bounce-dot {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
        @keyframes codee-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes codee-ring-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(120, 42, 144, 0.4);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(120, 42, 144, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(120, 42, 144, 0);
          }
        }
        .codee-panel-in {
          animation: codee-panel-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .codee-fade-in {
          animation: codee-fade-in 0.3s ease-out;
        }
        .codee-dot {
          animation: codee-bounce-dot 1.2s ease-in-out infinite;
        }
        .codee-float {
          animation: codee-float 3s ease-in-out infinite;
        }
        .codee-ring-pulse {
          animation: codee-ring-pulse 2s ease-out infinite;
        }
        .codee-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .codee-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .codee-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 42, 144, 0.2);
          border-radius: 999px;
        }
        .codee-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(120, 42, 144, 0.4);
        }
      `}</style>

      <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
        {/* ══════════ Chat Panel ══════════ */}
        {isOpen && (
          <div className="codee-panel-in pointer-events-auto flex w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-white/20 shadow-[0_32px_80px_rgba(120,42,144,0.3),0_0_0_1px_rgba(255,255,255,0.05)]">
            {/* ── Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#782a90] via-[#9355a6] to-[#47c2cb]">
              {/* Decorative circles */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-sm" />
              <div className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-white/5 blur-sm" />

              <header className="relative flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/30 shadow-lg">
                    <Image
                      src="/creaive/codee.png"
                      alt="CODEE"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      priority
                    />
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#782a90] bg-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wider text-white">
                      {ASSISTANT_NAME}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online — AI Assistant
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
                  aria-label="Close chat"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </header>
            </div>

            {/* ── Messages Area ── */}
            <div className="relative flex h-[460px] flex-col bg-gradient-to-b from-[#f8f4ff] via-[#f3f0fa] to-[#eee8f7]">
              <div className="codee-scrollbar flex-1 overflow-y-auto px-4 py-4">
                {/* Welcome Screen */}
                {!hasMessages && !isTyping && (
                  <div className="codee-fade-in flex flex-col items-center gap-4 pt-6">
                    <div className="codee-float relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-[#782a90] to-[#47c2cb] p-[3px] shadow-xl shadow-[#782a90]/20">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#f8f4ff]">
                        <Image
                          src="/creaive/codee.png"
                          alt="CODEE"
                          width={160}
                          height={160}
                          className="h-full w-full object-cover"
                          priority
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-[#0e113f]">
                        Hello! 👋
                      </h3>
                      <p className="mt-1 max-w-[280px] text-sm leading-relaxed text-[#0e113f]/60">
                        I am <strong className="text-[#782a90]">CODEE</strong>{" "}
                        your AI assistant from CREAiVE
                        <br />
                        Ready to answer any questions about our products.
                      </p>
                    </div>

                    {/* FAQ Buttons */}
                    <div className="mt-2 flex flex-wrap justify-center gap-2 px-2">
                      {FAQ_LIST.map((faq, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleFaqClick(faq.text)}
                          className="group flex items-center gap-1.5 rounded-full border border-[#782a90]/15 bg-white px-3.5 py-2 text-xs font-medium text-[#0e113f]/70 shadow-sm transition-all duration-200 hover:border-[#782a90]/30 hover:bg-[#782a90]/5 hover:text-[#782a90] hover:shadow-md active:scale-95"
                        >
                          <span className="text-sm transition-transform group-hover:scale-110">
                            {faq.emoji}
                          </span>
                          {faq.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex flex-col gap-3">
                  {messages
                    .filter((m) => !(m.role === "assistant" && !m.content))
                    .map((msg) => {
                      const isBot = msg.role === "assistant";
                      return (
                        <div
                          key={msg.id}
                          className={`codee-fade-in flex items-start gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}
                        >
                          {/* Avatar */}
                          {isBot && (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#782a90] to-[#47c2cb] shadow-md">
                              <Image
                                src="/creaive/codee.png"
                                alt="CODEE"
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          {/* Bubble */}
                          <div
                            className={`group relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-shadow ${
                              isBot
                                ? "rounded-tl-md bg-white/80 text-[#0e113f] shadow-sm backdrop-blur-sm hover:shadow-md"
                                : "rounded-tr-md bg-gradient-to-br from-[#782a90] to-[#9355a6] text-white shadow-md shadow-[#782a90]/15 hover:shadow-lg"
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.content}</p>
                            <span
                              className={`mt-1.5 block text-[10px] ${isBot ? "text-[#0e113f]/30" : "text-white/50"}`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* Typing Indicator — only while waiting for the first token */}
                  {isTyping &&
                    messages.some(
                      (m) => m.role === "assistant" && !m.content,
                    ) && <TypingIndicator />}
                </div>

                <div ref={messagesEndRef} />
              </div>

              {/* ── Composer ── */}
              <div className="border-t border-[#782a90]/10 bg-white/70 px-3 py-3 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <textarea
                      ref={inputRef}
                      className="h-11 w-full resize-none rounded-2xl border border-[#782a90]/15 bg-white px-4 py-2.5 pr-4 text-sm text-[#0e113f] placeholder:text-[#0e113f]/35 transition-all focus:border-[#782a90]/30 focus:outline-none focus:ring-2 focus:ring-[#782a90]/10"
                      placeholder="พิมพ์ข้อความที่นี่..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      aria-label="Message input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (inputValue.trim() && !isTyping) {
                            e.currentTarget.form?.requestSubmit();
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#782a90] to-[#47c2cb] text-white shadow-md shadow-[#782a90]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#782a90]/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-md"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m22 2-7 20-4-9-9-4z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </form>
                <p className="mt-2 text-center text-[10px] text-[#0e113f]/25">
                  Powered by{" "}
                  <span className="font-semibold text-[#782a90]/40">
                    CREAiVE
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ Floating Toggle Button ══════════ */}
        {!isOpen && (
          <div className="pointer-events-auto flex flex-col items-end gap-2.5">
            {/* Avatar Button */}
            <button
              type="button"
              onClick={openChat}
              className="codee-ring-pulse group relative h-16 w-16 overflow-hidden rounded-full shadow-[0_8px_30px_rgba(120,42,144,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(120,42,144,0.5)] focus:outline-none focus:ring-2 focus:ring-[#782a90]/40 focus:ring-offset-2 active:scale-100"
              aria-label="Open chat with CODEE"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#782a90] via-[#9355a6] to-[#47c2cb] p-[2.5px]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0a0f1b]">
                  <Image
                    src="/creaive/codee.png"
                    alt="CODEE"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Label Pill */}
            <button
              type="button"
              onClick={openChat}
              className="rounded-full bg-gradient-to-r from-[#782a90] via-[#9355a6] to-[#47c2cb] px-5 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#782a90]/30 active:scale-95"
              aria-expanded={isOpen}
            >
              💬 Chat with CODEE
            </button>
          </div>
        )}
      </div>
    </>
  );
}

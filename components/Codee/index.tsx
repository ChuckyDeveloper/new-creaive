"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  author: string;
  content: string;
  createdAt?: string | null;
};

type SessionInfo = {
  id: string | null;
  name: string;
  isAnonymous: boolean;
  tempKey: string | null;
};

type ThreadResponse = {
  threadId?: string;
  user?: {
    id: string | null;
    name?: string;
    isAnonymous?: boolean;
  };
  session?: {
    tempKey?: string | null;
  };
  messages?: Array<{
    id?: string;
    role?: string;
    author?: string;
    content?: string;
    createdAt?: string | null;
  }>;
};

const ANONYMOUS_LABEL = "Anonymous";
const ASSISTANT_NAME = "CODEE";
const PANEL_BACKDROP =
  "radial-gradient(circle at 20% -10%, rgba(255, 230, 255, 0.6), transparent 55%)," +
  "radial-gradient(circle at 80% -10%, rgba(171, 114, 255, 0.45), transparent 55%)," +
  "linear-gradient(180deg, rgba(108, 67, 219, 0.35) 0%, rgba(170, 90, 255, 0.25) 45%, rgba(244, 225, 255, 0.4) 100%)";

export default function CODEE() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [threadId, setThreadId] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    id: null,
    name: ANONYMOUS_LABEL,
    isAnonymous: true,
    tempKey: null,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const initializeThread = useCallback(async (): Promise<string | null> => {
    if (hasInitialized && threadId) return threadId;
    setIsInitializing(true);

    try {
      const response = await fetch("/api/v1/controllers/creaive", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to start chat");
      }

      const data: ThreadResponse = await response.json();
      if (!data.threadId) {
        throw new Error("Missing thread identifier");
      }

      const derivedName =
        data.user?.name || (data.user?.isAnonymous ? ANONYMOUS_LABEL : "User");

      setThreadId(data.threadId);
      setSessionInfo({
        id: data.user?.id ?? null,
        name: derivedName,
        isAnonymous: data.user?.isAnonymous ?? true,
        tempKey: data.session?.tempKey ?? null,
      });

      const hydratedMessages: ChatMessage[] = (data.messages ?? []).map(
        (msg, index) => {
          const normalizedRole: "user" | "assistant" =
            msg.role === "user" ? "user" : "assistant";
          const fallbackAuthor =
            normalizedRole === "assistant" ? ASSISTANT_NAME : derivedName;

          return {
            id: msg.id ?? `${data.threadId}-${index}`,
            role: normalizedRole,
            author: msg.author || fallbackAuthor,
            content: msg.content ?? "",
            createdAt: msg.createdAt ?? null,
          };
        },
      );

      setMessages(hydratedMessages);
      setError(null);
      return data.threadId;
    } catch (err) {
      console.error("Failed to initialise CODEE thread", err);
      setError(
        "CODEE is having trouble connecting. Please try again in a moment.",
      );
      return null;
    } finally {
      setHasInitialized(true);
      setIsInitializing(false);
    }
  }, [hasInitialized, threadId]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    void initializeThread();
  }, [isOpen, initializeThread]);

  useEffect(() => {
    if (!isOpen) {
      setUnreadCount((prev) => (messages.length ? prev : 0));
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen && hasInitialized && messages.length) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages.length, isOpen, hasInitialized]);

  const sendMessage = useCallback(
    async (content: string, forcedThreadId?: string) => {
      const idToUse = forcedThreadId ?? threadId;
      if (!content.trim() || isSending || !idToUse) return;

      const authorName = sessionInfo.name || ANONYMOUS_LABEL;
      const placeholderId = `${Date.now()}-assistant`;

      const newMessage: ChatMessage = {
        id: `${Date.now()}-user`,
        role: "user",
        author: authorName,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      const placeholderAssistant: ChatMessage = {
        id: placeholderId,
        role: "assistant",
        author: ASSISTANT_NAME,
        content: "...",
      };

      setMessages((prev) => [...prev, newMessage, placeholderAssistant]);
      setInputValue("");
      setIsSending(true);
      setError(null);

      try {
        const response = await fetch("/api/v1/controllers/creaive", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: idToUse,
            message: newMessage.content,
          }),
        });

        const data: {
          reply?: string;
          error?: string;
          user?: ThreadResponse["user"];
          session?: ThreadResponse["session"];
        } = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Assistant failed to reply.");
        }

        const assistantReply =
          data.reply?.trim() || "No reply received from assistant.";

        if (data.user || data.session) {
          setSessionInfo((prev) => ({
            id: data.user?.id ?? prev.id,
            name:
              data.user?.name ||
              (data.user?.isAnonymous ? ANONYMOUS_LABEL : prev.name),
            isAnonymous: data.user?.isAnonymous ?? prev.isAnonymous,
            tempKey: data.session?.tempKey ?? prev.tempKey,
          }));
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === placeholderId
              ? {
                  ...msg,
                  content: assistantReply,
                  createdAt: new Date().toISOString(),
                }
              : msg,
          ),
        );
      } catch (err) {
        console.error("Failed to send message", err);
        const fallbackError =
          err instanceof Error ? err.message : "Failed to send message.";
        setError(fallbackError);
        setMessages((prev) => prev.filter((msg) => msg.id !== placeholderId));
      } finally {
        setIsSending(false);
      }
    },
    [threadId, isSending, sessionInfo.name],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue.trim());
  };

  const handleFaqClick = useCallback(
    async (faqText: string) => {
      setIsOpen(true);
      setUnreadCount(0);
      setInputValue(faqText);
      const readyThreadId = await initializeThread();
      if (!readyThreadId) return;
      await sendMessage(faqText, readyThreadId);
    },
    [initializeThread, sendMessage],
  );

  const composerDisabled = isInitializing || isSending || !threadId;
  const hasHistory = messages.length > 0;
  const toggleLabel = useMemo(
    () =>
      isOpen
        ? "Close chat"
        : hasHistory
          ? "Continue with CODEE"
          : "Chat with CODEE",
    [hasHistory, isOpen],
  );

  // relative flex items-center justify-between gap-3 pl-4 pr-2 py-2 text-slate-900

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      {/* ── Chat Panel ── */}
      {isOpen ? (
        <div
          className="pointer-events-auto flex w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-white/95 shadow-[0_24px_64px_rgba(64,9,159,0.35)]"
          style={{ backgroundImage: PANEL_BACKDROP }}
        >
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-2xl" />
          <header className="relative flex items-center justify-between gap-3 px-4 py-3 text-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-xs font-bold text-white ring-2 ring-indigo-300/40">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide uppercase text-slate-800">
                  {ASSISTANT_NAME}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  AI Assistant
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="group rounded-full border border-slate-200/60 bg-white/70 p-1.5 text-slate-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 w-8 h-8 flex items-center justify-center"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Messages */}
        <div className="relative flex h-[460px] flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-white/20" />
          <div className="relative flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-600 shadow-sm"
              >
                {error}
              </div>
            )}
            {!hasHistory && !isInitializing && !error && (
              <div className="space-y-3 pt-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-xl font-bold text-white ring-2 ring-indigo-200/40 shadow-lg">
                  C
                </div>
                <p className="text-sm text-slate-500 text-center">
                  สวัสดีค่ะ/ครับ 😊 วันนี้อยากให้ CODEE ช่วยอะไรดีเอ่ย?
                </p>
              </div>
            )}
            {isInitializing && (
              <div className="flex items-center gap-3 rounded-xl border border-indigo-200/60 bg-white/50 px-3 py-2 text-sm text-slate-600">
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500" />
                Connecting to CODEE...
              </div>
            )}
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const alignment = isAssistant
                ? "justify-start gap-2"
                : "justify-end";
              const bubbleTone = isAssistant
                ? "bg-gradient-to-br from-[#904BFA]/40 via-[#7A4FE2]/30 to-[#B97BFF]/30 text-white shadow-lg"
                : "bg-white/50 text-slate-900 border border-white/30 shadow-sm backdrop-blur";

              return (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${alignment} animate-[fadeSlideUp_0.25s_ease-out]`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-0 py-0 transition ${bubbleTone}`}
                  >
                    <div className="flex p-2 items-center">
                      {isAssistant && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-[10px] font-bold text-white">
                          C
                        </div>
                      )}
                      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80 text-gray-900 px-2">
                        {isAssistant ? ASSISTANT_NAME : message.author || "You"}
                      </span>
                    </div>

                    <p
                      className={`mt-1 whitespace-pre-line text-sm leading-relaxed text-[#0e113f] px-2 pb-1 ${
                        isAssistant ? "text-start" : "text-end"
                      }`}
                    >
                      {message.content}
                    </p>

                    {message.createdAt && (
                      <span className="my-1 block text-[10px] uppercase tracking-wider text-[#0e113f]/50 text-end px-2 pb-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {!isSending && !hasHistory && (
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "What is CREAiVE?",
                  "How is AI Human used?",
                  "Tell me about AI Microsite",
                  "What can AI Lab do?",
                  "Tell me about HOLOVUE",
                  "Pricing & timelines?",
                ].map((faq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFaqClick(faq)}
                    className="rounded-full border border-indigo-200/80 bg-white/60 px-3 py-1.5 text-xs text-slate-600 shadow-sm transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md"
                  >
                    {faq}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="relative px-3 py-2.5 backdrop-blur-sm border-t border-white/20"
            style={{ backgroundImage: PANEL_BACKDROP }}
          >
            <fieldset
              className="flex gap-2 items-end"
              disabled={composerDisabled}
            >
              <textarea
                className="h-10 w-full resize-none rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-[#0e113f] placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200/50 transition-all"
                placeholder="Ask CODEE anything..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                aria-label="Message input"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (!composerDisabled && inputValue.trim()) {
                      const form = event.currentTarget.form;
                      if (form) {
                        form.requestSubmit();
                      }
                    }
                  }
                }}
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                disabled={composerDisabled || !inputValue.trim()}
              >
                <FaLocationArrow
                  size={16}
                  className={isSending ? "opacity-50 animate-pulse" : ""}
                />
              </button>
            </fieldset>
          </form>
        </div>
        </div>
      ) : null}

      {/* ── Floating Toggle Button ── */}
      {!isOpen && (
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          {/* Avatar bubble */}
          <button
            type="button"
            onClick={openChat}
            className="group relative w-16 h-16 rounded-full overflow-hidden shadow-[0_8px_32px_rgba(120,42,144,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(120,42,144,0.5)] focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            aria-label={toggleLabel}
          >
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 p-[2.5px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1b] text-base font-bold text-white">
                C
              </div>
            </div>
            {/* Pulse ring animation */}
            <span
              className="absolute inset-0 rounded-full animate-ping bg-primary-500/20"
              style={{ animationDuration: "2s" }}
            />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Label pill */}
          <button
            type="button"
            onClick={openChat}
            className="rounded-full bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-expanded={isOpen}
            aria-label={toggleLabel}
          >
            💬 Chat with CODEE
          </button>
        </div>
      )}
    </div>
  );
}

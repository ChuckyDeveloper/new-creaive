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
        }
      );

      setMessages(hydratedMessages);
      setError(null);
      return data.threadId;
    } catch (err) {
      console.error("Failed to initialise CODEE thread", err);
      setError(
        "CODEE is having trouble connecting. Please try again in a moment."
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
          body: JSON.stringify({ threadId: idToUse, message: newMessage.content }),
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
              : msg
          )
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
    [threadId, isSending, sessionInfo.name]
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
    [initializeThread, sendMessage]
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
    [hasHistory, isOpen]
  );

  // relative flex items-center justify-between gap-3 pl-4 pr-2 py-2 text-slate-900

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 ">
      {isOpen ? (
        <div
          className="pointer-events-auto flex w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(64,9,159,0.25)] bg-white/95"
          style={{ backgroundImage: PANEL_BACKDROP }}
        >
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-2xl" />
            <header className="relative flex items-center justify-between gap-3 pl-4 pr-2 py-2 text-slate-900">
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide uppercase text-slate-800">
                  {ASSISTANT_NAME}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200/50 bg-white/60 p-1.5 text-slate-500 transition hover:border-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center"
                aria-label="Close chat"
              >
                x
              </button>
            </header>
          </div>

          <div className="relative flex h-[480px] flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-white/20" />
            <div className="relative flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-600 shadow-sm"
                >
                  {error}
                </div>
              )}
              {!hasHistory && !isInitializing && !error && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
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
                    className={`flex ${alignment}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-0 py-0 transition ${bubbleTone}`}
                    >
                      <div className="flex p-2 items-center">
                        {isAssistant && (
                          <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center overflow-hidden">
                            {/* <img src="/creaive/codee.png" /> */}
                            <video
                              src="/creaive/codee.webm"
                              autoPlay
                              muted
                              loop
                              className="w-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80 text-gray-900 px-2">
                          {isAssistant
                            ? ASSISTANT_NAME
                            : message.author || "You"}
                        </span>
                      </div>

                      <p
                        className={`mt-1 whitespace-pre-line text-sm leading-relaxed text-[#0e113f] px-2 ${isAssistant ? "text-start" : "text-end"
                          }`}
                      >
                        {message.content}
                      </p>

                      {message.createdAt && (
                        <span className="my-1 block text-[10px] uppercase tracking-wider text-[#0e113f] text-end px-2">
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

              {!isSending && (
                <div className="absolute bottom-30 left-0 right-0 flex flex-nowrap gap-2 pb-2 px-4 overflow-x-auto hide-scrollbar">
                  {[
                    "What is CREAiVE?",
                    "What does CREAiVE do, and how is it different from typical agencies or production houses?",
                    "Which types of campaigns is AI Human suitable for, and how can we customize the persona to fit the brand?",
                    "How does the AI Microsite (AI Platform) drive engagement and collect consent/first-party data, and how can it integrate with advertising?",
                    "How much time and budget can AI Lab save, and what are the end-to-end workflow steps from brief to delivery?",
                    "What space and equipment does HOLOVUE require, and how do we connect it with AI Human/AI Lab/AI Platform on-site to create a wow effect?",
                    "Do you offer standard pricing packages and timelines, and what PDPA/data security measures are in place?"
                  ].map((faq, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleFaqClick(faq)}
                      className="shrink-0 rounded-xl border border-indigo-200 bg-white/70 px-3 py-1.5 text-xs text-slate-700 shadow-sm hover:bg-indigo-50"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative px-2 py-2 backdrop-blur"
              style={{ backgroundImage: PANEL_BACKDROP }}
            >
              <fieldset className="flex gap-3" disabled={composerDisabled}>
                <textarea
                  className="h-10 w-full resize-none rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-[#0e113f] placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-200"
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
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-2xl bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 px-4 text-sm font-medium text-white shadow-lg transition hover:brightness-105 focus:outline-none focus:ring-2 disabled:cursor-not-allowed"
                  disabled={composerDisabled || !inputValue.trim()}
                >
                  {isSending ? (
                    <div className="opacity-50">
                      <FaLocationArrow size={20} />
                    </div>
                  ) : (
                    <div>
                      <FaLocationArrow size={20} />
                    </div>
                  )}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      ) : (
        <div
          className="bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 
             p-1 overflow-hidden rounded-full w-[160px] h-[160px] flex 
             cursor-pointer pointer-events-auto"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-[150px] h-[150px] flex m-auto overflow-hidden rounded-full">
            <video
              src="/creaive/codee.webm"
              autoPlay
              muted
              loop
              className="w-full object-cover"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        // bg-gradient-to-r from-[#6C43DB] via-[#AA5AFF] to-[#F5B8FF]
        className="pointer-events-auto flex items-center gap-2 rounded-full 
        bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500
        px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 focus:ring-offset-white"
        aria-expanded={isOpen}
        aria-label={toggleLabel}
      >
        <span className="inline-flex h-2.5 w-2.5 items-center justify-center">
          <span className="block h-full w-full rounded-full bg-white/70" />
        </span>
        {toggleLabel}
        {/* {unreadCount > 0 && !isOpen && (
          <span className="ml-2 inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-black/20 px-2 py-0.5 text-xs font-semibold">
            {unreadCount}
          </span>
        )} */}
      </button>
    </div>
  );
}

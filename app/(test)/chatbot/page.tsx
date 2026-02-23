"use client";

import { useEffect, useRef, useState } from "react";

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
const ASSISTANT_LABEL = "Assistant";

export default function ChatbotPage() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    id: null,
    name: ANONYMOUS_LABEL,
    isAnonymous: true,
    tempKey: null,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeThread = async () => {
      try {
        const response = await fetch("/api/v1/controllers/creaive", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to create chat thread.");
        }

        const data: ThreadResponse = await response.json();

        if (!data.threadId) {
          throw new Error("Thread ID missing in response.");
        }

        const derivedName =
          data.user?.name ||
          (data.user?.isAnonymous ? ANONYMOUS_LABEL : "User");

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
              normalizedRole === "assistant" ? ASSISTANT_LABEL : derivedName;
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
      } catch (err) {
        console.error("Failed to initialize thread", err);
        setError("We could not start a chat session. Please refresh to retry.");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeThread();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim() || isSending) {
      return;
    }

    if (!threadId) {
      setError("Chat session is not ready yet. Please wait a moment.");
      return;
    }

    const authorName = sessionInfo.name || ANONYMOUS_LABEL;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      author: authorName,
      content: inputValue.trim(),
    };

    const placeholderId = `${Date.now()}-assistant`;
    setMessages((prev) => [
      ...prev,
      newMessage,
      {
        id: placeholderId,
        role: "assistant",
        author: ASSISTANT_LABEL,
        content: "...",
      },
    ]);
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
        body: JSON.stringify({ threadId, message: newMessage.content }),
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
          msg.id === placeholderId ? { ...msg, content: assistantReply } : msg
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
  };

  const composerDisabled = isInitializing || isSending || !threadId;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Creaive Chatbot
        </h1>
        <p
          className={`mt-2 text-sm ${
            error ? "text-red-600" : "text-slate-600"
          }`}
        >
          {isInitializing && "Starting a new conversation..."}
          {!isInitializing && !error && threadId && `Thread ready: ${threadId}`}
          {!isInitializing &&
            !error &&
            !threadId &&
            "Chat session initialised."}
          {error && error}
        </p>
        {!error && !isInitializing && (
          <p className="mt-1 text-xs text-slate-500">
            Chatting as {sessionInfo.name || ANONYMOUS_LABEL}
            {sessionInfo.isAnonymous && " (anonymous)"}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">
              Say hi to get started with the chatbot.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm `}>
                {message.role === "assistant" ? (
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wide opacity-70">
                      CODEE
                    </span>
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div className={`rounded-lg px-4 py-2 text-sm `}>
                    <span className="block text-xs font-medium uppercase ">
                      {message.author}
                    </span>
                    <div
                      className={`block text-xs font-lg text-end rounded-lg px-2 py-2 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
          <fieldset className="flex gap-3" disabled={composerDisabled}>
            <textarea
              className="h-24 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              aria-label="Message input"
              disabled={composerDisabled}
            />
            <button
              type="submit"
              className="min-w-[88px] rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={composerDisabled || !inputValue.trim()}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}


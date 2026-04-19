import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, MessageCircle, Flag } from "lucide-react";
import { useChatbot } from "@/context/chatbot-context";
import { useAuth } from "@/context/auth-context";
import { useProgress } from "@/context/progress-context";
import { isAssistantRoute } from "@/lib/chat-assistant-routes";
import { Button } from "@/components/ui/button";
import { postAiReport } from "@/services/api";
import type { AiPolicyMeta, ChatReplyDto } from "@/types";

interface Message {
  sender: "user" | "bot";
  text: string;
  policy?: AiPolicyMeta;
  reportId?: string;
  reportError?: string;
}

export default function ChatbotSidebar() {
  const { isSidebarOpen, closeSidebar } = useChatbot();
  const { pathname } = useLocation();
  const { user, token } = useAuth();
  const { progress } = useProgress();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "/api";
  const onAssistantRoute = isAssistantRoute(pathname);

  useEffect(() => {
    if (!onAssistantRoute && isSidebarOpen) {
      closeSidebar();
    }
  }, [onAssistantRoute, isSidebarOpen, closeSidebar]);

  if (!onAssistantRoute || !isSidebarOpen) {
    return null;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          pathname,
          userName: user?.name?.trim() || undefined,
          level: progress.level,
          totalPoints: progress.totalPoints,
        }),
      });

      const data = (await res.json()) as ChatReplyDto;
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I couldn't process that. Try again.",
          policy: data.policy,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Please try again." },
      ]);
    }
  };

  const reportBotMessage = async (index: number) => {
    const msg = messages[index];
    if (!msg || msg.sender !== "bot" || !token || msg.reportId) return;
    try {
      const created = await postAiReport(token, {
        source: "chat",
        outputExcerpt: msg.text.slice(0, 500),
        reportReason: "User flagged chat explanation for review",
        priority: "medium",
        endpoint: "/api/chat",
        policyDecision: msg.policy?.decision,
        policyReason: msg.policy?.reason,
        policyConfidence: msg.policy?.confidence,
        policyRequestId: msg.policy?.requestId,
        pathname,
        reporterName: user?.name ?? undefined,
      });
      setMessages((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, reportId: created.reportId, reportError: undefined } : item
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, reportError: "Could not submit report. Try again." } : item
        )
      );
    }
  };

  return (
    <div
      className="sticky top-0 flex h-dvh max-h-dvh shrink-0 flex-col overflow-hidden border-l border-border bg-background transition-all duration-300 ease-in-out w-96"
    >
      {/* Chat Content */}
      <div className="flex min-h-0 flex-1 flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Study Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={closeSidebar}
              className="h-8 w-8"
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex min-h-[12rem] items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                Ask me anything about your studies!
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "bot" && token && (
                <div className="mt-1 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={Boolean(msg.reportId)}
                    onClick={() => void reportBotMessage(idx)}
                  >
                    <Flag className="mr-1 h-3 w-3" />
                    {msg.reportId ? "Reported" : "Report"}
                  </Button>
                </div>
              )}
              {msg.reportError && (
                <p className="mt-1 text-right text-xs text-destructive">{msg.reportError}</p>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3 py-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-100" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

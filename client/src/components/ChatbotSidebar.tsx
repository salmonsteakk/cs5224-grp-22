import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useChatbot } from "@/context/chatbot-context";
import { Button } from "@/components/ui/button";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatbotSidebar() {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useChatbot();
  const { pathname } = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "/api";
  const isStudyPage = pathname.startsWith("/learn") || pathname.startsWith("/practice");

  useEffect(() => {
    if (!isStudyPage && isSidebarOpen) {
      closeSidebar();
    }
  }, [isStudyPage, isSidebarOpen, closeSidebar]);

  if (!isStudyPage) {
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
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I couldn't process that. Try again.",
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

  return (
    <div
      className={`flex-shrink-0 min-h-screen bg-background border-l border-border transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen ? "w-96" : "w-12"
      }`}
    >
      {/* Toggle Button - Always visible when collapsed */}
      {!isSidebarOpen && (
        <div className="flex h-full w-12 items-center justify-center bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
            title="Open Study Assistant"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Chat Content */}
      <div className={`flex h-full flex-col ${isSidebarOpen ? "flex" : "hidden"} w-full`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Study Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
              title="Collapse sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="h-8 w-8"
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
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

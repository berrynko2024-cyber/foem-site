"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  artworkId: string;
  artworkTitle: string;
};

const STARTERS = [
  "What feeling does this work evoke?",
  "Tell me about the technique used",
  "How does this relate to the artist's practice?",
  "이 작품이 주는 감정을 설명해주세요",
];

export default function ArtworkChat({ artworkId, artworkTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `I'm here to help you explore "${artworkTitle}". What would you like to know — the emotion behind it, the technique, or the artist's intention?`,
        },
      ]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/artwork-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          message: text,
          history: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "Sorry, I couldn't respond." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-6 border border-[#d4e8da] text-[#268042] text-xs tracking-[0.15em] uppercase py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#e8f5ee] transition-colors duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h10v8H8l-3 2v-2H2V2Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
        Talk about this work
      </button>
    );
  }

  return (
    <div className="mt-6 border border-[#d4e8da] bg-[#F9F8F4]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#d4e8da]">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#268042]">FOEM Guide</p>
        <button
          onClick={() => setOpen(false)}
          className="text-[#9A9A9A] hover:text-[#4A4A4A] transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="h-56 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] text-sm leading-relaxed px-3 py-2 ${
                m.role === "user"
                  ? "bg-[#268042] text-white"
                  : "bg-white text-[#1A1A1A] border border-[#E8E6E2]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E8E6E2] px-3 py-2">
              <span className="text-[#9A9A9A] text-sm">···</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starters (only when first message is assistant) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11px] text-[#268042] border border-[#d4e8da] px-2 py-1 hover:bg-[#e8f5ee] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#d4e8da] flex">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about this work..."
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none placeholder:text-[#C0C0C0]"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="px-4 text-[#268042] disabled:text-[#d4e8da] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

const messages = [
  {
    sender: "support",
    text: "Hello! How can we help you?",
  },
  {
    sender: "user",
    text: "I need help with a loading request.",
  },
];

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                FluidLogix Support
              </h3>

              <div className="mt-1 flex items-center gap-2 text-xs text-emerald-500 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar bg-background/50">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium ${item.sender === "user"
                      ? "rounded-br-md bg-[#FFA500] text-[#071522] shadow-sm"
                      : "rounded-bl-md bg-muted text-foreground border border-border"
                    }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 focus-within:border-[#FFA500]">
              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Type a message..."
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <button
                type="button"
                onClick={() => setMessage("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFA500] text-[#071522] hover:bg-[#FFB52E] transition cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] shadow-xl shadow-orange-500/20 transition hover:scale-105 hover:bg-[#FFB52E]"
        aria-label="Open support chat"
      >
        {open ? (
          <X size={22} />
        ) : (
          <MessageCircle size={22} />
        )}
      </button>
    </>
  );
}
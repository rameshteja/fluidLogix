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
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-2xl border border-[#29455C] bg-[#0D2031] shadow-2xl shadow-black/40">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1A3042] px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">
                FluidLogix Support
              </h3>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#00C897]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C897]" />
                Online
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-[#607B98] hover:bg-[#172A3A] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${item.sender === "user"
                      ? "rounded-br-md bg-[#FFA500] text-[#071522]"
                      : "rounded-bl-md bg-[#172A3A] text-[#C6D2DE]"
                    }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[#1A3042] p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#24384D] bg-[#172437] px-3">
              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Type a message..."
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#607B98]"
              />

              <button
                type="button"
                onClick={() => setMessage("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFA500] text-[#071522]"
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
"use client";

import { useState } from "react";

const INITIAL_MESSAGE = {
  id: 1,
  role: "bot",
  text: "Hello. I am your IPR assistant. Ask me about patents, trademarks, or copyright.",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to reach chatbot backend.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: data.reply || "I don't have enough information to answer that.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: error.message || "Something went wrong while getting a response.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[min(92vw,370px)] h-[520px] bg-white border border-[#d9dde4] rounded-2xl shadow-[0_18px_40px_rgba(6,15,26,0.2)] flex flex-col overflow-hidden">
          <div className="bg-[#060f1a] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide">IPR Assistant</p>
              <p className="text-[11px] text-gray-300">Online now</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl leading-none text-gray-300 hover:text-white"
              aria-label="Close chatbot"
            >
              x
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#f4f7fb] space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "ml-auto bg-[#0d1b2a] text-white rounded-br-md"
                    : "mr-auto bg-white text-[#0d1b2a] border border-[#e4e9f2] rounded-bl-md"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-white text-[#0d1b2a] border border-[#e4e9f2] rounded-2xl rounded-bl-md px-3 py-2 text-sm">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#d9dde4] bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about IPR..."
              className="flex-1 border border-[#cfd6e2] rounded-full px-3 py-2 text-sm outline-none focus:border-[#0d1b2a]"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-[#0d1b2a] text-white text-base disabled:opacity-60"
              aria-label="Send message"
            >
              {"->"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full bg-[#060f1a] text-white shadow-[0_14px_30px_rgba(6,15,26,0.35)] text-sm font-semibold tracking-wide hover:bg-[#0d1b2a]"
          aria-label="Open IPR chatbot"
        >
          Chat with IPR Assistant
        </button>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";

const conversations = [];

export default function MessagesPage() {
  const [active, setActive] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const selectConvo = (conversation) => {
    setActive(conversation);
    setMessages(conversation.messages || []);
  };

  const send = () => {
    if (!input.trim() || !active) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: input,
      },
    ]);
    setInput("");
  };

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] flex bg-white">
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0d1b2a]">Messages</h2>
          <button className="text-gray-400" disabled>
            <span className="material-symbols-outlined text-xl">edit_square</span>
          </button>
        </div>
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-gray-400 text-base">search</span>
            <input
              placeholder="Filter by Case ID or Agent..."
              className="text-xs text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400"
              disabled
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConvo(c)}
              className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                active?.id === c.id ? "bg-blue-50 border-l-2 border-l-[#0d1b2a]" : ""
              }`}
            >
              <p className="text-sm font-semibold text-[#0d1b2a] leading-tight">{c.title}</p>
            </button>
          ))}
          {conversations.length === 0 && (
            <p className="text-center text-sm text-gray-400 px-6 py-12">
              No conversations yet. Messages will appear after backend sync.
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-md text-center">
              <h3 className="text-xl font-bold text-[#0d1b2a]">No chat selected</h3>
              <p className="text-sm text-gray-500 mt-2">
                Select a conversation when backend data is available.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold">
                {active.agent?.charAt(0) || "A"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#0d1b2a]">{active.agent}</p>
                <p className="text-xs text-gray-400">Case {active.id}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#0d1b2a] text-white rounded-tr-sm"
                        : "bg-gray-100 text-[#0d1b2a] rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-sm text-gray-400 pt-12">
                  No messages in this conversation.
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Type your response..."
                  className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
                />
                <button
                  onClick={send}
                  className="w-8 h-8 bg-[#0d1b2a] rounded-lg flex items-center justify-center hover:bg-[#1a2f4a] transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-base">send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-64 border-l border-gray-100 p-5 hidden xl:block overflow-y-auto shrink-0">
        <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
          Case Intelligence
        </h3>
        <p className="text-xs text-gray-400">
          No intelligence insights yet. This panel will populate from backend case data.
        </p>
      </div>
    </div>
  );
}

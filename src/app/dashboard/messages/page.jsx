"use client";
import { useState } from "react";
import Link from "next/link";

const conversations = [
  {
    id: "US-9921-A",
    title: "Solar Panel Utility Patent",
    agent: "Jameson Thorne, Esq.",
    preview: "Agent: Prior art search attached for your review before the...",
    status: "IN REVIEW",
    statusColor: "bg-amber-100 text-amber-700",
    time: "10:45 AM",
    unread: true,
    messages: [
      { id: 1, sender: "agent", name: "Jameson Thorne, Esq.", time: "9:15 AM", text: "Hello Dr. Jenkins, I've finished the preliminary prior art search for the Solar Panel Utility Patent (Case US-9921-A). There are three citations from the USPTO that we need to distinguish our claims from." },
      { id: 2, sender: "user", time: "9:30 AM", text: "Thanks Jameson. Which specific citations are you concerned about? If it's the 2018 Huawei filing, we have already redesigned the converter architecture to bypass that specific topology." },
      { id: 3, sender: "agent", name: "Jameson Thorne, Esq.", time: "9:45 AM", text: "Exactly. I've highlighted the relevant sections in the report. Please see the attached PDF for the search results and my notes on Section 4.2. We should discuss this before the Friday deadline.", attachment: { name: "Prior_Art_Search_US9921A.pdf", size: "2.4 MB" } },
    ],
  },
  {
    id: "EU-4402-B",
    title: "AI Diagnostic Algorithm",
    agent: "Maria Garcia",
    preview: "Drafting complete. Waiting for signatures.",
    status: "DRAFTING",
    statusColor: "text-blue-600",
    time: "Yesterday",
    unread: false,
    messages: [],
  },
  {
    id: "JP-2210-C",
    title: "Hydraulic Valve Design",
    agent: "Sarah Vance",
    preview: "Office Action response filed.",
    status: null,
    time: "Nov 12",
    unread: false,
    messages: [],
  },
  {
    id: "US-8812-D",
    title: "Nanotech Membrane",
    agent: "Legal Team",
    preview: "Case closed successfully.",
    status: null,
    time: "Oct 30",
    unread: false,
    messages: [],
  },
];

export default function MessagesPage() {
  const [active, setActive] = useState(conversations[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(conversations[0].messages);

  const selectConvo = (c) => {
    setActive(c);
    setMessages(c.messages);
  };

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), sender: "user", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), text: input }]);
    setInput("");
  };

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] flex bg-white">
      {/* Conversations list */}
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0d1b2a]">Messages</h2>
          <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
            <span className="material-symbols-outlined text-xl">edit_square</span>
          </button>
        </div>
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-gray-400 text-base">search</span>
            <input placeholder="Filter by Case ID or Agent..." className="text-xs text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConvo(c)}
              className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${active.id === c.id ? "bg-blue-50 border-l-2 border-l-[#0d1b2a]" : ""}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-[10px] font-bold text-[#f5a623] tracking-wider">{c.id}</p>
                  <p className="text-sm font-semibold text-[#0d1b2a] leading-tight">{c.title}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
              </div>
              <p className={`text-xs truncate ${c.unread ? "text-[#0d1b2a] font-medium" : "text-gray-400"}`}>{c.preview}</p>
              {c.status && (
                <span className={`inline-block mt-1.5 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${c.statusColor || "text-gray-400"}`}>
                  {c.status === "IN REVIEW" ? "● IN REVIEW" : c.status}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold">
            {active.agent.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#0d1b2a] flex items-center gap-1.5">
              {active.agent}
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            </p>
            <p className="text-xs text-gray-400">Lead Patent Attorney • Case {active.id}</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">description</span> Case Brief
          </button>
          <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="text-center">
            <span className="text-[10px] font-semibold tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">November 15, 2023</span>
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              {msg.sender === "agent" && (
                <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {active.agent.charAt(0)}
                </div>
              )}
              <div className={`max-w-sm ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "user" ? "bg-[#0d1b2a] text-white rounded-tr-sm" : "bg-gray-100 text-[#0d1b2a] rounded-tl-sm"}`}>
                  {msg.text}
                  {msg.attachment && (
                    <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <div className="w-7 h-7 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">PDF</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{msg.attachment.name}</p>
                        <p className="text-[10px] opacity-70">{msg.attachment.size} • Encrypted Secure File</p>
                      </div>
                      <button>
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time} {msg.sender === "user" && <span className="material-symbols-outlined text-[11px]">done_all</span>}</span>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400 pt-12">No messages yet. Start the conversation.</p>
          )}
          <div className="text-center">
            <span className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase">New Message Below</span>
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
            <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Type your response to your agent..."
              className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
            />
            <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
              <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
            </button>
            <button onClick={send} className="w-8 h-8 bg-[#0d1b2a] rounded-lg flex items-center justify-center hover:bg-[#1a2f4a] transition-colors">
              <span className="material-symbols-outlined text-white text-base">send</span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-600 text-xs">lock</span>
              <span className="text-[10px] text-gray-400">End-to-end encrypted communication</span>
            </div>
            <span className="text-[10px] text-gray-400">Press Enter to send</span>
          </div>
        </div>
      </div>

      {/* Right: Case Intelligence */}
      <div className="w-64 border-l border-gray-100 p-5 hidden xl:block overflow-y-auto shrink-0">
        <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#f5a623] text-sm">psychology</span>
          Case Intelligence
        </h3>

        {/* Stage */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider">Current Stage</span>
            <span className="font-bold text-[#0d1b2a]">65% Complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-[#0d1b2a] h-1.5 rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-xs font-semibold text-[#0d1b2a] mt-1.5">Prior Art Distinction Phase</p>
        </div>

        {/* Deadlines */}
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Critical Deadlines</p>
          <div className="space-y-2.5">
            {[
              { label: "Final Response Due", date: "Nov 24, 2023", sub: "in 7 Days", urgent: true },
              { label: "Agent Draft Review", date: "Nov 16, 2023", sub: "", urgent: false },
            ].map((d) => (
              <div key={d.label} className="flex items-start gap-2">
                <span className={`material-symbols-outlined text-sm mt-0.5 ${d.urgent ? "text-red-500" : "text-gray-400"}`}>calendar_today</span>
                <div>
                  <p className="text-xs font-semibold text-[#0d1b2a]">{d.label}</p>
                  <p className="text-[10px] text-gray-400">{d.date} {d.sub && <span className="text-red-500 font-medium">({d.sub})</span>}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared assets */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Shared Assets</p>
            <button className="text-[10px] text-[#f5a623] hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {["Converter_Schematic_v2.png", "Invention_Disclosure.docx"].map((f) => (
              <div key={f} className="flex items-center gap-2 py-1.5 border-b border-gray-50">
                <span className="material-symbols-outlined text-gray-400 text-sm">attach_file</span>
                <span className="text-xs text-[#0d1b2a] truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal team */}
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Assigned Legal Team</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#f5a623]/20 flex items-center justify-center text-[#f5a623] text-xs font-bold">M</div>
            <div>
              <p className="text-xs font-semibold text-[#0d1b2a]">Maria Garcia</p>
              <p className="text-[10px] text-gray-400">Senior Paralegal</p>
            </div>
          </div>
          <button className="w-full border border-gray-200 text-[#0d1b2a] text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Request Strategy Call
          </button>
        </div>
      </div>
    </div>
  );
}

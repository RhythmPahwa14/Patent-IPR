"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Minimize2, Loader2, Sparkles } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am IPR-Assist. How can I help you with Intellectual Property Rights today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chatbot";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.text })
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      const botResponse = { id: Date.now() + 1, html: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="group relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_40px_rgb(59,130,246,0.3)] active:scale-95"
            aria-label="Open Chat"
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
            <MessageCircle size={32} className="relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
          </button>
        )}
      </div>

      {/* Chat Window Popup */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[24px] bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-slate-200/60 backdrop-blur-2xl transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right ${isOpen ? "scale-100 opacity-100 translate-y-0" : "pointer-events-none scale-95 opacity-0 translate-y-8"
          }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-slate-900 via-[#1A365D] to-slate-900 px-5 py-4 text-white shadow-md">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white p-1 shadow-lg">
              <img src="/bot_logo.jpeg" alt="IPR Logo" className="h-full w-full object-contain mix-blend-multiply" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>' }} />
            </div>
            <div>
              <h3 className="text-[17px] font-bold tracking-tight text-white/95">IPR-Assist AI</h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#93C5FD]">Online & Ready</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="relative z-10 rounded-full bg-white/10 p-2 text-blue-100 transition-all hover:bg-white/20 hover:text-white hover:scale-105 active:scale-95"
            aria-label="Close Chat"
          >
            <Minimize2 size={18} />
          </button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5 custom-scrollbar">
          <div className="flex flex-col space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
              >
                {msg.sender === "bot" && (
                  <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-slate-200 p-[2px]">
                    <img src="/bot_logo.jpeg" alt="Bot" className="h-full w-full object-contain mix-blend-multiply" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-[20px] px-5 py-3.5 text-[15px] shadow-sm transition-all ${msg.sender === "user"
                    ? "rounded-tr-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
                    : "rounded-tl-sm bg-white text-slate-800 ring-1 ring-slate-200/60 shadow-slate-200/50"
                    } ${msg.isError ? "bg-red-50 text-red-600 ring-red-100" : ""}`}
                >
                  {msg.html ? (
                    <div
                      className="prose prose-sm prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0 prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: msg.html }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-slate-200 p-[2px]">
                  <img src="/bot_logo.jpeg" alt="Bot" className="h-full w-full object-contain mix-blend-multiply" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="flex items-center space-x-1.5 rounded-[20px] rounded-tl-sm bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/95 px-5 py-4 backdrop-blur-xl border-t border-slate-100">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent px-4 py-3 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
              placeholder="Ask about IPR in India..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="mr-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_4px_15px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none active:scale-95"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin text-white/80" /> : <Sparkles size={18} className="text-white drop-shadow-sm" />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] font-medium text-slate-400">
            <span>Powered by</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">IPR-Assist AI</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </>
  );
}

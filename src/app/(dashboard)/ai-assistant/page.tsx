"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { createCardByAI } from "../actions";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Halo Kelvin! Mau dibantu buat workspace atau tambah card hari ini? Tinggal bilang aja, misalnya: 'Buat card Week 9 Activity di workspace NLP'." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      // Panggil Server Action yang bakal hubungin ke Gemini API
      const response = await createCardByAI(userMsg);

      if (response?.success) {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          content: `Siap! ${response.message}. Card sudah muncul di workspace kamu ya Ngab! 🚀` 
        }]);
        toast.success("Action Executed!");
      } else {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          content: response?.message || "Waduh, aku bingung mau naruh di mana. Bisa kasih tahu nama workspacenya yang spesifik?" 
        }]);
      }
    } catch (error) {
      toast.error("AI connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 max-w-4xl mx-auto h-[90vh] flex flex-col">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
          <Sparkles className="w-4 h-4" /> Smart Automation
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">AI Assistant</h1>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 
                ${msg.role === "bot" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                {msg.role === "bot" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed
                ${msg.role === "bot" ? "bg-zinc-800/50 text-zinc-200" : "bg-indigo-600 text-white"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
              </div>
              <div className="h-12 w-32 bg-zinc-800/50 rounded-[1.5rem]" />
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <form onSubmit={onSendMessage} className="p-6 bg-zinc-950/50 border-t border-zinc-800">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik perintah... (e.g. 'Tambah card Belajar IoT di IoT')"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-6 pr-16 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
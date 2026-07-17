"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { MessageSquare, Send, Loader2, Sparkles, BookOpen, User } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "سلام همکار گرامی. من دستیار هوشمند بالینی کیس‌کلینیک هستم. در تمام مباحث دندانپزشکی بالینی (از قبیل تشخیص پاتولوژی‌های اندو، جراحی فک و صورت، پروتزها و فارماکولوژی) آماده پاسخگویی علمی و هدایت شما هستم. چه موضوعی را بررسی کنیم؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "تفاوت پالپیت برگشت‌پذیر و برگشت‌ناپذیر چیست؟",
    "توالی درمان اورژانسی آبسه حاد لثه چیست؟",
    "چگونه بی‌حسی بلاک مندیبولار (IANB) را موفق‌تر انجام دهیم؟",
    "تداخل دارویی آموکسی‌سیلین و مترونیدازول در دندانپزشکی"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    const userMessage = { role: "user" as const, content: textToSend.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
        })
      });

      if (!response.ok) {
        throw new Error("Chat completions route not ok");
      }

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "متاسفانه خطایی در اتصال به سرور هوش مصنوعی رخ داد. لطفاً چند لحظه دیگر امتحان کنید." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-between h-[calc(100vh-4rem)]">
        
        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-clinical-navy text-clinical-light mr-auto rounded-tl-none"
                  : "bg-slate-50 dark:bg-slate-900 border border-clinical-navy/5 text-clinical-navy dark:text-clinical-light ml-auto rounded-tr-none"
              }`}
            >
              <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center bg-clinical-clay/10 text-clinical-clay font-bold text-[10px]">
                {msg.role === "user" ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3 text-clinical-clay" />}
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] text-clinical-clay font-bold block">
                  {msg.role === "user" ? "شما (کارورز)" : "استاد هوش مصنوعی"}
                </span>
                <p className="whitespace-pre-line font-medium leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 text-clinical-navy dark:text-clinical-light ml-auto rounded-2xl rounded-tr-none border border-clinical-navy/5 text-xs max-w-[40%]">
              <Loader2 className="h-4 w-4 animate-spin text-clinical-clay" />
              <span className="text-[10px] font-semibold text-clinical-navy/70 dark:text-clinical-light/70">در حال نگارش پاسخ بالینی...</span>
            </div>
          )}
        </div>

        {/* Input & Quick Prompt suggestions */}
        <div className="mt-4 space-y-4">
          
          {/* Quick suggestions layout */}
          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="p-3 text-right text-[11px] font-semibold bg-white dark:bg-clinical-darker hover:bg-clinical-navy/5 dark:hover:bg-white/5 border border-clinical-navy/10 dark:border-white/10 rounded-xl transition-all text-clinical-navy/80 dark:text-clinical-light/80"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Form input */}
          <div className="p-3 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl flex gap-2 items-center shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              placeholder="سوال علمی خود در مورد پروتز، ترمیمی، جراحی لثه یا اندو را مطرح کنید..."
              className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-clinical-clay text-clinical-navy dark:text-clinical-light"
            />
            <button
              disabled={isLoading}
              onClick={() => handleSendMessage(input)}
              className="p-3 bg-clinical-navy dark:bg-clinical-light text-clinical-light dark:text-clinical-navy hover:bg-clinical-clay dark:hover:bg-clinical-clay transition-all rounded-xl shadow active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

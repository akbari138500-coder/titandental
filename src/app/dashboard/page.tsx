"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  BookOpen, Award, Flame, ArrowLeft, RefreshCw,
  BarChart3, TrendingUp, Clock, CheckCircle2,
  AlertCircle, ChevronLeft, Zap, Target, Brain
} from "lucide-react";
import { mockCases } from "@/lib/data/mockCases";

interface UserInfo { name: string; email: string; role: string; }

const subjects = [
  { name: "ترمیمی و اپراتیو", mastery: 85, color: "#3b82f6" },
  { name: "اندودانتیکس", mastery: 65, color: "#0d9488" },
  { name: "پریودانتیکس", mastery: 40, color: "#10b981" },
  { name: "پروتزهای ثابت", mastery: 90, color: "#6366f1" },
  { name: "پروتزهای متحرک", mastery: 30, color: "#8b5cf6" },
  { name: "ایمپلنتولوژی", mastery: 15, color: "#0ea5e9" },
  { name: "جراحی فک و صورت", mastery: 50, color: "#f43f5e" },
  { name: "آسیب‌شناسی", mastery: 75, color: "#f59e0b" },
  { name: "رادیولوژی دهان", mastery: 60, color: "#06b6d4" },
  { name: "دندانپزشکی کودکان", mastery: 20, color: "#ec4899" },
  { name: "ارتودنسی", mastery: 10, color: "#f97316" },
  { name: "فارماکولوژی", mastery: 80, color: "#22c55e" },
  { name: "طرح درمان جامع", mastery: 5, color: "#a82020" },
];

const spacedItems = [
  { id: "irreversible-pulpitis-36", title: "پالپیت برگشت‌ناپذیر علامت‌دار دندان ۳۶", lastScore: 68, due: "امروز", urgent: true },
  { id: "periapical-abscess-24", title: "آبسه حاد پری‌آپیکال دندان ۲۴", lastScore: 45, due: "فردا", urgent: true },
  { id: "chronic-periodontitis", title: "پریودنتیت مزمن با درگیری فورکا", lastScore: 82, due: "۳ روز دیگر", urgent: false },
];

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "صبح بخیر";
    if (h < 17) return "ظهر بخیر";
    return "عصر بخیر";
  };

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Greeting Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-clinical-navy/50 dark:text-clinical-light/50 mb-1">
              {greeting()}، {user ? user.name : "دانشجوی عزیز"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black">
              داشبورد پیشرفت بالینی
            </h1>
          </div>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-clinical-clay hover:bg-clinical-clay/90 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-clinical-clay/20 self-start md:self-auto"
          >
            <Zap className="h-3.5 w-3.5" />
            شروع کیس جدید
          </Link>
        </div>

        {/* ── Top Stats Row ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "استریک مطالعه", value: "۱۲ روز", sub: "متوالی", icon: Flame, bg: "card-gradient-red", iconColor: "text-white" },
            { label: "کیس حل شده", value: "۸ کیس", sub: "این ماه", icon: BookOpen, bg: "card-gradient-navy", iconColor: "text-white" },
            { label: "میانگین نمره AI", value: "۸۴٪", sub: "از ۱۰۰", icon: Brain, bg: "card-gradient-teal", iconColor: "text-white" },
            { label: "تا آزمون ملی", value: "۴۸ روز", sub: "شمارش معکوس", icon: Target, bg: "card-gradient-gold", iconColor: "text-white" },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.bg} card-hover`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/75 mb-1">{s.label}</p>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">{s.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <s.icon className={`h-4.5 w-4.5 ${s.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left col (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recommended Case Banner */}
            <div className="card-gradient-navy rounded-3xl p-6 relative overflow-hidden noise-overlay">
              <div className="absolute top-0 left-0 w-40 h-40 bg-clinical-clay/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-gold">
                    <TrendingUp className="h-3 w-3" /> پیشنهاد هوشمند امروز
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
                  مرور کیس: پالپیت برگشت‌ناپذیر علامت‌دار دندان ۳۶
                </h2>
                <p className="text-xs text-white/65 leading-relaxed mb-5 max-w-lg">
                  با توجه به نمره ۶۸٪ در آخرین تلاش، الگوریتم تکرار فاصله‌دار این کیس را برای مرور امروز انتخاب کرده است.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/cases/irreversible-pulpitis-36"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-clinical-clay hover:bg-clinical-clay/90 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    ورود به پرونده <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/cases"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/20 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    کیس دیگری انتخاب کنم
                  </Link>
                </div>
              </div>
            </div>

            {/* Subject Mastery */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">نقشه تسلط بالینی</h3>
                  <p className="text-xs text-clinical-navy/50 dark:text-clinical-light/50 mt-0.5">۱۳ ماژول اصلی دندانپزشکی</p>
                </div>
                <BarChart3 className="h-4 w-4 text-clinical-navy/30 dark:text-clinical-light/30" />
              </div>

              <div className="space-y-3">
                {subjects.map((s, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-clinical-navy/80 dark:text-clinical-light/80">{s.name}</span>
                      <span className="font-bold tabular-nums" style={{ color: s.color }}>{s.mastery}٪</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: mounted ? `${s.mastery}%` : "0%", backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right col (1/3) */}
          <div className="space-y-5">

            {/* Today's checklist */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> اهداف امروز
              </h3>
              <div className="space-y-2.5">
                {[
                  { done: true, text: "حل ۲ کیس بالینی (کامل شد)" },
                  { done: true, text: "مرور کارت‌های فلش (کامل شد)" },
                  { done: false, text: "تمرین ۱۰ سوال QBank" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg ${item.done ? "bg-clinical-green/8 dark:bg-green-900/20" : "bg-clinical-light dark:bg-clinical-dark"}`}>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${item.done ? "text-clinical-green" : "text-clinical-navy/20 dark:text-white/20"}`} />
                    <span className={item.done ? "line-through text-clinical-navy/50 dark:text-white/40" : "font-medium"}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spaced Repetition Queue */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" /> جعبه لایتنر
                </h3>
                <span className="text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold px-2 py-0.5 rounded-full">
                  {spacedItems.filter(s => s.urgent).length} برای مرور
                </span>
              </div>

              <div className="space-y-3">
                {spacedItems.map((item) => (
                  <div key={item.id} className="p-3.5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold leading-snug">{item.title}</h4>
                      {item.urgent && <AlertCircle className="h-3.5 w-3.5 text-clinical-clay shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-clinical-navy/50 dark:text-white/40">نمره قبلی:</span>
                        <span
                          className={`text-[10px] font-bold ${item.lastScore >= 70 ? "text-clinical-green" : item.lastScore >= 50 ? "text-amber-500" : "text-clinical-red"}`}
                        >
                          {item.lastScore}٪
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${item.urgent ? "text-clinical-clay" : "text-clinical-navy/40 dark:text-white/30"}`}>
                        <Clock className="h-3 w-3 inline-block ml-0.5" />{item.due}
                      </span>
                    </div>
                    <Link
                      href={`/cases/${item.id}`}
                      className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-clinical-navy dark:bg-white/10 hover:bg-clinical-clay dark:hover:bg-clinical-clay text-white text-[10px] font-bold rounded-lg transition-colors"
                    >
                      شروع مرور <ChevronLeft className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-navy/50 dark:text-clinical-light/50">دسترسی سریع</h3>
              {[
                { href: "/qbank", label: "بانک سوالات MCQ", icon: Award },
                { href: "/chat", label: "استاد هوشمند بالینی", icon: Brain },
                { href: "/courses", label: "دروس و مباحث", icon: BookOpen },
              ].map((l, i) => (
                <Link
                  key={i}
                  href={l.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-clinical-navy/5 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-clinical-clay/10 flex items-center justify-center">
                    <l.icon className="h-4 w-4 text-clinical-clay" />
                  </div>
                  <span className="text-xs font-semibold flex-1">{l.label}</span>
                  <ChevronLeft className="h-3.5 w-3.5 text-clinical-navy/30 dark:text-white/30 group-hover:text-clinical-clay transition-colors" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

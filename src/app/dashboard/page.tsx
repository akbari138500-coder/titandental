import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  BookOpen, Award, Flame, ArrowLeft, RefreshCw,
  BarChart3, TrendingUp, Clock, CheckCircle2,
  AlertCircle, ChevronLeft, Zap, Target, Brain, Activity
} from "lucide-react";
import HeatmapChart from "@/components/HeatmapChart";
import Odontogram from "@/components/Odontogram";

export default async function DashboardPage() {
  const reqHeaders = headers();
  const userId = reqHeaders.get("x-user-id");
  const userName = reqHeaders.get("x-user-name") ? decodeURIComponent(reqHeaders.get("x-user-name")!) : "دانشجو";

  if (!userId) {
    redirect("/auth/login");
  }

  // Fetch real data from DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studyProgress: { include: { subject: true } },
      spacedRepetitions: {
        where: { nextReviewAt: { lte: new Date() } },
        include: { case: true },
        orderBy: { nextReviewAt: 'asc' },
        take: 5
      },
      attempts: {
        orderBy: { completedAt: 'desc' },
        take: 10
      }
    }
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Calculate stats
  const casesCompleted = user.attempts.length;
  const averageScore = casesCompleted > 0 
    ? Math.round(user.attempts.reduce((sum, a) => sum + a.finalScore, 0) / casesCompleted)
    : 0;

  // Prepare Heatmap Data
  const heatmapData = user.studyProgress.map(sp => ({
    subject: sp.subject.name,
    A: sp.mastery,
    fullMark: 100
  }));

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
              {greeting()}، {userName}
            </p>
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
              داشبورد بالینی <span className="text-sm font-bold bg-clinical-clay/10 text-clinical-clay px-2 py-1 rounded-lg">XP: {user.xp}</span>
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
            { label: "امتیاز تجربه (XP)", value: user.xp.toString(), sub: "گیمیفیکیشن", icon: Award, bg: "card-gradient-gold", iconColor: "text-white" },
            { label: "کیس‌های حل شده", value: `${casesCompleted} کیس`, sub: "مجموع تاریخچه", icon: BookOpen, bg: "card-gradient-navy", iconColor: "text-white" },
            { label: "میانگین نمره", value: `${averageScore}٪`, sub: "از ۱۰۰", icon: Brain, bg: "card-gradient-teal", iconColor: "text-white" },
            { label: "مرورهای امروز", value: `${user.spacedRepetitions.length} آیتم`, sub: "الگوریتم هوشمند", icon: RefreshCw, bg: "card-gradient-red", iconColor: "text-white" },
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

            {/* Subject Mastery Heatmap */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-clinical-clay" /> نقشه تسلط بالینی (هیت‌مپ)</h3>
                  <p className="text-xs text-clinical-navy/50 dark:text-clinical-light/50 mt-0.5">تحلیل هوش مصنوعی از نقاط ضعف و قوت شما بر اساس کیس‌های حل شده</p>
                </div>
              </div>
              <HeatmapChart data={heatmapData} />
            </div>

            {/* Interactive Odontogram Preview */}
            <div className="glass-card rounded-2xl p-6 space-y-5 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-clinical-clay" /> چارت دندانی سه‌بعدی تعاملی</h3>
                  <p className="text-xs text-clinical-navy/50 dark:text-clinical-light/50 mt-0.5">ثبت دیجیتال وضعیت دندان‌های بیمار در ایستگاه‌های معاینه</p>
                </div>
              </div>
              {/* Note: This is an interactive component. In a real exam, it reads/writes to the DB JSON. */}
              <Odontogram />
            </div>

          </div>

          {/* Right col (1/3) */}
          <div className="space-y-5">

            {/* Spaced Repetition Queue */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" /> جعبه لایتنر (مرورها)
                </h3>
                <span className="text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold px-2 py-0.5 rounded-full">
                  {user.spacedRepetitions.length} برای مرور
                </span>
              </div>

              {user.spacedRepetitions.length === 0 ? (
                <div className="p-6 text-center text-xs text-clinical-navy/50 dark:text-white/40 bg-clinical-navy/5 dark:bg-white/5 rounded-xl border border-dashed border-clinical-navy/10 dark:border-white/10">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50 text-clinical-green" />
                  آیتمی برای مرور امروز وجود ندارد. شما عالی هستید!
                </div>
              ) : (
                <div className="space-y-3">
                  {user.spacedRepetitions.map((item) => (
                    <div key={item.id} className="p-3.5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5 space-y-2.5 hover:border-clinical-clay/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold leading-snug truncate pr-2">{item.case.title}</h4>
                        <AlertCircle className="h-3.5 w-3.5 text-clinical-clay shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-clinical-navy/50 dark:text-white/40">
                          نیاز به مرور فوری
                        </span>
                        <span className="text-[10px] font-semibold text-clinical-clay">
                          <Clock className="h-3 w-3 inline-block ml-0.5" />امروز
                        </span>
                      </div>
                      <Link
                        href={`/cases/${item.case.slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-clinical-navy dark:bg-white/10 hover:bg-clinical-clay dark:hover:bg-clinical-clay text-white text-[10px] font-bold rounded-lg transition-colors"
                      >
                        شروع مرور <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-navy/50 dark:text-clinical-light/50">دسترسی سریع</h3>
              {[
                { href: "/cases", label: "بیماران مجازی", icon: BookOpen },
                { href: "/chat", label: "مشاوره با استاد هوشمند", icon: Brain },
                { href: "/admin", label: "پنل مدیریت", icon: Target },
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

"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  BookOpen, Award, Flame, Calendar, CheckCircle, 
  HelpCircle, ArrowLeft, RefreshCw, BarChart2, Star 
} from "lucide-react";
import { mockCases } from "@/lib/data/mockCases";

export default function DashboardPage() {
  const [activeStreak, setActiveStreak] = useState(12); // Mock streak days
  const [solvedCount, setSolvedCount] = useState(8);
  const [averageScore, setAverageScore] = useState(84);

  // 13 Subjects from Dentistry Curriculum
  const subjects = [
    { name: "ترمیمی و اپراتیو", mastery: 85, color: "bg-blue-600" },
    { name: "اندودانتیکس", mastery: 65, color: "bg-teal-600" },
    { name: "پریودانتیکس", mastery: 40, color: "bg-emerald-600" },
    { name: "پروتزهای ثابت", mastery: 90, color: "bg-indigo-600" },
    { name: "پروتزهای متحرک", mastery: 30, color: "bg-purple-600" },
    { name: "ایمپلنتولوژی", mastery: 15, color: "bg-sky-600" },
    { name: "جراحی فک و صورت", mastery: 50, color: "bg-rose-600" },
    { name: "آسیب‌شناسی و طب دهان", mastery: 75, color: "bg-amber-600" },
    { name: "رادیولوژی دهان و فک", mastery: 60, color: "bg-cyan-600" },
    { name: "دندانپزشکی کودکان", mastery: 20, color: "bg-pink-600" },
    { name: "ارتودنسی", mastery: 10, color: "bg-orange-600" },
    { name: "فارماکولوژی دندانپزشکی", mastery: 80, color: "bg-emerald-500" },
    { name: "طرح درمان جامع", mastery: 5, color: "bg-clinical-clay" }
  ];

  // Spaced Repetition Mock items
  const spacedRepetitionItems = [
    { 
      id: "case-endo-1", 
      title: "پالپیت برگشت‌ناپذیر علامت‌دار دندان ۳۶", 
      lastScore: 68, 
      dueDate: "امروز (نیاز به مرور)",
      severity: "high"
    },
    { 
      id: "case-endo-2", 
      title: "آبسه حاد اپیکال دندان ۲۴ با عصب‌کشی ناقص", 
      lastScore: 45, 
      dueDate: "فردا (نیاز به مرور)",
      severity: "critical"
    }
  ];

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Hero Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold">داشبورد پیشرفت علمی و کارآموزی</h1>
            <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">خوش آمدید دکتر محمدی. مسیر یادگیری کیسمحور و تکرار فاصله‌دار شما آماده است.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-clinical-clay animate-bounce" />
              <div>
                <span className="text-lg font-bold block">{activeStreak} روز</span>
                <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50">استریک مطالعه</span>
              </div>
            </div>
            <div className="h-8 w-px bg-clinical-navy/10 dark:bg-white/10" />
            <div>
              <span className="text-lg font-bold block">{solvedCount} کیس</span>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50">کل پاسخ‌ها</span>
            </div>
            <div className="h-8 w-px bg-clinical-navy/10 dark:bg-white/10" />
            <div>
              <span className="text-lg font-bold block">{averageScore}٪</span>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50">میانگین نمره AI</span>
            </div>
          </div>
        </div>

        {/* 2 Column Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recommended case & Subject Mastery List (2/3 size) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Recommendation Path */}
            <div className="p-6 bg-clinical-navy text-clinical-light dark:bg-slate-900 rounded-2xl border border-clinical-navy/20 dark:border-white/5 relative overflow-hidden">
              {/* Decorative graphic background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-clinical-clay/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <span className="px-2.5 py-1 text-[9px] bg-clinical-clay/20 text-clinical-clay font-bold rounded-full uppercase tracking-wider">پیشنهاد امروز</span>
              <h2 className="text-lg font-bold mt-2">مرور کیس اندودانتیکس: پالپیت برگشت‌ناپذیر علامت‌دار دندان ۳۶</h2>
              <p className="text-xs text-clinical-light/70 mt-1 leading-relaxed max-w-xl">
                با توجه به ضعف قبلی شما در تشخیص توالی درمانی دندان‌های با درد ضربان‌دار و تکرار فاصله‌دار، حل مجدد این کیس برای تثبیت آمادگی امتحان به شدت توصیه می‌شود.
              </p>
              
              <div className="mt-5 flex gap-3">
                <Link 
                  href="/cases/irreversible-pulpitis-36" 
                  className="px-4 py-2 bg-clinical-clay hover:bg-clinical-clay/90 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  ورود به پرونده بیمار <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
                <Link 
                  href="/cases" 
                  className="px-4 py-2 border border-white/20 hover:bg-white/5 text-xs font-bold rounded-xl transition-all"
                >
                  مشاهده همه کیس‌ها
                </Link>
              </div>
            </div>

            {/* Subject Mastery Heatmap */}
            <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay">درصد تسلط بر مباحث دندانپزشکی بالینی (۱۳ ماژول اصلی)</h3>
                <BarChart2 className="h-4 w-4 text-clinical-navy/40 dark:text-clinical-light/40" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subj, idx) => (
                  <div key={idx} className="p-3.5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{subj.name}</span>
                      <span className="font-bold text-clinical-clay">{subj.mastery}٪</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        style={{ width: `${subj.mastery}%` }}
                        className={`h-full rounded-full ${subj.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Spaced Repetition (Laitner) & Study Calendar */}
          <div className="space-y-6">
            
            {/* Study Exam Countdown Card */}
            <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay">شمارش معکوس آزمون ملی دندانپزشکی</h3>
              <div className="p-4 bg-clinical-navy/5 dark:bg-white/5 rounded-xl text-center space-y-1 border border-clinical-navy/10">
                <span className="text-2xl font-black text-clinical-clay block">۴۸ روز</span>
                <span className="text-[10px] text-clinical-navy/60 dark:text-clinical-light/60">تا آزمون صلاحیت بالینی و پره‌انترنی دندانپزشکی</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-clinical-green" />
                  <span>هدف روزانه: حل ۲ کیس بالینی (کامل شد)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-clinical-green" />
                  <span>مرور کارت‌های فلش تکرار فاصله‌دار (کامل شد)</span>
                </div>
              </div>
            </div>

            {/* Spaced Repetition Box */}
            <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay">جعبه لایتنر کیس‌ها (Spaced Repetition)</h3>
                <RefreshCw className="h-4 w-4 text-clinical-navy/40 dark:text-clinical-light/40" />
              </div>
              
              <div className="space-y-3">
                {spacedRepetitionItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-clinical-navy/50 dark:text-clinical-light/50">
                        <span>نمره قبلی: {item.lastScore}٪</span>
                        <span className="text-clinical-clay font-medium">{item.dueDate}</span>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/cases/${item.id}`} 
                      className="w-full py-1.5 bg-clinical-navy dark:bg-clinical-light hover:bg-clinical-clay dark:hover:bg-clinical-clay text-clinical-light dark:text-clinical-navy hover:text-white dark:hover:text-white text-[10px] font-bold rounded-lg text-center block transition-colors"
                    >
                      شروع مرور کیس
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Star, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function CoursesPage() {
  const subjects = [
    { 
      id: "endodontics", 
      name: "اندودانتیکس (درمان ریشه)", 
      desc: "شامل تشخیص پاتولوژی پالپ/پریاپیکال، تعیین طول کارکرد، شستشو و فایلینگ روتاری کانال‌ها.",
      casesCount: 15,
      active: true,
      mastery: 65
    },
    { 
      id: "restorative", 
      name: "دندانپزشکی ترمیمی و اپراتیو", 
      desc: "شامل اصول تراش حفره کلاس I تا VI، تفاوت‌های مواد آمالگام/کامپوزیت و تکنیک‌های باندینگ.",
      casesCount: 12,
      active: false,
      mastery: 85
    },
    { 
      id: "periodontics", 
      name: "پریودانتیکس (بیماری‌های لثه)", 
      desc: "شامل معاینات جرم‌گیری، جراحی‌های لثه و بررسی وضعیت تحلیل استخوان آلوئول دندان.",
      casesCount: 10,
      active: false,
      mastery: 40
    },
    { 
      id: "prosthodontics", 
      name: "پروتزهای دندانی ثابت و متحرک", 
      desc: "شامل اصول طراحی روکش، بریج‌های دندانی، متحرک کامل و پارسیل به همراه کلاسپ‌ها.",
      casesCount: 14,
      active: false,
      mastery: 45
    }
  ];

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="border-b border-clinical-navy/10 dark:border-white/5 pb-6">
          <h1 className="text-xl md:text-2xl font-black">دروس و ماژول‌های دندانپزشکی بالینی</h1>
          <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">دسترسی به بانک کیس اختصاصی و آموزش‌های خلاصه مبتنی بر OSCE برای هر ماژول علمی</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subj) => (
            <div 
              key={subj.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between h-[220px] transition-all bg-white dark:bg-clinical-darker ${
                subj.active 
                  ? "border-clinical-navy/15 dark:border-white/10 hover:shadow-md" 
                  : "opacity-75 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold">{subj.name}</h3>
                  {subj.active ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                      دسترسی فعال
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400 flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> قفل
                    </span>
                  )}
                </div>
                <p className="text-xs text-clinical-navy/70 dark:text-clinical-light/70 leading-relaxed line-clamp-3">
                  {subj.desc}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-clinical-navy/5 dark:border-white/5 pt-4">
                <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50">
                  {subj.casesCount} کیس بالینی فعال
                </span>

                {subj.active ? (
                  <Link 
                    href="/cases" 
                    className="px-4 py-2 bg-clinical-navy hover:bg-clinical-clay text-clinical-light text-[10px] font-bold rounded-xl transition-all"
                  >
                    مشاهده کیس‌ها
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-xl cursor-not-allowed"
                  >
                    به زودی...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

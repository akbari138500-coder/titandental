"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { mockCases } from "@/lib/data/mockCases";
import { BookOpen, User, ArrowLeft, Star, HeartCrack } from "lucide-react";

export default function CasesDirectoryPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");

  const filteredCases = selectedDifficulty === "ALL" 
    ? mockCases
    : mockCases.filter(c => c.difficulty === selectedDifficulty);

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Directory header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-clinical-navy/10 dark:border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black">بانک پرونده‌های بالینی (Case Bank)</h1>
            <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">کیس‌های درسی شبیه‌سازی شده برای یادگیری مهارت تشخیص و توالی درمان بالینی</p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 bg-clinical-navy/5 dark:bg-white/5 p-1 rounded-xl border border-clinical-navy/10 dark:border-white/5 text-xs font-semibold">
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDifficulty === diff 
                    ? "bg-clinical-navy text-clinical-light dark:bg-clinical-light dark:text-clinical-navy" 
                    : "text-clinical-navy/70 dark:text-clinical-light/70 hover:bg-clinical-navy/5"
                }`}
              >
                {diff === "ALL" ? "همه کیس‌ها" : diff === "BEGINNER" ? "مقدماتی" : diff === "INTERMEDIATE" ? "متوسط" : "پیشرفته"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of case folders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                    اندودانتیکس
                  </span>
                  <span className="text-[10px] text-clinical-clay font-bold font-mono">
                    {caseItem.difficulty}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold leading-snug">{caseItem.title}</h3>
                  <p className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50 font-medium">بیمار: {caseItem.demographic}</p>
                </div>

                <p className="text-xs text-clinical-navy/80 dark:text-clinical-light/80 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60">
                  <strong className="text-clinical-clay text-[10px] block mb-0.5">شکایت بیمار:</strong>
                  {caseItem.chiefComplaint}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-clinical-navy/5 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-clinical-navy/60 dark:text-clinical-light/60 italic font-sans max-w-[55%] truncate">
                  منبع: {caseItem.scientificSource.split("-")[0]}
                </span>
                
                <Link 
                  href={`/cases/${caseItem.slug}`} 
                  className="px-3.5 py-1.5 bg-clinical-navy hover:bg-clinical-clay text-clinical-light text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all"
                >
                  حل پرونده <ArrowLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

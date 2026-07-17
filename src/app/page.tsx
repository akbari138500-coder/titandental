import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Activity, ShieldAlert, Award, ArrowLeft, BookOpen, Stethoscope } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Subtle blur background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-clinical-clay/5 dark:bg-clinical-clay/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4">
          <span className="px-3 py-1 text-xs bg-clinical-clay/10 text-clinical-clay font-bold rounded-full border border-clinical-clay/20 inline-flex items-center gap-1.5 animate-pulse">
            <Activity className="h-3 w-3" /> شبیه‌ساز بالینی کارآموزان دندانپزشکی
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            مهارت‌های بالینی و تشخیص خود را با <span className="text-clinical-clay">پرونده‌های واقعی بیمار</span> بسنجید
          </h1>
          
          <p className="text-sm md:text-base text-clinical-navy/70 dark:text-clinical-light/70 max-w-2xl mx-auto leading-relaxed">
            کیس‌کلینیک اولین پلتفرم تخصصی دندانپزشکی در ایران است که پاسخ‌های آزاد و طرح درمان شما را با استفاده از هوش مصنوعی ارزیابی کرده و بازخوردی عمیق در سطح سناریوهای OSCE به شما می‌دهد.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-clinical-clay hover:bg-clinical-clay/90 text-clinical-light font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            ورود به پنل کارورزی (داشبورد) <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/cases"
            className="px-6 py-3.5 border border-clinical-navy/10 dark:border-white/10 hover:bg-clinical-navy/5 dark:hover:bg-white/5 text-xs font-bold rounded-xl transition-all"
          >
            مشاهده بانک کیس‌ها
          </Link>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-clinical-navy/10 dark:border-white/5">
        <h2 className="text-xl md:text-2xl font-black text-center mb-12">ارکان کلیدی آموزش بالینی کیس‌کلینیک</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
            <div className="h-10 w-10 bg-clinical-clay/10 rounded-xl flex items-center justify-center text-clinical-clay">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold">شبیه‌سازی تدریجی OSCE</h3>
            <p className="text-xs text-clinical-navy/75 dark:text-clinical-light/75 leading-relaxed">
              پرونده بیمار به صورت گام‌به‌گام و با کلیک شما باز می‌شود. تست‌های تشخیصی غیرضروری نمره منفی دارند تا تفکر منطقی دندانپزشکی در شما تقویت شود.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
            <div className="h-10 w-10 bg-clinical-clay/10 rounded-xl flex items-center justify-center text-clinical-clay">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold">ویوئر رادیوگرافی PACS</h3>
            <p className="text-xs text-clinical-navy/75 dark:text-clinical-light/75 leading-relaxed">
              تصاویر رادیوگرافی دندان را در پنل اختصاصی با فیلتر کنتراست، روشنایی و زوم/پن بررسی کنید تا کوچک‌ترین ضایعات اپیکال یا پوسیدگی‌ها را بیابید.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
            <div className="h-10 w-10 bg-clinical-clay/10 rounded-xl flex items-center justify-center text-clinical-clay">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold">ارزیابی هوشمند طرح درمان (AI)</h3>
            <p className="text-xs text-clinical-navy/75 dark:text-clinical-light/75 leading-relaxed">
              طرح درمان خود را بنویسید تا هوش مصنوعی انویدیا آن را با چک‌لیست روباریک‌های مرجع کتب دانشگاهی مقایسه کند و هشدارهای ایمنی بالینی بدهد.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

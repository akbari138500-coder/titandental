import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Activity, ShieldAlert, Award, ArrowLeft, BookOpen,
  Stethoscope, Brain, BarChart3, Zap, Star, Users,
  CheckCircle, ChevronLeft, Clock
} from "lucide-react";

const stats = [
  { value: "۱,۲۰۰+", label: "پرونده بالینی", icon: BookOpen },
  { value: "۹۸٪", label: "رضایت دانشجویان", icon: Star },
  { value: "۱۵۰+", label: "دانشکده طرف قرارداد", icon: Users },
  { value: "۴.۸/۵", label: "امتیاز کاربران", icon: Award },
];

const features = [
  {
    icon: Stethoscope,
    title: "شبیه‌سازی تدریجی OSCE",
    description: "پرونده بیمار قدم‌به‌قدم باز می‌شود. هر تست تشخیصی غیرضروری که درخواست کنید، از نمره شما کم می‌شود — دقیقاً مثل یک اتاق معاینه واقعی.",
    color: "card-gradient-red",
    delay: "0ms",
  },
  {
    icon: Brain,
    title: "ارزیابی هوشمند با AI",
    description: "طرح درمان آزاد شما توسط مدل Llama 3.1 با روباریک‌های کتب مرجع (کوهن، کارانزا، مالامد) مقایسه و نمره‌دهی می‌شود.",
    color: "card-gradient-navy",
    delay: "100ms",
  },
  {
    icon: BarChart3,
    title: "تکرار فاصله‌دار (SM-2)",
    description: "الگوریتم جعبه لایتنر هوشمند، پرونده‌هایی که ضعف دارید را دقیقاً در لحظه درست برای مرور مجدد به شما پیشنهاد می‌دهد.",
    color: "card-gradient-teal",
    delay: "200ms",
  },
  {
    icon: ShieldAlert,
    title: "هشدار ایمنی بالینی",
    description: "سیستم هوش مصنوعی خطاهای ایمنی خطرناک (مانند استفاده نادرست از دارو یا توالی درمان اشتباه) را شناسایی و گزارش می‌کند.",
    color: "card-gradient-gold",
    delay: "300ms",
  },
];

const subjects = [
  "اندودانتیکس", "ترمیمی", "پریودانتیکس", "پروتز ثابت",
  "جراحی", "کودکان", "رادیولوژی", "فارماکولوژی",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light overflow-x-hidden">
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-clinical-clay/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-clinical-teal/8 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-clinical-gold/4 rounded-full blur-3xl pointer-events-none" />

        {/* Floating icons */}
        <div className="absolute top-32 left-[10%] animate-float opacity-20 hidden lg:block">
          <div className="w-12 h-12 rounded-xl bg-clinical-clay flex items-center justify-center shadow-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-40 right-[8%] animate-float-delay opacity-20 hidden lg:block">
          <div className="w-10 h-10 rounded-xl bg-clinical-teal flex items-center justify-center shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clinical-clay/10 dark:bg-clinical-clay/20 border border-clinical-clay/20 text-clinical-clay text-xs font-bold mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clinical-clay opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-clinical-clay"></span>
            </span>
            اولین پلتفرم شبیه‌سازی OSCE دندانپزشکی در ایران
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            مهارت بالینی واقعی،<br />
            <span className="gradient-text">نه فقط حفظ کتاب</span>
          </h1>

          <p className="text-base md:text-xl text-clinical-navy/65 dark:text-clinical-light/65 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
            پرونده‌های بیمار واقعی را حل کنید. هوش مصنوعی طرح درمان شما را مثل استاد بالینی ارزیابی می‌کند. برای آزمون صلاحیت دندانپزشکی آماده شوید.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link
              href="/auth/register"
              id="hero-register-btn"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-clinical-clay hover:bg-clinical-clay/90 text-white font-bold text-sm rounded-2xl shadow-lg shadow-clinical-clay/25 transition-all active:scale-95 hover:-translate-y-0.5"
            >
              شروع رایگان (بدون نیاز به کارت)
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/cases"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 dark:bg-clinical-darker/80 hover:bg-white dark:hover:bg-clinical-darker border border-clinical-navy/10 dark:border-white/10 text-clinical-navy dark:text-clinical-light font-bold text-sm rounded-2xl backdrop-blur-sm transition-all active:scale-95 hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4 text-clinical-clay" />
              مشاهده بانک کیس‌ها
            </Link>
          </div>

          {/* Subjects pill tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 animate-slide-up" style={{ animationDelay: "400ms" }}>
            {subjects.map((s) => (
              <span key={s} className="px-3 py-1 text-xs rounded-full bg-white/70 dark:bg-white/5 border border-clinical-navy/8 dark:border-white/8 text-clinical-navy/70 dark:text-clinical-light/70 backdrop-blur-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-clinical-light dark:from-clinical-dark to-transparent pointer-events-none" />
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-center card-hover">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-clinical-clay/10 mb-3">
                <stat.icon className="h-5 w-5 text-clinical-clay" />
              </div>
              <div className="text-2xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="badge badge-red mb-4">
            <Zap className="h-3 w-3" /> قابلیت‌های پلتفرم
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            چرا کیس‌کلینیک با بقیه فرق دارد؟
          </h2>
          <p className="text-sm text-clinical-navy/60 dark:text-clinical-light/60 mt-4 max-w-xl mx-auto">
            ترکیب پداگوژی OSCE با هوش مصنوعی پیشرفته، یک تجربه یادگیری بی‌نظیر خلق می‌کند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group glass-card rounded-3xl overflow-hidden card-hover">
              <div className={`${f.color} p-6`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-clinical-navy/75 dark:text-clinical-light/75 leading-relaxed">
                  {f.description}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-clinical-clay group-hover:gap-3 transition-all">
                  بیشتر بدانید <ChevronLeft className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black">در ۳ قدم شروع کنید</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 right-[16.67%] left-[16.67%] h-px bg-gradient-to-l from-transparent via-clinical-clay/30 to-transparent" />
          {[
            { step: "۱", title: "ثبت‌نام رایگان", desc: "فقط ایمیل و رمز عبور. بدون نیاز به تأیید، بلافاصله وارد شوید." },
            { step: "۲", title: "انتخاب پرونده", desc: "از بانک کیس‌ها با سطح دشواری مختلف یک پرونده انتخاب کنید." },
            { step: "۳", title: "دریافت بازخورد AI", desc: "طرح درمان خود را بنویسید و نمره و بازخورد استاد هوشمند را دریافت کنید." },
          ].map((s, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full card-gradient-red mx-auto flex items-center justify-center shadow-lg shadow-clinical-clay/20">
                <span className="text-3xl font-black text-white">{s.step}</span>
              </div>
              <h3 className="text-base font-bold">{s.title}</h3>
              <p className="text-sm text-clinical-navy/65 dark:text-clinical-light/65 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-gradient-navy rounded-3xl p-10 md:p-16 text-center relative overflow-hidden noise-overlay">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-clinical-clay/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <span className="badge badge-gold">
                <Clock className="h-3 w-3" /> شروع از امروز
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                آزمون صلاحیت شما<br />
                <span className="shimmer-text">۴۸ روز دیگر است</span>
              </h2>
              <p className="text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
                هر روز ۲ کیس حل کنید. الگوریتم تکرار فاصله‌دار، ضعف‌های شما را شناسایی و برنامه مطالعاتی شما را بهینه می‌کند.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-clinical-clay hover:bg-clinical-clay/90 text-white font-bold text-sm rounded-2xl shadow-xl shadow-clinical-clay/30 transition-all active:scale-95 hover:-translate-y-0.5"
              >
                <CheckCircle className="h-4 w-4" />
                همین الان شروع کن — رایگان
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="py-10 px-4 border-t border-clinical-navy/8 dark:border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-clinical-clay" />
          <span className="font-bold text-clinical-navy dark:text-clinical-light">کیس‌کلینیک CaseClinic</span>
        </div>
        <p className="text-xs text-clinical-navy/40 dark:text-clinical-light/40">
          ساخته شده برای دانشجویان دندانپزشکی ایران · تمام حقوق محفوظ است
        </p>
      </footer>
    </div>
  );
}

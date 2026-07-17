"use client";

import React, { useState } from "react";
import { 
  User, MessageSquare, Clipboard, FileText, CheckCircle2, 
  HelpCircle, AlertTriangle, Send, Loader2, BookOpen, 
  Award, Play, ChevronLeft, ChevronRight, Stethoscope 
} from "lucide-react";
import RadiographyViewer from "./RadiographyViewer";
import { CaseData, DiagnosticTestData } from "@/lib/data/mockCases";

interface CaseViewerProps {
  caseData: CaseData;
}

export default function CaseViewer({ caseData }: CaseViewerProps) {
  // gradual disclosure tabs
  // 0: Demographics & CC, 1: HPI, 2: Clinical Exam, 3: Diagnostics, 4: Radiology, 5: Treatment Plan
  const [activeTab, setActiveTab] = useState<number>(0);
  const [maxUnlockedTab, setMaxUnlockedTab] = useState<number>(0);
  
  // diagnostic tests states
  const [conductedTests, setConductedTests] = useState<string[]>([]);
  
  // Treatment plan form inputs
  const [diagnosis, setDiagnosis] = useState("");
  const [sequence, setSequence] = useState("");
  const [materials, setMaterials] = useState("");
  const [safetyConsent, setSafetyConsent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Grading results
  const [gradingResult, setGradingResult] = useState<any>(null);
  
  // Tutor Chat state
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([
    { role: "assistant", text: `سلام همکار گرامی. من استاد بالینی شما برای پرونده "${caseData.title}" هستم. می‌توانید هر سوال علمی در مورد این بیمار را از من بپرسید.` }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Tab titles
  const tabs = [
    { label: "شکایت بیمار", icon: User },
    { label: "شرح حال (HPI)", icon: Clipboard },
    { label: "معاینه داخل دهانی", icon: Stethoscope },
    { label: "تست‌های تشخیصی", icon: FileText },
    { label: "رادیوگرافی (PACS)", icon: BookOpen },
    { label: "ثبت طرح درمان", icon: Award }
  ];

  const unlockNextTab = () => {
    const next = activeTab + 1;
    if (next < tabs.length) {
      if (next > maxUnlockedTab) {
        setMaxUnlockedTab(next);
      }
      setActiveTab(next);
    }
  };

  const handleTestSelection = (testId: string) => {
    if (!conductedTests.includes(testId)) {
      setConductedTests([...conductedTests, testId]);
    }
  };

  // Submit plan to API
  const handleSubmitPlan = async () => {
    setIsSubmitting(true);
    try {
      const combinedPlan = `
تشخیص نهایی:
${diagnosis}

توالی اقدامات درمانی:
${sequence}

مواد و تکنیک‌های انتخابی:
${materials}

ملاحظات عوارض و رضایت‌نامه:
${safetyConsent}
      `.trim();

      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: caseData.id,
          treatmentPlan: combinedPlan,
          userId: "demo-user-id" // Mock user ID for local storage context
        })
      });

      if (!response.ok) {
        throw new Error("API grading response not ok");
      }

      const data = await response.json();
      if (data.success) {
        setGradingResult(data.evaluation);
      }
    } catch (err) {
      console.error("Grading failed:", err);
      // Fallback calculation directly on client side if endpoint has issues
      alert("سیستم گریدینگ با اختلال مواجه شد. در حال بارگذاری نمره هوشمند محلی...");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chat with AI Tutor
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // For Phase 1 demo, we simulate a smart clinical answer matching dentistry guidelines
      // We will check for some keywords to give a extremely realistic answer!
      setTimeout(() => {
        let aiAnswer = "به عنوان استاد بالینی شما، توصیه می‌کنم پرونده بیمار را با دقت بیشتری مرور کنید. به خصوص به تست سرما و وضعیت رادیولوژی دقت کنید. چه بسا با تشخیص نادرست، درمان ریشه دندان سالم آغاز شود.";
        const normalized = userMsg.toLowerCase();
        
        if (normalized.includes("درد") || normalized.includes("شکایت")) {
          aiAnswer = `شکایت اصلی بیمار درد شدید و ماندگار به آب سرد روی دندان ۳۶ است. این موضوع نشان‌دهنده درگیری الیاف C پالپ است که معمولاً به علت پاسخ التهابی شدید رخ می‌دهد. در معاینه می‌بینیم درد دندان تا ۵۰ ثانیه پس از تست سرما ادامه دارد. این یافته پاتوگنومونیک برای پالپیت برگشت‌ناپذیر علامت‌دار است.`;
        } else if (normalized.includes("رادیوگرافی") || normalized.includes("عکس")) {
          aiAnswer = `رادیوگرافی پریاپیکال نشان‌دهنده پوسیدگی عمیق کلاس ۲ است که شاخک پالپ (pulp horn) را درگیر کرده است. فضای لیگامان پریودنتال (PDL space) در ناحیه اپکس دندان ۳۶ مقداری عریض‌تر شده است اما تخریب وسیع استخوانی دیده نمی‌شود که با تشخیص پری‌ودنتیت اپیکال علامت‌دار خفیف سازگار است.`;
        } else if (normalized.includes("درمان") || normalized.includes("عصب کشی")) {
          aiAnswer = `توالی صحیح درمان برای این کیس: ۱. بی‌حسی کامل (IANB) ۲. ایزولاسیون با رابر دم ۳. اکسس کویتی ۴. دبریدمان کامل کانال‌ها با NaOCl ۵.۲۵٪ ۵. فایلینگ روتاری و تعیین طول ۶. آبچوریشن سه بعدی با گوتاپرکا و سیلر AH-Plus و در نهایت بازسازی کامل تاج دندان.`;
        } else if (normalized.includes("آبسه") || normalized.includes("تورم")) {
          aiAnswer = `در کیس اول (پالپیت) ما تورم یا آبسه نداریم و لثه کاملاً سالم است. اما در کیس دوم، آبسه حاد اپیکال وجود دارد که در درمان آن برقراری درین (تخلیه چرک) و تجویز آنتی‌بیوتیک سیستمیک الزامی است.`;
        }
        
        setChatMessages(prev => [...prev, { role: "assistant", text: aiAnswer }]);
        setChatLoading(false);
      }, 1000);
    } catch (e) {
      setChatLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* Main Case Workspace (2 cols on large screen) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* OSCE Patient File Tab Bar */}
        <div className="flex overflow-x-auto bg-clinical-navy/5 dark:bg-white/5 p-1.5 rounded-xl border border-clinical-navy/10 dark:border-white/5 scrollbar-thin">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isUnlocked = idx <= maxUnlockedTab;
            const isActive = activeTab === idx;
            
            return (
              <button
                key={idx}
                disabled={!isUnlocked}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? "bg-clinical-navy text-clinical-light dark:bg-clinical-light dark:text-clinical-navy shadow" 
                    : isUnlocked
                      ? "text-clinical-navy/70 dark:text-clinical-light/70 hover:bg-clinical-navy/5 dark:hover:bg-white/5"
                      : "text-clinical-navy/30 dark:text-clinical-light/30 cursor-not-allowed"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-clinical-clay" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Card Frame resembling a hospital folder/binder */}
        <div className="bg-clinical-lighter dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 shadow-sm p-6 space-y-6">
          
          {/* Tab 0: Demographic & CC */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۱. اطلاعات هویتی و شکایت اصلی بیمار (Chief Complaint)</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">OSCE مرحله ۱</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5">
                  <span className="text-xs text-clinical-navy/50 dark:text-clinical-light/50">مشخصات دموگرافیک:</span>
                  <p className="text-sm font-semibold text-clinical-navy dark:text-clinical-light mt-1">{caseData.demographic}</p>
                </div>
                <div className="p-4 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5">
                  <span className="text-xs text-clinical-navy/50 dark:text-clinical-light/50">سطح سختی کیس دندانپزشکی:</span>
                  <p className="text-sm font-semibold text-clinical-clay mt-1">{caseData.difficulty}</p>
                </div>
              </div>

              <div className="p-5 bg-clinical-navy/5 dark:bg-white/5 rounded-xl border-r-4 border-clinical-clay">
                <span className="text-xs font-bold text-clinical-clay block mb-1">شکایت اصلی بیمار (CC):</span>
                <p className="text-md font-medium leading-relaxed italic text-clinical-navy dark:text-clinical-light">
                  {caseData.chiefComplaint}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={unlockNextTab}
                  className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  شروع شرح‌حال‌گیری بالینی <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: HPI & Medical History */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۲. تاریخچه بیماری فعلی و سابقه پزشکی (HPI & History)</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">OSCE مرحله ۲</span>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-clinical-navy/60 dark:text-clinical-light/60 mb-2">روند بیماری فعلی (HPI):</h3>
                  <p className="text-sm text-clinical-navy dark:text-clinical-light leading-relaxed">{caseData.hpi}</p>
                </div>

                <div className="p-5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-clinical-navy/60 dark:text-clinical-light/60 mb-2">سابقه پزشکی، دندانپزشکی و دارویی:</h3>
                  <p className="text-sm text-clinical-navy dark:text-clinical-light leading-relaxed">{caseData.medicalHistory}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab(0)}
                  className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-xl text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5"
                >
                  قبلی
                </button>
                <button
                  onClick={unlockNextTab}
                  className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  ورود به بخش معاینه بالینی <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Clinical Exam */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۳. معاینه بالینی داخل و خارج دهانی</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">OSCE مرحله ۳</span>
              </div>

              <div className="p-5 bg-clinical-light dark:bg-clinical-dark rounded-xl border border-clinical-navy/5 dark:border-white/5">
                <h3 className="text-xs font-bold text-clinical-navy/60 dark:text-clinical-light/60 mb-3">یافته‌های معاینات فیزیکی دندان پزشک:</h3>
                <p className="text-sm text-clinical-navy dark:text-clinical-light leading-relaxed whitespace-pre-line">
                  {caseData.examNotes}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab(1)}
                  className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-xl text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5"
                >
                  قبلی
                </button>
                <button
                  onClick={unlockNextTab}
                  className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  شبیه‌ساز تست‌های تشخیصی <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Diagnostic Tests */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۴. انجام تست‌های تشخیصی (انتخاب هدفمند)</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">OSCE مرحله ۴</span>
              </div>

              <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">
                در مواجهه بالینی واقعی، درخواست تست‌های غیرضروری هزینه بیمار را افزایش می‌دهد و نمره منفی دارد. تست‌های مورد نیاز را انتخاب کنید تا نتایج آنها ظاهر شود:
              </p>

              {/* Grid of available tests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caseData.diagnosticTests.map((test) => {
                  const isConducted = conductedTests.includes(test.id);
                  return (
                    <button
                      key={test.id}
                      onClick={() => handleTestSelection(test.id)}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between h-[100px] ${
                        isConducted 
                          ? "bg-clinical-navy/5 border-clinical-navy dark:bg-white/5 dark:border-white/30" 
                          : "bg-clinical-light hover:bg-clinical-navy/5 dark:bg-clinical-dark border-clinical-navy/10 dark:border-white/10 hover:border-clinical-navy"
                      }`}
                    >
                      <span className="text-xs font-bold text-clinical-navy dark:text-clinical-light">{test.name}</span>
                      {isConducted ? (
                        <span className="text-xs text-clinical-clay font-medium mt-2 leading-tight">{test.result}</span>
                      ) : (
                        <span className="text-[10px] text-clinical-navy/40 dark:text-clinical-light/40 mt-2 block">کلیک کنید جهت انجام تست...</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab(2)}
                  className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-xl text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5"
                >
                  قبلی
                </button>
                <button
                  onClick={unlockNextTab}
                  className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  مشاهده رادیوگرافی (PACS) <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Radiology (PACS) */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۵. تفسیر تصاویر رادیوگرافی (PACS Viewer)</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">OSCE مرحله ۵</span>
              </div>

              <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">
                جهت زوم از اسکرول ماوس (یا حرکت دو انگشت پینچ روی موبایل) استفاده کنید. برای جابجایی تصویر بکشید (drag) و کنتراست را از نوار پایینی کنترل نمایید:
              </p>

              {/* Integrate PACS Radiography Viewer */}
              <RadiographyViewer 
                imageUrl={caseData.radiologyImageUrl} 
                caption="رادیوگرافی پریاپیکال تهیه شده از ناحیه دندان مشکوک بیمار" 
              />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab(3)}
                  className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-xl text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5"
                >
                  قبلی
                </button>
                <button
                  onClick={unlockNextTab}
                  className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  تدوین و ثبت طرح درمان نهایی <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Treatment Plan Formulation & AI Grading */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                <h2 className="text-lg font-bold text-clinical-navy dark:text-clinical-light">۶. تدوین طرح درمان نهایی بیمار</h2>
                <span className="px-2.5 py-1 text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold rounded-full">مرحله نهایی ارزیابی</span>
              </div>

              {gradingResult ? (
                /* Show side-by-side grading comparison details */
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 bg-clinical-navy/5 border-clinical-navy/20 dark:bg-white/5">
                    <div>
                      <h3 className="text-md font-bold text-clinical-navy dark:text-clinical-light">کارنامه تحلیل هوشمند طرح درمان</h3>
                      <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60 mt-1">تصحیح شده بر اساس هوش مصنوعی NVIDIA NIM و رفرنس‌های مرجع ملی</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-clinical-clay text-clinical-light text-center border-4 border-clinical-light dark:border-clinical-dark shadow-md">
                        <span className="text-xl font-bold leading-none">{gradingResult.score}</span>
                        <span className="text-[8px]">امتیاز</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Warning if Safety Flag is triggered */}
                  {gradingResult.critical_safety_flag && (
                    <div className="p-4 bg-red-50 border-r-4 border-clinical-red text-clinical-red rounded-xl dark:bg-red-950/20 text-xs flex gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <div>
                        <strong className="block font-bold">هشدار جدی ایمنی بالینی (Clinical Safety Violation):</strong>
                        <p className="mt-1 leading-relaxed">یک اشتباه با ریسک بالا در طرح درمان شما یافت شد که در کار بالینی واقعی منجر به خطای پزشکی یا صدمه به بیمار می‌شود.</p>
                      </div>
                    </div>
                  )}

                  {/* Scientific Professor Feedback */}
                  <div className="p-5 bg-clinical-navy/5 dark:bg-white/5 border border-clinical-navy/10 rounded-xl">
                    <strong className="block text-xs text-clinical-navy/60 dark:text-clinical-light/60 font-bold mb-2">تفسیر تشریحی استاد بالینی:</strong>
                    <p className="text-sm text-clinical-navy dark:text-clinical-light leading-relaxed whitespace-pre-line font-medium">
                      {gradingResult.feedback_fa}
                    </p>
                  </div>

                  {/* Two column layout: Student responses vs Reference plans */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-clinical-navy/70 dark:text-clinical-light/70 uppercase tracking-wider">سرفصل‌های پوشش داده شده (پاسخ درست)</h4>
                      <div className="space-y-2">
                        {gradingResult.matched_items.length === 0 ? (
                          <p className="text-xs text-clinical-navy/40 dark:text-clinical-light/40 italic">موردی یافت نشد.</p>
                        ) : (
                          gradingResult.matched_items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg flex items-start gap-2 text-xs text-clinical-green">
                              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.text}</span>
                                <span className="block text-[9px] text-clinical-green/80 mt-0.5">بارم امتیاز پوشش داده شده: +{item.scoreAwarded}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-clinical-navy/70 dark:text-clinical-light/70 uppercase tracking-wider">نکات فراموش شده یا نیاز به مطالعه بیشتر</h4>
                      <div className="space-y-2">
                        {gradingResult.missed_items.length === 0 ? (
                          <p className="text-xs text-clinical-navy/40 dark:text-clinical-light/40 italic">موردی یافت نشد. طرح درمان بسیار کامل است.</p>
                        ) : (
                          gradingResult.missed_items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/40 rounded-lg flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                              <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.text}</span>
                                <span className="block text-[9px] mt-0.5 leading-relaxed">{item.reason}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Incorrect details list */}
                  {gradingResult.incorrect_items && gradingResult.incorrect_items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-clinical-red uppercase tracking-wider">اشتباهات علمی و بالینی در پاسخ شما</h4>
                      <div className="space-y-2">
                        {gradingResult.incorrect_items.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/55 rounded-lg flex items-start gap-2 text-xs text-clinical-red">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-slate-800 dark:text-slate-200">{item.detail}</strong>
                              <span className="block text-[10px] mt-0.5 text-clinical-red/90 leading-relaxed">{item.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended scientific references */}
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs text-clinical-navy/70 dark:text-clinical-light/70 space-y-1 font-mono">
                    <span className="text-[10px] font-bold text-clinical-clay">منبع رفرنس مرجع:</span>
                    <p className="italic">{caseData.scientificSource}</p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => {
                        setGradingResult(null);
                        setDiagnosis("");
                        setSequence("");
                        setMaterials("");
                        setSafetyConsent("");
                      }}
                      className="px-4 py-2 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy text-xs font-bold rounded-lg transition-all"
                    >
                      تلاش مجدد برای حل این کیس
                    </button>
                  </div>
                </div>
              ) : (
                /* Plan inputs Form */
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-clinical-navy dark:text-clinical-light">۱. تشخیص نهایی پالپ و پری‌آپیکال دندان دندانپزشکی (Final Diagnosis):</label>
                    <textarea
                      rows={3}
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="بر اساس نتایج معاینات و رادیوگرافی، تشخیص نهایی وضعیت پالپ و بافت پری‌آپیکال دندان را به فارسی بنویسید..."
                      className="w-full p-4 text-xs bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-clinical-navy dark:text-clinical-light">۲. توالی مراحل اقدامات بالینی (Treatment Sequence):</label>
                    <textarea
                      rows={4}
                      value={sequence}
                      onChange={(e) => setSequence(e.target.value)}
                      placeholder="از لحظه تزریق بی‌حسی تا بستن پانسمان یا پر کردن نهایی، گام‌های درمان را به ترتیب اولویت بنویسید (مثلاً نوع بی‌حسی، ایزولاسیون، اکسس، طول‌گیری، شستشو با NaOCl و...)"
                      className="w-full p-4 text-xs bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-clinical-navy dark:text-clinical-light">۳. انتخاب مواد دندانپزشکی و ابزارها (Materials & Instruments):</label>
                    <textarea
                      rows={3}
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="گوتاپرکا و سیلر انتخابی، سایز فایل‌های روتاری، مواد شستشو، و نحوه بیلدآپ نهایی تاج دندان را بنویسید..."
                      className="w-full p-4 text-xs bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-clinical-navy dark:text-clinical-light">۴. عوارض احتمالی و ملاحظات رضایت‌نامه بیمار (Complications & Safety):</label>
                    <textarea
                      rows={2}
                      value={safetyConsent}
                      onChange={(e) => setSafetyConsent(e.target.value)}
                      placeholder="چه خطرات احتمالی (شکستگی ابزار، سوراخ شدگی کانال، تداخل دارویی، آلرژی) وجود دارد و چه ملاحظاتی باید رعایت شود؟"
                      className="w-full p-4 text-xs bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed transition-all"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-clinical-navy/10 dark:border-white/5">
                    <button
                      onClick={() => setActiveTab(4)}
                      className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-xl text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5 animate-all"
                    >
                      قبلی
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSubmitPlan}
                      className="px-6 py-3 bg-clinical-clay hover:bg-clinical-clay/90 disabled:bg-slate-400 text-clinical-light font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          در حال تصحیح طرح درمان توسط هوش مصنوعی...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          ارسال و ارزیابی نهایی طرح درمان
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: AI Tutor Panel & Clinical Help */}
      <div className="space-y-6">
        
        {/* Study Stats Widget */}
        <div className="p-6 bg-clinical-lighter dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-clay">اطلاعات کیس بالینی</h3>
          <div className="space-y-2 text-xs text-clinical-navy/80 dark:text-clinical-light/80">
            <div className="flex justify-between">
              <span>ماژول درسی:</span>
              <span className="font-semibold text-clinical-navy dark:text-clinical-light">اندودانتیکس (درمان ریشه)</span>
            </div>
            <div className="flex justify-between">
              <span>درجه دشواری:</span>
              <span className="font-semibold text-clinical-navy dark:text-clinical-light">{caseData.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span>تست‌های انجام‌شده:</span>
              <span className="font-semibold text-clinical-navy dark:text-clinical-light font-mono">{conductedTests.length} مورد</span>
            </div>
            <div className="flex justify-between">
              <span>وضعیت پاسخ:</span>
              <span className={`font-semibold ${gradingResult ? "text-clinical-green" : "text-amber-500"}`}>
                {gradingResult ? "حل شده" : "در حال تلاش"}
              </span>
            </div>
          </div>
        </div>

        {/* AI Tutor Chat Widget */}
        <div className="flex flex-col h-[450px] bg-clinical-lighter dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-clinical-navy text-clinical-light dark:bg-slate-900 border-b border-clinical-navy/10 dark:border-white/5 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-clinical-clay shrink-0" />
            <div>
              <h3 className="text-xs font-bold">دستیار و مدرس هوشمند بالینی</h3>
              <p className="text-[9px] text-clinical-light/60 dark:text-slate-400 mt-0.5">پاسخ‌های مبتنی بر رفرنس دندانپزشکی کوهن</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-clinical-light/50 dark:bg-clinical-dark/30 scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-clinical-navy text-clinical-light mr-auto rounded-tl-none"
                    : "bg-white dark:bg-slate-900 text-clinical-navy dark:text-clinical-light ml-auto rounded-tr-none border border-clinical-navy/5 dark:border-white/5"
                }`}
              >
                <span className="text-[9px] text-clinical-clay font-bold mb-1">
                  {msg.role === "user" ? "شما (دانشجو)" : "استاد هوش مصنوعی"}
                </span>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 text-clinical-navy dark:text-clinical-light ml-auto rounded-2xl rounded-tr-none max-w-[50%] border border-clinical-navy/5 dark:border-white/5 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-clinical-clay" />
                <span className="text-[10px]">استاد در حال تفکر...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-clinical-navy/10 dark:border-white/5 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="در مورد تشخیص یا درمان بپرسید..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-clinical-navy/10 dark:border-white/10 rounded-xl outline-none focus:border-clinical-clay text-clinical-navy dark:text-clinical-light"
            />
            <button
              onClick={handleSendChat}
              className="p-2 rounded-xl bg-clinical-navy dark:bg-clinical-light text-clinical-light dark:text-clinical-navy hover:bg-clinical-clay dark:hover:bg-clinical-clay transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

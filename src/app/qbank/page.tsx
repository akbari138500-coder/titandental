"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Award, Clock, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, ChevronLeft, ArrowRight, Play, RefreshCw 
} from "lucide-react";

// Mock Questions dataset matching Section 8 requirements
interface Question {
  id: string;
  type: "MCQ" | "SEQUENCING" | "SPOT";
  text: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: any; // index or array order or spot coordinate
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: "q-mcq-1",
    type: "MCQ",
    text: "در رادیوگرافی پریاپیکال یک دندان مولر دوم بالا، یک ناحیه رادیولوسنت وسیع با حدود نامشخص در اپکس ریشه دیستوبوکال دیده می‌شود. بیمار پاسخ طولانی‌مدت به سرما دارد. تشخیص صحیح چیست؟",
    imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=400&auto=format&fit=crop",
    options: [
      "پالپیت برگشت‌پذیر علامت‌دار همراه با بافت اپیکال نرمال",
      "نکروز پالپ همراه با پریودنتیت اپیکال علامت‌دار",
      "پالپیت برگشت‌ناپذیر علامت‌دار همراه با پریودنتیت اپیکال علامت‌دار",
      "پالپیت برگشت‌ناپذیر بدون علامت همراه با بافت اپیکال نرمال"
    ],
    correctAnswer: 2,
    explanation: "پاسخ صحیح گزینه ۳ است. پاسخ طولانی‌مدت به سرما (درد پس از حذف عامل سرما) پاتوگنومونیک پالپیت برگشت‌ناپذیر علامت‌دار است. وجود رادیولوسنتی اپیکال با حدود نامشخص تاییدکننده درگیری بافت دور ریشه (پریودنتیت اپیکال علامت‌دار) است. گزینه ۲ غلط است زیرا در نکروز پالپ واکنشی به سرما نداریم."
  },
  {
    id: "q-seq-1",
    type: "SEQUENCING",
    text: "مراحل درمان ریشه (اندودانتیکس) یک دندان با پالپیت برگشت‌ناپذیر را از اولین اقدام تا آخرین گام به ترتیب اولویت منطقی بچینید:",
    options: [
      "تعیین طول کارکرد (Working Length) با اپکس لوکیتور",
      "ایزولاسیون با رابر دم و تراش حفره دسترسی (Access Cavity)",
      "تزریق بلاک عصبی و بی‌حسی موضعی کامل",
      "شکل‌دهی با فایل‌های روتاری و شستشو با سدیم هیپوکلریت",
      "پر کردن کانال با گوتاپرکا و سیلر و ترمیم نهایی تاج دندان"
    ],
    correctAnswer: [2, 1, 0, 3, 4], // correct indexes order
    explanation: "ترتیب صحیح مراحل در اندودانتیکس بالینی: ابتدا تزریق بی‌حسی کامل جهت کنترل درد بیمار انجام می‌شود، سپس ایزولاسیون رابر دم و تراش اکسس کویتی، در ادامه اندازه‌گیری طول کارکرد کانال‌ها، آماده‌سازی فیزیکی و شیمیایی (روتاری و NaOCl) و در نهایت آبچوریشن و ترمیم نهایی دندان صورت می‌گیرد."
  },
  {
    id: "q-spot-1",
    type: "SPOT",
    text: "در رادیوگرافی زیر، ضایعه تحلیل استخوانی پری‌آپیکال (رادیولوسنتی اپکس ریشه) در کدام ناحیه مشهودتر است؟ روی تصویر کلیک کنید:",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=500&auto=format&fit=crop",
    correctAnswer: { x: 50, y: 70, radius: 20 }, // Center coords in percentage
    explanation: "تحلیل استخوانی و رادیولوسنتی اپیکال در اطراف اپکس ریشه دندان پرمولر (ناحیه پایینی میانی رادیوگرافی) به وضوح نشان‌دهنده آبسه یا گرانولوم در حال گسترش است."
  }
];

export default function QBankPage() {
  const [activeMode, setActiveMode] = useState<"index" | "quiz">("index");
  
  // Quiz Running States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedMcqIdx, setSelectedMcqIdx] = useState<number | null>(null);
  const [sequencingOrder, setSequencingOrder] = useState<number[]>([0, 1, 2, 3, 4]);
  const [spotCoords, setSpotCoords] = useState<{ x: number; y: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !quizFinished) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizFinished) {
      setQuizFinished(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, quizFinished]);

  const startQuizMode = () => {
    setCurrentIdx(0);
    setSelectedMcqIdx(null);
    setSequencingOrder([3, 0, 4, 1, 2]); // Shuffle initially
    setSpotCoords(null);
    setShowAnswer(false);
    setQuizScore(0);
    setQuizFinished(false);
    setTimeLeft(300);
    setTimerActive(true);
    setActiveMode("quiz");
  };

  const handleMcqSelect = (idx: number) => {
    if (showAnswer) return;
    setSelectedMcqIdx(idx);
  };

  const moveSequenceItem = (fromIdx: number, toIdx: number) => {
    if (showAnswer) return;
    const next = [...sequencingOrder];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSequencingOrder(next);
  };

  const handleSpotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showAnswer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotCoords({ x, y });
  };

  const verifyAnswer = () => {
    const q = mockQuestions[currentIdx];
    let isCorrect = false;

    if (q.type === "MCQ") {
      isCorrect = selectedMcqIdx === q.correctAnswer;
    } else if (q.type === "SEQUENCING") {
      isCorrect = JSON.stringify(sequencingOrder) === JSON.stringify(q.correctAnswer);
    } else if (q.type === "SPOT") {
      if (spotCoords) {
        const dx = Math.abs(spotCoords.x - q.correctAnswer.x);
        const dy = Math.abs(spotCoords.y - q.correctAnswer.y);
        isCorrect = dx < q.correctAnswer.radius && dy < q.correctAnswer.radius;
      }
    }

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setShowAnswer(true);
  };

  const nextQuestion = () => {
    const next = currentIdx + 1;
    if (next < mockQuestions.length) {
      setCurrentIdx(next);
      setSelectedMcqIdx(null);
      setSequencingOrder([0, 1, 2, 3, 4]); // reset/shuffle for next sequencing
      setSpotCoords(null);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
      setTimerActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activeQuestion = mockQuestions[currentIdx];

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {activeMode === "index" ? (
          /* QBank Home / Index */
          <div className="space-y-6">
            <div className="border-b border-clinical-navy/10 dark:border-white/5 pb-6">
              <h1 className="text-xl md:text-2xl font-black">بانک سوالات و شبیه‌ساز آزمون (QBank)</h1>
              <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">آزمون‌های چندگزینه‌ای، تشخیص نقطه‌ای و تعیین توالی درمانی به همراه پاسخ‌های کاملاً تشریحی</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl md:col-span-2 space-y-4">
                <h2 className="text-md font-bold text-clinical-clay">شبیه‌ساز آزمون استاندارد بالینی دندانپزشکی</h2>
                <p className="text-xs leading-relaxed text-clinical-navy/70 dark:text-clinical-light/70">
                  این آزمون شامل انواع سوالات MCQ تصویرمحور، چینش توالی مراحل درمان، و شناسایی نقطه ضایعه (Spot Diagnosis) است. در حالت آزمون، پاسخ‌ها تا ثبت نهایی ذخیره شده و نمایش داده نمی‌شوند و تایمر ۵ دقیقه‌ای فعال است.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={startQuizMode}
                    className="px-5 py-3 bg-clinical-clay hover:bg-clinical-clay/90 text-clinical-light text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Play className="h-4 w-4" /> شروع شبیه‌ساز آزمون ۵ دقیقه‌ای
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-clinical-navy/55 dark:text-clinical-light/55">آمار سوالات</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>تعداد کل سوالات آزمون:</span> <span className="font-bold">۱۲۰ سوال</span></div>
                  <div className="flex justify-between"><span>سوالات پاسخ‌داده‌شده:</span> <span className="font-bold">۳۴ سوال</span></div>
                  <div className="flex justify-between"><span>میانگین درصد پاسخ درست:</span> <span className="font-bold text-clinical-green">۷۶٪</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Quiz Simulator Workspace */
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Quiz Subheader Info */}
            <div className="flex justify-between items-center bg-white dark:bg-clinical-darker p-4 rounded-xl border border-clinical-navy/10 dark:border-white/5 text-xs font-semibold">
              <span className="flex items-center gap-1 text-clinical-clay font-bold">
                <Clock className="h-4 w-4 shrink-0" /> زمان باقی‌مانده: {formatTime(timeLeft)}
              </span>
              <span className="text-clinical-navy/60 dark:text-clinical-light/60">
                سوال {currentIdx + 1} از {mockQuestions.length}
              </span>
            </div>

            {quizFinished ? (
              /* Quiz Score summary card */
              <div className="p-8 bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 text-center space-y-6 animate-fade-in">
                <div className="h-16 w-16 bg-clinical-clay/10 rounded-full flex items-center justify-center text-clinical-clay mx-auto border border-clinical-clay/20">
                  <Award className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">پایان شبیه‌ساز آزمون صلاحیت بالینی</h2>
                  <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">پاسخ‌های شما با موفقیت در دیتابیس ثبت شد.</p>
                </div>

                <div className="p-6 bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/5 dark:border-white/5 rounded-xl max-w-sm mx-auto space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>تعداد پاسخ‌های درست:</span>
                    <span className="text-clinical-green font-mono">{quizScore} از {mockQuestions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>درصد تسلط کل:</span>
                    <span className="text-clinical-clay font-mono">{Math.round((quizScore / mockQuestions.length) * 100)}٪</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    onClick={startQuizMode}
                    className="px-4 py-2 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> تلاش مجدد آزمون
                  </button>
                  <button 
                    onClick={() => setActiveMode("index")}
                    className="px-4 py-2 border border-clinical-navy/10 dark:border-white/10 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    بازگشت به بانک سوالات
                  </button>
                </div>
              </div>
            ) : (
              /* Question Container */
              <div className="p-6 bg-clinical-lighter dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 space-y-6">
                
                {/* Question Type Header Badge */}
                <div className="flex justify-between items-center border-b border-clinical-navy/10 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold">{activeQuestion.text}</h3>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-clinical-clay/10 text-clinical-clay">
                    {activeQuestion.type === "MCQ" ? "سوال چندگزینه‌ای" : activeQuestion.type === "SEQUENCING" ? "چینش توالی درمانی" : "تشخیص نقطه‌ای (Spot)"}
                  </span>
                </div>

                {/* MCQ Question Mode */}
                {activeQuestion.type === "MCQ" && activeQuestion.options && (
                  <div className="space-y-3">
                    {activeQuestion.imageUrl && (
                      <div className="max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={activeQuestion.imageUrl} alt="MCQ Radiograph" className="w-full object-contain" />
                      </div>
                    )}
                    <div className="space-y-2">
                      {activeQuestion.options.map((opt, idx) => {
                        const isSelected = selectedMcqIdx === idx;
                        const isCorrect = idx === activeQuestion.correctAnswer;
                        return (
                          <button
                            key={idx}
                            disabled={showAnswer}
                            onClick={() => handleMcqSelect(idx)}
                            className={`w-full p-4 rounded-xl border text-right text-xs leading-relaxed transition-all flex items-start gap-2 ${
                              showAnswer
                                ? isCorrect
                                  ? "bg-emerald-50 border-clinical-green text-clinical-green dark:bg-emerald-950/20"
                                  : isSelected
                                    ? "bg-red-50 border-clinical-red text-clinical-red dark:bg-red-950/20"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                : isSelected
                                  ? "bg-clinical-navy/5 border-clinical-navy dark:bg-white/5"
                                  : "bg-white dark:bg-slate-900 hover:bg-slate-50 border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <span className="font-bold text-clinical-clay shrink-0">گزینه {idx + 1}:</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SEQUENCING Question Mode */}
                {activeQuestion.type === "SEQUENCING" && activeQuestion.options && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-clinical-navy/60 dark:text-clinical-light/60">جهت مرتب کردن، مراحل درمان را با استفاده از دکمه‌های بالا و پایین جابجا کنید:</p>
                    <div className="space-y-2">
                      {sequencingOrder.map((itemIdx, idx) => {
                        const optionText = activeQuestion.options![itemIdx];
                        return (
                          <div
                            key={idx}
                            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
                          >
                            <span className="font-medium">{optionText}</span>
                            <div className="flex gap-1.5">
                              <button
                                disabled={idx === 0 || showAnswer}
                                onClick={() => moveSequenceItem(idx, idx - 1)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-[10px] font-bold disabled:opacity-50"
                              >
                                بالا ▲
                              </button>
                              <button
                                disabled={idx === sequencingOrder.length - 1 || showAnswer}
                                onClick={() => moveSequenceItem(idx, idx + 1)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-[10px] font-bold disabled:opacity-50"
                              >
                                پایین ▼
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SPOT Question Mode */}
                {activeQuestion.type === "SPOT" && activeQuestion.imageUrl && (
                  <div className="space-y-3">
                    <div 
                      onClick={handleSpotClick}
                      className="relative max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 cursor-crosshair select-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeQuestion.imageUrl} alt="Spot Diagnosis Radiography" className="w-full object-contain pointer-events-none" />
                      
                      {/* Student selected marker */}
                      {spotCoords && (
                        <div 
                          style={{ left: `${spotCoords.x}%`, top: `${spotCoords.y}%` }}
                          className="absolute h-4 w-4 rounded-full border-2 border-clinical-clay -translate-x-1/2 -translate-y-1/2 bg-clinical-clay/30"
                        />
                      )}

                      {/* Correct target visual showing on showAnswer */}
                      {showAnswer && (
                        <div 
                          style={{ 
                            left: `${activeQuestion.correctAnswer.x}%`, 
                            top: `${activeQuestion.correctAnswer.y}%`,
                            width: `${activeQuestion.correctAnswer.radius * 2}%`,
                            height: `${activeQuestion.correctAnswer.radius * 2}%`
                          }}
                          className="absolute rounded-full border-4 border-dashed border-clinical-green -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-clinical-green/10"
                        />
                      )}
                    </div>
                    {spotCoords && <p className="text-[10px] text-center text-clinical-navy/50 dark:text-clinical-light/50">نقطه ثبت شد: X={Math.round(spotCoords.x)}٪، Y={Math.round(spotCoords.y)}٪</p>}
                  </div>
                )}

                {/* Verification Explanation block */}
                {showAnswer && (
                  <div className="p-5 bg-clinical-navy/5 dark:bg-white/5 border border-clinical-navy/10 rounded-xl space-y-2 animate-fade-in">
                    <strong className="block text-xs text-clinical-clay font-bold flex items-center gap-1">
                      <HelpCircle className="h-4 w-4 text-clinical-clay" /> تفسیر و توضیح تشریحی دندانپزشکی بالینی:
                    </strong>
                    <p className="text-xs text-clinical-navy dark:text-clinical-light leading-relaxed whitespace-pre-line">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex justify-end pt-4 border-t border-clinical-navy/10 dark:border-white/5">
                  {!showAnswer ? (
                    <button
                      disabled={
                        (activeQuestion.type === "MCQ" && selectedMcqIdx === null) ||
                        (activeQuestion.type === "SPOT" && spotCoords === null)
                      }
                      onClick={verifyAnswer}
                      className="px-5 py-2.5 bg-clinical-clay hover:bg-clinical-clay/90 disabled:bg-slate-400 text-clinical-light text-xs font-bold rounded-xl transition-all"
                    >
                      تایید و بررسی پاسخ
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="px-5 py-2.5 bg-clinical-navy hover:bg-clinical-navy/90 text-clinical-light dark:bg-clinical-light dark:text-clinical-navy text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                    >
                      سوال بعدی <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

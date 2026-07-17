"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { 
  FolderPlus, Clipboard, List, Plus, Trash2, Save, 
  Settings, Users, BarChart, Database, AlertCircle 
} from "lucide-react";
import { mockCases, RubricItemData, DiagnosticTestData } from "@/lib/data/mockCases";

export default function AdminPage() {
  const [activeSubTab, setActiveSubTab] = useState<"list" | "create" | "generate">("list");
  
  // New Case States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPREHENSIVE">("BEGINNER");
  const [demographic, setDemographic] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hpi, setHpi] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [examNotes, setExamNotes] = useState("");
  const [radiologyUrl, setRadiologyUrl] = useState("");
  const [scientificSource, setScientificSource] = useState("");

  // Lists for dynamic builders
  const [rubrics, setRubrics] = useState<RubricItemData[]>([
    { key: "diagnosis", text: "", weight: 20, scientificReference: "", keywords: [] }
  ]);
  const [tests, setTests] = useState<DiagnosticTestData[]>([
    { id: "test-1", name: "", result: "", isNecessary: true, costWeight: 0 }
  ]);

  const addRubricRow = () => {
    setRubrics([
      ...rubrics,
      { key: `rubric-${Date.now()}`, text: "", weight: 10, scientificReference: "", keywords: [] }
    ]);
  };

  const removeRubricRow = (index: number) => {
    setRubrics(rubrics.filter((_, idx) => idx !== index));
  };

  const addTestRow = () => {
    setTests([
      ...tests,
      { id: `test-${Date.now()}`, name: "", result: "", isNecessary: false, costWeight: 5 }
    ]);
  };

  const removeTestRow = (index: number) => {
    setTests(tests.filter((_, idx) => idx !== index));
  };

  const handleSaveCase = async () => {
    if (!title || !slug || !chiefComplaint) {
      alert("لطفاً فیلدهای اجباری (عنوان، اسلاگ و شکایت اصلی) را پر کنید.");
      return;
    }

    const payload = {
      title,
      slug,
      difficulty,
      demographic,
      chiefComplaint,
      hpi,
      medicalHistory,
      examNotes,
      radiologyImageUrl: radiologyUrl || "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop",
      scientificSource,
      referenceRubric: rubrics,
      diagnosticTests: tests
    };

    try {
      const response = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        alert("کیس جدید با موفقیت ذخیره شد و به دیتابیس منتقل شد.");
        setActiveSubTab("list");
      } else {
        alert("خطا در ذخیره کیس: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره‌سازی کیس. لطفا وضعیت اتصال به پایگاه داده را بررسی نمایید.");
      setActiveSubTab("list");
    }
  };

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page title & stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-clinical-navy/10 dark:border-white/5 pb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black">پنل مدیریت محتوای دندانپزشکی (Admin CMS)</h1>
            <p className="text-xs text-clinical-navy/60 dark:text-clinical-light/60">مدیریت بانک کیس‌های بالینی، ویرایش روباریک‌های مرجع و ارزیابی فعالیت‌های کارورزان</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveSubTab("list")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "list" 
                  ? "bg-clinical-navy text-clinical-light dark:bg-clinical-light dark:text-clinical-navy" 
                  : "bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/10"
              }`}
            >
              <List className="h-4 w-4" /> لیست پرونده‌ها
            </button>
            <button 
              onClick={() => setActiveSubTab("create")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "create" 
                  ? "bg-clinical-navy text-clinical-light dark:bg-clinical-light dark:text-clinical-navy" 
                  : "bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/10"
              }`}
            >
              <FolderPlus className="h-4 w-4" /> ایجاد دستی
            </button>
            <button 
              onClick={() => setActiveSubTab("generate")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "generate" 
                  ? "bg-clinical-clay text-white border-clinical-clay" 
                  : "bg-white dark:bg-clinical-darker border border-clinical-clay/30 text-clinical-clay"
              }`}
            >
              <Settings className="h-4 w-4" /> ساخت کیس با AI
            </button>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-clinical-darker rounded-xl border border-clinical-navy/10 dark:border-white/5 flex items-center gap-3">
            <Database className="h-8 w-8 text-clinical-clay" />
            <div>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50 block">کیس‌های فعال</span>
              <span className="text-lg font-bold">{mockCases.length} کیس</span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-clinical-darker rounded-xl border border-clinical-navy/10 dark:border-white/5 flex items-center gap-3">
            <Clipboard className="h-8 w-8 text-teal-600" />
            <div>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50 block">تعداد سنجه‌های روباریک</span>
              <span className="text-lg font-bold">۱۱ سنجه</span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-clinical-darker rounded-xl border border-clinical-navy/10 dark:border-white/5 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50 block">تلاش‌های تصحیح شده</span>
              <span className="text-lg font-bold">۲۴ تلاش</span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-clinical-darker rounded-xl border border-clinical-navy/10 dark:border-white/5 flex items-center gap-3">
            <BarChart className="h-8 w-8 text-emerald-600" />
            <div>
              <span className="text-[10px] text-clinical-navy/50 dark:text-clinical-light/50 block">دقت تصحیح AI</span>
              <span className="text-lg font-bold">۹۸.۴٪ (NIM)</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeSubTab === "list" ? (
          /* List Cases Table */
          <div className="bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-clinical-navy/5 font-bold text-xs">
              لیست کل پرونده‌های بالینی موجود در سیستم
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-clinical-navy/5 dark:border-white/5 text-clinical-navy/60 dark:text-clinical-light/60">
                    <th className="p-4">عنوان پرونده</th>
                    <th className="p-4">اسلاگ</th>
                    <th className="p-4">درجه سختی</th>
                    <th className="p-4">تعداد روباریک‌ها</th>
                    <th className="p-4">منبع علمی رفرنس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-clinical-navy/5 dark:divide-white/5">
                  {mockCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                      <td className="p-4 font-bold">{c.title}</td>
                      <td className="p-4 font-mono text-[10px]">{c.slug}</td>
                      <td className="p-4 text-clinical-clay font-semibold">{c.difficulty}</td>
                      <td className="p-4">{c.referenceRubric.length} معیار</td>
                      <td className="p-4 text-clinical-navy/70 dark:text-clinical-light/70 italic">{c.scientificSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Create New Case Form */
          <div className="bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-md font-bold text-clinical-clay border-b border-clinical-navy/5 dark:border-white/5 pb-2">فرم ساخت کیس بالینی جدید</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">عنوان کیس دندانپزشکی (اجباری):</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="مثال: پالپیت دندان مولر اول"
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">آدرس اسلاگ Slug (یکتا، بدون فاصله):</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="مثال: pulpitis-molar-36"
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">سطح سختی:</label>
                <select 
                  value={difficulty} 
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none"
                >
                  <option value="BEGINNER">مقدماتی (Beginner)</option>
                  <option value="INTERMEDIATE">متوسط (Intermediate)</option>
                  <option value="ADVANCED">پیشرفته (Advanced)</option>
                  <option value="COMPREHENSIVE">جامع (Comprehensive)</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">اطلاعات دموگرافیک بیمار:</label>
                <input 
                  type="text" 
                  value={demographic} 
                  onChange={(e) => setDemographic(e.target.value)} 
                  placeholder="مثال: خانم ۴۲ ساله، منشی مطب، بدون درگیری سیستمیک"
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">شکایت اصلی بیمار (محاوره‌ای):</label>
              <textarea 
                rows={2} 
                value={chiefComplaint} 
                onChange={(e) => setChiefComplaint(e.target.value)} 
                placeholder="مثال: «دندان آسیابم شدید درد میکنه وقتی آب سرد میخورم...»"
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">شرح حال بیماری فعلی (HPI):</label>
                <textarea 
                  rows={3} 
                  value={hpi} 
                  onChange={(e) => setHpi(e.target.value)} 
                  placeholder="روند درد از ابتدا تا کنون..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">یافته‌های معاینات فیزیکی دندان‌پزشک:</label>
                <textarea 
                  rows={3} 
                  value={examNotes} 
                  onChange={(e) => setExamNotes(e.target.value)} 
                  placeholder="یافته‌های لثه، تست دق، تست لمس و تست‌های فیزیکی..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">آدرس تصویر رادیوگرافی (S3 URL):</label>
                <input 
                  type="text" 
                  value={radiologyUrl} 
                  onChange={(e) => setRadiologyUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">کتاب رفرنس دانشگاهی مبنای این کیس:</label>
                <input 
                  type="text" 
                  value={scientificSource} 
                  onChange={(e) => setScientificSource(e.target.value)} 
                  placeholder="مثال: Cohen's Pathways of the Pulp, 12th Ed"
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none"
                />
              </div>
            </div>

            {/* Rubrics Builder */}
            <div className="space-y-3 pt-4 border-t border-clinical-navy/10 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-clinical-clay flex items-center gap-1"><Settings className="h-4 w-4" /> معیارهای ارزیابی طرح درمان (روباریک‌های هوش مصنوعی)</h3>
                <button 
                  onClick={addRubricRow}
                  className="px-2 py-1 bg-clinical-navy dark:bg-clinical-light text-clinical-light dark:text-clinical-navy text-[10px] font-bold rounded flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> افزودن سطر
                </button>
              </div>

              <div className="space-y-2">
                {rubrics.map((r, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/30 p-2 rounded-xl border border-clinical-navy/5 dark:border-white/5">
                    <input 
                      type="text" 
                      value={r.text} 
                      onChange={(e) => {
                        const next = [...rubrics];
                        next[idx].text = e.target.value;
                        setRubrics(next);
                      }} 
                      placeholder="عنوان سنجه (مثال: ضرورت رابر دم)"
                      className="flex-1 p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                    />
                    <input 
                      type="number" 
                      value={r.weight} 
                      onChange={(e) => {
                        const next = [...rubrics];
                        next[idx].weight = Number(e.target.value);
                        setRubrics(next);
                      }} 
                      placeholder="بارم"
                      className="w-16 p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-center"
                    />
                    <button 
                      onClick={() => removeRubricRow(idx)}
                      className="p-2 text-clinical-red hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Tests Builder */}
            <div className="space-y-3 pt-4 border-t border-clinical-navy/10 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-clinical-clay flex items-center gap-1"><AlertCircle className="h-4 w-4" /> شبیه‌ساز تست‌های تشخیصی بیمار</h3>
                <button 
                  onClick={addTestRow}
                  className="px-2 py-1 bg-clinical-navy dark:bg-clinical-light text-clinical-light dark:text-clinical-navy text-[10px] font-bold rounded flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> افزودن تست
                </button>
              </div>

              <div className="space-y-2">
                {tests.map((t, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/30 p-2 rounded-xl border border-clinical-navy/5 dark:border-white/5">
                    <input 
                      type="text" 
                      value={t.name} 
                      onChange={(e) => {
                        const next = [...tests];
                        next[idx].name = e.target.value;
                        setTests(next);
                      }} 
                      placeholder="نام تست (مثال: تست سرما)"
                      className="flex-1 p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                    />
                    <input 
                      type="text" 
                      value={t.result} 
                      onChange={(e) => {
                        const next = [...tests];
                        next[idx].result = e.target.value;
                        setTests(next);
                      }} 
                      placeholder="پاسخ تست در صورت انتخاب دانشجو"
                      className="flex-1 p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                    />
                    <label className="flex items-center gap-1 text-[10px] whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={t.isNecessary} 
                        onChange={(e) => {
                          const next = [...tests];
                          next[idx].isNecessary = e.target.checked;
                          setTests(next);
                        }} 
                      />
                      ضروری
                    </label>
                    <button 
                      onClick={() => removeTestRow(idx)}
                      className="p-2 text-clinical-red hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-clinical-navy/10 dark:border-white/5">
              <button 
                onClick={handleSaveCase}
                className="px-6 py-3 bg-clinical-clay hover:bg-clinical-clay/90 text-clinical-light text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Save className="h-4 w-4" /> ذخیره نهائی پرونده بالینی
              </button>
            </div>
          </div>
        ) : (
          /* Generate Case with AI Form */
          <AICaseGenerator setActiveSubTab={setActiveSubTab} />
        )}

      </main>
    </div>
  );
}

function AICaseGenerator({ setActiveSubTab }: { setActiveSubTab: (tab: "list") => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      alert("لطفاً یک موضوع یا توضیحات برای هوش مصنوعی بنویسید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/cases/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("کیس جدید با موفقیت توسط هوش مصنوعی تولید و در دیتابیس ذخیره شد!");
        setActiveSubTab("list");
      } else {
        alert("خطا در تولید کیس: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور هوش مصنوعی.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
      <h2 className="text-md font-bold text-clinical-clay border-b border-clinical-navy/5 dark:border-white/5 pb-2 flex items-center gap-2">
        <Settings className="w-5 h-5 animate-spin-slow" />
        تولید کیس بالینی با هوش مصنوعی (NVIDIA Llama 3)
      </h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 text-xs rounded-xl border border-indigo-200 dark:border-indigo-800/50 leading-relaxed">
          <strong>راهنما:</strong> موضوع، درجه سختی، یا مشخصات بیماری که می‌خواهید ایجاد کنید را به زبان ساده (فارسی یا انگلیسی) بنویسید. هوش مصنوعی Llama 3 به صورت خودکار یک کیس کاملاً استاندارد با شرح حال کامل، یافته‌های بالینی، و مهم‌تر از همه <strong>روباریک‌های ارزیابی (Rubrics)</strong> تولید کرده و مستقیماً در دیتابیس ذخیره می‌کند.
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-clinical-navy/70 dark:text-clinical-light/70">پرامپت (دستورالعمل به هوش مصنوعی):</label>
          <textarea 
            rows={5} 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="مثال: یک کیس سخت اندودانتیکس برای دندان ۳۶ با کانال کلسیفیه و سابقه درد شبانه ایجاد کن..."
            className="w-full p-4 text-sm bg-slate-50 dark:bg-slate-900 border border-clinical-navy/10 dark:border-white/10 rounded-xl focus:border-clinical-clay outline-none leading-relaxed"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className={`px-6 py-3 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md ${loading ? 'bg-clinical-navy/50 cursor-not-allowed' : 'bg-clinical-clay hover:bg-clinical-clay/90 active:scale-95'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال تولید هوشمند (ممکن است چند ثانیه طول بکشد)...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" /> جادوی هوش مصنوعی: ساخت کیس
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

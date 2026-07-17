"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

export type ToothCondition = "HEALTHY" | "CARIES" | "RESTORED" | "MISSING" | "IMPLANT" | "ENDO";

interface OdontogramProps {
  onToothClick?: (toothNumber: number, condition: ToothCondition) => void;
  readOnly?: boolean;
  initialState?: Record<number, ToothCondition>;
}

const FDI_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const FDI_UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const FDI_LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const FDI_LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

const CONDITION_COLORS: Record<ToothCondition, string> = {
  HEALTHY: "bg-white dark:bg-clinical-darker border-clinical-navy/20 dark:border-white/20 text-clinical-navy dark:text-white",
  CARIES: "bg-red-500 border-red-700 text-white shadow-inner",
  RESTORED: "bg-blue-400 border-blue-600 text-white",
  MISSING: "bg-gray-200 dark:bg-gray-800 border-dashed border-gray-400 text-gray-400 opacity-50",
  IMPLANT: "bg-purple-500 border-purple-700 text-white",
  ENDO: "bg-amber-500 border-amber-700 text-white",
};

export default function Odontogram({ onToothClick, readOnly = false, initialState = {} }: OdontogramProps) {
  const [teeth, setTeeth] = useState<Record<number, ToothCondition>>(initialState);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleSelectCondition = (tooth: number, condition: ToothCondition) => {
    const updated = { ...teeth, [tooth]: condition };
    setTeeth(updated);
    setActiveMenu(null);
    onToothClick?.(tooth, condition);
  };

  const renderTooth = (num: number) => {
    const condition = teeth[num] || "HEALTHY";
    const colorClass = CONDITION_COLORS[condition];

    return (
      <div key={num} className="relative flex flex-col items-center gap-1 group">
        <button
          onClick={() => !readOnly && setActiveMenu(activeMenu === num ? null : num)}
          className={`w-8 h-10 sm:w-10 sm:h-14 rounded-[4px] sm:rounded-md border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 ${colorClass}`}
          title={`Tooth ${num} - ${condition}`}
        >
          {num}
        </button>
        
        {/* Context Menu for changing condition */}
        {activeMenu === num && !readOnly && (
          <div className="absolute top-full mt-2 z-50 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/10 rounded-xl shadow-xl flex flex-col w-32 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="px-3 py-2 bg-clinical-light dark:bg-clinical-dark border-b border-clinical-navy/5 text-xs font-bold text-center">
              دندان {num}
            </div>
            {Object.keys(CONDITION_COLORS).map((c) => (
              <button
                key={c}
                onClick={() => handleSelectCondition(num, c as ToothCondition)}
                className="px-3 py-2 text-xs text-right hover:bg-clinical-clay/10 transition-colors border-b border-clinical-navy/5 last:border-0"
              >
                {c === "HEALTHY" && "سالم"}
                {c === "CARIES" && "پوسیدگی"}
                {c === "RESTORED" && "ترمیم شده"}
                {c === "MISSING" && "غایب (کشیده شده)"}
                {c === "IMPLANT" && "ایمپلنت"}
                {c === "ENDO" && "درمان ریشه"}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-6 min-w-[600px]">
        <h3 className="text-sm font-bold text-clinical-navy dark:text-clinical-light flex items-center gap-2">
          چارت دندانی (FDI)
        </h3>
        <div className="flex gap-4 text-[10px] sm:text-xs font-medium">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> پوسیدگی</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> ترمیم</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> اندو</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 border border-dashed border-gray-400 rounded-sm"></div> غایب</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 min-w-[600px] items-center">
        {/* Maxillary Arch */}
        <div className="flex items-end justify-center gap-4">
          <div className="flex gap-1.5 sm:gap-2">
            {FDI_UPPER_RIGHT.map(renderTooth)}
          </div>
          <div className="w-px h-16 bg-clinical-navy/20 dark:bg-white/20"></div>
          <div className="flex gap-1.5 sm:gap-2">
            {FDI_UPPER_LEFT.map(renderTooth)}
          </div>
        </div>

        {/* Mandibular Arch */}
        <div className="flex items-start justify-center gap-4">
          <div className="flex gap-1.5 sm:gap-2">
            {FDI_LOWER_RIGHT.map(renderTooth)}
          </div>
          <div className="w-px h-16 bg-clinical-navy/20 dark:bg-white/20"></div>
          <div className="flex gap-1.5 sm:gap-2">
            {FDI_LOWER_LEFT.map(renderTooth)}
          </div>
        </div>
      </div>
      
      {!readOnly && (
        <p className="text-xs text-clinical-navy/50 dark:text-clinical-light/50 mt-6 text-center flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          برای تغییر وضعیت روی دندان‌ها کلیک کنید.
        </p>
      )}
    </div>
  );
}

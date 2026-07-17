"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

interface SkillData {
  subject: string;
  A: number; // User score
  fullMark: number;
}

interface HeatmapChartProps {
  data: SkillData[];
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-sm text-clinical-navy/50 dark:text-white/40">
        اطلاعات کافی برای رسم نمودار تحلیلی وجود ندارد.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'currentColor', fontSize: 12, className: 'text-clinical-navy/70 dark:text-clinical-light/70 font-semibold' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
          />
          <Radar 
            name="مهارت بالینی" 
            dataKey="A" 
            stroke="#2563eb" 
            fill="#3b82f6" 
            fillOpacity={0.5} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

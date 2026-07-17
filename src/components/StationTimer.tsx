"use client";

import React, { useState, useEffect } from "react";
import { Timer, AlertTriangle } from "lucide-react";

interface StationTimerProps {
  timeLimitSeconds: number; // e.g., 300 for 5 minutes
  onTimeUp?: () => void;
  warningThreshold?: number; // e.g., 60 for 1 minute warning
}

export default function StationTimer({ 
  timeLimitSeconds, 
  onTimeUp,
  warningThreshold = 60 
}: StationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    if (timeLeft <= warningThreshold && !isWarning) {
      setIsWarning(true);
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, warningThreshold, isWarning]);

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
        isWarning 
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse" 
          : "bg-white dark:bg-clinical-darker border-clinical-navy/10 dark:border-white/10 text-clinical-navy dark:text-clinical-light"
      }`}
    >
      {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
      <span className="font-mono font-bold text-lg">{formattedTime}</span>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Moon, Sun, BookOpen, Award, User } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial local storage or class list
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-clinical-light dark:bg-clinical-dark border-b border-clinical-navy/10 dark:border-white/10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Activity className="h-6 w-6 text-clinical-clay group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight text-clinical-navy dark:text-clinical-light">
                کیس‌کلینیک <span className="text-xs text-clinical-clay">CaseClinic</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-clinical-navy/80 dark:text-clinical-light/80">
              <Link href="/dashboard" className="hover:text-clinical-clay transition-colors">داشبورد</Link>
              <Link href="/courses" className="hover:text-clinical-clay transition-colors">دروس بالینی</Link>
              <Link href="/cases" className="hover:text-clinical-clay transition-colors">بانک کیس</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-clinical-navy/5 dark:hover:bg-white/5 text-clinical-navy dark:text-clinical-light transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5 text-clinical-gold" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-clinical-navy/10 dark:border-white/10 hover:bg-clinical-navy/5 dark:hover:bg-white/5 transition-all text-xs font-semibold text-clinical-navy dark:text-clinical-light">
              <User className="h-4 w-4 text-clinical-clay" />
              <span>دکتر محمدی (پنل کارورز)</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

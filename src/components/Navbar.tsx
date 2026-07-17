"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Moon, Sun, LogOut, User, ChevronDown } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Dark Mode: load from localStorage on mount ───────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // ── Fetch current user from cookie via API ───────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-clinical-light/95 dark:bg-clinical-dark/95 border-b border-clinical-navy/10 dark:border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Activity className="h-6 w-6 text-clinical-clay group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight text-clinical-navy dark:text-clinical-light">
                کیس‌کلینیک{" "}
                <span className="text-xs text-clinical-clay">CaseClinic</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-clinical-navy/80 dark:text-clinical-light/80">
              <Link href="/dashboard" className="hover:text-clinical-clay transition-colors">داشبورد</Link>
              <Link href="/courses" className="hover:text-clinical-clay transition-colors">دروس بالینی</Link>
              <Link href="/cases" className="hover:text-clinical-clay transition-colors">بانک کیس</Link>
              <Link href="/qbank" className="hover:text-clinical-clay transition-colors">بانک سوال</Link>
              <Link href="/chat" className="hover:text-clinical-clay transition-colors">استاد هوشمند</Link>
            </div>
          </div>

          {/* Right side: Dark mode + User */}
          <div className="flex items-center gap-3">
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-clinical-navy/5 dark:hover:bg-white/5 text-clinical-navy dark:text-clinical-light transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-clinical-gold" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-clinical-navy/10 dark:border-white/10 hover:bg-clinical-navy/5 dark:hover:bg-white/5 transition-all text-xs font-semibold text-clinical-navy dark:text-clinical-light"
                >
                  <User className="h-4 w-4 text-clinical-clay" />
                  <span>{user.name}</span>
                  {user.role === "ADMIN" && (
                    <span className="px-1.5 py-0.5 bg-clinical-clay text-white text-[10px] rounded-full font-bold">
                      ادمین
                    </span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/5 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-clinical-navy/5 dark:border-white/5">
                      <p className="text-xs font-bold text-clinical-navy dark:text-clinical-light truncate">{user.name}</p>
                      <p className="text-[11px] text-clinical-navy/50 dark:text-white/40 truncate">{user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-clinical-navy dark:text-clinical-light hover:bg-clinical-navy/5 dark:hover:bg-white/5 transition-colors"
                      >
                        پنل مدیریت
                      </Link>
                    )}
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-clinical-red dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      خروج از حساب
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-semibold text-clinical-navy dark:text-clinical-light hover:text-clinical-clay transition-colors"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 bg-clinical-clay hover:bg-clinical-clay/90 text-white text-xs font-bold rounded-lg transition-all active:scale-95"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

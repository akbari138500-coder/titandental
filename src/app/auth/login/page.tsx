"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ورود. دوباره تلاش کنید.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("خطا در اتصال به سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-clinical-clay/10 rounded-2xl flex items-center justify-center mb-4">
            <Activity className="h-7 w-7 text-clinical-clay" />
          </div>
          <h1 className="text-2xl font-black text-clinical-navy dark:text-clinical-light">
            کیس‌کلینیک
          </h1>
          <p className="text-sm text-clinical-navy/60 dark:text-clinical-light/60 mt-1">
            ورود به حساب کاربری
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-clinical-darker rounded-2xl border border-clinical-navy/10 dark:border-white/5 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-clinical-navy/80 dark:text-clinical-light/80">
                آدرس ایمیل
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-navy/40 dark:text-white/30" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@university.ac.ir"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 text-clinical-navy dark:text-clinical-light placeholder:text-clinical-navy/30 dark:placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-clinical-clay/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-clinical-navy/80 dark:text-clinical-light/80">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-navy/40 dark:text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full pr-10 pl-10 py-3 rounded-xl bg-clinical-light dark:bg-clinical-dark border border-clinical-navy/10 dark:border-white/10 text-clinical-navy dark:text-clinical-light placeholder:text-clinical-navy/30 dark:placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-clinical-clay/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-clinical-navy/40 dark:text-white/30 hover:text-clinical-navy dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-btn"
              disabled={loading}
              className="w-full py-3.5 bg-clinical-clay hover:bg-clinical-clay/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all active:scale-95 shadow-md"
            >
              {loading ? "در حال ورود..." : "ورود به حساب"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-clinical-navy/60 dark:text-clinical-light/60">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/auth/register"
              className="text-clinical-clay font-semibold hover:underline"
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

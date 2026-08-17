"use client";

import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 selection:bg-[#FFA500] selection:text-[#071522]">
      <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-[#FFA500]/10 blur-3xl pointer-events-none" />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/25 mx-auto mb-4">
          <FileQuestion size={32} />
        </div>

        <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2.5 py-0.5 rounded-full border border-[#FFA500]/20">
          404 - Page Not Found
        </span>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
          Page Under Construction
        </h1>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          The requested page is either not created yet or under development. Use the buttons below to return to safety.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/dashboard");
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Previous</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

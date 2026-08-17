"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Construction,
  Home,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComingSoonViewProps {
  title: string;
  category?: string;
  description: string;
  badge?: string;
  expectedDate?: string;
  features?: string[];
}

export default function ComingSoonView({
  title,
  category = "Module in Pipeline",
  description,
  badge = "Under Development",
  expectedDate = "Q3 2025 Release",
  features = [
    "Comprehensive automated workflow integration",
    "Real-time analytics & exportable audit reports",
    "Customizable role-based permissions & security rules",
    "Seamless synchronization across transport hubs",
  ],
}: ComingSoonViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/dashboard");
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground shadow-sm hover:border-[#FFA500]/50 hover:bg-[#FFA500]/10 hover:text-[#FFA500] transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Previous Page</span>
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <Home size={14} />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      {/* Main Feature Announcement Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg text-center flex flex-col items-center justify-center">
        {/* Glow ambient background decoration */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-96 rounded-full bg-[#FFA500]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none" />

        {/* Floating Icon */}
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#FFA500]/30 bg-gradient-to-br from-[#FFA500]/20 to-[#FF8C00]/10 text-[#FFA500] shadow-xl shadow-orange-500/15 animate-bounce duration-1000">
          <Construction size={36} className="stroke-[2.2]" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFA500]/30 bg-[#FFA500]/10 px-3.5 py-1 text-xs font-bold text-[#FFA500] mb-3">
          <span className="h-2 w-2 rounded-full bg-[#FFA500] animate-ping" />
          <span>{badge}</span>
        </div>

        {/* Module Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground max-w-xl leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Estimated Timeline */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
          <Clock size={14} className="text-[#38BDF8]" />
          <span>
            Targeted Milestone: <strong className="text-foreground">{expectedDate}</strong>
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 w-full max-w-2xl border-t border-border pt-6 text-left">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-foreground">
            <span className="flex items-center gap-1.5 text-[#FFA500]">
              <Sparkles size={14} />
              <span>What to Expect in This Module</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              {category}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-background/60 p-3 text-xs"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-muted-foreground leading-snug font-medium">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Action Trigger */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/dashboard");
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Return to Previous Page</span>
          </button>

          <Link
            href="/dashboard/load-logs"
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
          >
            <span>Go to Daily Load Logs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

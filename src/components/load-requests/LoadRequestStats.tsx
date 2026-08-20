"use client";

import { CheckCircle2, Clock, Flame, PackageSearch, Truck, Zap } from "lucide-react";
import { LoadRequestPaginatedResult } from "@/types/loadRequest";

interface LoadRequestStatsProps {
  stats: LoadRequestPaginatedResult["statusCounts"];
  priorityStats: LoadRequestPaginatedResult["priorityCounts"];
}

export default function LoadRequestStats({
  stats,
  priorityStats,
}: LoadRequestStatsProps) {
  const cards = [
    {
      title: "Total Requisitions",
      value: stats.all,
      subtext: "All-time cargo requests",
      icon: PackageSearch,
      iconBg: "bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/25",
    },
    {
      title: "Pending Allocation",
      value: stats.pending,
      subtext: "Awaiting tanker assignment",
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    },
    {
      title: "Urgent Requisitions",
      value: priorityStats.urgent + priorityStats.high,
      subtext: "High-priority cargo dispatches",
      icon: Flame,
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    },
    {
      title: "Active In Transit",
      value: stats.inTransit + stats.assigned,
      subtext: "Assigned & en route tankers",
      icon: Truck,
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-border/80 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.iconBg}`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono tracking-tight text-foreground">
                {card.value}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}

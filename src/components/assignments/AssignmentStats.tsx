"use client";

import { CheckCircle2, Clock, MapPin, Radio, Shield, Truck, Zap } from "lucide-react";
import { AssignmentPaginatedResult } from "@/types/assignment";

interface AssignmentStatsProps {
  stats: AssignmentPaginatedResult["statusCounts"];
}

export default function AssignmentStats({ stats }: AssignmentStatsProps) {
  const cards = [
    {
      title: "Total Allocations",
      value: stats.all,
      subtext: "Fleet assignments issued",
      icon: Truck,
      iconBg: "bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/25",
    },
    {
      title: "At Loading Bay",
      value: stats.allocated + stats.atPlant,
      subtext: "Docked for chemical loading",
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    },
    {
      title: "Active In Transit",
      value: stats.inTransit,
      subtext: "Live GPS tracked on routes",
      icon: Radio,
      iconBg: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    },
    {
      title: "Delivered & Released",
      value: stats.delivered + stats.released,
      subtext: "Completed trips this cycle",
      icon: CheckCircle2,
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

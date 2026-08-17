"use client";

import { Activity, Building2, Truck, Wallet } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardData";

const iconMap = {
  truck: {
    icon: Truck,
    color: "text-[#FFA500]",
    bg: "bg-[#FFA500]/10",
  },
  activity: {
    icon: Activity,
    color: "text-[#00AEEF]",
    bg: "bg-[#00AEEF]/10",
  },
  building: {
    icon: Building2,
    color: "text-[#8B6CFF]",
    bg: "bg-[#8B6CFF]/10",
  },
  wallet: {
    icon: Wallet,
    color: "text-[#00C897]",
    bg: "bg-[#00C897]/10",
  },
};

export default function StatCards() {
  const { stats, loading } = useDashboardStats();

  if (loading && stats.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-[#14293C] bg-[#0A1A2B]/60 p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const iconConfig = iconMap[stat.iconType] || iconMap.truck;
        const Icon = iconConfig.icon;

        return (
          <div
            key={stat.id}
            className="group relative rounded-2xl border border-[#14293C] bg-[#0A1A2B] p-4 sm:p-5 transition-all duration-200 hover:border-[#1E3E5B] hover:bg-[#0C1E32] hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          >
            {/* Top Icon */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconConfig.bg} ${iconConfig.color} transition-transform group-hover:scale-105`}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Value */}
            <div className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#F1F5F9] leading-tight">
              {stat.value}
            </div>

            {/* Label */}
            <div className="mt-1 text-xs font-medium text-[#7A95AF]">
              {stat.title}
            </div>

            {/* Trend / Status Note */}
            <div
              className={`mt-2 text-xs font-medium ${
                stat.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}

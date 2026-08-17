"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRevenueTrend } from "@/hooks/useDashboardData";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: {
      month: string;
      revenue: number;
      trips: number;
      revenueDisplay: string;
      tripsDisplay: string;
    };
  }>;
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-popover text-popover-foreground px-3.5 py-2.5 text-xs shadow-2xl backdrop-blur-md z-30">
        <div className="font-semibold text-foreground mb-1.5 pb-1 border-b border-border">
          {label}
        </div>
        <div className="flex items-center gap-2 text-[#FFA500] font-medium">
          <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
          <span>Revenue: {dataItem.revenueDisplay || `₹${dataItem.revenue}K`}</span>
        </div>
        <div className="flex items-center gap-2 text-[#38BDF8] font-medium mt-1">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
          <span>Trips: {dataItem.tripsDisplay || `${dataItem.trips} trips`}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function RevenueTrendChart() {
  const { data, range, setRange, loading } = useRevenueTrend("6m");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 transition hover:border-primary/40 text-card-foreground shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground leading-snug">
            Revenue & Trip Trend
          </h2>
          <p className="text-xs text-muted-foreground">
            Dynamic monthly performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium mr-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
              <span>Revenue (₹K)</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
              <span>Trips</span>
            </div>
          </div>

          {/* Range Selector Pill Switch */}
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
            <button
              onClick={() => setRange("6m")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                range === "6m"
                  ? "bg-[#FFA500] text-[#071522] shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setRange("1y")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                range === "1y"
                  ? "bg-[#FFA500] text-[#071522] shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1 Year
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[240px] w-full pt-2">
        {!mounted || loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-[#FFA500] border-t-transparent animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA500" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FFA500" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />

              <YAxis
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                domain={[0, "auto"]}
              />

              <Tooltip content={<CustomChartTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#FFA500"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 5, fill: "#FFA500", stroke: "var(--card)", strokeWidth: 2 }}
              />

              <Area
                type="monotone"
                dataKey="trips"
                name="Trips"
                stroke="#38BDF8"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#colorTrips)"
                activeDot={{ r: 5, fill: "#38BDF8", stroke: "var(--card)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

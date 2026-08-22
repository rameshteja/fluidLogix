"use client";

import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  Truck,
  BarChart3,
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsWrapper from "./HighchartsWrapper";

type ChartType = "stacked-column" | "combo" | "area";
type DateWindow = "today" | "week" | "month";

const FLEET_DATASETS: Record<DateWindow, {
  categories: string[];
  inTransit: number[];
  loadedAtPlant: number[];
  available: number[];
  maintenance: number[];
  efficiencyHours: number[];
}> = {
  today: {
    categories: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    inTransit: [24, 28, 38, 42, 40, 32],
    loadedAtPlant: [8, 10, 14, 12, 10, 8],
    available: [18, 14, 6, 4, 8, 16],
    maintenance: [2, 2, 2, 2, 2, 2],
    efficiencyHours: [38, 36, 33, 31, 32, 34],
  },
  week: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    inTransit: [32, 36, 41, 44, 42, 35, 28],
    loadedAtPlant: [10, 12, 11, 8, 9, 7, 6],
    available: [8, 4, 2, 2, 3, 10, 18],
    maintenance: [2, 2, 2, 2, 2, 2, 2],
    efficiencyHours: [34, 32, 30, 29, 31, 36, 39],
  },
  month: {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    inTransit: [34, 38, 42, 45],
    loadedAtPlant: [9, 10, 8, 7],
    available: [7, 4, 2, 1],
    maintenance: [2, 2, 2, 2],
    efficiencyHours: [33.5, 31.8, 29.4, 28.2],
  },
};

export default function HighchartsFleetUtilization() {
  const [chartType, setChartType] = useState<ChartType>("stacked-column");
  const [dateWindow, setDateWindow] = useState<DateWindow>("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dataset = useMemo(() => {
    return FLEET_DATASETS[dateWindow];
  }, [dateWindow]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const highchartsOptions: Highcharts.Options = useMemo(() => {
    const isStacked = chartType === "stacked-column";
    const isArea = chartType === "area";
    const isCombo = chartType === "combo";

    return {
      chart: {
        type: isStacked ? "column" : isArea ? "area" : "column",
        backgroundColor: "transparent",
        spacing: [15, 10, 10, 10],
        style: {
          fontFamily: "inherit",
        },
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: dataset.categories,
        lineColor: "rgba(255, 255, 255, 0.1)",
        tickColor: "rgba(255, 255, 255, 0.1)",
        labels: {
          style: {
            color: "rgba(161, 161, 170, 0.9)",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
      },
      yAxis: [
        {
          title: {
            text: "Tankers Count",
            style: {
              color: "#FFA500",
              fontSize: "11px",
              fontWeight: "600",
            },
          },
          gridLineColor: "rgba(255, 255, 255, 0.06)",
          labels: {
            format: "{value} Units",
            style: {
              color: "rgba(161, 161, 170, 0.8)",
              fontSize: "10px",
            },
          },
          stackLabels: {
            enabled: isStacked,
            style: {
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "10px",
            },
          },
        },
        ...(isCombo
          ? [
              {
                title: {
                  text: "Avg Turnaround (Hrs)",
                  style: {
                    color: "#38BDF8",
                    fontSize: "11px",
                    fontWeight: "600",
                  },
                },
                gridLineWidth: 0,
                opposite: true,
                labels: {
                  format: "{value}h",
                  style: {
                    color: "#38BDF8",
                    fontSize: "10px",
                  },
                },
              },
            ]
          : []),
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "rgba(7, 21, 34, 0.95)",
        borderColor: "rgba(255, 165, 0, 0.3)",
        borderRadius: 12,
        shadow: true,
        style: {
          color: "#FFFFFF",
          fontSize: "12px",
        },
        headerFormat: '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:4px;">{point.key}</div>',
        pointFormat:
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:3px 0;">' +
          '<span style="color:{series.color};font-weight:600;">● {series.name}:</span> ' +
          '<span style="font-family:monospace;font-weight:bold;color:#FFFFFF;">{point.y}</span>' +
          '</div>',
      },
      legend: {
        itemStyle: {
          color: "rgba(228, 228, 231, 0.85)",
          fontSize: "11px",
          fontWeight: "500",
        },
        itemHoverStyle: {
          color: "#FFA500",
        },
      },
      plotOptions: {
        column: {
          stacking: isStacked ? "normal" : undefined,
          borderRadius: 4,
          borderWidth: 0,
        },
        area: {
          stacking: "normal",
          lineColor: "rgba(255, 255, 255, 0.2)",
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: "#fff",
          },
        },
      },
      series: [
        {
          type: isCombo ? "column" : isArea ? "area" : "column",
          name: "In Transit (Active)",
          data: dataset.inTransit,
          color: "#10B981", // Emerald
        },
        {
          type: isCombo ? "column" : isArea ? "area" : "column",
          name: "Loading at Plant",
          data: dataset.loadedAtPlant,
          color: "#FFA500", // Amber
        },
        {
          type: isCombo ? "column" : isArea ? "area" : "column",
          name: "Available in Depot",
          data: dataset.available,
          color: "#38BDF8", // Cyan
        },
        {
          type: isCombo ? "column" : isArea ? "area" : "column",
          name: "Under Inspection",
          data: dataset.maintenance,
          color: "#F43F5E", // Rose
        },
        ...(isCombo
          ? [
              {
                type: "spline" as const,
                name: "Avg Turnaround Duration",
                data: dataset.efficiencyHours,
                color: "#A855F7", // Purple
                yAxis: 1,
                tooltip: {
                  valueSuffix: " Hours",
                },
              },
            ]
          : []),
      ],
    };
  }, [chartType, dataset]);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 transition shadow-sm flex flex-col justify-between overflow-hidden h-full min-h-[440px]">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Truck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground leading-snug">
                  Fleet Utilization & Status Matrix
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 size={11} />
                  <span>88.4% Active</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time tanker availability, plant turnaround & transit efficiency
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setChartType("stacked-column")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "stacked-column"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Stacked Column Breakdown"
              >
                <BarChart3 size={13} />
                <span className="hidden sm:inline">Stacked</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType("combo")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "combo"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Turnaround Combo Chart"
              >
                <TrendingUp size={13} />
                <span className="hidden sm:inline">Combo</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType("area")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "area"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Area Waves"
              >
                <Layers size={13} />
                <span className="hidden sm:inline">Area</span>
              </button>
            </div>

            {/* Date Window Filter */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 text-xs">
              {(
                [
                  { label: "Today", value: "today" },
                  { label: "7D", value: "week" },
                  { label: "1M", value: "month" },
                ] as Array<{ label: string; value: DateWindow }>
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setDateWindow(tab.value)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                    dateWindow === tab.value
                      ? "bg-[#FFA500] text-[#071522] font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
                isRefreshing ? "text-[#FFA500]" : ""
              }`}
              title="Refresh Fleet Utilization"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#FFA500]" : ""} />
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">In Transit:</span>
            <span className="font-mono font-bold text-emerald-400">42 Tankers</span>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">At Plant:</span>
            <span className="font-mono font-bold text-[#FFA500]">10 Tankers</span>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Available:</span>
            <span className="font-mono font-bold text-[#38BDF8]">4 Tankers</span>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Turnaround:</span>
            <span className="font-mono font-bold text-purple-400">29.4 hrs avg</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[260px] w-full pt-3 flex flex-col justify-center">
        {isRefreshing ? (
          <div className="h-full w-full min-h-[260px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA500]">
              <RefreshCw size={15} className="animate-spin" />
              <span>Updating fleet utilization...</span>
            </div>
          </div>
        ) : (
          <HighchartsWrapper options={highchartsOptions} />
        )}
      </div>
    </div>
  );
}

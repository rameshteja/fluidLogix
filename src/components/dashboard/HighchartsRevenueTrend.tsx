"use client";

import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  Calendar,
  BarChart2,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsWrapper from "./HighchartsWrapper";

type ChartType = "spline" | "column" | "area";
type DateRange = "7d" | "30d" | "3m" | "6m" | "1y";

// Baseline dataset for various date ranges
const DATASETS: Record<DateRange, {
  categories: string[];
  revenue: number[];
  trips: number[];
  costs: number[];
}> = {
  "7d": {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [82, 95, 110, 105, 128, 140, 118], // in ₹ thousands
    trips: [14, 17, 19, 18, 22, 25, 20],
    costs: [52, 60, 71, 68, 80, 88, 74],
  },
  "30d": {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [480, 560, 620, 590], // in ₹ thousands
    trips: [78, 92, 104, 98],
    costs: [310, 360, 395, 380],
  },
  "3m": {
    categories: ["May 2025", "Jun 2025", "Jul 2025"],
    revenue: [1840, 2190, 2450],
    trips: [290, 345, 390],
    costs: [1180, 1390, 1550],
  },
  "6m": {
    categories: ["Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025"],
    revenue: [1420, 1680, 1750, 1920, 2240, 2580],
    trips: [210, 245, 260, 295, 340, 392],
    costs: [920, 1080, 1120, 1230, 1420, 1630],
  },
  "1y": {
    categories: [
      "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24", "Jan 25",
      "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25"
    ],
    revenue: [1100, 1250, 1320, 1450, 1580, 1390, 1420, 1680, 1750, 1920, 2240, 2580],
    trips: [160, 185, 195, 215, 230, 205, 210, 245, 260, 295, 340, 392],
    costs: [710, 800, 840, 930, 1010, 890, 920, 1080, 1120, 1230, 1420, 1630],
  },
};

export default function HighchartsRevenueTrend() {
  const [chartType, setChartType] = useState<ChartType>("spline");
  const [dateRange, setDateRange] = useState<DateRange>("6m");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metricMode, setMetricMode] = useState<"all" | "revenue" | "trips">("all");

  const currentData = useMemo(() => {
    return DATASETS[dateRange];
  }, [dateRange]);

  const totalRevenue = useMemo(() => {
    return currentData.revenue.reduce((a, b) => a + b, 0);
  }, [currentData]);

  const totalTrips = useMemo(() => {
    return currentData.trips.reduce((a, b) => a + b, 0);
  }, [currentData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Build Highcharts Configuration Options
  const highchartsOptions: Highcharts.Options = useMemo(() => {
    const seriesList: any[] = [];

    if (metricMode === "all" || metricMode === "revenue") {
      seriesList.push({
        type: chartType === "spline" ? "spline" : chartType === "column" ? "column" : "area",
        name: "Gross Freight Revenue",
        data: currentData.revenue,
        color: "#FFA500",
        yAxis: 0,
        borderRadius: chartType === "column" ? 6 : 0,
        fillColor:
          chartType === "area"
            ? {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(255, 165, 0, 0.45)"],
                  [1, "rgba(255, 165, 0, 0.01)"],
                ],
              }
            : undefined,
        tooltip: {
          valuePrefix: "₹",
          valueSuffix: " K",
        },
      });
    }

    if (metricMode === "all") {
      seriesList.push({
        type: chartType === "spline" ? "spline" : chartType === "column" ? "column" : "area",
        name: "Operating Costs",
        data: currentData.costs,
        color: "#F43F5E",
        yAxis: 0,
        borderRadius: chartType === "column" ? 6 : 0,
        fillColor:
          chartType === "area"
            ? {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(244, 63, 94, 0.35)"],
                  [1, "rgba(244, 63, 94, 0.01)"],
                ],
              }
            : undefined,
        tooltip: {
          valuePrefix: "₹",
          valueSuffix: " K",
        },
      });
    }

    if (metricMode === "all" || metricMode === "trips") {
      seriesList.push({
        type: chartType === "column" && metricMode === "all" ? "spline" : chartType === "spline" ? "spline" : chartType === "column" ? "column" : "area",
        name: "Dispatch Trips",
        data: currentData.trips,
        color: "#38BDF8",
        yAxis: metricMode === "all" ? 1 : 0,
        borderRadius: chartType === "column" ? 6 : 0,
        fillColor:
          chartType === "area"
            ? {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(56, 189, 248, 0.4)"],
                  [1, "rgba(56, 189, 248, 0.01)"],
                ],
              }
            : undefined,
        tooltip: {
          valueSuffix: " Trips",
        },
      });
    }

    return {
      chart: {
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
        categories: currentData.categories,
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
            text: "Revenue (₹K)",
            style: {
              color: "#FFA500",
              fontSize: "11px",
              fontWeight: "600",
            },
          },
          gridLineColor: "rgba(255, 255, 255, 0.06)",
          labels: {
            format: "₹{value}K",
            style: {
              color: "rgba(161, 161, 170, 0.8)",
              fontSize: "10px",
            },
          },
        },
        ...(metricMode === "all"
          ? [
              {
                title: {
                  text: "Trips Completed",
                  style: {
                    color: "#38BDF8",
                    fontSize: "11px",
                    fontWeight: "600",
                  },
                },
                gridLineWidth: 0,
                opposite: true,
                labels: {
                  format: "{value}",
                  style: {
                    color: "rgba(161, 161, 170, 0.8)",
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
        series: {
          animation: {
            duration: 500,
          },
          marker: {
            radius: 4,
            symbol: "circle",
          },
        },
        column: {
          borderWidth: 0,
          groupPadding: 0.15,
        },
      },
      series: seriesList,
    };
  }, [chartType, currentData, metricMode]);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 transition shadow-sm flex flex-col justify-between overflow-hidden h-full min-h-[460px]">
      {/* Top Header: Title & Action Controls */}
      <div className="flex flex-col gap-3.5 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title and live metrics badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/15 text-[#FFA500] shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground leading-snug">
                  Financial & Dispatch Trends
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <ArrowUpRight size={11} />
                  <span>+18.4% YoY</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Highcharts dynamic analytics with multi-metric time series
              </p>
            </div>
          </div>

          {/* Controls: Chart Switcher, Date Range, Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Type Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setChartType("spline")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "spline"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Line / Spline Chart"
              >
                <TrendingUp size={13} />
                <span className="hidden sm:inline">Line</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType("column")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "column"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Bar / Column Chart"
              >
                <BarChart2 size={13} />
                <span className="hidden sm:inline">Bar</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType("area")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "area"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Area Gradient Chart"
              >
                <Layers size={13} />
                <span className="hidden sm:inline">Area</span>
              </button>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 text-xs">
              {(["7d", "30d", "3m", "6m", "1y"] as DateRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setDateRange(r);
                    setShowCustomDate(false);
                  }}
                  className={`px-2 py-1 rounded-lg font-semibold uppercase text-[10px] transition cursor-pointer ${
                    dateRange === r && !showCustomDate
                      ? "bg-[#FFA500] text-[#071522] font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustomDate(!showCustomDate)}
                className={`p-1 rounded-lg transition cursor-pointer ${
                  showCustomDate
                    ? "bg-[#FFA500] text-[#071522]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Custom Date Filter"
              >
                <Calendar size={13} />
              </button>
            </div>

            {/* Live Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
                isRefreshing ? "text-[#FFA500]" : ""
              }`}
              title="Refresh Chart Data"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#FFA500]" : ""} />
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker Accordion */}
        {showCustomDate && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50 text-xs animate-in fade-in duration-150">
            <span className="text-muted-foreground text-[11px] font-semibold">Custom Window:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="h-7.5 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[#FFA500]"
            />
            <span className="text-muted-foreground text-xs">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-7.5 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[#FFA500]"
            />
            <button
              type="button"
              onClick={handleRefresh}
              className="h-7.5 px-3 rounded-lg bg-[#FFA500] text-[#071522] font-bold text-xs hover:bg-[#FFB733] transition cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        )}

        {/* Metric Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div
            onClick={() => setMetricMode("revenue")}
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition cursor-pointer ${
              metricMode === "revenue"
                ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground"
                : "border-border/70 bg-background/50 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
            <span>Total Revenue:</span>
            <strong className="font-mono text-foreground font-bold">
              ₹{(totalRevenue / 100).toFixed(1)} Lakhs
            </strong>
          </div>

          <div
            onClick={() => setMetricMode("trips")}
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition cursor-pointer ${
              metricMode === "trips"
                ? "border-[#38BDF8] bg-[#38BDF8]/10 text-foreground"
                : "border-border/70 bg-background/50 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            <span>Total Trips:</span>
            <strong className="font-mono text-foreground font-bold">{totalTrips}</strong>
          </div>

          <div
            onClick={() => setMetricMode("all")}
            className={`ml-auto text-[11px] font-semibold cursor-pointer transition ${
              metricMode === "all" ? "text-[#FFA500] underline" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Show All Metrics
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 min-h-[280px] w-full pt-3 flex flex-col justify-center">
        {isRefreshing ? (
          <div className="h-full w-full min-h-[280px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA500]">
              <RefreshCw size={15} className="animate-spin" />
              <span>Updating Highcharts dataset...</span>
            </div>
          </div>
        ) : (
          <HighchartsWrapper options={highchartsOptions} />
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  MapPin,
  BarChartHorizontal,
  BarChart2,
  PieChart as PieIcon,
  Navigation,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsWrapper from "./HighchartsWrapper";

type ChartType = "bar" | "column" | "pie";
type DateFilter = "30d" | "90d" | "1y";

interface RouteData {
  route: string;
  shortName: string;
  volumeKl: number;
  revenueLakhs: number;
  trips: number;
  avgHours: number;
  color: string;
}

const ROUTE_DATASETS: Record<DateFilter, RouteData[]> = {
  "30d": [
    { route: "Visakhapatnam → Hazira", shortName: "Vizag-Hazira", volumeKl: 3200, revenueLakhs: 48.5, trips: 84, avgHours: 32, color: "#FFA500" },
    { route: "Mumbai → Hyderabad", shortName: "Mumbai-Hyd", volumeKl: 2800, revenueLakhs: 39.2, trips: 72, avgHours: 24, color: "#38BDF8" },
    { route: "Chennai → Bengaluru", shortName: "Chennai-Blr", volumeKl: 2400, revenueLakhs: 31.0, trips: 65, avgHours: 16, color: "#10B981" },
    { route: "Paradeep → Vizag Port", shortName: "Paradeep-Vizag", volumeKl: 1900, revenueLakhs: 24.8, trips: 51, avgHours: 18, color: "#8B5CF6" },
    { route: "Dahej → Vadodara", shortName: "Dahej-Vadodara", volumeKl: 1650, revenueLakhs: 19.5, trips: 44, avgHours: 12, color: "#F43F5E" },
  ],
  "90d": [
    { route: "Visakhapatnam → Hazira", shortName: "Vizag-Hazira", volumeKl: 9800, revenueLakhs: 148.0, trips: 258, avgHours: 31.5, color: "#FFA500" },
    { route: "Mumbai → Hyderabad", shortName: "Mumbai-Hyd", volumeKl: 8400, revenueLakhs: 119.5, trips: 218, avgHours: 23.8, color: "#38BDF8" },
    { route: "Chennai → Bengaluru", shortName: "Chennai-Blr", volumeKl: 7100, revenueLakhs: 94.2, trips: 195, avgHours: 15.5, color: "#10B981" },
    { route: "Paradeep → Vizag Port", shortName: "Paradeep-Vizag", volumeKl: 5800, revenueLakhs: 76.4, trips: 155, avgHours: 17.8, color: "#8B5CF6" },
    { route: "Dahej → Vadodara", shortName: "Dahej-Vadodara", volumeKl: 4900, revenueLakhs: 58.0, trips: 132, avgHours: 11.8, color: "#F43F5E" },
  ],
  "1y": [
    { route: "Visakhapatnam → Hazira", shortName: "Vizag-Hazira", volumeKl: 39500, revenueLakhs: 596.0, trips: 1040, avgHours: 31.0, color: "#FFA500" },
    { route: "Mumbai → Hyderabad", shortName: "Mumbai-Hyd", volumeKl: 33800, revenueLakhs: 482.0, trips: 880, avgHours: 23.5, color: "#38BDF8" },
    { route: "Chennai → Bengaluru", shortName: "Chennai-Blr", volumeKl: 28600, revenueLakhs: 380.0, trips: 785, avgHours: 15.2, color: "#10B981" },
    { route: "Paradeep → Vizag Port", shortName: "Paradeep-Vizag", volumeKl: 23400, revenueLakhs: 308.0, trips: 625, avgHours: 17.5, color: "#8B5CF6" },
    { route: "Dahej → Vadodara", shortName: "Dahej-Vadodara", volumeKl: 19800, revenueLakhs: 234.0, trips: 530, avgHours: 11.5, color: "#F43F5E" },
  ],
};

export default function HighchartsRoutePerformance() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const routes = useMemo(() => {
    return ROUTE_DATASETS[dateFilter];
  }, [dateFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const highchartsOptions: Highcharts.Options = useMemo(() => {
    if (chartType === "pie") {
      return {
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          spacing: [5, 5, 5, 5],
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
        tooltip: {
          useHTML: true,
          backgroundColor: "rgba(7, 21, 34, 0.95)",
          borderColor: "rgba(255, 165, 0, 0.3)",
          borderRadius: 12,
          formatter: function (this: any) {
            const point = this.point || this;
            return (
              '<div style="padding: 2px 4px;">' +
              '<div style="font-weight:bold;color:' +
              point.color +
              ';">' +
              point.name +
              "</div>" +
              '<div style="font-size:11px;margin-top:3px;">Volume: <strong style="color:#FFF;">' +
              point.y.toLocaleString() +
              " KL</strong></div>" +
              '<div style="font-size:11px;">Freight Revenue: <strong style="color:#FFA500;">₹' +
              point.revenueLakhs +
              " Lakhs</strong></div>" +
              "</div>"
            );
          },
        },
        plotOptions: {
          pie: {
            innerSize: "55%",
            borderWidth: 2,
            borderColor: "rgba(7, 21, 34, 0.6)",
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: [
          {
            type: "pie",
            name: "Route Volume",
            data: routes.map((r) => ({
              name: r.shortName,
              y: r.volumeKl,
              color: r.color,
              revenueLakhs: r.revenueLakhs,
            })),
          },
        ],
      };
    }

    const categories = routes.map((r) => r.shortName);

    return {
      chart: {
        type: chartType === "bar" ? "bar" : "column",
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
        categories,
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
            text: "Volume (KL)",
            style: {
              color: "#FFA500",
              fontSize: "11px",
              fontWeight: "600",
            },
          },
          gridLineColor: "rgba(255, 255, 255, 0.06)",
          labels: {
            format: "{value} KL",
            style: {
              color: "rgba(161, 161, 170, 0.8)",
              fontSize: "10px",
            },
          },
        },
        {
          title: {
            text: "Revenue (₹ Lakhs)",
            style: {
              color: "#38BDF8",
              fontSize: "11px",
              fontWeight: "600",
            },
          },
          opposite: true,
          gridLineWidth: 0,
          labels: {
            format: "₹{value}L",
            style: {
              color: "#38BDF8",
              fontSize: "10px",
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "rgba(7, 21, 34, 0.95)",
        borderColor: "rgba(255, 165, 0, 0.3)",
        borderRadius: 12,
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderWidth: 0,
        },
        column: {
          borderRadius: 6,
          borderWidth: 0,
        },
      },
      legend: {
        itemStyle: {
          color: "rgba(228, 228, 231, 0.85)",
          fontSize: "11px",
        },
      },
      series: [
        {
          type: chartType === "bar" ? "bar" : "column",
          name: "Payload Volume (KL)",
          data: routes.map((r) => r.volumeKl),
          color: "#FFA500",
          yAxis: 0,
        },
        {
          type: chartType === "bar" ? "bar" : "column",
          name: "Revenue (₹ Lakhs)",
          data: routes.map((r) => r.revenueLakhs),
          color: "#38BDF8",
          yAxis: 1,
        },
      ],
    };
  }, [chartType, routes]);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 transition shadow-sm flex flex-col justify-between overflow-hidden h-full min-h-[440px]">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-[#38BDF8] shrink-0">
              <Navigation size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-snug">
                Top Logistics Freight Corridors
              </h2>
              <p className="text-xs text-muted-foreground">
                Regional liquid cargo volume and revenue throughput
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Type Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "bar"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Horizontal Bar Chart"
              >
                <BarChartHorizontal size={13} />
                <span className="hidden sm:inline">Bar</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType("column")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "column"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Column Chart"
              >
                <BarChart2 size={13} />
                <span className="hidden sm:inline">Col</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  chartType === "pie"
                    ? "bg-[#FFA500] text-[#071522] shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Pie Chart"
              >
                <PieIcon size={13} />
                <span className="hidden sm:inline">Pie</span>
              </button>
            </div>

            {/* Date Filter */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 text-xs">
              {(
                [
                  { label: "30D", value: "30d" },
                  { label: "90D", value: "90d" },
                  { label: "1Y", value: "1y" },
                ] as Array<{ label: string; value: DateFilter }>
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setDateFilter(tab.value)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                    dateFilter === tab.value
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
              title="Refresh Route Analytics"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#FFA500]" : ""} />
            </button>
          </div>
        </div>

        {/* Quick Route Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Top Route:</span>
            <span className="font-semibold text-foreground truncate max-w-[110px] text-[11px]">Vizag → Hazira</span>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Total KL:</span>
            <span className="font-mono font-bold text-[#FFA500]">
              {(routes.reduce((a, b) => a + b.volumeKl, 0) / 1000).toFixed(1)}k KL
            </span>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/60 p-2 col-span-2 sm:col-span-1 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Total Freight:</span>
            <span className="font-mono font-bold text-emerald-400">
              ₹{routes.reduce((a, b) => a + b.revenueLakhs, 0).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[260px] w-full pt-3 flex flex-col justify-center">
        {isRefreshing ? (
          <div className="h-full w-full min-h-[260px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA500]">
              <RefreshCw size={15} className="animate-spin" />
              <span>Updating corridor analytics...</span>
            </div>
          </div>
        ) : (
          <HighchartsWrapper options={highchartsOptions} />
        )}
      </div>
    </div>
  );
}

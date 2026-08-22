"use client";

import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  PieChart as PieIcon,
  BarChartHorizontal,
  BarChart,
  Calendar,
  FlaskConical,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsWrapper from "./HighchartsWrapper";

type ChartType = "donut" | "pie" | "bar" | "column";
type DateFilter = "month" | "quarter" | "year";

interface MaterialStat {
  name: string;
  volumeKl: number;
  percentage: number;
  color: string;
  category: string;
}

const MATERIAL_DATA_PRESETS: Record<DateFilter, MaterialStat[]> = {
  month: [
    { name: "Liquid Caustic Soda (48%)", volumeKl: 1450, percentage: 35, color: "#FFA500", category: "Chemical" },
    { name: "Sulfuric Acid (98%)", volumeKl: 980, percentage: 24, color: "#38BDF8", category: "Hazardous" },
    { name: "Bio-Ethanol / Fuel", volumeKl: 720, percentage: 18, color: "#10B981", category: "Non-Hazard" },
    { name: "Organic Solvents", volumeKl: 560, percentage: 14, color: "#8B5CF6", category: "Chemical" },
    { name: "Industrial Slurry & Waste", volumeKl: 380, percentage: 9, color: "#F43F5E", category: "Waste Water" },
  ],
  quarter: [
    { name: "Liquid Caustic Soda (48%)", volumeKl: 4200, percentage: 34, color: "#FFA500", category: "Chemical" },
    { name: "Sulfuric Acid (98%)", volumeKl: 3100, percentage: 25, color: "#38BDF8", category: "Hazardous" },
    { name: "Bio-Ethanol / Fuel", volumeKl: 2350, percentage: 19, color: "#10B981", category: "Non-Hazard" },
    { name: "Organic Solvents", volumeKl: 1620, percentage: 13, color: "#8B5CF6", category: "Chemical" },
    { name: "Industrial Slurry & Waste", volumeKl: 1100, percentage: 9, color: "#F43F5E", category: "Waste Water" },
  ],
  year: [
    { name: "Liquid Caustic Soda (48%)", volumeKl: 16800, percentage: 36, color: "#FFA500", category: "Chemical" },
    { name: "Sulfuric Acid (98%)", volumeKl: 11200, percentage: 24, color: "#38BDF8", category: "Hazardous" },
    { name: "Bio-Ethanol / Fuel", volumeKl: 8900, percentage: 19, color: "#10B981", category: "Non-Hazard" },
    { name: "Organic Solvents", volumeKl: 5800, percentage: 12, color: "#8B5CF6", category: "Chemical" },
    { name: "Industrial Slurry & Waste", volumeKl: 4200, percentage: 9, color: "#F43F5E", category: "Waste Water" },
  ],
};

export default function HighchartsMaterialDonut() {
  const [chartType, setChartType] = useState<ChartType>("donut");
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const materials = useMemo(() => {
    return MATERIAL_DATA_PRESETS[dateFilter];
  }, [dateFilter]);

  const totalVolume = useMemo(() => {
    return materials.reduce((acc, curr) => acc + curr.volumeKl, 0);
  }, [materials]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Highcharts Configuration
  const highchartsOptions: Highcharts.Options = useMemo(() => {
    if (chartType === "donut" || chartType === "pie") {
      const pieData = materials.map((m) => ({
        name: m.name,
        y: m.percentage,
        color: m.color,
        volumeKl: m.volumeKl,
      }));

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
          shadow: true,
          style: {
            color: "#FFFFFF",
            fontSize: "12px",
          },
          formatter: function (this: any) {
            const point = this.point || this;
            return (
              '<div style="padding: 2px 4px;">' +
              '<div style="font-weight:bold;color:' +
              point.color +
              ';margin-bottom:3px;">● ' +
              point.name +
              "</div>" +
              '<div style="display:flex;gap:8px;font-size:11px;">' +
              '<span style="color:#A1A1AA;">Volume:</span> <strong style="font-family:monospace;color:#FFF;">' +
              point.volumeKl.toLocaleString() +
              " KL</strong>" +
              "</div>" +
              '<div style="display:flex;gap:8px;font-size:11px;margin-top:2px;">' +
              '<span style="color:#A1A1AA;">Share:</span> <strong style="color:#FFA500;">' +
              point.y +
              "%</strong>" +
              "</div>" +
              "</div>"
            );
          },
        },
        plotOptions: {
          pie: {
            innerSize: chartType === "donut" ? "65%" : "0%",
            allowPointSelect: true,
            cursor: "pointer",
            borderWidth: 2,
            borderColor: "rgba(7, 21, 34, 0.6)",
            dataLabels: {
              enabled: false,
            },
            showInLegend: false,
            states: {
              hover: {
                halo: {
                  size: 8,
                  opacity: 0.35,
                },
                brightness: 0.1,
              },
            },
          },
        },
        series: [
          {
            type: "pie",
            name: "Cargo Volume",
            data: pieData,
          },
        ],
      };
    }

    // Horizontal Bar or Column mode
    const categories = materials.map((m) => m.name.split(" (")[0]);
    const seriesData = materials.map((m) => ({
      y: m.volumeKl,
      color: m.color,
      name: m.name,
      percentage: m.percentage,
    }));

    return {
      chart: {
        type: chartType === "bar" ? "bar" : "column",
        backgroundColor: "transparent",
        spacing: [10, 10, 10, 10],
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
            fontSize: "10px",
          },
        },
      },
      yAxis: {
        title: {
          text: "Volume (KL)",
          style: {
            color: "#FFA500",
            fontSize: "10px",
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
      tooltip: {
        useHTML: true,
        backgroundColor: "rgba(7, 21, 34, 0.95)",
        borderColor: "rgba(255, 165, 0, 0.3)",
        borderRadius: 12,
        formatter: function (this: any) {
          const point = this.point || this;
          return (
            '<div style="padding: 2px;">' +
            '<div style="font-weight:bold;color:' +
            point.color +
            ';">' +
            point.name +
            "</div>" +
            '<div style="font-size:11px;margin-top:2px;">Volume: <strong style="color:#FFF;">' +
            point.y.toLocaleString() +
            " KL</strong> (" +
            point.percentage +
            "%)</div>" +
            "</div>"
          );
        },
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
        enabled: false,
      },
      series: [
        {
          type: chartType === "bar" ? "bar" : "column",
          name: "Volume (KL)",
          data: seriesData,
        },
      ],
    };
  }, [chartType, materials]);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 transition shadow-sm flex flex-col justify-between overflow-hidden h-full min-h-[460px]">
      {/* Card Header & Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
              <FlaskConical size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-snug">
                Hazmat Cargo Split
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Chemical fluid category distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
                isRefreshing ? "text-[#FFA500]" : ""
              }`}
              title="Refresh Cargo Distribution"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin text-[#FFA500]" : ""} />
            </button>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Chart Switcher */}
          <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
            <button
              type="button"
              onClick={() => setChartType("donut")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === "donut"
                  ? "bg-[#FFA500] text-[#071522] font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Donut Chart"
            >
              <PieIcon size={12} />
              <span>Donut</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === "bar"
                  ? "bg-[#FFA500] text-[#071522] font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Bar Chart"
            >
              <BarChartHorizontal size={12} />
              <span>Bar</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("column")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === "column"
                  ? "bg-[#FFA500] text-[#071522] font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Column Chart"
            >
              <BarChart size={12} />
              <span>Col</span>
            </button>
          </div>

          {/* Date Range Select */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5 text-xs">
            {(
              [
                { label: "1M", value: "month" },
                { label: "Q3", value: "quarter" },
                { label: "1Y", value: "year" },
              ] as Array<{ label: string; value: DateFilter }>
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setDateFilter(tab.value)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition cursor-pointer ${
                  dateFilter === tab.value
                    ? "bg-[#FFA500] text-[#071522] font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas & Center Badge */}
      <div className="relative my-2 flex-1 min-h-[190px] w-full flex items-center justify-center">
        {isRefreshing ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA500]">
              <RefreshCw size={14} className="animate-spin" />
              <span>Updating distribution...</span>
            </div>
          </div>
        ) : (
          <>
            <HighchartsWrapper options={highchartsOptions} />

            {/* Central Total Overlay for Donut Mode */}
            {chartType === "donut" && (
              <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
                {hoveredIdx !== null && materials[hoveredIdx] ? (
                  <>
                    <span
                      className="text-lg font-black font-mono"
                      style={{ color: materials[hoveredIdx].color }}
                    >
                      {materials[hoveredIdx].percentage}%
                    </span>
                    <span className="text-[9px] font-semibold text-muted-foreground max-w-[80px] truncate">
                      {materials[hoveredIdx].volumeKl.toLocaleString()} KL
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-black text-foreground font-mono">
                      {(totalVolume / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Total KL
                    </span>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Legend Items (Anchored at Bottom) */}
      <div className="space-y-1 pt-2 border-t border-border/50 text-xs mt-auto shrink-0">
        {materials.map((mat, i) => {
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={mat.name}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isHovered
                  ? "bg-muted text-foreground font-medium"
                  : "hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: mat.color }}
                />
                <span className={`truncate text-[11px] ${isHovered ? "text-foreground font-semibold" : ""}`}>
                  {mat.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 font-mono text-[11px]">
                <span className="text-muted-foreground">{mat.volumeKl.toLocaleString()} KL</span>
                <span className="font-bold text-foreground min-w-[28px] text-right">
                  {mat.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

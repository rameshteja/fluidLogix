"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMaterialDistribution } from "@/hooks/useDashboardData";

export default function MaterialDonutChart() {
  const { materials, loading } = useMaterialDistribution();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalLoads = materials.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="relative rounded-2xl border border-[#14293C] bg-[#0A1A2B] p-4 sm:p-5 transition hover:border-[#1E3E5B] flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-[#F1F5F9] leading-snug">
          Loads by Material
        </h2>
        <p className="text-xs text-[#5E7995]">
          Live category breakdown
        </p>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="relative my-2 h-[175px] w-full flex items-center justify-center">
        {!mounted || loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-[#FFA500] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materials}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="percentage"
                  onMouseEnter={(_, index) => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  cursor="pointer"
                  stroke="none"
                >
                  {materials.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-200"
                      style={{
                        filter:
                          hoveredIdx === index
                            ? `drop-shadow(0 0 8px ${entry.color}90)`
                            : "none",
                        transform:
                          hoveredIdx === index ? "scale(1.04)" : "scale(1)",
                        transformOrigin: "center center",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-[#1F3E5C] bg-[#071728]/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
                          <div className="font-semibold text-[#F1F5F9]">{data.name}</div>
                          <div className="text-[#FFA500] font-medium">{data.loadsDisplay} ({data.percentage}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Central Stat Badge */}
            <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
              {hoveredIdx !== null && materials[hoveredIdx] ? (
                <>
                  <span
                    className="text-lg font-bold"
                    style={{ color: materials[hoveredIdx].color }}
                  >
                    {materials[hoveredIdx].percentage}%
                  </span>
                  <span className="text-[10px] font-medium text-[#7E9AB5] max-w-[70px] truncate">
                    {materials[hoveredIdx].name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base font-bold text-[#F1F5F9]">
                    {totalLoads}
                  </span>
                  <span className="text-[10px] font-medium text-[#5E7995]">
                    Total Loads
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Legend List */}
      <div className="space-y-1.5 pt-1">
        {materials.map((mat, i) => {
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={mat.name}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isHovered ? "bg-[#0E253A]" : "hover:bg-[#0D2134]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: mat.color }}
                />
                <span
                  className={`transition-colors ${
                    isHovered ? "text-[#F1F5F9] font-medium" : "text-[#839DB6]"
                  }`}
                >
                  {mat.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#5A7692]">
                  {mat.loadsDisplay}
                </span>
                <span className="font-semibold text-[#E2E8F0] min-w-[28px] text-right">
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

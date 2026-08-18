"use client";

import { Calendar, Check, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface DateRangePreset {
  label: string;
  startDate: string;
  endDate: string;
}

export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  { label: "July 2025 (Current)", startDate: "2025-07-01", endDate: "2025-07-31" },
  { label: "June 2025", startDate: "2025-06-01", endDate: "2025-06-30" },
  { label: "May 2025", startDate: "2025-05-01", endDate: "2025-05-31" },
  { label: "Q2 2025 (Apr - Jun)", startDate: "2025-04-01", endDate: "2025-06-30" },
  { label: "Last 30 Days", startDate: "2025-06-20", endDate: "2025-07-20" },
  { label: "Year to Date (2025)", startDate: "2025-01-01", endDate: "2025-07-20" },
];

interface DateRangePickerProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  singleDate?: string;
  onRangeChange: (start: string, end: string) => void;
  presets?: DateRangePreset[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function DateRangePicker({
  label,
  startDate = "",
  endDate = "",
  singleDate = "",
  onRangeChange,
  presets = DEFAULT_DATE_RANGE_PRESETS,
  placeholder = "Select date range...",
  className = "",
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || singleDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp dates when props change
  useEffect(() => {
    setTempStart(startDate || singleDate || "");
    setTempEnd(endDate || "");
  }, [startDate, endDate, singleDate]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasRange = Boolean(startDate || endDate || singleDate);

  const displayLabel = (() => {
    if (startDate && endDate) {
      if (startDate === endDate) return startDate;
      return `${startDate} → ${endDate}`;
    }
    if (startDate) return `From ${startDate}`;
    if (endDate) return `Until ${endDate}`;
    if (singleDate) return singleDate;
    return placeholder;
  })();

  const handleApplyCustom = () => {
    onRangeChange(tempStart, tempEnd);
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTempStart("");
    setTempEnd("");
    onRangeChange("", "");
    setIsOpen(false);
  };

  const handleSelectPreset = (preset: DateRangePreset) => {
    setTempStart(preset.startDate);
    setTempEnd(preset.endDate);
    onRangeChange(preset.startDate, preset.endDate);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-muted-foreground font-semibold mb-1 text-xs">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-8.5 w-full items-center justify-between gap-2 rounded-lg border bg-background px-2.5 text-xs text-foreground transition outline-none cursor-pointer select-none ${
          isOpen
            ? "border-[#FFA500] ring-1 ring-[#FFA500]/40 shadow-sm"
            : hasRange
            ? "border-[#FFA500]/60 bg-[#FFA500]/5 font-medium"
            : "border-border hover:border-border/80"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden text-left">
          <Calendar
            size={13}
            className={`shrink-0 transition-colors ${
              hasRange ? "text-[#FFA500]" : "text-muted-foreground"
            }`}
          />
          <span
            className={`truncate ${
              hasRange ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
          >
            {displayLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {hasRange && (
            <span
              onClick={handleClear}
              className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              title="Clear date range"
            >
              <X size={11} />
            </span>
          )}

          <ChevronDown
            size={13}
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#FFA500]" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar size={13} className="text-[#FFA500]" />
              <span>Select Date Range</span>
            </span>
            {hasRange && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] text-[#FFA500] hover:underline cursor-pointer font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Custom Date Inputs (From & To) */}
          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!tempStart && !tempEnd}
                className="flex-1 h-7.5 rounded-lg bg-[#FFA500] text-xs font-bold text-[#071522] hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
              >
                Apply Range
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClear();
                }}
                className="px-2.5 h-7.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-border">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
              Quick Range Presets
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-0.5">
              <button
                type="button"
                onClick={() => handleClear()}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                  !hasRange
                    ? "bg-[#FFA500]/15 text-[#FFA500] font-semibold border border-[#FFA500]/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>All Dates (Show All)</span>
                {!hasRange && <Check size={12} className="text-[#FFA500]" />}
              </button>

              {presets.map((p) => {
                const isSelected =
                  startDate === p.startDate && endDate === p.endDate;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-[#FFA500]/15 text-[#FFA500] font-semibold border border-[#FFA500]/30"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && (
                      <Check size={12} className="text-[#FFA500]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

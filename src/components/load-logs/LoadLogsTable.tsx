"use client";

import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns3,
  Download,
  Droplets,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Truck,
  Weight,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ExportModal from "@/components/common/ExportModal";
import ViewLoadLogModal from "@/components/load-logs/ViewLoadLogModal";
import { useLoadLogsData } from "@/hooks/useLoadLogsData";
import {
  LoadLogItem,
  LoadLogSortField,
  LoadStatus,
  MaterialCategory,
  TripType,
} from "@/types/loadLog";

interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

const LOAD_LOGS_COLUMNS: ColumnDef[] = [
  { id: "id", label: "Log ID", required: true },
  { id: "date", label: "Date" },
  { id: "vehicle", label: "Vehicle" },
  { id: "driver", label: "Driver" },
  { id: "company", label: "Company" },
  { id: "material", label: "Material" },
  { id: "weight", label: "Weight" },
  { id: "from", label: "From" },
  { id: "to", label: "To" },
  { id: "type", label: "Type" },
  { id: "loadTime", label: "Load" },
  { id: "unloadTime", label: "Unload" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Action" },
];

const loadDatePresets = [
  { label: "19 Jul 2025 (Latest)", value: "2025-07-19" },
  { label: "18 Jul 2025", value: "2025-07-18" },
  { label: "17 Jul 2025", value: "2025-07-17" },
  { label: "16 Jul 2025", value: "2025-07-16" },
  { label: "15 Jul 2025", value: "2025-07-15" },
  { label: "14 Jul 2025", value: "2025-07-14" },
  { label: "13 Jul 2025", value: "2025-07-13" },
  { label: "12 Jul 2025", value: "2025-07-12" },
];

export default function LoadLogsTable() {
  const {
    filteredLogs,
    total,
    totalPages,
    page,
    pageSize,
    stats,
    globalStats,
    params,
    setParams,
    toastMessage,

    // Modal States
    isViewOpen,
    setIsViewOpen,
    isExportOpen,
    setIsExportOpen,
    activeLog,
    setActiveLog,

    // Handlers
    handleSearch,
    setCategoryFilter,
    setStatusFilter,
    setTypeFilter,
    setDateFilter,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    handleExport,
    availableExportColumns,
    showToast,
  } = useLoadLogsData(10);

  // View Mode: List (Table) or Grid (Cards) - defaults to list matching screenshot
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Column Visibility State (All visible by default)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    date: true,
    vehicle: true,
    driver: true,
    company: true,
    material: true,
    weight: true,
    from: true,
    to: true,
    type: true,
    loadTime: true,
    unloadTime: true,
    status: true,
    actions: true,
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColumnDropdown(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDateDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumnVisibility = (colId: string) => {
    setVisibleColumns((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (prev[colId] && activeCount <= 1) return prev;
      return { ...prev, [colId]: !prev[colId] };
    });
  };

  const showAllColumns = () => {
    const allVisible: Record<string, boolean> = {};
    LOAD_LOGS_COLUMNS.forEach((col) => {
      allVisible[col.id] = true;
    });
    setVisibleColumns(allVisible);
  };

  const resetDefaultColumns = () => {
    const defaultVisible: Record<string, boolean> = {};
    LOAD_LOGS_COLUMNS.forEach((col) => {
      defaultVisible[col.id] = true;
    });
    setVisibleColumns(defaultVisible);
  };

  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  const activeAdvancedFiltersCount =
    (params.category && params.category !== "ALL" ? 1 : 0) +
    (params.status && params.status !== "ALL" ? 1 : 0) +
    (params.type && params.type !== "ALL" ? 1 : 0) +
    (params.vehicle && params.vehicle !== "ALL" ? 1 : 0) +
    (params.company && params.company !== "ALL" ? 1 : 0) +
    (params.date && params.date.trim() ? 1 : 0);

  const getSortIcon = (field: LoadLogSortField) => {
    if (params.sortBy !== field) {
      return (
        <ArrowUpDown
          size={12}
          className="text-muted-foreground group-hover:text-[#FFA500]"
        />
      );
    }
    return params.sortOrder === "asc" ? (
      <ArrowUp size={12} className="text-[#FFA500]" />
    ) : (
      <ArrowDown size={12} className="text-[#FFA500]" />
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Daily load logs refreshed");
    }, 450);
  };

  const getMaterialColorClass = (category: MaterialCategory) => {
    switch (category) {
      case "Chemical":
        return "text-[#FFA500] font-semibold";
      case "Hazardous":
        return "text-[#EF4444] font-semibold";
      case "Waste Water":
        return "text-[#38BDF8] font-semibold";
      case "Non-Hazard":
        return "text-[#10B981] font-semibold";
      default:
        return "text-foreground font-semibold";
    }
  };

  const getStatusBadge = (status: LoadStatus) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>In Transit</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>Pending</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#FFA500]/30 bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-[#FFA500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Quick Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Dispatches */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-[#FFA500]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Dispatches
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500]">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {globalStats.totalDispatches}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">
              +{stats.completed} done
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            All registered tanker trips
          </p>
        </div>

        {/* Card 2: In Transit */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-cyan-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Active In Transit
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Truck size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {globalStats.inTransit}
            </span>
            <span className="text-[11px] font-semibold text-cyan-400 animate-pulse">
              Live on GPS
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Tankers en route to destination
          </p>
        </div>

        {/* Card 3: Dispatched Cargo Volume */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Cargo Volume
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Weight size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {globalStats.totalWeightDisplay}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Liquid payload transported
          </p>
        </div>

        {/* Card 4: Total Billed Amount */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-[#FFA500]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Trip Billing Volume
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500]">
              <Droplets size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {globalStats.totalAmountDisplay}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">
              Active
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Calculated freight revenue
          </p>
        </div>
      </div>

      {/* 2. Main Daily Load Logs Table Card Container */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-4 sm:p-6 transition shadow-sm space-y-5">
        {/* Top Header: Title & Action Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug">
                Daily Load Logs
              </h2>
              <span className="rounded-full bg-[#FFA500]/10 border border-[#FFA500]/25 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#FFA500]">
                {total} Records
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time fluid transport logs, origin/destination tracking & dispatch manifests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Grid / List View Toggle */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#FFA500] text-[#071522] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View (Table)"
              >
                <List size={14} />
                <span>List</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#FFA500] text-[#071522] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View (Cards)"
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>
            </div>

            {/* Dedicated Calendar / Date Filter Popover */}
            <div className="relative" ref={dateDropdownRef}>
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                  params.date
                    ? "border-[#38BDF8]/60 bg-[#38BDF8]/15 text-[#38BDF8] ring-1 ring-[#38BDF8]/30"
                    : showDateDropdown
                    ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
                title="Filter by Dispatch Date"
              >
                <Calendar
                  size={13}
                  className={params.date ? "text-[#38BDF8]" : "text-muted-foreground"}
                />
                <span>{params.date ? params.date : "19-07-2025"}</span>
                {params.date && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setDateFilter("");
                    }}
                    className="ml-0.5 rounded p-0.5 hover:bg-[#38BDF8]/20 hover:text-white cursor-pointer"
                    title="Clear Date"
                  >
                    <X size={11} />
                  </span>
                )}
              </button>

              {/* Calendar Popover Menu */}
              {showDateDropdown && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl border border-border bg-card p-3.5 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#FFA500]" />
                      <span>Filter by Dispatch Date</span>
                    </span>
                    {params.date && (
                      <button
                        onClick={() => {
                          setDateFilter("");
                          setShowDateDropdown(false);
                        }}
                        className="text-[10px] text-[#FFA500] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Date Input */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">
                      Choose Specific Date:
                    </label>
                    <input
                      type="date"
                      value={params.date || ""}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setShowDateDropdown(false);
                      }}
                      className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] cursor-pointer"
                    />
                  </div>

                  {/* Quick Shortcuts */}
                  <div>
                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Quick Date Presets
                    </span>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDateFilter("");
                          setShowDateDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          !params.date
                            ? "bg-[#FFA500]/15 text-[#FFA500] font-semibold border border-[#FFA500]/30"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span>All Dates (Show All)</span>
                        {!params.date && <Check size={12} className="text-[#FFA500]" />}
                      </button>

                      {loadDatePresets.map((preset) => {
                        const isSelected = params.date === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setDateFilter(preset.value);
                              setShowDateDropdown(false);
                            }}
                            className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                              isSelected
                                ? "bg-[#38BDF8]/15 text-[#38BDF8] font-semibold border border-[#38BDF8]/30"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span>{preset.label}</span>
                            {isSelected && (
                              <Check size={12} className="text-[#38BDF8]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column Selection Dropdown (Only in List View) */}
            {viewMode === "list" && (
              <div className="relative" ref={columnDropdownRef}>
                <button
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                    showColumnDropdown ||
                    visibleColumnsCount < LOAD_LOGS_COLUMNS.length
                      ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                  title="Select columns to display"
                >
                  <Columns3
                    size={14}
                    className={
                      visibleColumnsCount < LOAD_LOGS_COLUMNS.length
                        ? "text-[#FFA500]"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Columns</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-[#FFA500]">
                    {visibleColumnsCount}/{LOAD_LOGS_COLUMNS.length}
                  </span>
                </button>

                {/* Popover */}
                {showColumnDropdown && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border border-border bg-card p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-border mb-2 px-1">
                      <span className="text-xs font-bold text-foreground">
                        Show / Hide Columns
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          onClick={showAllColumns}
                          className="text-[#FFA500] hover:underline cursor-pointer font-medium"
                        >
                          All
                        </button>
                        <span className="text-muted-foreground">|</span>
                        <button
                          onClick={resetDefaultColumns}
                          className="text-muted-foreground hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {LOAD_LOGS_COLUMNS.map((col) => {
                        const isChecked = visibleColumns[col.id] !== false;
                        return (
                          <label
                            key={col.id}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition select-none ${
                              isChecked
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleColumnVisibility(col.id)}
                                className="h-3.5 w-3.5 rounded border-border bg-background accent-[#FFA500] cursor-pointer"
                              />
                              <span>{col.label}</span>
                            </span>
                            {isChecked && (
                              <Check size={12} className="text-[#FFA500]" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                showFiltersPanel || activeAdvancedFiltersCount > 0
                  ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              <Filter size={13} />
              <span>Filters</span>
              {activeAdvancedFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFA500] text-[10px] font-bold text-[#071522]">
                  {activeAdvancedFiltersCount}
                </span>
              )}
            </button>

            {/* Export CSV / PDF / JSON Button */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
              title="Refresh Daily Load Logs"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin text-[#FFA500]" : ""}
              />
            </button>
          </div>
        </div>

        {/* Category Tabs & Live Search Bar Row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
          {/* Material Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { label: "All Logs", value: "ALL" },
                { label: "Chemical", value: "Chemical" },
                { label: "Hazardous", value: "Hazardous" },
                { label: "Waste Water", value: "Waste Water" },
                { label: "Non-Hazard", value: "Non-Hazard" },
              ] as Array<{ label: string; value: MaterialCategory | "ALL" }>
            ).map((tab) => {
              const isActive = (params.category || "ALL") === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setCategoryFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 shadow-sm"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by Log ID, vehicle, driver, company, route, material..."
              value={params.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
            />
            {params.search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFiltersPanel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-muted/20 animate-in fade-in duration-150 text-xs">
            {/* Status Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Dispatch Status
              </label>
              <select
                value={params.status || "ALL"}
                onChange={(e) =>
                  setStatusFilter(e.target.value as LoadStatus | "ALL")
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Transit">In Transit</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Trip Scope Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Trip Scope
              </label>
              <select
                value={params.type || "ALL"}
                onChange={(e) =>
                  setTypeFilter(e.target.value as TripType | "ALL")
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Trip Types</option>
                <option value="Local">Local</option>
                <option value="Non-Local">Non-Local</option>
              </select>
            </div>

            {/* Vehicle Tanker Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Vehicle Tanker
              </label>
              <select
                value={params.vehicle || "ALL"}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    vehicle: e.target.value,
                    page: 1,
                  }))
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Vehicles</option>
                <option value="TK-001">TK-001</option>
                <option value="TK-002">TK-002</option>
                <option value="TK-003">TK-003</option>
                <option value="TK-004">TK-004</option>
                <option value="TK-005">TK-005</option>
                <option value="TK-006">TK-006</option>
                <option value="TK-008">TK-008</option>
                <option value="TK-011">TK-011</option>
                <option value="TK-015">TK-015</option>
                <option value="TK-019">TK-019</option>
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Client / Hub Company
              </label>
              <select
                value={params.company || "ALL"}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    company: e.target.value,
                    page: 1,
                  }))
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Companies</option>
                <option value="ChemCorp Ltd">ChemCorp Ltd</option>
                <option value="HazWaste Solutions">HazWaste Solutions</option>
                <option value="EcoWaste Corp">EcoWaste Corp</option>
                <option value="IndusChem Ltd">IndusChem Ltd</option>
                <option value="AquaTech Pvt Ltd">AquaTech Pvt Ltd</option>
                <option value="BioClean Enviro">BioClean Enviro</option>
                <option value="Apex Solvents">Apex Solvents</option>
                <option value="GreenEco Logistics">GreenEco Logistics</option>
              </select>
            </div>

            {/* Reset Filters Action */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="h-8.5 w-full rounded-lg border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* 3. Main Display Area: LIST VIEW vs GRID VIEW */}
        {viewMode === "list" ? (
          /* ================= LIST VIEW (Exact match to reference screenshot) ================= */
          <div className="overflow-x-auto relative min-h-[300px] custom-scrollbar">
            {/* Loading Overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Refreshing logs...</span>
                </div>
              </div>
            )}

            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium text-muted-foreground">
                  {/* Log ID Column */}
                  {visibleColumns.id && (
                    <th
                      onClick={() => handleSort("id")}
                      className="pb-3 pr-4 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Log ID</span>
                        {getSortIcon("id")}
                      </div>
                    </th>
                  )}

                  {/* Date Column */}
                  {visibleColumns.date && (
                    <th
                      onClick={() => handleSort("date")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Date</span>
                        {getSortIcon("date")}
                      </div>
                    </th>
                  )}

                  {/* Vehicle Column */}
                  {visibleColumns.vehicle && (
                    <th
                      onClick={() => handleSort("vehicle")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Vehicle</span>
                        {getSortIcon("vehicle")}
                      </div>
                    </th>
                  )}

                  {/* Driver Column */}
                  {visibleColumns.driver && (
                    <th
                      onClick={() => handleSort("driver")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Driver</span>
                        {getSortIcon("driver")}
                      </div>
                    </th>
                  )}

                  {/* Company Column */}
                  {visibleColumns.company && (
                    <th
                      onClick={() => handleSort("company")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Company</span>
                        {getSortIcon("company")}
                      </div>
                    </th>
                  )}

                  {/* Material Column */}
                  {visibleColumns.material && (
                    <th
                      onClick={() => handleSort("material")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Material</span>
                        {getSortIcon("material")}
                      </div>
                    </th>
                  )}

                  {/* Weight Column */}
                  {visibleColumns.weight && (
                    <th
                      onClick={() => handleSort("weightKg")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Weight</span>
                        {getSortIcon("weightKg")}
                      </div>
                    </th>
                  )}

                  {/* From Column */}
                  {visibleColumns.from && (
                    <th
                      onClick={() => handleSort("from")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>From</span>
                        {getSortIcon("from")}
                      </div>
                    </th>
                  )}

                  {/* To Column */}
                  {visibleColumns.to && (
                    <th
                      onClick={() => handleSort("to")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>To</span>
                        {getSortIcon("to")}
                      </div>
                    </th>
                  )}

                  {/* Type Column */}
                  {visibleColumns.type && (
                    <th
                      onClick={() => handleSort("type")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Type</span>
                        {getSortIcon("type")}
                      </div>
                    </th>
                  )}

                  {/* Load Column */}
                  {visibleColumns.loadTime && (
                    <th
                      onClick={() => handleSort("loadTime")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Load</span>
                        {getSortIcon("loadTime")}
                      </div>
                    </th>
                  )}

                  {/* Unload Column */}
                  {visibleColumns.unloadTime && (
                    <th
                      onClick={() => handleSort("unloadTime")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Unload</span>
                        {getSortIcon("unloadTime")}
                      </div>
                    </th>
                  )}

                  {/* Status Column */}
                  {visibleColumns.status && (
                    <th
                      onClick={() => handleSort("status")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {getSortIcon("status")}
                      </div>
                    </th>
                  )}

                  {/* Actions Column */}
                  {visibleColumns.actions && (
                    <th className="pb-3 pl-3 text-right font-medium">Manifest</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumnsCount}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Search size={22} className="text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">
                          No load logs match the current criteria
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try searching for another vehicle, material, or date.
                        </p>
                        <button
                          onClick={resetFilters}
                          className="mt-2 rounded-lg bg-[#FFA500]/10 border border-[#FFA500]/30 px-3 py-1 text-xs font-semibold text-[#FFA500] hover:bg-[#FFA500]/20 cursor-pointer transition"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((row) => (
                    <tr
                      key={row.id}
                      className="transition hover:bg-muted/40 group"
                    >
                      {/* Log ID - Styled in gold mono text matching screenshot */}
                      {visibleColumns.id && (
                        <td className="py-3.5 pr-4">
                          <span
                            onClick={() => {
                              setActiveLog(row);
                              setIsViewOpen(true);
                            }}
                            className="font-mono font-black text-[#FFA500] hover:underline cursor-pointer tracking-wide"
                            title="Click to view load log details"
                          >
                            {row.id}
                          </span>
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.date && (
                        <td className="py-3.5 px-3 text-muted-foreground font-medium">
                          {row.date}
                        </td>
                      )}

                      {/* Vehicle Tanker */}
                      {visibleColumns.vehicle && (
                        <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                          {row.vehicle}
                        </td>
                      )}

                      {/* Driver */}
                      {visibleColumns.driver && (
                        <td className="py-3.5 px-3 font-semibold text-foreground">
                          {row.driver}
                        </td>
                      )}

                      {/* Company */}
                      {visibleColumns.company && (
                        <td className="py-3.5 px-3 text-muted-foreground font-medium">
                          {row.company}
                        </td>
                      )}

                      {/* Material (Distinct category coloring matching screenshot) */}
                      {visibleColumns.material && (
                        <td
                          className={`py-3.5 px-3 ${getMaterialColorClass(
                            row.category
                          )}`}
                        >
                          {row.material}
                        </td>
                      )}

                      {/* Weight */}
                      {visibleColumns.weight && (
                        <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                          {row.weightDisplay}
                        </td>
                      )}

                      {/* From */}
                      {visibleColumns.from && (
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {row.from}
                        </td>
                      )}

                      {/* To */}
                      {visibleColumns.to && (
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {row.to}
                        </td>
                      )}

                      {/* Type (Non-Local in yellow/amber, Local in teal/cyan) */}
                      {visibleColumns.type && (
                        <td className="py-3.5 px-3 font-semibold">
                          <span
                            className={
                              row.type === "Non-Local"
                                ? "text-[#FFA500]"
                                : "text-[#38BDF8]"
                            }
                          >
                            {row.type}
                          </span>
                        </td>
                      )}

                      {/* Load Time */}
                      {visibleColumns.loadTime && (
                        <td className="py-3.5 px-3 font-mono text-muted-foreground">
                          {row.loadTime}
                        </td>
                      )}

                      {/* Unload Time */}
                      {visibleColumns.unloadTime && (
                        <td className="py-3.5 px-3 font-mono text-muted-foreground">
                          {row.unloadTime}
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.status && (
                        <td className="py-3.5 px-3">{getStatusBadge(row.status)}</td>
                      )}

                      {/* Actions: View Manifest */}
                      {visibleColumns.actions && (
                        <td className="py-3.5 pl-3 text-right">
                          <button
                            onClick={() => {
                              setActiveLog(row);
                              setIsViewOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-[#FFA500]/50 hover:bg-[#FFA500]/10 hover:text-[#FFA500] transition cursor-pointer"
                            title="View Manifest Details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= GRID VIEW (Cards) ================= */
          <div className="min-h-[300px]">
            {filteredLogs.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-12 text-center text-muted-foreground">
                No load logs matching criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-border/80 bg-background/80 p-4.5 transition-all duration-200 hover:border-[#FFA500]/50 hover:shadow-lg hover:shadow-orange-500/5 relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top: Log ID & Tanker ID + Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded border border-[#FFA500]/25">
                            {log.id}
                          </span>
                          <span className="font-mono font-bold text-sm text-foreground">
                            {log.vehicle}
                          </span>
                        </div>
                        {getStatusBadge(log.status)}
                      </div>

                      {/* Route Display with Arrow */}
                      <div className="rounded-xl border border-border bg-muted/20 p-3 mb-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                            Transport Route
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              log.type === "Non-Local"
                                ? "bg-[#FFA500]/10 text-[#FFA500]"
                                : "bg-[#38BDF8]/10 text-[#38BDF8]"
                            }`}
                          >
                            {log.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-foreground font-semibold gap-2">
                          <div className="truncate flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-400 shrink-0" />
                            <span className="truncate">{log.from}</span>
                          </div>
                          <ArrowRight size={13} className="text-muted-foreground shrink-0" />
                          <div className="truncate flex items-center gap-1 text-right">
                            <span className="truncate">{log.to}</span>
                            <MapPin size={12} className="text-cyan-400 shrink-0" />
                          </div>
                        </div>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Material:
                          </span>
                          <span
                            className={`font-semibold ${getMaterialColorClass(
                              log.category
                            )}`}
                          >
                            {log.material}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Weight:
                          </span>
                          <span className="font-mono font-bold text-foreground">
                            {log.weightDisplay}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Driver:
                          </span>
                          <span className="font-medium text-foreground">
                            {log.driver}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-muted-foreground block">
                            Company:
                          </span>
                          <span className="font-medium text-muted-foreground truncate block">
                            {log.company}
                          </span>
                        </div>
                      </div>

                      {/* Load / Unload Times */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#FFA500]" />
                          <span>Load: <strong className="text-foreground">{log.loadTime}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#38BDF8]" />
                          <span>Unload: <strong className="text-foreground">{log.unloadTime}</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between border-t border-border mt-3 pt-3">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {log.date}
                      </span>

                      <button
                        onClick={() => {
                          setActiveLog(log);
                          setIsViewOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-[#FFA500]/50 hover:bg-[#FFA500]/10 hover:text-[#FFA500] transition cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Table Pagination Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          {/* Entries summary */}
          <div>
            Showing <span className="font-semibold text-foreground">{startEntry}</span> to{" "}
            <span className="font-semibold text-foreground">{endEntry}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> records
          </div>

          {/* Page size & pagination controls */}
          <div className="flex items-center gap-3">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[#FFA500] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;

                  return (
                    <div key={p} className="flex items-center">
                      {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                          page === p
                            ? "bg-[#FFA500] text-[#071522] shadow-sm"
                            : "border border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Load Log Modal */}
      <ViewLoadLogModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setActiveLog(null);
        }}
        log={activeLog}
      />

      {/* Export Configuration Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Daily Load Logs"
        defaultFilename={`FluidLogix_Daily_Load_Logs_${new Date().toISOString().split("T")[0]}`}
        availableColumns={availableExportColumns}
        totalRecordsCount={globalStats.totalDispatches}
        currentPageCount={filteredLogs.length}
        filteredCount={total}
        onExport={handleExport}
      />
    </div>
  );
}

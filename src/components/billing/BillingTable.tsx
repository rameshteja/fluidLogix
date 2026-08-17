"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns3,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Landmark,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Truck,
  Weight,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ExportModal from "@/components/common/ExportModal";
import GenerateBillsModal from "@/components/billing/GenerateBillsModal";
import PayNowModal from "@/components/billing/PayNowModal";
import ViewReceiptModal from "@/components/billing/ViewReceiptModal";
import { useBillingData } from "@/hooks/useBillingData";
import {
  BillingSortField,
  BillingStatus,
  MonthlyBillingItem,
} from "@/types/billing";

interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

const BILLING_COLUMNS: ColumnDef[] = [
  { id: "vehicle", label: "Vehicle", required: true },
  { id: "plateNo", label: "Plate No." },
  { id: "owner", label: "Owner" },
  { id: "trips", label: "Trips" },
  { id: "totalWeight", label: "Total Weight" },
  { id: "local", label: "Local" },
  { id: "nonLocal", label: "Non-Local" },
  { id: "localAmt", label: "Local Amt" },
  { id: "nonLocalAmt", label: "Non-Local Amt" },
  { id: "total", label: "Total" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Action" },
];

const MONTH_OPTIONS = [
  "July 2025",
  "June 2025",
  "May 2025",
  "April 2025",
  "ALL",
];

export default function BillingTable() {
  const {
    filteredBills,
    total,
    totalPages,
    page,
    pageSize,
    stats,
    monthStats,
    params,
    setParams,

    // Selection
    selectedIds,
    setSelectedIds,
    selectedBills,
    selectedTotalPayable,
    selectedTotalPayableDisplay,
    isAllSelected,
    handleSelectAll,
    handleToggleSelect,
    handleClearSelection,
    handleBulkPay,

    toastMessage,

    // Modal states
    isReceiptOpen,
    setIsReceiptOpen,
    isPayOpen,
    setIsPayOpen,
    isGenerateOpen,
    setIsGenerateOpen,
    isExportOpen,
    setIsExportOpen,
    activeBill,
    setActiveBill,

    // Handlers
    handleSearch,
    setMonthFilter,
    setStatusFilter,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    handlePayBill,
    handleGenerateBills,
    handleExport,
    availableExportColumns,
    showToast,
  } = useBillingData(10);

  // View Mode: List (Table) vs Grid (Cards)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    vehicle: true,
    plateNo: true,
    owner: true,
    trips: true,
    totalWeight: true,
    local: true,
    nonLocal: true,
    localAmt: true,
    nonLocalAmt: true,
    total: true,
    status: true,
    actions: true,
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColumnDropdown(false);
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
    BILLING_COLUMNS.forEach((col) => {
      allVisible[col.id] = true;
    });
    setVisibleColumns(allVisible);
  };

  const resetDefaultColumns = () => {
    const defaultVisible: Record<string, boolean> = {};
    BILLING_COLUMNS.forEach((col) => {
      defaultVisible[col.id] = true;
    });
    setVisibleColumns(defaultVisible);
  };

  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  const activeAdvancedFiltersCount =
    (params.status && params.status !== "ALL" ? 1 : 0) +
    (params.owner && params.owner !== "ALL" ? 1 : 0) +
    (params.vehicle && params.vehicle !== "ALL" ? 1 : 0) +
    (params.month && params.month !== "July 2025" ? 1 : 0);

  const getSortIcon = (field: BillingSortField) => {
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
      showToast("Monthly billing calculations updated");
    }, 450);
  };

  const getStatusBadge = (status: BillingStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Paid</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-[#FFA500]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>Pending</span>
          </span>
        );
      case "Generated":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Generated</span>
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-0.5 text-xs font-semibold text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span>Overdue</span>
          </span>
        );
    }
  };

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#FFA500]/30 bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-[#FFA500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Month Selector + Generate All Bills Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Monthly Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Payment generation for {params.month || "July 2025"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Dropdown Selector */}
          <div className="relative">
            <select
              value={params.month || "July 2025"}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-4 pr-9 text-xs font-bold text-foreground outline-none focus:border-[#FFA500] cursor-pointer shadow-sm appearance-none"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m === "ALL" ? "All Billing Months" : m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* + Generate All Bills Primary Button */}
          <button
            onClick={() => setIsGenerateOpen(true)}
            className="flex items-center gap-2 h-10 rounded-xl bg-[#FFA500] px-4.5 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
          >
            <Zap size={16} className="stroke-[2.5] fill-[#071522]" />
            <span>
              {selectedIds.length > 0
                ? `+ Generate Bills (${selectedIds.length} Selected)`
                : "+ Generate All Bills"}
            </span>
          </button>
        </div>
      </div>

      {/* 1. Top 4 KPI Summary Cards (Exact match to Reference Screenshot) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Payable (Gold/Amber text e.g. ₹5,66,000) */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-[#FFA500]/40">
          <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-[#FFA500]">
            {stats.totalPayableDisplay}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            Total Payable
          </div>
        </div>

        {/* Card 2: Bills Paid (Green text e.g. 2 / 5) */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-emerald-500/40">
          <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-emerald-400">
            {stats.billsPaidRatioDisplay}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            Bills Paid
          </div>
        </div>

        {/* Card 3: Pending Amount (Amber text e.g. ₹3,06,000) */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-[#FFA500]/40">
          <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-[#FFA500]">
            {stats.pendingAmountDisplay}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            Pending Amount
          </div>
        </div>

        {/* Card 4: Total Trips (Cyan text e.g. 114) */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-cyan-500/40">
          <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-[#38BDF8]">
            {stats.totalTrips}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            Total Trips
          </div>
        </div>
      </div>

      {/* 2. Main Billing Table Container */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-4 sm:p-6 transition shadow-sm space-y-5">
        {/* Table Top Controls: Status Tabs, Search, View Mode, Column View, Filters, Export, Refresh */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { label: "All Bills", value: "ALL" },
                { label: "Pending", value: "Pending" },
                { label: "Paid", value: "Paid" },
                { label: "Generated", value: "Generated" },
              ] as Array<{ label: string; value: BillingStatus | "ALL" }>
            ).map((tab) => {
              const isActive = (params.status || "ALL") === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
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

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-52 lg:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search vehicle, owner, plate..."
                value={params.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-background pl-8.5 pr-7 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/25 transition"
              />
              {params.search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* List / Grid View Toggle */}
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

            {/* Column Selection Dropdown (Only in List View) */}
            {viewMode === "list" && (
              <div className="relative" ref={columnDropdownRef}>
                <button
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                    showColumnDropdown ||
                    visibleColumnsCount < BILLING_COLUMNS.length
                      ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                  title="Select columns to display"
                >
                  <Columns3
                    size={14}
                    className={
                      visibleColumnsCount < BILLING_COLUMNS.length
                        ? "text-[#FFA500]"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Columns</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-[#FFA500]">
                    {visibleColumnsCount}/{BILLING_COLUMNS.length}
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
                      {BILLING_COLUMNS.map((col) => {
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

            {/* Filter Toggle */}
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

            {/* Export CSV / PDF */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
              title="Refresh Billing Data"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin text-[#FFA500]" : ""}
              />
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFiltersPanel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-muted/20 animate-in fade-in duration-150 text-xs">
            {/* Status Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Settlement Status
              </label>
              <select
                value={params.status || "ALL"}
                onChange={(e) =>
                  setStatusFilter(e.target.value as BillingStatus | "ALL")
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Generated">Generated</option>
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
                <option value="ALL">All Tankers</option>
                <option value="TK-001">TK-001</option>
                <option value="TK-002">TK-002</option>
                <option value="TK-004">TK-004</option>
                <option value="TK-005">TK-005</option>
                <option value="TK-006">TK-006</option>
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Fleet Owner
              </label>
              <select
                value={params.owner || "ALL"}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    owner: e.target.value,
                    page: 1,
                  }))
                }
                className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Fleet Owners</option>
                <option value="Ravi Kumar">Ravi Kumar</option>
                <option value="Prakash Reddy">Prakash Reddy</option>
                <option value="Kishore Patel">Kishore Patel</option>
                <option value="Venkat Babu">Venkat Babu</option>
                <option value="Deepak Shah">Deepak Shah</option>
              </select>
            </div>

            {/* Reset Filters */}
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

        {/* Selected Trucks Bulk Action Header Bar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#FFA500]/40 bg-[#FFA500]/10 p-3.5 text-xs text-foreground shadow-sm animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFA500] text-[#071522] font-black text-xs shadow-sm">
                {selectedIds.length}
              </div>
              <div>
                <span className="font-bold text-foreground text-sm">
                  {selectedIds.length} Truck(s) Selected
                </span>
                <span className="text-muted-foreground ml-2">
                  Total Payable:{" "}
                  <strong className="font-mono font-black text-[#FFA500]">
                    {selectedTotalPayableDisplay}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Generate for Selected */}
              <button
                onClick={() => setIsGenerateOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-1.5 font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
              >
                <Zap size={13} className="stroke-[2.5] fill-[#071522]" />
                <span>Generate Bill for Selected ({selectedIds.length})</span>
              </button>

              {/* Bulk Mark as Paid */}
              <button
                onClick={handleBulkPay}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <CheckCircle2 size={13} />
                <span>Mark Paid</span>
              </button>

              {/* Clear Selection */}
              <button
                onClick={handleClearSelection}
                className="rounded-xl border border-border bg-background px-3 py-1.5 font-semibold text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 3. Main Data Container: LIST VIEW vs GRID VIEW */}
        {viewMode === "list" ? (
          /* ================= LIST VIEW (Exact match to Reference Screenshot) ================= */
          <div className="overflow-x-auto relative min-h-[260px] custom-scrollbar">
            {/* Loading Overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Updating statements...</span>
                </div>
              </div>
            )}

            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium text-muted-foreground">
                  {/* Select All Checkbox Column */}
                  <th className="pb-3 pr-2 w-8">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border bg-background accent-[#FFA500] cursor-pointer"
                      title="Select all trucks in current view"
                    />
                  </th>

                  {/* Vehicle Column */}
                  {visibleColumns.vehicle && (
                    <th
                      onClick={() => handleSort("vehicle")}
                      className="pb-3 pr-4 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Vehicle</span>
                        {getSortIcon("vehicle")}
                      </div>
                    </th>
                  )}

                  {/* Plate No Column */}
                  {visibleColumns.plateNo && (
                    <th
                      onClick={() => handleSort("plateNo")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Plate No.</span>
                        {getSortIcon("plateNo")}
                      </div>
                    </th>
                  )}

                  {/* Owner Column */}
                  {visibleColumns.owner && (
                    <th
                      onClick={() => handleSort("owner")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Owner</span>
                        {getSortIcon("owner")}
                      </div>
                    </th>
                  )}

                  {/* Trips Column */}
                  {visibleColumns.trips && (
                    <th
                      onClick={() => handleSort("trips")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Trips</span>
                        {getSortIcon("trips")}
                      </div>
                    </th>
                  )}

                  {/* Total Weight Column */}
                  {visibleColumns.totalWeight && (
                    <th
                      onClick={() => handleSort("totalWeightKg")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Total Weight</span>
                        {getSortIcon("totalWeightKg")}
                      </div>
                    </th>
                  )}

                  {/* Local Column */}
                  {visibleColumns.local && (
                    <th
                      onClick={() => handleSort("localTrips")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Local</span>
                        {getSortIcon("localTrips")}
                      </div>
                    </th>
                  )}

                  {/* Non-Local Column */}
                  {visibleColumns.nonLocal && (
                    <th
                      onClick={() => handleSort("nonLocalTrips")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Non-Local</span>
                        {getSortIcon("nonLocalTrips")}
                      </div>
                    </th>
                  )}

                  {/* Local Amt Column */}
                  {visibleColumns.localAmt && (
                    <th
                      onClick={() => handleSort("localAmt")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Local Amt</span>
                        {getSortIcon("localAmt")}
                      </div>
                    </th>
                  )}

                  {/* Non-Local Amt Column */}
                  {visibleColumns.nonLocalAmt && (
                    <th
                      onClick={() => handleSort("nonLocalAmt")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Non-Local Amt</span>
                        {getSortIcon("nonLocalAmt")}
                      </div>
                    </th>
                  )}

                  {/* Total Column */}
                  {visibleColumns.total && (
                    <th
                      onClick={() => handleSort("total")}
                      className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Total</span>
                        {getSortIcon("total")}
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

                  {/* Action Column */}
                  {visibleColumns.actions && (
                    <th className="pb-3 pl-3 text-right font-medium">Action</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumnsCount + 1}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Search size={22} className="text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">
                          No billing records match the current criteria
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try changing the billing month or clearing search filters.
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
                  filteredBills.map((row) => {
                    const isPaid = row.status === "Paid";
                    const isSelected = selectedIds.includes(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`transition hover:bg-muted/40 group ${
                          isSelected ? "bg-[#FFA500]/5" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 pr-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(row.id)}
                            className="h-3.5 w-3.5 rounded border-border bg-background accent-[#FFA500] cursor-pointer"
                            title={`Select ${row.vehicle}`}
                          />
                        </td>

                        {/* Vehicle - Orange bold mono font matching screenshot */}
                        {visibleColumns.vehicle && (
                          <td className="py-3.5 pr-4">
                            <span
                              onClick={() => {
                                setActiveBill(row);
                                setIsReceiptOpen(true);
                              }}
                              className="font-mono font-black text-[#FFA500] hover:underline cursor-pointer tracking-wide"
                              title="Click to view invoice details"
                            >
                              {row.vehicle}
                            </span>
                          </td>
                        )}

                        {/* Plate No. */}
                        {visibleColumns.plateNo && (
                          <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                            {row.plateNo}
                          </td>
                        )}

                        {/* Owner */}
                        {visibleColumns.owner && (
                          <td className="py-3.5 px-3 font-semibold text-foreground">
                            {row.owner}
                          </td>
                        )}

                        {/* Trips */}
                        {visibleColumns.trips && (
                          <td className="py-3.5 px-3 font-mono font-semibold text-foreground">
                            {row.trips}
                          </td>
                        )}

                        {/* Total Weight */}
                        {visibleColumns.totalWeight && (
                          <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                            {row.totalWeightDisplay}
                          </td>
                        )}

                        {/* Local (Green text e.g. 8, 15, 10...) */}
                        {visibleColumns.local && (
                          <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                            {row.localTrips}
                          </td>
                        )}

                        {/* Non-Local (Orange/Amber text e.g. 20, 7, 8...) */}
                        {visibleColumns.nonLocal && (
                          <td className="py-3.5 px-3 font-mono font-bold text-[#FFA500]">
                            {row.nonLocalTrips}
                          </td>
                        )}

                        {/* Local Amt */}
                        {visibleColumns.localAmt && (
                          <td className="py-3.5 px-3 font-mono text-muted-foreground">
                            {row.localAmtDisplay}
                          </td>
                        )}

                        {/* Non-Local Amt */}
                        {visibleColumns.nonLocalAmt && (
                          <td className="py-3.5 px-3 font-mono text-muted-foreground">
                            {row.nonLocalAmtDisplay}
                          </td>
                        )}

                        {/* Total (Bold Orange / Gold font e.g. ₹1,34,800) */}
                        {visibleColumns.total && (
                          <td className="py-3.5 px-3 font-mono font-black text-[#FFA500]">
                            {row.totalDisplay}
                          </td>
                        )}

                        {/* Status Badge */}
                        {visibleColumns.status && (
                          <td className="py-3.5 px-3">{getStatusBadge(row.status)}</td>
                        )}

                        {/* Action Column: Pay Now for Pending/Generated, View Receipt for Paid */}
                        {visibleColumns.actions && (
                          <td className="py-3.5 pl-3 text-right">
                            {isPaid ? (
                              <button
                                onClick={() => {
                                  setActiveBill(row);
                                  setIsReceiptOpen(true);
                                }}
                                className="font-semibold text-[#FFA500] hover:underline cursor-pointer text-xs"
                              >
                                View Receipt
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveBill(row);
                                  setIsPayOpen(true);
                                }}
                                className="font-semibold text-[#FFA500] hover:underline cursor-pointer text-xs"
                              >
                                Pay Now
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= GRID VIEW (Cards Layout) ================= */
          <div className="min-h-[260px]">
            {filteredBills.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-12 text-center text-muted-foreground">
                No billing statements matching criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBills.map((bill) => {
                  const isPaid = bill.status === "Paid";
                  const isSelected = selectedIds.includes(bill.id);

                  return (
                    <div
                      key={bill.id}
                      className={`rounded-2xl border bg-background/80 p-4.5 transition-all duration-200 hover:border-[#FFA500]/50 hover:shadow-lg hover:shadow-orange-500/5 relative group flex flex-col justify-between ${
                        isSelected
                          ? "border-[#FFA500] bg-[#FFA500]/5 shadow-sm"
                          : "border-border/80"
                      }`}
                    >
                      <div>
                        {/* Top: Checkbox, Vehicle ID & Plate No + Status Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(bill.id)}
                              className="h-3.5 w-3.5 rounded border-border bg-background accent-[#FFA500] cursor-pointer"
                            />
                            <span className="font-mono text-sm font-black text-[#FFA500]">
                              {bill.vehicle}
                            </span>
                            <span className="font-mono font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                              {bill.plateNo}
                            </span>
                          </div>
                          {getStatusBadge(bill.status)}
                        </div>

                        {/* Owner & Bank info */}
                        <div className="rounded-xl border border-border bg-muted/20 p-3 mb-3 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-xs">{bill.owner}</span>
                            <span className="text-[10px] text-muted-foreground">{bill.month}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {bill.bankAccount || "Commercial Bank"}
                          </div>
                        </div>

                        {/* Trips Breakdown Row */}
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          <div className="rounded-lg border border-border bg-background p-2">
                            <span className="text-[10px] text-muted-foreground block">Total Trips</span>
                            <span className="font-mono font-bold text-foreground text-xs">{bill.trips}</span>
                          </div>
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                            <span className="text-[10px] text-emerald-400 block">Local</span>
                            <span className="font-mono font-bold text-emerald-400 text-xs">{bill.localTrips}</span>
                          </div>
                          <div className="rounded-lg border border-[#FFA500]/20 bg-[#FFA500]/5 p-2">
                            <span className="text-[10px] text-[#FFA500] block">Non-Local</span>
                            <span className="font-mono font-bold text-[#FFA500] text-xs">{bill.nonLocalTrips}</span>
                          </div>
                        </div>

                        {/* Amounts Breakdown */}
                        <div className="space-y-1.5 text-xs mb-3 border-t border-border pt-2.5">
                          <div className="flex justify-between items-center text-muted-foreground text-[11px]">
                            <span>Local Freight:</span>
                            <span className="font-mono font-semibold text-foreground">{bill.localAmtDisplay}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground text-[11px]">
                            <span>Non-Local Freight:</span>
                            <span className="font-mono font-semibold text-foreground">{bill.nonLocalAmtDisplay}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground text-[11px]">
                            <span>Cargo Weight:</span>
                            <span className="font-mono font-semibold text-foreground">{bill.totalWeightDisplay}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Total Payable & Action */}
                      <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                        <div>
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                            Total Payable
                          </span>
                          <span className="font-mono font-black text-sm text-[#FFA500]">
                            {bill.totalDisplay}
                          </span>
                        </div>

                        <div>
                          {isPaid ? (
                            <button
                              onClick={() => {
                                setActiveBill(bill);
                                setIsReceiptOpen(true);
                              }}
                              className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-[#FFA500] hover:bg-muted transition cursor-pointer"
                            >
                              View Receipt
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveBill(bill);
                                setIsPayOpen(true);
                              }}
                              className="rounded-lg bg-[#FFA500] px-3.5 py-1 text-xs font-bold text-[#071522] shadow-sm hover:bg-[#FFB733] transition cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Table Pagination Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{startEntry}</span> to{" "}
            <span className="font-semibold text-foreground">{endEntry}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> billing records
          </div>

          <div className="flex items-center gap-3">
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
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                    page === p
                      ? "bg-[#FFA500] text-[#071522] shadow-sm"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}

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

      {/* View Receipt / Invoice Modal */}
      <ViewReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setActiveBill(null);
        }}
        bill={activeBill}
        onPayNow={(bill) => {
          setIsReceiptOpen(false);
          setActiveBill(bill);
          setIsPayOpen(true);
        }}
      />

      {/* Pay Now Payment Modal */}
      <PayNowModal
        isOpen={isPayOpen}
        onClose={() => {
          setIsPayOpen(false);
          setActiveBill(null);
        }}
        bill={activeBill}
        onPay={handlePayBill}
      />

      {/* Generate Bills Modal (Supports selected trucks or all trucks) */}
      <GenerateBillsModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        selectedMonth={params.month || "July 2025"}
        selectedTrucks={selectedBills}
        onGenerate={handleGenerateBills}
      />

      {/* Export Configuration Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Monthly Billing Statements"
        defaultFilename={`FluidLogix_Monthly_Billing_${params.month?.replace(" ", "_") || "All"}`}
        availableColumns={availableExportColumns}
        totalRecordsCount={total}
        currentPageCount={filteredBills.length}
        filteredCount={selectedIds.length > 0 ? selectedIds.length : total}
        onExport={handleExport}
      />
    </div>
  );
}

"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Columns3,
  Download,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLoadLogsTable } from "@/hooks/useDashboardData";
import { LoadLog, LoadStatus, MaterialCategory, TripType } from "@/types/dashboard";
import ExportModal from "@/components/common/ExportModal";

interface ColumnDef {
  id: string;
  label: string;
}

const RECENT_LOGS_COLUMNS: ColumnDef[] = [
  { id: "vehicle", label: "Vehicle" },
  { id: "driver", label: "Driver" },
  { id: "company", label: "Company" },
  { id: "material", label: "Material" },
  { id: "weight", label: "Weight" },
  { id: "route", label: "Route" },
  { id: "type", label: "Type" },
  { id: "date", label: "Date" },
  { id: "status", label: "Status" },
];

export default function RecentLoadLogsTable() {
  const {
    data,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    params,
    setSearch,
    setStatus,
    setCategory,
    setCompany,
    setType,
    handleSort,
    setPage,
    setPageSize,
    resetFilters,
    handleExport,
    availableExportColumns,
    isExportModalOpen,
    openExportModal,
    closeExportModal,
    refresh,
  } = useLoadLogsTable({ pageSize: 5 });

  // Column Visibility State (All visible by default)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    vehicle: true,
    driver: true,
    company: true,
    material: true,
    weight: true,
    route: true,
    type: true,
    date: true,
    status: true,
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // Close column dropdown when clicking outside
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
    RECENT_LOGS_COLUMNS.forEach((col) => {
      allVisible[col.id] = true;
    });
    setVisibleColumns(allVisible);
  };

  const resetDefaultColumns = () => {
    const defaultVisible: Record<string, boolean> = {};
    RECENT_LOGS_COLUMNS.forEach((col) => {
      defaultVisible[col.id] = true;
    });
    setVisibleColumns(defaultVisible);
  };

  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  const getSortIcon = (column: keyof LoadLog) => {
    if (params.sortBy !== column) {
      return <ArrowUpDown size={12} className="text-[#4A647E] group-hover:text-[#FFA500]" />;
    }
    return params.sortOrder === "asc" ? (
      <ArrowUp size={12} className="text-[#FFA500]" />
    ) : (
      <ArrowDown size={12} className="text-[#FFA500]" />
    );
  };

  const getCategoryBadgeClass = (category: MaterialCategory) => {
    switch (category) {
      case "Chemical":
        return "text-[#FFA500] bg-[#FFA500]/10 border-[#FFA500]/20";
      case "Hazardous":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
      case "Waste Water":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20";
      case "Non-Hazard":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      default:
        return "text-[#7E9AB5] bg-[#7E9AB5]/10 border-[#7E9AB5]/20";
    }
  };

  const getStatusBadge = (status: LoadStatus) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            In Transit
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Cancelled
          </span>
        );
    }
  };

  const activeFiltersCount =
    (params.status !== "ALL" ? 1 : 0) +
    (params.category !== "ALL" ? 1 : 0) +
    (params.company && params.company !== "ALL" ? 1 : 0) +
    (params.type !== "ALL" ? 1 : 0);

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div className="rounded-2xl border border-[#14293C] bg-[#0A1A2B] p-4 sm:p-5 transition hover:border-[#1E3E5B]">
      {/* Table Top Header: Title, Search, Filters, Columns, Export, Refresh */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F1F5F9] leading-snug">
              Recent Load Logs
            </h2>
            <span className="rounded-full bg-[#FFA500]/10 border border-[#FFA500]/20 px-2 py-0.5 text-[10px] font-semibold text-[#FFA500]">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-[#5E7995]">
            Live tanker transport & dispatch records
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60 lg:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#56728D]"
            />
            <input
              type="text"
              value={params.search || ""}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tanker, company, route..."
              className="h-8.5 w-full rounded-lg border border-[#172D40] bg-[#071522] pl-8.5 pr-7 text-xs text-[#E8EEF5] placeholder:text-[#526D87] outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/25"
            />
            {params.search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#56728D] hover:text-[#E8EEF5]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Column Selection Dropdown */}
          <div className="relative" ref={columnDropdownRef}>
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className={`flex items-center gap-1.5 h-8.5 rounded-lg border px-3 text-xs font-medium transition cursor-pointer ${
                showColumnDropdown || visibleColumnsCount < RECENT_LOGS_COLUMNS.length
                  ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                  : "border-[#172D40] bg-[#071522] text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9]"
              }`}
              title="Select columns to display in the table"
            >
              <Columns3 size={13} className={visibleColumnsCount < RECENT_LOGS_COLUMNS.length ? "text-[#FFA500]" : "text-[#7E9AB5]"} />
              <span>Columns</span>
              <span className="rounded-md bg-[#0D2235] px-1.5 py-0.5 text-[10px] font-mono text-[#FFA500]">
                {visibleColumnsCount}/{RECENT_LOGS_COLUMNS.length}
              </span>
            </button>

            {/* Column Selection Popover Menu */}
            {showColumnDropdown && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border border-[#162D42] bg-[#0B1D2F] p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#142637] mb-2 px-1">
                  <span className="text-xs font-bold text-[#F1F5F9]">
                    Show / Hide Columns
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      onClick={showAllColumns}
                      className="text-[#FFA500] hover:underline cursor-pointer font-medium"
                    >
                      All
                    </button>
                    <span className="text-[#3A526A]">|</span>
                    <button
                      onClick={resetDefaultColumns}
                      className="text-[#7E9AB5] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
                  {RECENT_LOGS_COLUMNS.map((col) => {
                    const isChecked = !!visibleColumns[col.id];

                    return (
                      <label
                        key={col.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-[#0E2437] text-[#F1F5F9] font-medium"
                            : "text-[#6A86A2] hover:bg-[#0B1D2F] hover:text-[#9FB7CE]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleColumnVisibility(col.id)}
                            className="h-3.5 w-3.5 rounded border-[#1E3A54] bg-[#0B1A28] accent-[#FFA500] cursor-pointer"
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

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 h-8.5 rounded-lg border px-3 text-xs font-medium transition cursor-pointer ${
              showFilters || activeFiltersCount > 0
                ? "border-[#FFA500]/40 bg-[#FFA500]/10 text-[#FFA500]"
                : "border-[#172D40] bg-[#071522] text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9]"
            }`}
          >
            <Filter size={13} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFA500] text-[10px] font-bold text-[#071522]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Export Button - Opens Advanced Export Configuration Modal */}
          <button
            onClick={openExportModal}
            className="flex items-center gap-1.5 h-8.5 rounded-lg border border-[#172D40] bg-[#071522] px-3 text-xs font-medium text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#FFA500] transition cursor-pointer"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-[#172D40] bg-[#071522] text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9] transition cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#FFA500]" : ""} />
          </button>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {showFilters && (
        <div className="mb-4 rounded-xl border border-[#172D40] bg-[#071522]/80 p-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#142637] mb-2.5">
            <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
              <SlidersHorizontal size={12} className="text-[#FFA500]" />
              Filter Records
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#FFA500] hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Status
              </label>
              <select
                value={params.status || "ALL"}
                onChange={(e) => setStatus(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Transit">In Transit</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Material Category
              </label>
              <select
                value={params.category || "ALL"}
                onChange={(e) => setCategory(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Materials</option>
                <option value="Chemical">Chemical</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Waste Water">Waste Water</option>
                <option value="Non-Hazard">Non-Hazard</option>
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Company
              </label>
              <select
                value={params.company || "ALL"}
                onChange={(e) => setCompany(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Companies</option>
                <option value="ChemCorp Ltd">ChemCorp Ltd</option>
                <option value="HazWaste Solutions">HazWaste Solutions</option>
                <option value="AquaTech Pvt Ltd">AquaTech Pvt Ltd</option>
                <option value="EcoWaste Corp">EcoWaste Corp</option>
                <option value="IndusChem Ltd">IndusChem Ltd</option>
              </select>
            </div>

            {/* Trip Type Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Trip Scope
              </label>
              <select
                value={params.type || "ALL"}
                onChange={(e) => setType(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Types</option>
                <option value="Local">Local</option>
                <option value="Non-Local">Non-Local</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto relative min-h-[220px]">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-[#0A1A2B]/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 rounded-full bg-[#071522] border border-[#1E3B56] px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
              <RefreshCw size={14} className="animate-spin" />
              <span>Loading records...</span>
            </div>
          </div>
        )}

        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#142637] text-[11px] font-medium text-[#5E7995]">
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

              {/* Route Column */}
              {visibleColumns.route && (
                <th
                  onClick={() => handleSort("route")}
                  className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Route</span>
                    {getSortIcon("route")}
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

              {/* Status Column */}
              {visibleColumns.status && (
                <th
                  onClick={() => handleSort("status")}
                  className="pb-3 pl-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {getSortIcon("status")}
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#122334]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnsCount || 9} className="py-10 text-center text-[#5E7995]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Search size={20} className="text-[#3A526A]" />
                    <p className="font-medium text-[#8DA6BE]">No records match the current filters</p>
                    <button
                      onClick={resetFilters}
                      className="text-xs text-[#FFA500] hover:underline mt-1 cursor-pointer"
                    >
                      Clear search & filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="transition hover:bg-[#0D2235]/60 group"
                >
                  {/* Vehicle */}
                  {visibleColumns.vehicle && (
                    <td className="py-3 pr-4 font-mono font-medium text-[#FFA500]">
                      {row.vehicle}
                    </td>
                  )}

                  {/* Driver */}
                  {visibleColumns.driver && (
                    <td className="py-3 px-3 font-medium text-[#F1F5F9]">
                      {row.driver}
                    </td>
                  )}

                  {/* Company */}
                  {visibleColumns.company && (
                    <td className="py-3 px-3 text-[#8DA6BE]">
                      {row.company}
                    </td>
                  )}

                  {/* Material */}
                  {visibleColumns.material && (
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium ${getCategoryBadgeClass(
                          row.category
                        )}`}
                      >
                        {row.material}
                      </span>
                    </td>
                  )}

                  {/* Weight */}
                  {visibleColumns.weight && (
                    <td className="py-3 px-3 font-mono font-medium text-[#E2E8F0]">
                      {row.weightDisplay}
                    </td>
                  )}

                  {/* Route */}
                  {visibleColumns.route && (
                    <td className="py-3 px-3 text-[#7E9AB5] max-w-[140px] truncate" title={row.route}>
                      {row.route}
                    </td>
                  )}

                  {/* Type */}
                  {visibleColumns.type && (
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          row.type === "Local"
                            ? "bg-[#1E293B] text-[#94A3B8]"
                            : "bg-[#0369A1]/20 text-[#38BDF8] border border-[#0284C7]/30"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                  )}

                  {/* Date */}
                  {visibleColumns.date && (
                    <td className="py-3 px-3 text-[11px] text-[#5E7995]">
                      {row.date}
                    </td>
                  )}

                  {/* Status */}
                  {visibleColumns.status && (
                    <td className="py-3 pl-3">
                      {getStatusBadge(row.status)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#142637] pt-3 text-xs text-[#6A86A2]">
        {/* Left: Summary & Page Size selector */}
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-[#E8EEF5]">{startEntry}</strong> to{" "}
            <strong className="text-[#E8EEF5]">{endEntry}</strong> of{" "}
            <strong className="text-[#E8EEF5]">{total}</strong> records
          </span>

          <div className="flex items-center gap-1.5 pl-2 border-l border-[#142637]">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-[#162D42] bg-[#071522] px-2 py-0.5 text-xs text-[#E8EEF5] outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Right: Page numbers and Prev/Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-[#172D40] bg-[#071522] px-2.5 py-1 text-xs font-medium text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9] disabled:opacity-40 disabled:hover:border-[#172D40] cursor-pointer transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-7 w-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                page === p
                  ? "bg-[#FFA500] text-[#071522] shadow-sm shadow-orange-500/20"
                  : "border border-[#172D40] bg-[#071522] text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9]"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-[#172D40] bg-[#071522] px-2.5 py-1 text-xs font-medium text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9] disabled:opacity-40 disabled:hover:border-[#172D40] cursor-pointer transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Advanced Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        title="Export Recent Load Logs"
        defaultFilename="fluidlogix-load-logs"
        availableColumns={availableExportColumns}
        totalRecordsCount={total}
        currentPageCount={data.length}
        filteredCount={total}
        onExport={handleExport}
      />
    </div>
  );
}

"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Gauge,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Share2,
  Trash2,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import ExportModal, { ColumnOption, ExportConfig } from "@/components/common/ExportModal";
import {
  AssignmentPaginatedResult,
  AssignmentQueryParams,
  AssignmentStatus,
  TruckAssignment,
} from "@/types/assignment";
import { MaterialCategory } from "@/types/dashboard";
import { ExportColumn, exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

interface AssignmentsTableProps {
  data: AssignmentPaginatedResult;
  params: AssignmentQueryParams;
  onParamsChange: (newParams: Partial<AssignmentQueryParams>) => void;
  onOpenAssign: () => void;
  onOpenEdit: (assignment: TruckAssignment) => void;
  onOpenView: (assignment: TruckAssignment) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ASSIGNMENT_COLUMNS: ColumnOption[] = [
  { id: "id", label: "Pass / Allocation ID" },
  { id: "vehicleId", label: "Tanker Truck" },
  { id: "plateNo", label: "Plate Number" },
  { id: "driver", label: "Driver Name" },
  { id: "driverPhone", label: "Driver Phone" },
  { id: "company", label: "Client Company" },
  { id: "chemicalName", label: "Chemical / Cargo" },
  { id: "materialCategory", label: "Material Category" },
  { id: "allocatedCapacity", label: "Capacity (L)" },
  { id: "originCity", label: "Origin City" },
  { id: "destinationCity", label: "Destination City" },
  { id: "expectedLoadingDate", label: "Loading Date" },
  { id: "freightRate", label: "Freight Rate (INR)" },
  { id: "advancePaid", label: "Advance Paid (INR)" },
  { id: "status", label: "Status" },
];

export default function AssignmentsTable({
  data,
  params,
  onParamsChange,
  onOpenAssign,
  onOpenEdit,
  onOpenView,
  onDelete,
  onRefresh,
  isRefreshing = false,
}: AssignmentsTableProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ search: searchInput, page: 1 });
  };

  const handleSort = (column: keyof TruckAssignment) => {
    const isCurrent = params.sortBy === column;
    const newOrder = isCurrent && params.sortOrder === "asc" ? "desc" : "asc";
    onParamsChange({ sortBy: column, sortOrder: newOrder, page: 1 });
  };

  const getSortIcon = (column: keyof TruckAssignment) => {
    if (params.sortBy !== column) {
      return <ArrowUpDown size={12} className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition" />;
    }
    return params.sortOrder === "asc" ? (
      <ArrowUp size={13} className="text-[#FFA500]" />
    ) : (
      <ArrowDown size={13} className="text-[#FFA500]" />
    );
  };

  const handleExport = async (config: ExportConfig) => {
    const exportCols: ExportColumn<TruckAssignment>[] = config.selectedColumns.map((colId) => {
      const option = ASSIGNMENT_COLUMNS.find((c) => c.id === colId);
      return {
        header: option ? option.label : colId,
        key: colId as keyof TruckAssignment,
        formatter: (item: TruckAssignment) => {
          if (colId === "allocatedCapacity") return `${item.allocatedCapacity.toLocaleString()} L`;
          if (colId === "freightRate") return `₹${item.freightRate.toLocaleString()}`;
          if (colId === "advancePaid") return `₹${item.advancePaid.toLocaleString()}`;
          return String(item[colId as keyof TruckAssignment] ?? "");
        },
      };
    });

    const exportData = data.data;

    if (config.format === "csv") {
      exportToCSV({
        filename: config.filename || "truck-allocations",
        data: exportData,
        columns: exportCols,
      });
    } else if (config.format === "json") {
      exportToJSON({
        filename: config.filename || "truck-allocations",
        data: exportData,
        columns: exportCols,
      });
    } else {
      exportToPDF({
        filename: config.filename || "truck-allocations",
        data: exportData,
        columns: exportCols,
        title: "Fleet Truck Allocations & Gate Pass Report",
        subtitle: `Generated on ${new Date().toLocaleDateString()}`,
      });
    }
  };

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case "Allocated":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Allocated
          </span>
        );
      case "At Plant":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            At Plant
          </span>
        );
      case "Loaded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400">
            <CheckCircle2 size={11} />
            Loaded
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FFA500]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA500] animate-pulse" />
            In Transit
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 size={11} />
            Delivered
          </span>
        );
      case "Released":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/25 bg-slate-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Released
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search allocation ID, vehicle, driver, company, route..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onParamsChange({ search: "", page: 1 });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={params.status || "ALL"}
            onChange={(e) =>
              onParamsChange({
                status: e.target.value as "ALL" | AssignmentStatus,
                page: 1,
              })
            }
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
          >
            <option value="ALL">All Milestones ({data.statusCounts.all})</option>
            <option value="Allocated">Allocated ({data.statusCounts.allocated})</option>
            <option value="At Plant">At Plant ({data.statusCounts.atPlant})</option>
            <option value="Loaded">Loaded ({data.statusCounts.loaded})</option>
            <option value="In Transit">In Transit ({data.statusCounts.inTransit})</option>
            <option value="Delivered">Delivered ({data.statusCounts.delivered})</option>
            <option value="Released">Released ({data.statusCounts.released})</option>
          </select>

          {/* Date Filter with default current date */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 h-9 text-xs">
            <Calendar size={13} className="text-[#FFA500]" />
            <input
              type="date"
              value={params.startDate || ""}
              onChange={(e) => onParamsChange({ startDate: e.target.value, page: 1 })}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
            />
            {params.startDate && (
              <button
                type="button"
                onClick={() => onParamsChange({ startDate: "", page: 1 })}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                title="Clear date filter"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner h-9">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#FFA500] text-[#071522] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View (Table)"
            >
              <List size={13} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#FFA500] text-[#071522] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View (Cards)"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className={`flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
                isRefreshing ? "text-[#FFA500]" : ""
              }`}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#FFA500]" : ""} />
            </button>
          )}

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            title="Export Records"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Table or Grid */}
      <div className="relative rounded-2xl border border-border bg-card shadow-xs overflow-hidden min-h-[350px]">
        {/* Loading Overlay */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-semibold text-[#FFA500] shadow-xl">
              <RefreshCw size={14} className="animate-spin" />
              <span>Updating allocation dispatches...</span>
            </div>
          </div>
        )}

        {viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="p-4 sm:p-5">
            {data.data.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Truck size={36} className="text-muted-foreground/50" />
                <p className="font-semibold text-xs text-foreground">No truck allocations found</p>
                <p className="text-[11px] text-muted-foreground">Assign a tanker to an indent to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.data.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenView(item)}
                    className="rounded-2xl border border-border bg-background p-4.5 space-y-3.5 hover:border-[#FFA500]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top Info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-foreground text-xs">{item.id}</span>
                          <span className="font-mono text-[10px] font-bold text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/25 px-1.5 py-0.5 rounded">
                            {item.vehicleId}
                          </span>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="mt-2.5">
                        <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                          <Building2 size={14} className="text-muted-foreground shrink-0" />
                          <span>{item.company}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {item.chemicalName}
                        </div>
                      </div>
                    </div>

                    {/* Driver & Route Box */}
                    <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <User size={13} className="text-primary" />
                          <span>{item.driver}</span>
                        </span>
                        <span className="font-mono text-muted-foreground text-[10px]">
                          {item.driverPhone}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-semibold text-foreground border-t border-border/50 pt-2 text-[11px]">
                        <span className="text-emerald-400">{item.originCity}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-[#FFA500]">{item.destinationCity}</span>
                        <span className="text-muted-foreground font-mono text-[10px] ml-auto">
                          {item.expectedLoadingDate}
                        </span>
                      </div>
                    </div>

                    {/* Commercial & Action Buttons */}
                    <div
                      className="flex items-center justify-between border-t border-border pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Freight Rate</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          ₹{item.freightRate.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenView(item)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                          title="View Gate Pass"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEdit(item)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-[#00AEEF] transition cursor-pointer"
                          title="Edit Allocation"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove allocation ${item.id}?`)) {
                              onDelete(item.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                          title="Delete Allocation"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* LIST VIEW (Table) */
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th onClick={() => handleSort("id")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Pass ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("vehicleId")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Tanker Truck</span>
                      {getSortIcon("vehicleId")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("driver")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Assigned Driver</span>
                      {getSortIcon("driver")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("company")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Client & Cargo</span>
                      {getSortIcon("company")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("expectedLoadingDate")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Route & Schedule</span>
                      {getSortIcon("expectedLoadingDate")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("freightRate")} className="px-4 py-3.5 text-right cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center justify-end gap-1">
                      <span>Freight & Advance</span>
                      {getSortIcon("freightRate")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("status")} className="px-4 py-3.5 text-center cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center justify-center gap-1">
                      <span>Milestone</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {data.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Truck size={32} className="text-muted-foreground/50" />
                        <p className="font-semibold text-xs text-foreground">No truck allocations found</p>
                        <p className="text-[11px] text-muted-foreground">
                          Assign a tanker to an indent to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => onOpenView(item)}
                    >
                      {/* Pass ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-foreground text-xs">
                            {item.id}
                          </span>
                          {item.requestId && (
                            <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {item.requestId}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tanker Vehicle */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#FFA500] text-xs">
                            {item.vehicleId}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {item.plateNo}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {item.allocatedCapacity.toLocaleString()} L
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-foreground text-xs flex items-center gap-1">
                          <User size={12} className="text-muted-foreground" />
                          <span>{item.driver}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {item.driverPhone}
                        </div>
                      </td>

                      {/* Company & Cargo */}
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <div className="font-bold text-foreground truncate">{item.company}</div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5" title={item.chemicalName}>
                          {item.chemicalName}
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <span className="text-emerald-400">{item.originCity}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-[#FFA500]">{item.destinationCity}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Load: {item.expectedLoadingDate}
                        </div>
                      </td>

                      {/* Freight & Advance */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          ₹{item.freightRate.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          Adv: ₹{item.advancePaid.toLocaleString()}
                        </div>
                      </td>

                      {/* Milestone Status */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenView(item)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                            title="View Gate Pass"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEdit(item)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-[#00AEEF] transition cursor-pointer"
                            title="Edit Allocation"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove allocation ${item.id}?`)) {
                                onDelete(item.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border px-4 py-3 gap-3 bg-muted/20 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-foreground">{data.data.length}</span> of{" "}
            <span className="font-bold text-foreground">{data.total}</span> allocations
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => onParamsChange({ page: data.page - 1 })}
              className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            <span className="font-mono text-xs font-semibold px-2 text-foreground">
              Page {data.page} of {data.totalPages}
            </span>

            <button
              type="button"
              disabled={data.page >= data.totalPages}
              onClick={() => onParamsChange({ page: data.page + 1 })}
              className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Truck Allocations"
        defaultFilename="truck-allocations"
        availableColumns={ASSIGNMENT_COLUMNS}
        totalRecordsCount={data.total}
        currentPageCount={data.data.length}
        filteredCount={data.total}
        onExport={handleExport}
      />
    </div>
  );
}

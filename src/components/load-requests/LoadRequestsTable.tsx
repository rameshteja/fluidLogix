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
  DollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  Flame,
  Gauge,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  PackageSearch,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Truck,
  X,
  Zap,
} from "lucide-react";
import React, { useRef, useState } from "react";
import ExportModal, { ColumnOption, ExportConfig } from "@/components/common/ExportModal";
import { MaterialCategory } from "@/types/dashboard";
import {
  LoadRequest,
  LoadRequestPaginatedResult,
  LoadRequestQueryParams,
  LoadRequestStatus,
  RequestPriority,
} from "@/types/loadRequest";
import { ExportColumn, exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

interface LoadRequestsTableProps {
  data: LoadRequestPaginatedResult;
  params: LoadRequestQueryParams;
  onParamsChange: (newParams: Partial<LoadRequestQueryParams>) => void;
  onOpenCreate: () => void;
  onOpenEdit: (request: LoadRequest) => void;
  onOpenView: (request: LoadRequest) => void;
  onOpenAssign: (request: LoadRequest) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const LOAD_REQUEST_COLUMNS: ColumnOption[] = [
  { id: "id", label: "Requisition ID" },
  { id: "company", label: "Client Company" },
  { id: "contactPerson", label: "Contact Person" },
  { id: "contactPhone", label: "Phone" },
  { id: "chemicalName", label: "Chemical / Cargo Name" },
  { id: "materialCategory", label: "Cargo Category" },
  { id: "tankerType", label: "Tanker Type" },
  { id: "bodyType", label: "Body Material" },
  { id: "requiredCapacity", label: "Capacity (L)" },
  { id: "compartmentsNeeded", label: "Chambers" },
  { id: "pickupCity", label: "Pickup City" },
  { id: "deliveryCity", label: "Delivery City" },
  { id: "loadingDate", label: "Loading Date" },
  { id: "offeredRate", label: "Offered Freight (INR)" },
  { id: "priority", label: "Priority" },
  { id: "status", label: "Status" },
];

export default function LoadRequestsTable({
  data,
  params,
  onParamsChange,
  onOpenCreate,
  onOpenEdit,
  onOpenView,
  onOpenAssign,
  onDelete,
  onRefresh,
  isRefreshing = false,
}: LoadRequestsTableProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ search: searchInput, page: 1 });
  };

  const handleSort = (column: keyof LoadRequest) => {
    const isCurrent = params.sortBy === column;
    const newOrder = isCurrent && params.sortOrder === "asc" ? "desc" : "asc";
    onParamsChange({ sortBy: column, sortOrder: newOrder, page: 1 });
  };

  const getSortIcon = (column: keyof LoadRequest) => {
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
    const exportCols: ExportColumn<LoadRequest>[] = config.selectedColumns.map((colId) => {
      const option = LOAD_REQUEST_COLUMNS.find((c) => c.id === colId);
      return {
        header: option ? option.label : colId,
        key: colId as keyof LoadRequest,
        formatter: (req: LoadRequest) => {
          if (colId === "requiredCapacity") return `${req.requiredCapacity.toLocaleString()} L`;
          if (colId === "offeredRate") return `₹${req.offeredRate.toLocaleString()}`;
          return String(req[colId as keyof LoadRequest] ?? "");
        },
      };
    });

    const exportData = config.scope === "all" ? data.data : data.data;

    if (config.format === "csv") {
      exportToCSV({
        filename: config.filename || "load-requests",
        data: exportData,
        columns: exportCols,
      });
    } else if (config.format === "json") {
      exportToJSON({
        filename: config.filename || "load-requests",
        data: exportData,
        columns: exportCols,
      });
    } else {
      exportToPDF({
        filename: config.filename || "load-requests",
        data: exportData,
        columns: exportCols,
        title: "Company Load Requisitions Report",
        subtitle: `Generated on ${new Date().toLocaleDateString()}`,
      });
    }
  };

  const getStatusBadge = (status: LoadRequestStatus) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
      case "Assigned":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Assigned
          </span>
        );
      case "Loading":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Loading
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FFA500]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA500] animate-pulse" />
            In Transit
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
            Cancelled
          </span>
        );
    }
  };

  const getPriorityTag = (priority: RequestPriority) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md">
            <Flame size={10} />
            Urgent
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center font-mono text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
            High
          </span>
        );
      case "Normal":
        return (
          <span className="inline-flex items-center font-mono text-[10px] font-medium text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-md">
            Normal
          </span>
        );
    }
  };

  const getMaterialColor = (material: MaterialCategory) => {
    switch (material) {
      case "Chemical":
        return "text-[#FFA500] bg-[#FFA500]/10 border-[#FFA500]/25";
      case "Hazardous":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25";
      case "Waste Water":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25";
      case "Non-Hazard":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, chemical, city, request ID..."
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

        {/* Filters, View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <select
            value={params.status || "ALL"}
            onChange={(e) =>
              onParamsChange({
                status: e.target.value as "ALL" | LoadRequestStatus,
                page: 1,
              })
            }
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
          >
            <option value="ALL">All Statuses ({data.statusCounts.all})</option>
            <option value="Pending">Pending ({data.statusCounts.pending})</option>
            <option value="Assigned">Assigned ({data.statusCounts.assigned})</option>
            <option value="In Transit">In Transit ({data.statusCounts.inTransit})</option>
            <option value="Completed">Completed ({data.statusCounts.completed})</option>
          </select>

          {/* Priority Filter */}
          <select
            value={params.priority || "ALL"}
            onChange={(e) =>
              onParamsChange({
                priority: e.target.value as "ALL" | RequestPriority,
                page: 1,
              })
            }
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent Requisitions</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Orders</option>
          </select>

          {/* Material Category */}
          <select
            value={params.materialCategory || "ALL"}
            onChange={(e) =>
              onParamsChange({
                materialCategory: e.target.value as "ALL" | MaterialCategory,
                page: 1,
              })
            }
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
          >
            <option value="ALL">All Materials</option>
            <option value="Chemical">Chemical</option>
            <option value="Hazardous">Hazardous</option>
            <option value="Waste Water">Waste Water</option>
            <option value="Non-Hazard">Non-Hazard</option>
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

      {/* Main Workspace: Table or Grid View */}
      <div className="relative rounded-2xl border border-border bg-card shadow-xs overflow-hidden min-h-[350px]">
        {/* Loading Overlay when refreshing */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-semibold text-[#FFA500] shadow-xl">
              <RefreshCw size={14} className="animate-spin" />
              <span>Fetching latest requisitions...</span>
            </div>
          </div>
        )}

        {viewMode === "grid" ? (
          /* GRID VIEW (Interactive Cards) */
          <div className="p-4 sm:p-5">
            {data.data.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <PackageSearch size={36} className="text-muted-foreground/50" />
                <p className="font-semibold text-xs text-foreground">No load requisitions found</p>
                <p className="text-[11px] text-muted-foreground">Try clearing date or search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.data.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onOpenView(req)}
                    className="rounded-2xl border border-border bg-background p-4.5 space-y-3.5 hover:border-[#FFA500]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-foreground text-xs">{req.id}</span>
                          {getPriorityTag(req.priority)}
                        </div>
                        {getStatusBadge(req.status)}
                      </div>

                      <div className="mt-2.5">
                        <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                          <Building2 size={14} className="text-muted-foreground shrink-0" />
                          <span>{req.company}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 font-medium truncate">
                          {req.chemicalName}
                        </div>
                      </div>
                    </div>

                    {/* Tanker Specs & Route Box */}
                    <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground flex items-center gap-1">
                          <Gauge size={13} className="text-[#FFA500]" />
                          <span>{req.requiredCapacity.toLocaleString()} L</span>
                        </span>
                        <span className="font-semibold text-[#FFA500] text-[11px]">
                          {req.bodyType} Body • {req.compartmentsNeeded} {req.compartmentsNeeded === 1 ? "Chamber" : "Chambers"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-semibold text-foreground border-t border-border/50 pt-2 text-[11px]">
                        <span className="text-emerald-400">{req.pickupCity}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-[#FFA500]">{req.deliveryCity}</span>
                        <span className="text-muted-foreground font-mono text-[10px] ml-auto">
                          {req.loadingDate}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Commercial & Actions */}
                    <div
                      className="flex items-center justify-between border-t border-border pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Offered Rate</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          ₹{req.offeredRate.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {req.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => onOpenAssign(req)}
                            className="flex items-center gap-1 rounded-lg bg-[#FFA500] px-3 py-1.5 text-xs font-bold text-[#071522] shadow-xs hover:bg-[#FFB733] transition cursor-pointer"
                          >
                            <Truck size={12} className="stroke-[2.5]" />
                            <span>Assign</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenView(req)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenEdit(req)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-[#00AEEF] transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete load requisition ${req.id}?`)) {
                              onDelete(req.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                          title="Delete"
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
          /* LIST VIEW (Table Layout) */
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th onClick={() => handleSort("id")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Requisition ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("company")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Company & Requester</span>
                      {getSortIcon("company")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("chemicalName")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Cargo / Chemical</span>
                      {getSortIcon("chemicalName")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("requiredCapacity")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Required Tanker</span>
                      {getSortIcon("requiredCapacity")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("loadingDate")} className="px-4 py-3.5 cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center gap-1">
                      <span>Route & Schedule</span>
                      {getSortIcon("loadingDate")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("offeredRate")} className="px-4 py-3.5 text-right cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center justify-end gap-1">
                      <span>Offered Rate</span>
                      {getSortIcon("offeredRate")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("status")} className="px-4 py-3.5 text-center cursor-pointer hover:text-foreground transition group select-none">
                    <div className="flex items-center justify-center gap-1">
                      <span>Status</span>
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
                        <PackageSearch size={32} className="text-muted-foreground/50" />
                        <p className="font-semibold text-xs text-foreground">No load requisitions found</p>
                        <p className="text-[11px] text-muted-foreground">
                          Try adjusting your filters or create a new request
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.data.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => onOpenView(req)}
                    >
                      {/* ID & Priority */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono font-bold text-foreground text-xs">
                            {req.id}
                          </span>
                          {getPriorityTag(req.priority)}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Building2 size={13} className="text-muted-foreground shrink-0" />
                          <span>{req.company}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <span>{req.contactPerson}</span>
                          <span className="font-mono text-[10px]">({req.contactPhone})</span>
                        </div>
                      </td>

                      {/* Cargo */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="font-semibold text-foreground truncate" title={req.chemicalName}>
                          {req.chemicalName}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.2 text-[10px] font-bold ${getMaterialColor(
                              req.materialCategory
                            )}`}
                          >
                            {req.materialCategory}
                          </span>
                        </div>
                      </td>

                      {/* Tanker Specs */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground text-xs flex items-center gap-1">
                          <Gauge size={13} className="text-[#FFA500]" />
                          <span>{req.requiredCapacity.toLocaleString()} L</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          <span className="text-[#FFA500] font-semibold">{req.bodyType} Body</span> •{" "}
                          <span>{req.compartmentsNeeded} {req.compartmentsNeeded === 1 ? "Chamber" : "Chambers"}</span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <span className="text-emerald-400">{req.pickupCity}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-[#FFA500]">{req.deliveryCity}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                          <Calendar size={11} />
                          <span>Load: {req.loadingDate}</span>
                        </div>
                      </td>

                      {/* Offered Rate */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          ₹{req.offeredRate.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Lump sum</div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => onOpenAssign(req)}
                              className="flex items-center gap-1 rounded-lg bg-[#FFA500] px-2.5 py-1 text-[11px] font-bold text-[#071522] shadow-xs hover:bg-[#FFB733] transition cursor-pointer"
                              title="Assign available tanker truck"
                            >
                              <Truck size={12} className="stroke-[2.5]" />
                              <span>Assign</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenView(req)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                            title="View Requisition Details"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEdit(req)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-[#00AEEF] transition cursor-pointer"
                            title="Edit Requisition"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete load requisition ${req.id}?`)) {
                                onDelete(req.id);
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

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border px-4 py-3 gap-3 bg-muted/20 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-foreground">{data.data.length}</span> of{" "}
            <span className="font-bold text-foreground">{data.total}</span> requisitions
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
        title="Export Load Requisitions"
        defaultFilename="company-load-requests"
        availableColumns={LOAD_REQUEST_COLUMNS}
        totalRecordsCount={data.total}
        currentPageCount={data.data.length}
        filteredCount={data.total}
        onExport={handleExport}
      />
    </div>
  );
}

"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  Columns3,
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFleetData } from "@/hooks/useFleetData";
import { FleetStatus, FleetVehicle, MaterialCategory, TankerType } from "@/types/fleet";
import AddVehicleModal from "./AddVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import ViewVehicleModal from "./ViewVehicleModal";
import ExportModal from "@/components/common/ExportModal";

interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

const FLEET_COLUMNS: ColumnDef[] = [
  { id: "id", label: "Vehicle ID", required: true },
  { id: "plateNo", label: "Plate No." },
  { id: "capacity", label: "Type / Capacity" },
  { id: "owner", label: "Owner" },
  { id: "driver", label: "Driver" },
  { id: "company", label: "Company" },
  { id: "material", label: "Material" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
];

export default function FleetTable() {
  const {
    data,
    total,
    page,
    pageSize,
    totalPages,
    statusCounts,
    loading,
    params,
    setSearch,
    setStatusFilter,
    setTankerTypeFilter,
    setMaterialFilter,
    setCompanyFilter,
    setDateFilter,
    resetFilters,
    handleSort,
    setPage,
    setPageSize,
    addVehicle,
    editVehicle,
    deleteVehicle,
    handleExport,
    availableExportColumns,
    refresh,
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isExportModalOpen,
    selectedVehicle,
    openAddModal,
    openEditModal,
    openViewModal,
    openExportModal,
    closeModals,
  } = useFleetData({ pageSize: 6 });

  // Column Visibility State (All visible by default)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    plateNo: true,
    capacity: true,
    owner: true,
    driver: true,
    company: true,
    material: true,
    status: true,
    actions: true,
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
      // Prevent hiding all columns (keep at least 1)
      if (prev[colId] && activeCount <= 1) return prev;
      return { ...prev, [colId]: !prev[colId] };
    });
  };

  const showAllColumns = () => {
    const allVisible: Record<string, boolean> = {};
    FLEET_COLUMNS.forEach((col) => {
      allVisible[col.id] = true;
    });
    setVisibleColumns(allVisible);
  };

  const resetDefaultColumns = () => {
    const defaultVisible: Record<string, boolean> = {};
    FLEET_COLUMNS.forEach((col) => {
      defaultVisible[col.id] = true;
    });
    setVisibleColumns(defaultVisible);
  };

  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  const getSortIcon = (column: keyof FleetVehicle) => {
    if (params.sortBy !== column) {
      return <ArrowUpDown size={12} className="text-[#4A647E] group-hover:text-[#FFA500]" />;
    }
    return params.sortOrder === "asc" ? (
      <ArrowUp size={12} className="text-[#FFA500]" />
    ) : (
      <ArrowDown size={12} className="text-[#FFA500]" />
    );
  };

  const getMaterialClass = (material: MaterialCategory) => {
    switch (material) {
      case "Chemical":
        return "text-[#FFA500] font-semibold";
      case "Hazardous":
        return "text-[#EF4444] font-semibold";
      case "Waste Water":
        return "text-[#38BDF8] font-semibold";
      case "Non-Hazard":
        return "text-[#10B981] font-semibold";
      default:
        return "text-[#E8EEF5]";
    }
  };

  const getStatusPill = (status: FleetStatus) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center justify-center rounded-full bg-[#052E20] border border-[#065F46]/40 px-3 py-0.5 text-xs font-semibold text-[#10B981]">
            Active
          </span>
        );
      case "Transit":
        return (
          <span className="inline-flex items-center justify-center rounded-full bg-[#08283B] border border-[#0369A1]/40 px-3 py-0.5 text-xs font-semibold text-[#38BDF8]">
            Transit
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center justify-center rounded-full bg-[#2A1E0B] border border-[#B45309]/40 px-3 py-0.5 text-xs font-semibold text-[#FFA500]">
            Maintenance
          </span>
        );
      case "Idle":
        return (
          <span className="inline-flex items-center justify-center rounded-full bg-[#16202B] border border-[#334155]/40 px-3 py-0.5 text-xs font-semibold text-[#7E9AB5]">
            Idle
          </span>
        );
    }
  };

  const statusTabs: Array<{ label: string; value: "ALL" | FleetStatus; count: number }> = [
    { label: "All", value: "ALL", count: statusCounts.all },
    { label: "Active", value: "Active", count: statusCounts.active },
    { label: "Transit", value: "Transit", count: statusCounts.transit },
    { label: "Maintenance", value: "Maintenance", count: statusCounts.maintenance },
    { label: "Idle", value: "Idle", count: statusCounts.idle },
  ];

  const activeAdvancedFiltersCount =
    (params.tankerType && params.tankerType !== "ALL" ? 1 : 0) +
    (params.material && params.material !== "ALL" ? 1 : 0) +
    (params.company && params.company !== "ALL" ? 1 : 0) +
    (params.date && params.date.trim() ? 1 : 0);

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  // Common sample dates for quick filtering presets in fleet records
  const fleetDatePresets = [
    { label: "2025-07-18 (Service)", value: "2025-07-18" },
    { label: "2025-07-10", value: "2025-07-10" },
    { label: "2025-07-02", value: "2025-07-02" },
    { label: "2025-06-28", value: "2025-06-28" },
    { label: "2025-06-15", value: "2025-06-15" },
  ];

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="rounded-2xl border border-[#14293C] bg-[#0A1A2B] p-4 sm:p-6 transition hover:border-[#1E3E5B]">
      {/* 1. Header: Fleet Management Title & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F1F5F9] leading-snug">
            Fleet Management
          </h2>
          <p className="text-xs text-[#5E7995] mt-0.5">
            Monitor, assign, and manage all transport tankers & drivers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dedicated Calendar / Date Filter Popover */}
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                params.date
                  ? "border-[#38BDF8]/60 bg-[#38BDF8]/15 text-[#38BDF8] ring-1 ring-[#38BDF8]/30"
                  : showDateDropdown
                  ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                  : "border-[#18314A] bg-[#071522] text-[#8DA6BE] hover:border-[#2C4863] hover:text-[#F1F5F9]"
              }`}
              title="Filter fleet vehicles by service / registration date"
            >
              <Calendar size={13} className={params.date ? "text-[#38BDF8]" : "text-[#7E9AB5]"} />
              <span>{params.date ? params.date : "Date"}</span>
              {params.date && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter("");
                  }}
                  className="ml-0.5 rounded p-0.5 hover:bg-[#38BDF8]/20 hover:text-white"
                  title="Clear Date"
                >
                  <X size={11} />
                </span>
              )}
            </button>

            {/* Calendar Popover Menu */}
            {showDateDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-2xl border border-[#162D42] bg-[#0B1D2F] p-3.5 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#142637] mb-2.5">
                  <span className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#FFA500]" />
                    <span>Filter by Service Date</span>
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

                {/* Specific Date Picker Input */}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1.5">
                    Choose Specific Date:
                  </label>
                  <input
                    type="date"
                    value={params.date || ""}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setShowDateDropdown(false);
                    }}
                    className="h-8.5 w-full rounded-lg border border-[#182F45] bg-[#071522] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500] [color-scheme:dark] cursor-pointer"
                  />
                </div>

                {/* Quick Date Shortcuts */}
                <div>
                  <span className="block text-[10px] font-semibold text-[#5E7995] uppercase tracking-wider mb-1.5">
                    Quick Service Dates
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
                          : "text-[#8DA6BE] hover:bg-[#0E2437] hover:text-[#F1F5F9]"
                      }`}
                    >
                      <span>All Dates (Show All)</span>
                      {!params.date && <Check size={12} className="text-[#FFA500]" />}
                    </button>

                    {fleetDatePresets.map((preset) => {
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
                              : "text-[#8DA6BE] hover:bg-[#0E2437] hover:text-[#F1F5F9]"
                          }`}
                        >
                          <span>{preset.label}</span>
                          {isSelected && <Check size={12} className="text-[#38BDF8]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column Selection Dropdown */}
          <div className="relative" ref={columnDropdownRef}>
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                showColumnDropdown || visibleColumnsCount < FLEET_COLUMNS.length
                  ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                  : "border-[#18314A] bg-[#071522] text-[#8DA6BE] hover:border-[#2C4863] hover:text-[#F1F5F9]"
              }`}
              title="Select columns to display in the table"
            >
              <Columns3 size={14} className={visibleColumnsCount < FLEET_COLUMNS.length ? "text-[#FFA500]" : "text-[#7E9AB5]"} />
              <span>Columns</span>
              <span className="rounded-md bg-[#0D2235] px-1.5 py-0.5 text-[10px] font-mono text-[#FFA500]">
                {visibleColumnsCount}/{FLEET_COLUMNS.length}
              </span>
            </button>

            {/* Column Selection Popover Menu */}
            {showColumnDropdown && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-2xl border border-[#162D42] bg-[#0B1D2F] p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
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

                <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5 custom-scrollbar">
                  {FLEET_COLUMNS.map((col) => {
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

          {/* Filter Panel Toggle Button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
              showFiltersPanel || activeAdvancedFiltersCount > 0
                ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                : "border-[#18314A] bg-[#071522] text-[#8DA6BE] hover:border-[#2C4863] hover:text-[#F1F5F9]"
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

          {/* Export Button - Opens Advanced Export Configuration Modal */}
          <button
            onClick={openExportModal}
            className="flex items-center gap-1.5 h-9 rounded-xl border border-[#18314A] bg-[#071522] px-3.5 text-xs font-semibold text-[#8DA6BE] hover:border-[#2C4863] hover:text-[#FFA500] transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#18314A] bg-[#071522] text-[#8DA6BE] hover:border-[#2C4863] hover:text-[#F1F5F9] transition cursor-pointer disabled:opacity-50"
            title="Refresh Fleet Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#FFA500]" : ""} />
          </button>

          {/* + Add Vehicle Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 h-9 rounded-xl bg-[#FFA500] px-4 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar: Search Input & Status Tabs Pills */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center mb-4">
        {/* Search Bar matching screenshot */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#56728D]"
          />
          <input
            type="text"
            value={params.search || ""}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plate, owner, driver, company.."
            className="h-9 w-full rounded-full border border-[#172D40] bg-[#071522] pl-9 pr-8 text-xs text-[#E8EEF5] placeholder:text-[#526D87] outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/25"
          />
          {params.search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#56728D] hover:text-[#E8EEF5]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Pill Filters matching screenshot */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => {
            const isActive = params.status === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-[#FFA500] text-[#071522] font-semibold shadow-md shadow-orange-500/15"
                    : "bg-[#071522] border border-[#162D42] text-[#7E9AB5] hover:border-[#2C4863] hover:text-[#F1F5F9]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] ${
                      isActive ? "text-[#071522]/80" : "text-[#55718E]"
                    }`}
                  >
                    ({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Advanced Column Filters Drawer */}
      {showFiltersPanel && (
        <div className="mb-4 rounded-xl border border-[#162D42] bg-[#071522]/90 p-3.5 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#142637] mb-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#F1F5F9]">
              <SlidersHorizontal size={13} className="text-[#FFA500]" />
              <span>Advanced Column Filters</span>
            </div>
            {activeAdvancedFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#FFA500] hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Tanker Type Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Tanker Type
              </label>
              <select
                value={params.tankerType || "ALL"}
                onChange={(e) => setTankerTypeFilter(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ALL">All Tanker Types</option>
                <option value="Chemical Tanker">Chemical Tanker</option>
                <option value="Hazmat Tanker">Hazmat Tanker</option>
                <option value="Water Tanker">Water Tanker</option>
                <option value="General Tanker">General Tanker</option>
              </select>
            </div>

            {/* Material Category Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1">
                Material Classification
              </label>
              <select
                value={params.material || "ALL"}
                onChange={(e) => setMaterialFilter(e.target.value)}
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
                Operating Company
              </label>
              <select
                value={params.company || "ALL"}
                onChange={(e) => setCompanyFilter(e.target.value)}
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

            {/* Service Date Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#7E9AB5] mb-1 flex items-center justify-between">
                <span>Service / Reg. Date</span>
                {params.date && (
                  <button
                    onClick={() => setDateFilter("")}
                    className="text-[10px] text-[#FFA500] hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </label>
              <input
                type="date"
                value={params.date || ""}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#182F45] bg-[#0B1A28] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500] [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Quick Service Date Presets */}
          <div className="mt-2.5 pt-2 border-t border-[#142637] flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#5E7995] mr-1">Quick Date:</span>
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                !params.date
                  ? "bg-[#FFA500] text-[#071522] font-semibold"
                  : "bg-[#0B1A28] text-[#7E9AB5] hover:text-[#F1F5F9] border border-[#162D42]"
              }`}
            >
              All Dates
            </button>
            {fleetDatePresets.map((preset) => {
              const isSelected = params.date === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setDateFilter(preset.value)}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    isSelected
                      ? "bg-[#FFA500] text-[#071522] font-semibold"
                      : "bg-[#0B1A28] text-[#7E9AB5] hover:text-[#F1F5F9] border border-[#162D42]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Table Container */}
      <div className="overflow-x-auto relative min-h-[220px] custom-scrollbar">
        {loading && (
          <div className="absolute inset-0 bg-[#0A1A2B]/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 rounded-full bg-[#071522] border border-[#1E3B56] px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
              <RefreshCw size={14} className="animate-spin" />
              <span>Loading fleet records...</span>
            </div>
          </div>
        )}

        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#142637] text-[11px] font-medium text-[#5E7995]">
              {/* Vehicle ID */}
              {visibleColumns.id && (
                <th
                  onClick={() => handleSort("id")}
                  className="pb-3 pr-4 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Vehicle ID</span>
                    {getSortIcon("id")}
                  </div>
                </th>
              )}

              {/* Plate No */}
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

              {/* Type / Capacity */}
              {visibleColumns.capacity && (
                <th
                  onClick={() => handleSort("capacity")}
                  className="pb-3 px-3 font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Type / Capacity</span>
                    {getSortIcon("capacity")}
                  </div>
                </th>
              )}

              {/* Owner */}
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

              {/* Driver */}
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

              {/* Company */}
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

              {/* Material */}
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

              {/* Status */}
              {visibleColumns.status && (
                <th
                  onClick={() => handleSort("status")}
                  className="pb-3 px-3 text-center font-medium cursor-pointer group hover:text-[#FFA500] transition select-none"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Status</span>
                    {getSortIcon("status")}
                  </div>
                </th>
              )}

              {/* Action Icons */}
              {visibleColumns.actions && (
                <th className="pb-3 pl-4 text-right font-medium text-[#5E7995]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#122334]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnsCount || 9} className="py-12 text-center text-[#5E7995]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search size={24} className="text-[#3A526A]" />
                    <p className="font-semibold text-[#8DA6BE]">No fleet vehicles found</p>
                    <p className="text-xs text-[#55718E]">
                      Try changing your search query or column filters.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-1 text-xs text-[#FFA500] hover:underline cursor-pointer"
                    >
                      Clear search & filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="transition hover:bg-[#0D2235]/60 group"
                >
                  {/* Vehicle ID */}
                  {visibleColumns.id && (
                    <td className="py-3.5 pr-4 font-mono font-bold text-[#FFA500]">
                      {vehicle.id}
                    </td>
                  )}

                  {/* Plate No */}
                  {visibleColumns.plateNo && (
                    <td className="py-3.5 px-3 font-bold text-[#F1F5F9]">
                      {vehicle.plateNo}
                    </td>
                  )}

                  {/* Type / Capacity */}
                  {visibleColumns.capacity && (
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#E2E8F0] leading-tight">
                        {vehicle.tankerType}
                      </div>
                      <div className="text-[11px] text-[#5E7995] font-mono mt-0.5">
                        {vehicle.capacityDisplay}
                      </div>
                    </td>
                  )}

                  {/* Owner */}
                  {visibleColumns.owner && (
                    <td className="py-3.5 px-3 font-medium text-[#7E9AB5]">
                      {vehicle.owner}
                    </td>
                  )}

                  {/* Driver */}
                  {visibleColumns.driver && (
                    <td className="py-3.5 px-3 font-medium text-[#7E9AB5]">
                      {vehicle.driver}
                    </td>
                  )}

                  {/* Company */}
                  {visibleColumns.company && (
                    <td className="py-3.5 px-3 font-medium text-[#7E9AB5]">
                      {vehicle.company}
                    </td>
                  )}

                  {/* Material */}
                  {visibleColumns.material && (
                    <td className={`py-3.5 px-3 ${getMaterialClass(vehicle.material)}`}>
                      {vehicle.material}
                    </td>
                  )}

                  {/* Status */}
                  {visibleColumns.status && (
                    <td className="py-3.5 px-3 text-center">
                      {getStatusPill(vehicle.status)}
                    </td>
                  )}

                  {/* Action Icons */}
                  {visibleColumns.actions && (
                    <td className="py-3.5 pl-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-[#5A7692]">
                        {/* View Action */}
                        <button
                          onClick={() => openViewModal(vehicle)}
                          className="rounded-lg p-1.5 hover:bg-[#0E2337] hover:text-[#38BDF8] transition cursor-pointer"
                          title="View Vehicle Details"
                          aria-label="View vehicle details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit Action */}
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="rounded-lg p-1.5 hover:bg-[#0E2337] hover:text-[#FFA500] transition cursor-pointer"
                          title="Edit Vehicle"
                          aria-label="Edit vehicle"
                        >
                          <Edit size={15} />
                        </button>

                        {/* Delete Action with Confirmation */}
                        {deleteConfirmId === vehicle.id ? (
                          <div className="flex items-center gap-1 animate-in fade-in duration-100">
                            <button
                              onClick={() => handleDelete(vehicle.id)}
                              className="rounded px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold hover:bg-rose-600 cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded px-1.5 py-0.5 bg-[#162D42] text-[#8DA6BE] text-[10px] hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(vehicle.id)}
                            className="rounded-lg p-1.5 hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                            title="Remove Vehicle"
                            aria-label="Remove vehicle"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#142637] pt-4 text-xs text-[#6A86A2]">
        {/* Left: Summary & Rows Selector */}
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-[#E8EEF5]">{startEntry}</strong> to{" "}
            <strong className="text-[#E8EEF5]">{endEntry}</strong> of{" "}
            <strong className="text-[#E8EEF5]">{total}</strong> entries
          </span>

          <div className="flex items-center gap-1.5 pl-2 border-l border-[#142637]">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-[#162D42] bg-[#071522] px-2 py-0.5 text-xs text-[#E8EEF5] outline-none"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Right: Page Numbers & Prev/Next */}
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

      {/* Popups & Modals */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={closeModals}
        onAdd={addVehicle}
        existingVehicles={data}
      />

      <EditVehicleModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onEdit={editVehicle}
        vehicle={selectedVehicle}
        existingVehicles={data}
      />

      <ViewVehicleModal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        onEditClick={openEditModal}
        vehicle={selectedVehicle}
      />

      {/* Advanced Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeModals}
        title="Export Fleet Vehicles"
        defaultFilename="fluidlogix-fleet"
        availableColumns={availableExportColumns}
        totalRecordsCount={statusCounts.all}
        currentPageCount={data.length}
        filteredCount={total}
        onExport={handleExport}
      />
    </div>
  );
}

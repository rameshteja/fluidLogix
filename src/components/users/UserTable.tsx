"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Edit,
  Eye,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ExportModal from "@/components/common/ExportModal";
import AddUserModal from "@/components/users/AddUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import ViewUserModal from "@/components/users/ViewUserModal";
import { useUserData } from "@/hooks/useUserData";
import {
  UserCategory,
  UserItem,
  UserSortField,
  UserStatus,
  UserVerificationStatus,
} from "@/types/user";

interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

const USER_COLUMNS_MAP: Record<UserCategory, ColumnDef[]> = {
  Drivers: [
    { id: "name", label: "Name", required: true },
    { id: "phone", label: "Phone" },
    { id: "licenseNo", label: "License No." },
    { id: "assignedVehicle", label: "Assigned Vehicle" },
    { id: "verified", label: "Verified" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ],
  Owners: [
    { id: "name", label: "Name", required: true },
    { id: "phone", label: "Phone" },
    { id: "company", label: "Company / Fleet Size" },
    { id: "verified", label: "Verified" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ],
  Companies: [
    { id: "name", label: "Company Name", required: true },
    { id: "phone", label: "Phone" },
    { id: "company", label: "Contact Person / Fleet" },
    { id: "verified", label: "Verified" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ],
};

const userDatePresets = [
  { label: "2025-07-18 (Latest)", value: "2025-07-18" },
  { label: "2025-07-15", value: "2025-07-15" },
  { label: "2025-07-10", value: "2025-07-10" },
  { label: "2025-06-25", value: "2025-06-25" },
  { label: "2025-06-15", value: "2025-06-15" },
  { label: "2025-05-12", value: "2025-05-12" },
];

export default function UserTable() {
  const {
    filteredUsers,
    total,
    totalPages,
    categoryTotalCount,
    activeTab,
    params,
    setParams,
    selectedIds,
    toastMessage,

    // Modal States
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    isViewOpen,
    setIsViewOpen,
    isExportOpen,
    setIsExportOpen,
    activeUser,
    setActiveUser,

    // Handlers
    handleTabChange,
    handleSearch,
    setDateFilter,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleSelectAll,
    handleToggleSelect,
    handleBulkDelete,
    handleBulkStatusChange,
    handleExport,
    availableExportColumns,
  } = useUserData();

  // View Mode: Grid (Cards) or List (Table)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Active columns def
  const currentColumnsDef = USER_COLUMNS_MAP[activeTab];

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    phone: true,
    licenseNo: true,
    assignedVehicle: true,
    company: true,
    verified: true,
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
    currentColumnsDef.forEach((col) => {
      allVisible[col.id] = true;
    });
    setVisibleColumns(allVisible);
  };

  const visibleColumnsCount = currentColumnsDef.filter(
    (col) => visibleColumns[col.id] !== false
  ).length;

  const activeAdvancedFiltersCount =
    (params.status && params.status !== "ALL" ? 1 : 0) +
    (params.verified && params.verified !== "ALL" ? 1 : 0) +
    (params.assignedVehicle && params.assignedVehicle !== "ALL" ? 1 : 0) +
    (params.company && params.company !== "ALL" ? 1 : 0) +
    (params.date && params.date.trim() ? 1 : 0);

  const getSortIcon = (field: UserSortField) => {
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
    }, 400);
  };

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.includes(u.id));

  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-4 sm:p-6 transition shadow-sm space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#FFA500]/30 bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-[#FFA500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header: User Management Title & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            User Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and manage drivers, fleet owners, and transport companies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grid / List View Toggle Switch */}
          <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shadow-inner">
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
              title="Filter users by registration date"
            >
              <Calendar
                size={13}
                className={params.date ? "text-[#38BDF8]" : "text-muted-foreground"}
              />
              <span>{params.date ? params.date : "Date"}</span>
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
                    <span>Filter by Registration Date</span>
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

                {/* Quick Date Shortcuts */}
                <div>
                  <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Quick Dates
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

                    {userDatePresets.map((preset) => {
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
                  visibleColumnsCount < currentColumnsDef.length
                    ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
                title="Select columns to display"
              >
                <Columns3
                  size={14}
                  className={
                    visibleColumnsCount < currentColumnsDef.length
                      ? "text-[#FFA500]"
                      : "text-muted-foreground"
                  }
                />
                <span>Columns</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-[#FFA500]">
                  {visibleColumnsCount}/{currentColumnsDef.length}
                </span>
              </button>

              {/* Popover */}
              {showColumnDropdown && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border border-border bg-card p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2 px-1">
                    <span className="text-xs font-bold text-foreground">
                      Columns
                    </span>
                    <button
                      onClick={showAllColumns}
                      className="text-[10px] text-[#FFA500] hover:underline cursor-pointer font-medium"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {currentColumnsDef.map((col) => {
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

          {/* Filter Panel Toggle Button */}
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

          {/* Export Button */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
            title="Refresh Users Data"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin text-[#FFA500]" : ""}
            />
          </button>

          {/* + Add User Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 h-9 rounded-xl bg-[#FFA500] px-4 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* 2. Category Tabs & Search Bar Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
        {/* Tab Pills matching reference design screenshot */}
        <div className="flex items-center gap-2">
          {(["Drivers", "Owners", "Companies"] as UserCategory[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()} by name, phone, license, vehicle...`}
            value={params.search}
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

      {/* Expandable Advanced Filters Panel */}
      {showFiltersPanel && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-muted/20 animate-in fade-in duration-150 text-xs">
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Account Status
            </label>
            <select
              value={params.status}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  status: e.target.value as UserStatus | "ALL",
                  page: 1,
                }))
              }
              className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Verification
            </label>
            <select
              value={params.verified}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  verified: e.target.value as UserVerificationStatus | "ALL",
                  page: 1,
                }))
              }
              className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
            >
              <option value="ALL">All Verifications</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Vehicle Filter
            </label>
            <select
              value={params.assignedVehicle}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  assignedVehicle: e.target.value,
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
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  status: "ALL",
                  verified: "ALL",
                  assignedVehicle: "ALL",
                  company: "ALL",
                  date: "",
                  search: "",
                  page: 1,
                }))
              }
              className="h-8.5 w-full rounded-lg border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Action Header Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[#FFA500]/30 bg-[#FFA500]/10 px-4 py-2.5 text-xs text-foreground animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] font-bold text-[11px]">
              {selectedIds.length}
            </span>
            <span>Selected Users</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("Active")}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer font-semibold"
            >
              Set Active
            </button>
            <button
              onClick={handleBulkDelete}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer font-semibold flex items-center gap-1"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Display Container: GRID VIEW vs LIST VIEW */}
      {viewMode === "grid" ? (
        /* GRID VIEW (Exact match to reference screenshot) */
        <div className="min-h-[300px]">
          {filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-border bg-background p-12 text-center text-muted-foreground">
              No users matching criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                const vehicleCountVal =
                  user.vehiclesCount ??
                  user.fleetSize ??
                  user.activeFleetCount ??
                  (user.assignedVehicle && user.assignedVehicle !== "Unassigned"
                    ? 1
                    : 0);

                const driverCountVal =
                  user.driversCount ??
                  (activeTab === "Drivers"
                    ? 1
                    : user.fleetSize
                    ? Math.min(user.fleetSize, 2)
                    : 1);

                return (
                  <div
                    key={user.id}
                    className={`rounded-2xl border bg-background/80 p-4.5 transition-all duration-200 hover:border-[#FFA500]/50 hover:shadow-lg hover:shadow-orange-500/5 relative group flex flex-col justify-between ${
                      isSelected
                        ? "border-[#FFA500] bg-[#FFA500]/5"
                        : "border-border/80"
                    }`}
                  >
                    {/* Top Row: Avatar Initials, Name, Phone & Verification Icon */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex items-center gap-3">
                        {/* Circle Avatar with Initials */}
                        <div className="h-10 w-10 rounded-full bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 font-extrabold text-sm flex items-center justify-center shadow-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm group-hover:text-[#FFA500] transition leading-snug">
                            {user.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {user.phone}
                          </p>
                        </div>
                      </div>

                      {/* Verification Status Icon Badge */}
                      <div className="flex items-center gap-2">
                        {user.verified === "Verified" ? (
                          <div
                            className="h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                            title="Verified Account"
                          >
                            <CheckCircle2 size={15} className="text-emerald-400" />
                          </div>
                        ) : user.verified === "Pending" ? (
                          <div
                            className="h-6 w-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center"
                            title="Pending Verification"
                          >
                            <AlertTriangle size={14} className="text-amber-400" />
                          </div>
                        ) : (
                          <div
                            className="h-6 w-6 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center"
                            title="Rejected Account"
                          >
                            <X size={14} className="text-rose-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle Section: 3-Column Stats Divider (Matching Reference Image) */}
                    <div className="border-t border-b border-border/60 py-3.5 my-1 grid grid-cols-3 text-center gap-2">
                      {/* Stat 1: Vehicles */}
                      <div className="px-1 border-r border-border/40">
                        <div className="text-base font-extrabold text-foreground">
                          {vehicleCountVal}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          Vehicles
                        </div>
                      </div>

                      {/* Stat 2: Drivers */}
                      <div className="px-1 border-r border-border/40">
                        <div className="text-base font-extrabold text-foreground">
                          {driverCountVal}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          Drivers
                        </div>
                      </div>

                      {/* Stat 3: Bank Details */}
                      <div className="px-1 truncate">
                        <div
                          className="text-xs font-bold text-foreground truncate"
                          title={user.bankAccount || "SBI ****4532"}
                        >
                          {user.bankAccount || "SBI ****4532"}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          Bank
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Category Details & Action Buttons */}
                    <div className="flex items-center justify-between pt-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            user.status === "Active"
                              ? "bg-[#052E20] border border-[#065F46]/40 text-[#10B981]"
                              : "bg-[#16202B] border border-[#334155]/40 text-[#7E9AB5]"
                          }`}
                        >
                          {user.status}
                        </span>

                        {/* License or Assigned Vehicle Tag */}
                        {activeTab === "Drivers" && user.assignedVehicle && (
                          <span className="font-mono text-[11px] text-[#FFA500] font-bold">
                            {user.assignedVehicle}
                          </span>
                        )}
                      </div>

                      {/* Modal Action Buttons */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <button
                          onClick={() => {
                            setActiveUser(user);
                            setIsViewOpen(true);
                          }}
                          className="hover:text-foreground transition cursor-pointer p-1 rounded-md hover:bg-muted"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setActiveUser(user);
                            setIsEditOpen(true);
                          }}
                          className="hover:text-foreground transition cursor-pointer p-1 rounded-md hover:bg-muted"
                          title="Edit User"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="hover:text-rose-400 transition cursor-pointer p-1 rounded-md hover:bg-muted"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW (Table Layout) */
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border text-[#FFA500] focus:ring-[#FFA500]"
                    />
                  </th>

                  {visibleColumns.name !== false && (
                    <th
                      onClick={() => handleSort("name")}
                      className="px-4 py-3.5 cursor-pointer hover:text-foreground transition select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{activeTab === "Companies" ? "Company Name" : "Name"}</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                  )}

                  {visibleColumns.phone !== false && (
                    <th className="px-4 py-3.5">Phone</th>
                  )}

                  {activeTab === "Drivers" && visibleColumns.licenseNo !== false && (
                    <th
                      onClick={() => handleSort("licenseNo")}
                      className="px-4 py-3.5 cursor-pointer hover:text-foreground transition select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>License No.</span>
                        {getSortIcon("licenseNo")}
                      </div>
                    </th>
                  )}

                  {activeTab === "Drivers" && visibleColumns.assignedVehicle !== false && (
                    <th
                      onClick={() => handleSort("assignedVehicle")}
                      className="px-4 py-3.5 cursor-pointer hover:text-foreground transition select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Assigned Vehicle</span>
                        {getSortIcon("assignedVehicle")}
                      </div>
                    </th>
                  )}

                  {activeTab === "Owners" && visibleColumns.company !== false && (
                    <th className="px-4 py-3.5">Company / Fleet Size</th>
                  )}

                  {activeTab === "Companies" && visibleColumns.company !== false && (
                    <th className="px-4 py-3.5">Contact Person / Fleet</th>
                  )}

                  {visibleColumns.verified !== false && (
                    <th
                      onClick={() => handleSort("verified")}
                      className="px-4 py-3.5 cursor-pointer hover:text-foreground transition select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Verified</span>
                        {getSortIcon("verified")}
                      </div>
                    </th>
                  )}

                  {visibleColumns.status !== false && (
                    <th
                      onClick={() => handleSort("status")}
                      className="px-4 py-3.5 cursor-pointer hover:text-foreground transition select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {getSortIcon("status")}
                      </div>
                    </th>
                  )}

                  {visibleColumns.actions !== false && (
                    <th className="px-4 py-3.5 text-right pr-6">Actions</th>
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No users matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                      <tr
                        key={user.id}
                        className={`group hover:bg-muted/30 transition ${
                          isSelected ? "bg-[#FFA500]/5" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(user.id)}
                            className="rounded border-border text-[#FFA500] focus:ring-[#FFA500]"
                          />
                        </td>

                        {/* Name Column */}
                        {visibleColumns.name !== false && (
                          <td className="px-4 py-3.5 font-bold text-foreground group-hover:text-[#FFA500] transition">
                            {user.name}
                          </td>
                        )}

                        {/* Phone Column */}
                        {visibleColumns.phone !== false && (
                          <td className="px-4 py-3.5 font-medium text-foreground/80">
                            {user.phone}
                          </td>
                        )}

                        {/* License No (Drivers) */}
                        {activeTab === "Drivers" && visibleColumns.licenseNo !== false && (
                          <td className="px-4 py-3.5 font-mono text-muted-foreground">
                            {user.licenseNo || "—"}
                          </td>
                        )}

                        {/* Assigned Vehicle (Drivers) */}
                        {activeTab === "Drivers" && visibleColumns.assignedVehicle !== false && (
                          <td className="px-4 py-3.5">
                            {user.assignedVehicle && user.assignedVehicle !== "Unassigned" ? (
                              <span className="font-mono font-bold text-[#FFA500]">
                                {user.assignedVehicle}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Unassigned
                              </span>
                            )}
                          </td>
                        )}

                        {/* Company & Fleet Size (Owners) */}
                        {activeTab === "Owners" && visibleColumns.company !== false && (
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">
                              {user.company || "Independent"}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {user.fleetSize} Vehicles
                            </div>
                          </td>
                        )}

                        {/* Contact Person & Active Fleet (Companies) */}
                        {activeTab === "Companies" && visibleColumns.company !== false && (
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">
                              {user.contactPerson || "N/A"}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {user.activeFleetCount} Active Tankers
                            </div>
                          </td>
                        )}

                        {/* Verified Status */}
                        {visibleColumns.verified !== false && (
                          <td className="px-4 py-3.5">
                            {user.verified === "Verified" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                <CheckCircle2 size={13} />
                                <span>Verified</span>
                              </span>
                            ) : user.verified === "Pending" ? (
                              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                                <AlertTriangle size={13} />
                                <span>Pending</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                                <X size={13} />
                                <span>Rejected</span>
                              </span>
                            )}
                          </td>
                        )}

                        {/* Status Pill */}
                        {visibleColumns.status !== false && (
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                                user.status === "Active"
                                  ? "bg-[#052E20] border border-[#065F46]/40 text-[#10B981]"
                                  : "bg-[#16202B] border border-[#334155]/40 text-[#7E9AB5]"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        )}

                        {/* Actions Column */}
                        {visibleColumns.actions !== false && (
                          <td className="px-4 py-3.5 text-right pr-6">
                            <div className="flex items-center justify-end gap-2 text-muted-foreground">
                              {/* View Eye Icon */}
                              <button
                                onClick={() => {
                                  setActiveUser(user);
                                  setIsViewOpen(true);
                                }}
                                className="hover:text-foreground transition cursor-pointer p-1"
                                title="View User"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Edit Pencil Icon */}
                              <button
                                onClick={() => {
                                  setActiveUser(user);
                                  setIsEditOpen(true);
                                }}
                                className="hover:text-foreground transition cursor-pointer p-1"
                                title="Edit User"
                              >
                                <Edit size={15} />
                              </button>

                              {/* Delete Trash Icon */}
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="hover:text-rose-400 transition cursor-pointer p-1"
                                title="Delete User"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer (Clean & Integrated - Not a separate card) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            Showing{" "}
            <strong className="text-foreground">
              {total === 0 ? 0 : (params.page - 1) * params.pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {Math.min(params.page * params.pageSize, total)}
            </strong>{" "}
            of <strong className="text-foreground">{total}</strong> users
          </span>

          <select
            value={params.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-2 py-1 text-foreground outline-none cursor-pointer"
          >
            <option value={6}>6 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(params.page - 1)}
            disabled={params.page <= 1}
            className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                p === params.page
                  ? "bg-[#FFA500] text-[#071522] shadow-sm shadow-orange-500/20"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(params.page + 1)}
            disabled={params.page >= totalPages}
            className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddUser}
        defaultCategory={activeTab}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEdit={handleEditUser}
        user={activeUser}
      />

      <ViewUserModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={activeUser}
      />

      {/* Export Modal with correct prop contract */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={`Export ${activeTab} Records`}
        defaultFilename={`fluidlogix-users-${activeTab.toLowerCase()}`}
        availableColumns={availableExportColumns}
        totalRecordsCount={categoryTotalCount}
        currentPageCount={filteredUsers.length}
        filteredCount={total}
        onExport={handleExport}
      />
    </div>
  );
}

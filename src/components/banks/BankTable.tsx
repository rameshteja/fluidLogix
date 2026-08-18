"use client";

import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Grid,
  History,
  Landmark,
  LayoutGrid,
  List,
  Lock,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Star,
  Table as TableIcon,
  Trash2,
  Truck,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import ExportModal from "@/components/common/ExportModal";
import { FLEET_OWNER_FILTER_OPTIONS } from "@/data/filterOptions";
import { useBankData } from "@/hooks/useBankData";
import {
  BankSortField,
  OwnerBankItem,
  OwnerPayoutStatus,
  OwnerVerificationStatus,
} from "@/types/bank";
import AddBankModal from "./AddBankModal";
import DeleteBankModal from "./DeleteBankModal";
import EditBankModal from "./EditBankModal";
import ViewBankModal from "./ViewBankModal";

export interface BankCardTheme {
  gradient: string;
  glow: string;
  chipGradient: string;
  accentText: string;
  border: string;
  tagBg: string;
}

export const BANK_CARD_THEMES: BankCardTheme[] = [
  // 1. Midnight Sapphire (Deep Blue Navy)
  {
    gradient: "bg-gradient-to-tr from-[#0a192f] via-[#112240] to-[#1e3a8a]",
    glow: "bg-blue-500/25",
    chipGradient: "from-amber-200 via-amber-400 to-yellow-500",
    accentText: "text-sky-300",
    border: "border-blue-400/30",
    tagBg: "bg-blue-500/20 text-blue-200",
  },
  // 2. Obsidian Amber / Gold (Rich Warm Royal)
  {
    gradient: "bg-gradient-to-tr from-[#1c1204] via-[#382307] to-[#613b0a]",
    glow: "bg-[#FFA500]/30",
    chipGradient: "from-amber-200 via-yellow-400 to-amber-600",
    accentText: "text-[#FFA500]",
    border: "border-amber-500/35",
    tagBg: "bg-[#FFA500]/20 text-amber-200",
  },
  // 3. Deep Jade / Forest Emerald
  {
    gradient: "bg-gradient-to-tr from-[#031d15] via-[#083325] to-[#115e45]",
    glow: "bg-emerald-500/25",
    chipGradient: "from-emerald-200 via-teal-300 to-emerald-500",
    accentText: "text-emerald-300",
    border: "border-emerald-500/30",
    tagBg: "bg-emerald-500/20 text-emerald-200",
  },
  // 4. Royal Velvet / Purple Amethyst
  {
    gradient: "bg-gradient-to-tr from-[#1a0826] via-[#311145] to-[#581c87]",
    glow: "bg-purple-500/25",
    chipGradient: "from-purple-200 via-pink-300 to-purple-500",
    accentText: "text-purple-300",
    border: "border-purple-500/30",
    tagBg: "bg-purple-500/20 text-purple-200",
  },
  // 5. Crimson Ruby / Burgundy Wine
  {
    gradient: "bg-gradient-to-tr from-[#24060d] via-[#430f1b] to-[#7f1d32]",
    glow: "bg-rose-500/25",
    chipGradient: "from-rose-200 via-amber-300 to-rose-500",
    accentText: "text-rose-300",
    border: "border-rose-500/30",
    tagBg: "bg-rose-500/20 text-rose-200",
  },
  // 6. Cyber Teal / Deep Ocean Aqua
  {
    gradient: "bg-gradient-to-tr from-[#031a20] via-[#07323e] to-[#0e5c70]",
    glow: "bg-cyan-500/25",
    chipGradient: "from-cyan-200 via-teal-300 to-cyan-500",
    accentText: "text-cyan-300",
    border: "border-cyan-500/30",
    tagBg: "bg-cyan-500/20 text-cyan-200",
  },
  // 7. Copper Bronze / Terracotta
  {
    gradient: "bg-gradient-to-tr from-[#200f07] via-[#3d1c0e] to-[#6c3016]",
    glow: "bg-orange-600/25",
    chipGradient: "from-amber-200 via-orange-300 to-amber-600",
    accentText: "text-orange-300",
    border: "border-orange-500/30",
    tagBg: "bg-orange-500/20 text-orange-200",
  },
  // 8. Titanium Carbon / Deep Slate
  {
    gradient: "bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155]",
    glow: "bg-slate-400/20",
    chipGradient: "from-slate-200 via-zinc-300 to-slate-400",
    accentText: "text-[#FFA500]",
    border: "border-slate-500/30",
    tagBg: "bg-slate-500/20 text-slate-200",
  },
];

export function getBankCardTheme(
  bank: OwnerBankItem,
  index: number = 0
): BankCardTheme {
  const namedMap: Record<string, number> = {
    amber: 1,
    blue: 0,
    emerald: 2,
    purple: 3,
    rose: 4,
    cyan: 5,
    copper: 6,
    slate: 7,
  };

  if (bank.colorTheme && namedMap[bank.colorTheme] !== undefined) {
    return BANK_CARD_THEMES[namedMap[bank.colorTheme]];
  }

  let hash = index;
  const str = bank.id || bank.accountNumber || bank.bankName || "";
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return BANK_CARD_THEMES[Math.abs(hash) % BANK_CARD_THEMES.length];
}

interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

const OWNER_BANK_COLUMNS: ColumnDef[] = [
  { id: "ownerName", label: "Fleet Owner & Tankers", required: true },
  { id: "bankDetails", label: "Bank & Account No." },
  { id: "ifscCode", label: "IFSC & Branch" },
  { id: "monthlySettlement", label: "July Settlement Due" },
  { id: "verificationStatus", label: "KYC & Verification" },
  { id: "actions", label: "Actions" },
];

export default function BankTable() {
  const {
    data,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    stats,
    viewMode,
    setViewMode,
    params,
    setSearch,
    setOwnerFilter,
    setBankNameFilter,
    setVerificationFilter,
    setPayoutStatusFilter,
    resetFilters,
    handleSort,
    setPage,
    setPageSize,
    handlePageSizeChange,
    addBank,
    editBank,
    deleteBank,
    verifyAccount,
    refresh,
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    isExportModalOpen,
    selectedBank,
    openAddModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    openExportModal,
    closeModals,
    availableExportColumns,
    handleExport,
  } = useBankData({ initialPageSize: 8 });

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    ownerName: true,
    bankDetails: true,
    ifscCode: true,
    monthlySettlement: true,
    verificationStatus: true,
    actions: true,
  });

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const columnMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(event.target as Node)
      ) {
        setShowColumnMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyAcc = (accNumber: string, id: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedId(id);
    showToast(`Copied account number to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSortIcon = (field: BankSortField) => {
    if (params.sortBy !== field) {
      return <ArrowUpDown size={12} className="opacity-40" />;
    }
    return params.sortOrder === "asc" ? (
      <ArrowUp size={12} className="text-[#FFA500]" />
    ) : (
      <ArrowDown size={12} className="text-[#FFA500]" />
    );
  };

  const activeFiltersCount =
    (params.owner && params.owner !== "ALL" ? 1 : 0) +
    (params.bankName && params.bankName !== "ALL" ? 1 : 0) +
    (params.verificationStatus && params.verificationStatus !== "ALL" ? 1 : 0) +
    (params.payoutStatus && params.payoutStatus !== "ALL" ? 1 : 0);

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-[#071522] text-emerald-400 px-4 py-3 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. METRICS / SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total July Settlement Due */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-lg transition hover:border-[#FFA500]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              July 2025 Settlement Total
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/15 text-[#FFA500]">
              <Wallet size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground tracking-tight">
              {stats.totalMonthlySettlementDisplay}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Bank NEFT/RTGS Transfer</span>
            </div>
          </div>
        </div>

        {/* Card 2: Registered Fleet Owners */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-lg transition hover:border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Registered Fleet Owners
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground tracking-tight">
              {stats.totalOwnersCount}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                Owners ({stats.totalTankersLinked} Tankers)
              </span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              100% Direct Payout Linked
            </div>
          </div>
        </div>

        {/* Card 3: Penny Drop Verified */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-lg transition hover:border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Penny Drop & KYC Verified
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400">
              {stats.verifiedOwnersCount}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {stats.totalOwnersCount} Verified
              </span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {stats.pendingPayoutsCount} Awaiting Penny Drop Check
            </div>
          </div>
        </div>

        {/* Card 4: Disbursed YTD */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-lg transition hover:border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Disbursed (YTD)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground tracking-tight">
              {stats.totalDisbursedYTDDisplay}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Direct Corporate Gateway Settlements
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN TABLE / GRID CONTAINER ================= */}
      <div className="rounded-3xl border border-border bg-card text-card-foreground p-4 sm:p-6 shadow-xl transition">
        {/* Header: Title & Action Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug">
              Owner Bank Accounts & Payment Settlements
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transporter banking details, penny drop verification & monthly payout dispatches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher (Table ⇄ Grid) */}
            <div className="flex items-center rounded-xl border border-border bg-background p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#FFA500] text-[#071522] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <TableIcon size={14} />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#FFA500] text-[#071522] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Column Selection Dropdown */}
            {viewMode === "table" && (
              <div className="relative" ref={columnMenuRef}>
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <Columns3 size={13} />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>

                {showColumnMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-border bg-card p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground border-b border-border mb-1">
                      Toggle Columns
                    </div>
                    {OWNER_BANK_COLUMNS.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => toggleColumn(col.id)}
                        disabled={col.required}
                        className={`flex w-full items-center justify-between px-2 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          visibleColumns[col.id]
                            ? "text-foreground hover:bg-muted"
                            : "text-muted-foreground hover:bg-muted"
                        } ${col.required ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <span>{col.label}</span>
                        {visibleColumns[col.id] && (
                          <Check size={13} className="text-[#FFA500]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={openExportModal}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            {/* + Add Owner Bank CTA */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 h-9 rounded-xl bg-[#FFA500] px-3.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Add Owner Bank</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Drawer Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search owner name, phone, tanker, bank, IFSC, PAN..."
              value={params.search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFA500] transition"
            />
            {params.search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-1.5 h-9 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                activeFiltersCount > 0
                  ? "border-[#FFA500]/50 bg-[#FFA500]/10 text-[#FFA500]"
                  : showFiltersPanel
                  ? "border-foreground bg-muted text-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={refresh}
              className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full aspect-square border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin text-[#FFA500]" : ""}
              />
            </button>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {showFiltersPanel && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-4 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <SlidersHorizontal size={13} className="text-[#FFA500]" />
                <span>Filter Fleet Owner Settlements</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#FFA500] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Fleet Owner Filter */}
              <AutocompleteFilter
                label="Fleet Owner"
                value={params.owner || "ALL"}
                onChange={(val) => setOwnerFilter(val)}
                options={FLEET_OWNER_FILTER_OPTIONS}
                allOptionLabel="All Fleet Owners"
                placeholder="Search fleet owner..."
                icon={<User size={13} />}
              />

              {/* KYC Verification Status */}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  KYC Verification Status
                </label>
                <select
                  value={params.verificationStatus || "ALL"}
                  onChange={(e) =>
                    setVerificationFilter(
                      e.target.value as OwnerVerificationStatus | "ALL"
                    )
                  }
                  className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="ALL">All KYC Statuses</option>
                  <option value="Verified">Verified (Penny Drop Passed)</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Payout Status */}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Payout Status
                </label>
                <select
                  value={params.payoutStatus || "ALL"}
                  onChange={(e) =>
                    setPayoutStatusFilter(
                      e.target.value as OwnerPayoutStatus | "ALL"
                    )
                  }
                  className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="ALL">All Payout Statuses</option>
                  <option value="Ready for Payout">Ready for Payout</option>
                  <option value="On Hold (KYC Pending)">On Hold</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Reset Action */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-8.5 w-full rounded-lg border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3A. TABLE VIEW ================= */}
        {viewMode === "table" && (
          <div className="overflow-x-auto relative min-h-[260px] custom-scrollbar">
            {loading && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Loading transporter accounts...</span>
                </div>
              </div>
            )}

            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium text-muted-foreground">
                  {/* Owner & Tankers */}
                  {visibleColumns.ownerName && (
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition select-none"
                      onClick={() => handleSort("ownerName")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Fleet Owner & Linked Tankers</span>
                        {getSortIcon("ownerName")}
                      </div>
                    </th>
                  )}

                  {/* Bank & Account */}
                  {visibleColumns.bankDetails && (
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition select-none"
                      onClick={() => handleSort("bankName")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Bank & Account No.</span>
                        {getSortIcon("bankName")}
                      </div>
                    </th>
                  )}

                  {/* IFSC & Branch */}
                  {visibleColumns.ifscCode && (
                    <th className="py-3 px-3">
                      <span>IFSC & Branch</span>
                    </th>
                  )}

                  {/* July Settlement Due */}
                  {visibleColumns.monthlySettlement && (
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition select-none"
                      onClick={() => handleSort("monthlySettlementAmt")}
                    >
                      <div className="flex items-center gap-1">
                        <span>July Settlement Due</span>
                        {getSortIcon("monthlySettlementAmt")}
                      </div>
                    </th>
                  )}

                  {/* KYC & Status */}
                  {visibleColumns.verificationStatus && (
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition select-none"
                      onClick={() => handleSort("verificationStatus")}
                    >
                      <div className="flex items-center gap-1">
                        <span>KYC & Verification</span>
                        {getSortIcon("verificationStatus")}
                      </div>
                    </th>
                  )}

                  {/* Actions */}
                  {visibleColumns.actions && (
                    <th className="py-3 px-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <User size={24} className="text-muted-foreground/50" />
                        <span className="font-semibold text-sm">
                          No fleet owner bank accounts found
                        </span>
                        <p className="text-xs">
                          Try adjusting search terms or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((bank) => (
                    <tr
                      key={bank.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Owner & Tankers */}
                      {visibleColumns.ownerName && (
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFA500]/15 text-[#FFA500] font-bold text-xs">
                              {(bank.ownerName || "FL").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                <span>{bank.ownerName || "Transporter"}</span>
                                <span className="text-[10px] font-mono text-muted-foreground font-normal">
                                  ({bank.ownerPhone || "N/A"})
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                {(bank.assignedTankers || []).map((t) => (
                                  <span
                                    key={t}
                                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Bank Details */}
                      {visibleColumns.bankDetails && (
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">
                            {bank.bankName}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-mono font-semibold">
                              {bank.maskedAccountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyAcc(bank.accountNumber, bank.id)
                              }
                              className="text-muted-foreground hover:text-[#FFA500] transition"
                              title="Copy Full Account Number"
                            >
                              {copiedId === bank.id ? (
                                <Check size={12} className="text-emerald-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* IFSC & Branch */}
                      {visibleColumns.ifscCode && (
                        <td className="py-3 px-3">
                          <div className="font-mono text-xs font-bold text-foreground">
                            {bank.ifscCode}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {bank.branchName}, {bank.city}
                          </div>
                        </td>
                      )}

                      {/* July Settlement Amount */}
                      {visibleColumns.monthlySettlement && (
                        <td className="py-3 px-3">
                          <div className="font-black text-sm text-[#FFA500]">
                            {bank.monthlySettlementDisplay}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            YTD: {bank.totalSettledYTDDisplay}
                          </div>
                        </td>
                      )}

                      {/* Verification Status */}
                      {visibleColumns.verificationStatus && (
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              bank.verificationStatus === "Verified"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                bank.verificationStatus === "Verified"
                                  ? "bg-emerald-400"
                                  : "bg-amber-400 animate-pulse"
                              }`}
                            />
                            <span>{bank.verificationStatus}</span>
                          </span>
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.actions && (
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openViewModal(bank)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                              title="View Settlement Details & Virtual Card"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openEditModal(bank)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
                              title="Edit Bank Details"
                            >
                              <Edit size={14} />
                            </button>
                            {bank.verificationStatus !== "Verified" && (
                              <button
                                onClick={() => {
                                  verifyAccount(bank.id);
                                  showToast(
                                    `Penny drop verification passed for ${bank.ownerName}`
                                  );
                                }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-emerald-400 transition cursor-pointer"
                                title="Run Penny Drop Check"
                              >
                                <ShieldCheck size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => openDeleteModal(bank)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                              title="Delete Bank Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= 3B. CARD GRID VIEW ================= */}
        {viewMode === "grid" && (
          <div className="relative min-h-[260px]">
            {loading && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-3xl">
                <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-xs font-medium text-[#FFA500] shadow-xl">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Loading transporter accounts...</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
              {data.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <User size={28} className="mx-auto mb-2 opacity-50" />
                <div className="font-bold text-sm">
                  No fleet owner accounts found
                </div>
              </div>
            ) : (
              data.map((bank, index) => {
                const theme = getBankCardTheme(bank, index);

                return (
                  <div
                    key={bank.id}
                    className="relative overflow-hidden rounded-3xl border border-border bg-card hover:border-[#FFA500]/40 transition-all duration-200 shadow-xl flex flex-col justify-between"
                  >
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FFA500] to-[#FF8C00] text-[#071522] font-black text-sm shadow-md shadow-orange-500/20">
                            {(bank.ownerName || "FL").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-base text-foreground tracking-tight">
                              {bank.ownerName || "Fleet Owner"}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {bank.ownerPhone || "N/A"}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            bank.verificationStatus === "Verified"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <span>{bank.verificationStatus}</span>
                        </span>
                      </div>

                      {/* Linked Tanker Tags */}
                      <div className="flex flex-wrap items-center gap-1 mt-3">
                        <span className="text-[10px] text-muted-foreground font-semibold mr-1">
                          Tankers:
                        </span>
                        {(bank.assignedTankers || []).map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-foreground border border-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Visual Card Simulation Box with Distinct Theme Colors */}
                      <div
                        className={`mt-4 p-4 rounded-2xl ${theme.gradient} text-white shadow-xl border ${theme.border} relative overflow-hidden space-y-3 transition-all duration-300 hover:shadow-2xl`}
                      >
                        {/* Ambient Card Glow */}
                        <div
                          className={`absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full ${theme.glow} blur-xl pointer-events-none`}
                        />

                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[11px] font-black tracking-wider uppercase ${theme.accentText}`}
                            >
                              {bank.bankName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Radio size={14} className="text-white/70" />
                            </div>
                          </div>

                          {/* EMV Chip & Account Number */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-5 w-7 rounded-sm bg-gradient-to-tr ${theme.chipGradient} shadow-inner flex items-center justify-center border border-white/20`}
                              >
                                <div className="w-5 h-3 border border-black/30 rounded-2xs" />
                              </div>
                              <div className="font-mono text-sm tracking-widest font-bold text-white/95">
                                {bank.maskedAccountNumber}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopyAcc(bank.accountNumber, bank.id)
                              }
                              className="text-white/60 hover:text-white transition cursor-pointer p-1 rounded hover:bg-white/10"
                              title="Copy Account Number"
                            >
                              {copiedId === bank.id ? (
                                <Check size={13} className="text-emerald-400" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>

                          <div className="flex items-end justify-between pt-2 border-t border-white/15 text-[10px]">
                            <div>
                              <div className="text-white/60 uppercase text-[8px] tracking-wider font-semibold">
                                Beneficiary Entity
                              </div>
                              <div className="font-bold truncate max-w-[140px] text-white/90">
                                {bank.accountHolder}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white/60 uppercase text-[8px] tracking-wider font-semibold">
                                IFSC
                              </div>
                              <div className="font-mono font-bold text-white/90">
                                {bank.ifscCode}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* Financial Settlement Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-t border-border/60 mt-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          July Settlement Due
                        </span>
                        <span className="font-bold text-base font-mono text-[#FFA500]">
                          {bank.monthlySettlementDisplay || "₹0"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          Total Settled (YTD)
                        </span>
                        <span className="font-bold text-base font-mono text-emerald-400">
                          {bank.totalSettledYTDDisplay || "₹0"}
                        </span>
                      </div>
                    </div>
                  </div>

                    {/* Card Footer: Status & Actions */}
                    <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between text-xs">
                      {/* Payout Status */}
                      <div>
                        {bank.payoutStatus === "Ready for Payout" ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Ready for Payout
                          </span>
                        ) : bank.payoutStatus === "On Hold (KYC Pending)" ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-400 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                            On Hold
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-400 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                            Blocked
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <button
                          onClick={() => openViewModal(bank)}
                          className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(bank)}
                          className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition cursor-pointer"
                          title="Edit Bank Details"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(bank)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                          title="Delete Bank Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        )}

        {/* ================= 4. PAGINATION FOOTER ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-foreground">{startEntry}</strong>{" "}
              to <strong className="text-foreground">{endEntry}</strong> of{" "}
              <strong className="text-foreground">{total}</strong> fleet owners
            </span>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-2 py-1 text-foreground outline-none cursor-pointer"
            >
              <option value={6}>6 per page</option>
              <option value={8}>8 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full aspect-square border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full aspect-square text-xs font-bold transition cursor-pointer ${
                  p === page
                    ? "bg-[#FFA500] text-[#071522] shadow-sm shadow-orange-500/20"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full aspect-square border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 5. MODALS ================= */}
      <AddBankModal
        isOpen={isAddModalOpen}
        onClose={closeModals}
        onSubmit={addBank}
      />

      <EditBankModal
        isOpen={isEditModalOpen}
        bank={selectedBank}
        onClose={closeModals}
        onSubmit={editBank}
      />

      <ViewBankModal
        isOpen={isViewModalOpen}
        bank={selectedBank}
        onClose={closeModals}
        onEdit={openEditModal}
      />

      <DeleteBankModal
        isOpen={isDeleteModalOpen}
        bank={selectedBank}
        onClose={closeModals}
        onConfirm={deleteBank}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeModals}
        title="Export Fleet Owner Settlement Accounts"
        defaultFilename="fluidlogix-owner-settlement-banks"
        availableColumns={availableExportColumns}
        totalRecordsCount={stats.totalOwnersCount}
        currentPageCount={data.length}
        filteredCount={total}
        onExport={handleExport}
      />
    </div>
  );
}

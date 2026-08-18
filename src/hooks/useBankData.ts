"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createOwnerBank,
  deleteOwnerBank,
  getBankStats,
  getOwnerBanks,
  updateOwnerBank,
  verifyPennyDrop,
} from "@/services/bankService";
import {
  BankFilterParams,
  BankSortField,
  BankStats,
  OwnerBankFormData,
  OwnerBankItem,
  OwnerPayoutStatus,
  OwnerVerificationStatus,
} from "@/types/bank";
import {
  ExportColumn,
  exportToCSV,
  exportToJSON,
  exportToPDF,
} from "@/utils/exportUtils";

const ownerBankExportColumns: ExportColumn<OwnerBankItem>[] = [
  { header: "Account ID", key: "id" },
  { header: "Fleet Owner", key: "ownerName" },
  { header: "Phone Number", key: "ownerPhone" },
  { header: "PAN Number", key: "panNumber" },
  {
    header: "Assigned Tankers",
    formatter: (b) => b.assignedTankers.join(", ") || "None",
  },
  { header: "Bank Name", key: "bankName" },
  { header: "Account Holder", key: "accountHolder" },
  { header: "Account Number", key: "accountNumber" },
  { header: "Account Type", key: "accountType" },
  { header: "IFSC Code", key: "ifscCode" },
  { header: "Branch Name", key: "branchName" },
  { header: "City", key: "city" },
  {
    header: "July Settlement Due",
    formatter: (b) => b.monthlySettlementDisplay,
  },
  {
    header: "Total Settled YTD",
    formatter: (b) => b.totalSettledYTDDisplay,
  },
  { header: "KYC Verification", key: "verificationStatus" },
  { header: "Payout Status", key: "payoutStatus" },
  {
    header: "Penny Drop Verified",
    formatter: (b) => (b.pennyDropPassed ? "Passed" : "Pending"),
  },
  {
    header: "194C TDS Declaration",
    formatter: (b) => (b.tdsDeclarationSubmitted ? "Filed" : "Not Filed"),
  },
];

export const availableOwnerBankExportColumns = ownerBankExportColumns.map(
  (col) => ({
    id: col.header,
    label: col.header,
  })
);

interface UseBankDataOptions {
  initialPageSize?: number;
  initialViewMode?: "table" | "grid";
}

export function useBankData(options: UseBankDataOptions = {}) {
  const [viewMode, setViewMode] = useState<"table" | "grid">(
    options.initialViewMode || "table"
  );
  const [data, setData] = useState<OwnerBankItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.initialPageSize || 8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BankStats>(getBankStats());

  // Filter Params
  const [params, setParams] = useState<BankFilterParams>({
    search: "",
    owner: "ALL",
    bankName: "ALL",
    verificationStatus: "ALL",
    payoutStatus: "ALL",
    accountType: "ALL",
    sortBy: "monthlySettlementAmt",
    sortOrder: "desc",
    page: 1,
    pageSize: options.initialPageSize || 8,
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<OwnerBankItem | null>(null);

  // Fetch Data
  const fetchData = useCallback(() => {
    setLoading(true);
    try {
      const res = getOwnerBanks({
        ...params,
        page,
        pageSize,
      });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setStats(getBankStats());
    } catch (err) {
      console.error("Error fetching owner banks:", err);
    } finally {
      setLoading(false);
    }
  }, [params, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search & Filter Handlers
  const setSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
    setPage(1);
  };

  const setOwnerFilter = (owner: string) => {
    setParams((prev) => ({ ...prev, owner, page: 1 }));
    setPage(1);
  };

  const setBankNameFilter = (bankName: string) => {
    setParams((prev) => ({ ...prev, bankName, page: 1 }));
    setPage(1);
  };

  const setVerificationFilter = (
    verificationStatus: OwnerVerificationStatus | "ALL"
  ) => {
    setParams((prev) => ({ ...prev, verificationStatus, page: 1 }));
    setPage(1);
  };

  const setPayoutStatusFilter = (payoutStatus: OwnerPayoutStatus | "ALL") => {
    setParams((prev) => ({ ...prev, payoutStatus, page: 1 }));
    setPage(1);
  };

  const resetFilters = () => {
    setParams({
      search: "",
      owner: "ALL",
      bankName: "ALL",
      verificationStatus: "ALL",
      payoutStatus: "ALL",
      accountType: "ALL",
      sortBy: "monthlySettlementAmt",
      sortOrder: "desc",
      page: 1,
      pageSize,
    });
    setPage(1);
  };

  const handleSort = (field: BankSortField) => {
    setParams((prev) => {
      const isSameField = prev.sortBy === field;
      const nextOrder =
        isSameField && prev.sortOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        sortBy: field,
        sortOrder: nextOrder,
        page: 1,
      };
    });
    setPage(1);
  };

  // CRUD Handlers
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setParams((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
    setPage(1);
  };

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 600);
  }, [fetchData]);

  const addBank = async (formData: OwnerBankFormData) => {
    createOwnerBank(formData);
    fetchData();
    setIsAddModalOpen(false);
  };

  const editBank = async (id: string, formData: Partial<OwnerBankFormData>) => {
    updateOwnerBank(id, formData);
    fetchData();
    setIsEditModalOpen(false);
    setSelectedBank(null);
  };

  const deleteBank = async (id: string): Promise<boolean> => {
    const result = deleteOwnerBank(id);
    fetchData();
    setIsDeleteModalOpen(false);
    setSelectedBank(null);
    return result;
  };

  const verifyAccount = async (id: string) => {
    verifyPennyDrop(id);
    fetchData();
  };

  // Modal Openers
  const openAddModal = () => setIsAddModalOpen(true);
  const openEditModal = (bank: OwnerBankItem) => {
    setSelectedBank(bank);
    setIsEditModalOpen(true);
  };
  const openViewModal = (bank: OwnerBankItem) => {
    setSelectedBank(bank);
    setIsViewModalOpen(true);
  };
  const openDeleteModal = (bank: OwnerBankItem) => {
    setSelectedBank(bank);
    setIsDeleteModalOpen(true);
  };
  const openExportModal = () => setIsExportModalOpen(true);

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsExportModalOpen(false);
    setSelectedBank(null);
  };

  // Export handler
  const availableExportColumns = availableOwnerBankExportColumns;

  const handleExport = async ({
    format,
    scope,
    selectedColumns,
    filename,
  }: {
    format: "pdf" | "csv" | "json";
    scope: "all" | "current_page" | "filtered";
    selectedColumns: string[];
    filename?: string;
  }) => {
    let exportData: OwnerBankItem[] = [];

    if (scope === "current_page") {
      exportData = [...data];
    } else if (scope === "filtered") {
      exportData = getOwnerBanks({ ...params, page: 1, pageSize: 999 }).data;
    } else {
      exportData = getOwnerBanks({ page: 1, pageSize: 999 }).data;
    }

    const activeColumns = ownerBankExportColumns.filter((col) =>
      selectedColumns.includes(col.header)
    );

    const targetFilename = filename || `fluidlogix-owner-banks-${scope}`;

    if (format === "csv") {
      exportToCSV<OwnerBankItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "json") {
      exportToJSON<OwnerBankItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "pdf") {
      exportToPDF<OwnerBankItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
        title: "Fleet Owner Settlement Bank Accounts Statement",
        subtitle: `FluidLogix Transport Disbursements • Scope: ${
          scope === "all"
            ? "All Transporters"
            : scope === "current_page"
            ? `Page ${page}`
            : "Filtered Records"
        }`,
        summaryStats: [
          { label: "Transporter Accounts", value: exportData.length },
          {
            label: "July Settlement Due",
            value:
              "₹" +
              exportData
                .reduce((s, b) => s + b.monthlySettlementAmt, 0)
                .toLocaleString("en-IN"),
          },
          {
            label: "Verified Accounts",
            value: exportData.filter((b) => b.verificationStatus === "Verified")
              .length,
          },
        ],
        orientation: "landscape",
      });
    }
  };

  return {
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
  };
}

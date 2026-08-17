"use client";

import { useMemo, useState } from "react";
import { initialBillingData } from "@/data/billing-data";
import {
  calculateBillingStats,
  filterAndSortBilling,
  formatCurrency,
} from "@/services/billingService";
import {
  BillingFilterParams,
  BillingSortField,
  BillingStatus,
  MonthlyBillingItem,
  PaymentFormData,
} from "@/types/billing";
import {
  ExportColumn,
  exportToCSV,
  exportToJSON,
  exportToPDF,
} from "@/utils/exportUtils";

export const billingExportColumns: ExportColumn<MonthlyBillingItem>[] = [
  { header: "Invoice No", key: "invoiceNo" },
  { header: "Vehicle", key: "vehicle" },
  { header: "Plate No.", key: "plateNo" },
  { header: "Owner", key: "owner" },
  { header: "Month", key: "month" },
  { header: "Total Trips", key: "trips" },
  { header: "Total Weight", key: "totalWeightDisplay" },
  { header: "Local Trips", key: "localTrips" },
  { header: "Non-Local Trips", key: "nonLocalTrips" },
  { header: "Local Amount", key: "localAmtDisplay" },
  { header: "Non-Local Amount", key: "nonLocalAmtDisplay" },
  { header: "Total Payable", key: "totalDisplay" },
  { header: "Status", key: "status" },
  { header: "Generated Date", key: "generatedDate" },
  { header: "Due Date", key: "dueDate" },
  { header: "Paid Date", formatter: (b) => b.paidDate || "Unpaid" },
  { header: "Txn Ref", formatter: (b) => b.transactionRef || "N/A" },
];

export function useBillingData(initialPageSize = 10) {
  const [bills, setBills] = useState<MonthlyBillingItem[]>(initialBillingData);

  // Filter params
  const [params, setParams] = useState<BillingFilterParams>({
    search: "",
    month: "July 2025",
    status: "ALL",
    owner: "ALL",
    vehicle: "ALL",
    sortBy: "vehicle",
    sortOrder: "asc",
    page: 1,
    pageSize: initialPageSize,
  });

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [activeBill, setActiveBill] = useState<MonthlyBillingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Processed Data
  const {
    data: filteredBills,
    total,
    totalPages,
    page,
    pageSize,
    stats,
  } = useMemo(() => {
    return filterAndSortBilling(bills, params);
  }, [bills, params]);

  // Overall Global Stats across all records in current month
  const monthStats = useMemo(() => {
    const monthBills = bills.filter((b) =>
      params.month && params.month !== "ALL"
        ? b.month.toLowerCase() === params.month.toLowerCase()
        : true
    );
    return calculateBillingStats(monthBills);
  }, [bills, params.month]);

  // Selected bills objects & stats
  const selectedBills = useMemo(() => {
    return bills.filter((b) => selectedIds.includes(b.id));
  }, [bills, selectedIds]);

  const selectedTotalPayable = useMemo(() => {
    return selectedBills.reduce((acc, b) => acc + (b.total || 0), 0);
  }, [selectedBills]);

  const selectedTotalPayableDisplay = useMemo(() => {
    return formatCurrency(selectedTotalPayable);
  }, [selectedTotalPayable]);

  const isAllSelected =
    filteredBills.length > 0 &&
    filteredBills.every((b) => selectedIds.includes(b.id));

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBills.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Actions
  const handleSearch = (q: string) => {
    setParams((prev) => ({ ...prev, search: q, page: 1 }));
  };

  const setMonthFilter = (m: string) => {
    setParams((prev) => ({ ...prev, month: m, page: 1 }));
    setSelectedIds([]);
  };

  const setStatusFilter = (st: BillingStatus | "ALL") => {
    setParams((prev) => ({ ...prev, status: st, page: 1 }));
  };

  const handleSort = (field: BillingSortField) => {
    setParams((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sortBy: field, sortOrder: "asc" };
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (size: number) => {
    setParams((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  const resetFilters = () => {
    setParams({
      search: "",
      month: "July 2025",
      status: "ALL",
      owner: "ALL",
      vehicle: "ALL",
      sortBy: "vehicle",
      sortOrder: "asc",
      page: 1,
      pageSize: params.pageSize || initialPageSize,
    });
    setSelectedIds([]);
    showToast("Filters reset to July 2025 default view");
  };

  // Pay Single Bill Action
  const handlePayBill = async (formData: PaymentFormData) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === formData.billingId) {
          const updated = {
            ...b,
            status: "Paid" as BillingStatus,
            paidDate:
              formData.paidDate ||
              new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            paymentMethod: formData.paymentMethod,
            transactionRef: formData.transactionRef,
            notes: formData.notes || b.notes,
          };
          if (activeBill && activeBill.id === b.id) {
            setActiveBill(updated);
          }
          return updated;
        }
        return b;
      })
    );
    showToast(
      `Payment of ₹${formData.amount.toLocaleString("en-IN")} recorded for ${
        activeBill?.vehicle || "Vehicle"
      }!`
    );
  };

  // Bulk Mark as Paid Action
  const handleBulkPay = () => {
    const count = selectedIds.length;
    const nowStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setBills((prev) =>
      prev.map((b) => {
        if (selectedIds.includes(b.id)) {
          return {
            ...b,
            status: "Paid" as BillingStatus,
            paidDate: nowStr,
            paymentMethod: "NEFT / Batch Gateway",
            transactionRef: `BATCH-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          };
        }
        return b;
      })
    );

    showToast(`Marked ${count} selected truck bills as Paid!`);
    setSelectedIds([]);
  };

  // Generate Bills for selected or all
  const handleGenerateBills = async ({
    monthName,
    targetIds,
  }: {
    monthName: string;
    targetIds?: string[];
  }) => {
    const targetCount = targetIds && targetIds.length > 0 ? targetIds.length : total;
    const nowStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setBills((prev) =>
      prev.map((b) => {
        const matchesTarget =
          !targetIds || targetIds.length === 0 || targetIds.includes(b.id);
        const matchesMonth =
          !monthName || monthName === "ALL" || b.month === monthName;

        if (matchesTarget && matchesMonth) {
          return {
            ...b,
            status: (b.status === "Paid" ? "Paid" : "Generated") as BillingStatus,
            generatedDate: nowStr,
          };
        }
        return b;
      })
    );

    showToast(`Bills generated for ${targetCount} truck(s) in ${monthName}!`);
    setSelectedIds([]);
  };

  // Export
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
    let exportData: MonthlyBillingItem[] = [];

    if (selectedIds.length > 0 && scope === "filtered") {
      exportData = selectedBills;
    } else if (scope === "current_page") {
      exportData = [...filteredBills];
    } else if (scope === "filtered") {
      exportData = filterAndSortBilling(bills, {
        ...params,
        page: 1,
        pageSize: 10000,
      }).data;
    } else {
      // "all"
      exportData = bills;
    }

    const activeColumns = billingExportColumns.filter((col) =>
      selectedColumns.includes(String(col.key || col.header))
    );

    const safeColumns =
      activeColumns.length > 0 ? activeColumns : billingExportColumns;

    const baseName =
      filename ||
      `FluidLogix_Monthly_Billing_${params.month?.replace(" ", "_") || "All"}_${
        new Date().toISOString().split("T")[0]
      }`;

    if (format === "csv") {
      exportToCSV({
        filename: baseName,
        data: exportData,
        columns: safeColumns,
      });
      showToast(`Exported ${exportData.length} records as CSV`);
    } else if (format === "json") {
      exportToJSON({
        filename: baseName,
        data: exportData,
        columns: safeColumns,
      });
      showToast(`Exported ${exportData.length} records as JSON`);
    } else if (format === "pdf") {
      const totalAmt = exportData.reduce((acc, c) => acc + (c.total || 0), 0);
      const paidCount = exportData.filter((d) => d.status === "Paid").length;

      exportToPDF({
        filename: baseName,
        data: exportData,
        columns: safeColumns,
        title: "FluidLogix - Monthly Transport Billing Summary",
        subtitle: `Period: ${params.month || "All Months"} | ${
          exportData.length
        } Tanker Accounts`,
        summaryStats: [
          { label: "Total Payable", value: formatCurrency(totalAmt) },
          { label: "Bills Paid", value: `${paidCount} / ${exportData.length}` },
          {
            label: "Total Trips",
            value: exportData.reduce((acc, c) => acc + (c.trips || 0), 0),
          },
          {
            label: "Total Weight",
            value: `${(
              exportData.reduce((acc, c) => acc + (c.totalWeightKg || 0), 0) /
              1000
            ).toFixed(1)} Tons`,
          },
        ],
      });
      showToast(
        `Exported PDF Billing Report with ${exportData.length} accounts`
      );
    }
  };

  const availableExportColumns = billingExportColumns.map((col) => ({
    id: String(col.key || col.header),
    label: col.header,
  }));

  return {
    bills,
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
  };
}

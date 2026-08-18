"use client";

import { useMemo, useState } from "react";
import { initialLoadLogsData } from "@/data/load-logs-data";
import {
  filterAndSortLoadLogs,
  formatWeight,
  getLoadLogStats,
} from "@/services/loadLogsService";
import {
  LoadLogFilterParams,
  LoadLogFormData,
  LoadLogItem,
  LoadLogSortField,
  LoadStatus,
  MaterialCategory,
  TripType,
} from "@/types/loadLog";
import {
  ExportColumn,
  exportToCSV,
  exportToJSON,
  exportToPDF,
} from "@/utils/exportUtils";

export const loadLogExportColumns: ExportColumn<LoadLogItem>[] = [
  { header: "Log ID", key: "id" },
  { header: "Date", key: "date" },
  { header: "Vehicle", key: "vehicle" },
  { header: "Driver", key: "driver" },
  { header: "Company", key: "company" },
  { header: "Material", key: "material" },
  { header: "Category", key: "category" },
  { header: "Weight", key: "weightDisplay" },
  { header: "Origin (From)", key: "from" },
  { header: "Destination (To)", key: "to" },
  { header: "Trip Type", key: "type" },
  { header: "Load Time", key: "loadTime" },
  { header: "Unload Time", key: "unloadTime" },
  { header: "Status", key: "status" },
  {
    header: "Billing Amount",
    formatter: (l) => (l.amount ? `₹${l.amount.toLocaleString("en-IN")}` : "₹0"),
  },
  { header: "Seal No", formatter: (l) => l.sealNo || "N/A" },
  { header: "Hazard Class", formatter: (l) => l.hazardClass || "Non-Hazardous" },
];

export function useLoadLogsData(initialPageSize = 10) {
  const [logs, setLogs] = useState<LoadLogItem[]>(initialLoadLogsData);

  // Filter params
  const [params, setParams] = useState<LoadLogFilterParams>({
    search: "",
    category: "ALL",
    status: "ALL",
    type: "ALL",
    vehicle: "ALL",
    company: "ALL",
    owner: "ALL",
    date: "",
    sortBy: "id",
    sortOrder: "asc",
    page: 1,
    pageSize: initialPageSize,
  });

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [activeLog, setActiveLog] = useState<LoadLogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Processed Data
  const {
    data: filteredLogs,
    total,
    totalPages,
    page,
    pageSize,
    stats,
  } = useMemo(() => {
    return filterAndSortLoadLogs(logs, params);
  }, [logs, params]);

  // Overall Global Stats across dataset
  const globalStats = useMemo(() => {
    return getLoadLogStats(logs);
  }, [logs]);

  // Actions
  const handleSearch = (q: string) => {
    setParams((prev) => ({ ...prev, search: q, page: 1 }));
  };

  const setCategoryFilter = (cat: MaterialCategory | "ALL") => {
    setParams((prev) => ({ ...prev, category: cat, page: 1 }));
  };

  const setStatusFilter = (st: LoadStatus | "ALL") => {
    setParams((prev) => ({ ...prev, status: st, page: 1 }));
  };

  const setTypeFilter = (t: TripType | "ALL") => {
    setParams((prev) => ({ ...prev, type: t, page: 1 }));
  };

  const setDateFilter = (date: string) => {
    setParams((prev) => ({ ...prev, date, page: 1 }));
  };

  const handleSort = (field: LoadLogSortField) => {
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
      category: "ALL",
      status: "ALL",
      type: "ALL",
      vehicle: "ALL",
      company: "ALL",
      owner: "ALL",
      date: "",
      sortBy: "id",
      sortOrder: "asc",
      page: 1,
      pageSize: params.pageSize || initialPageSize,
    });
    showToast("Filters reset to default view");
  };

  // Add Log
  const handleAddLog = async (formData: LoadLogFormData): Promise<LoadLogItem> => {
    const nextNum = logs.length + 1;
    const padded = String(nextNum).padStart(3, "0");
    const newId = `LOG-${padded}`;

    // Format date nicely
    const dateObj = new Date(formData.date || new Date().toISOString());
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    const newLog: LoadLogItem = {
      id: newId,
      date: formattedDate,
      dateRaw: formData.date,
      vehicle: formData.vehicle,
      driver: formData.driver,
      driverPhone: formData.driverPhone || "+91 98450 00000",
      company: formData.company,
      material: formData.material,
      category: formData.category,
      weightKg: Number(formData.weightKg),
      weightDisplay: formatWeight(Number(formData.weightKg)),
      from: formData.from,
      to: formData.to,
      route: `${formData.from} → ${formData.to}`,
      type: formData.type,
      loadTime: formData.loadTime,
      unloadTime: formData.unloadTime || (formData.status === "In Transit" ? "—" : "18:00"),
      status: formData.status,
      amount: formData.amount || 35000,
      sealNo: formData.sealNo || `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      hazardClass:
        formData.hazardClass ||
        (formData.category === "Hazardous"
          ? "Class 8 - Hazardous"
          : formData.category === "Chemical"
          ? "Class 8 - Corrosive"
          : "Non-Hazardous"),
      notes: formData.notes || "Standard dispatch logged.",
      createdAt: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast(`Load Log ${newId} created successfully!`);
    return newLog;
  };

  // Edit Log
  const handleEditLog = async (
    id: string,
    formData: LoadLogFormData
  ): Promise<LoadLogItem> => {
    let updatedLog: LoadLogItem | null = null;

    setLogs((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          const dateObj = new Date(formData.date || log.dateRaw || new Date().toISOString());
          const day = dateObj.getDate();
          const month = dateObj.toLocaleString("default", { month: "short" });
          const year = dateObj.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;

          updatedLog = {
            ...log,
            date: formattedDate,
            dateRaw: formData.date,
            vehicle: formData.vehicle,
            driver: formData.driver,
            driverPhone: formData.driverPhone || log.driverPhone,
            company: formData.company,
            material: formData.material,
            category: formData.category,
            weightKg: Number(formData.weightKg),
            weightDisplay: formatWeight(Number(formData.weightKg)),
            from: formData.from,
            to: formData.to,
            route: `${formData.from} → ${formData.to}`,
            type: formData.type,
            loadTime: formData.loadTime,
            unloadTime:
              formData.unloadTime || (formData.status === "In Transit" ? "—" : log.unloadTime),
            status: formData.status,
            amount: formData.amount !== undefined ? formData.amount : log.amount,
            sealNo: formData.sealNo || log.sealNo,
            hazardClass: formData.hazardClass || log.hazardClass,
            notes: formData.notes !== undefined ? formData.notes : log.notes,
          };
          return updatedLog;
        }
        return log;
      })
    );

    if (updatedLog) {
      setActiveLog(updatedLog);
      showToast(`Load Log ${id} updated successfully!`);
      return updatedLog;
    }
    throw new Error("Log not found");
  };

  // Delete Log
  const handleDeleteLog = async (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast(`Load Log ${id} deleted`);
  };

  // Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLogs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setLogs((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
    setSelectedIds([]);
    showToast(`Deleted ${count} load logs`);
  };

  // Bulk Status
  const handleBulkStatusChange = (newStatus: LoadStatus) => {
    setLogs((prev) =>
      prev.map((l) => (selectedIds.includes(l.id) ? { ...l, status: newStatus } : l))
    );
    showToast(`Updated ${selectedIds.length} logs to ${newStatus}`);
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
    let exportData: LoadLogItem[] = [];

    if (scope === "current_page") {
      exportData = [...filteredLogs];
    } else if (scope === "filtered") {
      exportData = filterAndSortLoadLogs(logs, {
        ...params,
        page: 1,
        pageSize: 10000,
      }).data;
    } else {
      // "all"
      exportData = logs;
    }

    const activeColumns = loadLogExportColumns.filter((col) =>
      selectedColumns.includes(String(col.key || col.header))
    );

    const safeColumns =
      activeColumns.length > 0 ? activeColumns : loadLogExportColumns;

    const baseName = filename || `FluidLogix_Load_Logs_${new Date().toISOString().split("T")[0]}`;

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
      exportToPDF({
        filename: baseName,
        data: exportData,
        columns: safeColumns,
        title: "FluidLogix - Daily Load Logs Report",
        subtitle: `Generated on ${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} | ${exportData.length} Total Dispatches`,
        summaryStats: [
          { label: "Total Dispatches", value: exportData.length },
          {
            label: "Completed",
            value: exportData.filter((d) => d.status === "Completed").length,
          },
          {
            label: "In Transit",
            value: exportData.filter((d) => d.status === "In Transit").length,
          },
          {
            label: "Total Weight",
            value: `${(
              exportData.reduce((acc, c) => acc + (c.weightKg || 0), 0) / 1000
            ).toFixed(1)} Tons`,
          },
        ],
      });
      showToast(`Exported PDF Report with ${exportData.length} records`);
    }
  };

  const availableExportColumns = loadLogExportColumns.map((col) => ({
    id: String(col.key || col.header),
    label: col.header,
  }));

  return {
    logs,
    filteredLogs,
    total,
    totalPages,
    page,
    pageSize,
    stats,
    globalStats,
    params,
    setParams,
    selectedIds,
    toastMessage,

    // Modal states
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
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
    handleAddLog,
    handleEditLog,
    handleDeleteLog,
    handleSelectAll,
    handleToggleSelect,
    handleBulkDelete,
    handleBulkStatusChange,
    handleExport,
    availableExportColumns,
    showToast,
  };
}

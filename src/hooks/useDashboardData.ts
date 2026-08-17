"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboardService";
import {
  DashboardStat,
  LoadLog,
  MaterialDistribution,
  PaginatedResult,
  RevenueTrendPoint,
  TableQueryParams,
} from "@/types/dashboard";
import { ExportColumn, exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

const loadLogExportColumns: ExportColumn<LoadLog>[] = [
  { header: "Log ID", key: "id" },
  { header: "Vehicle", key: "vehicle" },
  { header: "Driver", key: "driver" },
  { header: "Company", key: "company" },
  { header: "Material", key: "material" },
  { header: "Category", key: "category" },
  { header: "Weight", formatter: (l) => l.weightDisplay || `${l.weightKg} kg` },
  { header: "Route", key: "route" },
  { header: "Type", key: "type" },
  { header: "Status", key: "status" },
  { header: "Date", key: "date" },
];

/**
 * Custom Hook for Dynamic Dashboard Stats
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}

/**
 * Custom Hook for Dynamic Revenue & Trip Trend Chart
 */
export function useRevenueTrend(initialRange: "6m" | "1y" = "6m") {
  const [range, setRange] = useState<"6m" | "1y">(initialRange);
  const [data, setData] = useState<RevenueTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrend = useCallback(async (selectedRange: "6m" | "1y") => {
    setLoading(true);
    try {
      const points = await DashboardService.getRevenueTrend(selectedRange);
      setData(points);
    } catch (err) {
      console.error("Failed to load revenue trend:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend(range);
  }, [range, fetchTrend]);

  return { data, range, setRange, loading, refresh: () => fetchTrend(range) };
}

/**
 * Custom Hook for Dynamic Material Donut Chart
 */
export function useMaterialDistribution() {
  const [materials, setMaterials] = useState<MaterialDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const list = await DashboardService.getMaterialDistributions();
      setMaterials(list);
    } catch (err) {
      console.error("Failed to load material distribution:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return { materials, loading, refresh: fetchMaterials };
}

/**
 * Custom Hook for Dynamic Load Logs Table (Search, Sort, Filter, Pagination, Export)
 */
export function useLoadLogsTable(initialParams: TableQueryParams = {}) {
  const [params, setParams] = useState<TableQueryParams>({
    search: "",
    status: "ALL",
    category: "ALL",
    type: "ALL",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    pageSize: 5,
    ...initialParams,
  });

  const [result, setResult] = useState<PaginatedResult<LoadLog>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchLogs = useCallback(async (queryParams: TableQueryParams, minDelay = 0) => {
    setLoading(true);
    try {
      if (minDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, minDelay));
      }
      const res = await DashboardService.getLoadLogs(queryParams);
      setResult(res);
    } catch (err) {
      console.error("Failed to load logs table data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(params);
  }, [params, fetchLogs]);

  // Set Search Query with automatic page reset to 1
  const setSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  // Set Status Filter
  const setStatus = (status: string) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  };

  // Set Category Filter
  const setCategory = (category: string) => {
    setParams((prev) => ({ ...prev, category, page: 1 }));
  };

  // Set Company Filter
  const setCompany = (company: string) => {
    setParams((prev) => ({ ...prev, company, page: 1 }));
  };

  // Set Trip Type Filter
  const setType = (type: string) => {
    setParams((prev) => ({ ...prev, type, page: 1 }));
  };

  // Set Date Filter (YYYY-MM-DD)
  const setDate = (date: string) => {
    setParams((prev) => ({ ...prev, date, page: 1 }));
  };

  // Toggle Sorting on column header
  const handleSort = (column: keyof LoadLog) => {
    setParams((prev) => {
      const isCurrent = prev.sortBy === column;
      const nextOrder = isCurrent && prev.sortOrder === "asc" ? "desc" : "asc";
      return { ...prev, sortBy: column, sortOrder: nextOrder, page: 1 };
    });
  };

  // Set Page
  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // Set Page Size
  const setPageSize = (pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Reset Filters
  const resetFilters = () => {
    setParams({
      search: "",
      status: "ALL",
      category: "ALL",
      company: "ALL",
      type: "ALL",
      date: "",
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      pageSize: params.pageSize || 5,
    });
  };

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  // Advanced Configurable Export Handler
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
    let exportData: LoadLog[] = [];

    if (scope === "current_page") {
      exportData = [...result.data];
    } else if (scope === "filtered") {
      exportData = await DashboardService.getAllLoadLogsForExport(params);
    } else {
      exportData = await DashboardService.getAllLoadLogsForExport({});
    }

    const activeColumns = loadLogExportColumns.filter((col) =>
      selectedColumns.includes(col.header)
    );

    const targetFilename = filename || `fluidlogix-load-logs-${scope}`;

    if (format === "csv") {
      exportToCSV<LoadLog>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "json") {
      exportToJSON<LoadLog>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "pdf") {
      exportToPDF<LoadLog>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
        title: "Recent Load Logs Report",
        subtitle: `FluidLogix Dispatch & Transport Records • Scope: ${
          scope === "all"
            ? "All Logs"
            : scope === "current_page"
            ? `Page ${result.page}`
            : "Filtered Records"
        }`,
        summaryStats: [
          { label: "Total Logs", value: exportData.length },
          {
            label: "Completed",
            value: exportData.filter((l) => l.status === "Completed").length,
          },
          {
            label: "In Transit",
            value: exportData.filter((l) => l.status === "In Transit").length,
          },
          {
            label: "Pending",
            value: exportData.filter((l) => l.status === "Pending").length,
          },
        ],
        orientation: "landscape",
      });
    }
  };

  return {
    data: result.data,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages,
    loading,
    params,
    setSearch,
    setStatus,
    setCategory,
    setCompany,
    setType,
    setDate,
    handleSort,
    setPage,
    setPageSize,
    resetFilters,
    handleExport,
    availableExportColumns: loadLogExportColumns.map((c) => ({
      id: c.header,
      label: c.header,
    })),
    isExportModalOpen,
    openExportModal,
    closeExportModal,
    refresh: () => fetchLogs(params, 350),
  };
}

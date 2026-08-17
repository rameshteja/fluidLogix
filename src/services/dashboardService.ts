import {
  dashboardStats,
  loadLogsData,
  materialDistributions,
  revenueTrend1Y,
  revenueTrend6M,
} from "@/data/dummy-data";
import {
  DashboardStat,
  LoadLog,
  MaterialDistribution,
  PaginatedResult,
  RevenueTrendPoint,
  TableQueryParams,
} from "@/types/dashboard";

/**
 * Dashboard Data Service
 * Currently queries from @/data/dummy-data.ts.
 * Ready to be swapped with NestJS HTTP Client (e.g. fetch(`${API_BASE}/...`))
 */
export const DashboardService = {
  /**
   * Fetch Dashboard Key Metric Cards
   */
  async getStats(): Promise<DashboardStat[]> {
    // Simulating async response (e.g. GET /api/v1/dashboard/stats)
    return Promise.resolve([...dashboardStats]);
  },

  /**
   * Fetch Revenue & Trip Trend points
   * @param range "6m" | "1y"
   */
  async getRevenueTrend(range: "6m" | "1y" = "6m"): Promise<RevenueTrendPoint[]> {
    const data = range === "1y" ? revenueTrend1Y : revenueTrend6M;
    return Promise.resolve([...data]);
  },

  /**
   * Fetch Material Load Breakdown
   */
  async getMaterialDistributions(): Promise<MaterialDistribution[]> {
    return Promise.resolve([...materialDistributions]);
  },

  /**
   * Fetch Load Logs with Search, Multi-Filter, Sorting & Pagination
   * Emulates server-side pagination from NestJS: GET /api/v1/load-logs?page=1&pageSize=10...
   */
  async getLoadLogs(params: TableQueryParams = {}): Promise<PaginatedResult<LoadLog>> {
    const {
      search = "",
      status = "ALL",
      category = "ALL",
      company = "ALL",
      type = "ALL",
      date = "",
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      pageSize = 5,
    } = params;

    let filtered = [...loadLogsData];

    // 1. Search Query filter (matches id, vehicle, driver, company, material, route)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.vehicle.toLowerCase().includes(q) ||
          item.driver.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.route.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (status && status !== "ALL") {
      filtered = filtered.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Category filter
    if (category && category !== "ALL") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 4. Company filter
    if (company && company !== "ALL") {
      filtered = filtered.filter(
        (item) => item.company.toLowerCase() === company.toLowerCase()
      );
    }

    // 5. Trip Type filter
    if (type && type !== "ALL") {
      filtered = filtered.filter((item) => item.type.toLowerCase() === type.toLowerCase());
    }

    // 6. Specific Date filter (matches YYYY-MM-DD)
    if (date && date.trim() && date !== "ALL") {
      const targetDate = date.trim();
      filtered = filtered.filter((item) => item.date === targetDate || item.date.startsWith(targetDate));
    }

    // 5. Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal === undefined) return 0;
      if (bVal === undefined) return 0;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (safePage - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return Promise.resolve({
      data: paginatedData,
      total,
      page: safePage,
      pageSize,
      totalPages,
    });
  },

  /**
   * Fetch All Load Logs for Export (CSV / JSON)
   */
  async getAllLoadLogsForExport(params: Omit<TableQueryParams, "page" | "pageSize"> = {}): Promise<LoadLog[]> {
    const res = await this.getLoadLogs({ ...params, page: 1, pageSize: 1000 });
    return res.data;
  },
};

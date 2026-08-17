export type MaterialCategory = "Chemical" | "Hazardous" | "Waste Water" | "Non-Hazard";
export type TripType = "Local" | "Non-Local";
export type LoadStatus = "Completed" | "In Transit" | "Pending" | "Cancelled";

export interface LoadLog {
  id: string;
  vehicle: string;
  driver: string;
  company: string;
  material: string;
  category: MaterialCategory;
  weightKg: number;
  weightDisplay: string;
  route: string;
  type: TripType;
  status: LoadStatus;
  date: string;
  amount?: number;
}

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
  iconType: "truck" | "activity" | "building" | "wallet";
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number; // in thousands (K INR)
  trips: number;
  revenueDisplay: string;
  tripsDisplay: string;
}

export interface MaterialDistribution {
  name: MaterialCategory;
  count: number;
  percentage: number;
  color: string;
  loadsDisplay: string;
}

export interface TableQueryParams {
  search?: string;
  status?: string;
  category?: string;
  company?: string;
  type?: string;
  date?: string;
  sortBy?: keyof LoadLog;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

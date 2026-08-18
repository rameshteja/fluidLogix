import { MaterialCategory, TripType, LoadStatus } from "./dashboard";

export type { MaterialCategory, TripType, LoadStatus };

export interface LoadLogItem {
  id: string;
  date: string; // e.g. "19 Jul 2025" or "2025-07-19"
  dateRaw?: string; // e.g. "2025-07-19"
  vehicle: string; // e.g. "TK-001"
  driver: string; // e.g. "Suresh Mohan"
  driverPhone?: string; // e.g. "+91 98451 22310"
  company: string; // e.g. "ChemCorp Ltd"
  material: string; // e.g. "Sulphuric Acid"
  category: MaterialCategory;
  weightKg: number; // e.g. 18500
  weightDisplay: string; // e.g. "18,500 kg"
  from: string; // e.g. "Visakhapatnam Port"
  to: string; // e.g. "Hyderabad MIDC"
  route?: string; // e.g. "Visakhapatnam Port → Hyderabad MIDC"
  type: TripType; // "Non-Local" | "Local"
  loadTime: string; // e.g. "06:30"
  unloadTime: string; // e.g. "18:45" or "—"
  status: LoadStatus; // "Completed" | "In Transit" | "Pending" | "Cancelled"
  amount?: number; // e.g. 45000
  sealNo?: string; // e.g. "SL-8842"
  hazardClass?: string; // e.g. "Class 8 - Corrosive"
  notes?: string;
  createdAt?: string;
}

export type LoadLogSortField =
  | "id"
  | "date"
  | "vehicle"
  | "driver"
  | "company"
  | "material"
  | "category"
  | "weightKg"
  | "from"
  | "to"
  | "type"
  | "loadTime"
  | "unloadTime"
  | "status"
  | "amount";

export interface LoadLogFilterParams {
  search?: string;
  category?: MaterialCategory | "ALL";
  status?: LoadStatus | "ALL";
  type?: TripType | "ALL";
  vehicle?: string;
  company?: string;
  owner?: string;
  date?: string;
  sortBy?: LoadLogSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface LoadLogFormData {
  date: string;
  vehicle: string;
  driver: string;
  driverPhone?: string;
  company: string;
  material: string;
  category: MaterialCategory;
  weightKg: number;
  from: string;
  to: string;
  type: TripType;
  loadTime: string;
  unloadTime?: string;
  status: LoadStatus;
  amount?: number;
  sealNo?: string;
  hazardClass?: string;
  notes?: string;
}

export interface LoadLogFormErrors {
  vehicle?: string;
  driver?: string;
  company?: string;
  material?: string;
  category?: string;
  weightKg?: string;
  from?: string;
  to?: string;
  date?: string;
  loadTime?: string;
}

export interface LoadLogStats {
  totalDispatches: number;
  completed: number;
  inTransit: number;
  pending: number;
  cancelled: number;
  totalWeightKg: number;
  totalWeightDisplay: string;
  totalAmount: number;
  totalAmountDisplay: string;
}

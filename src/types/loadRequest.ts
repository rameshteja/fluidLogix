import { UploadedDocInfo } from "@/components/common/FileUploadDropzone";
import { MaterialCategory } from "@/types/dashboard";
import { TankerType, VehicleBodyType } from "@/types/fleet";

export type RequestPriority = "Urgent" | "High" | "Normal";

export type LoadRequestStatus =
  | "Pending"
  | "Assigned"
  | "Loading"
  | "In Transit"
  | "Completed"
  | "Cancelled";

export interface LoadRequest {
  id: string; // e.g. "REQ-8021"
  company: string; // e.g. "ChemCorp Ltd"
  contactPerson: string;
  contactPhone: string;
  materialCategory: MaterialCategory;
  chemicalName: string; // e.g. "Liquid Caustic Soda 48%"
  tankerType: TankerType;
  bodyType: VehicleBodyType | string; // "MS", "SS", "Rubber Lined MS", etc.
  requiredCapacity: number; // in Liters
  compartmentsNeeded: number; // e.g. 1, 2, 3
  pickupLocation: string;
  pickupCity: string;
  deliveryLocation: string;
  deliveryCity: string;
  loadingDate: string; // e.g. "2025-08-25"
  loadingTimeWindow: string; // e.g. "08:00 AM - 12:00 PM"
  expectedDeliveryDate: string;
  offeredRate: number; // in INR
  priority: RequestPriority;
  specialInstructions?: string;
  status: LoadRequestStatus;
  assignedVehicleId?: string; // e.g. "TK-001"
  assignedDriver?: string;
  assignmentId?: string; // e.g. "DISP-2025-0914"
  msdsDocFile?: UploadedDocInfo | string | null;
  createdAt: string;
}

export interface LoadRequestFormData {
  id?: string;
  company: string;
  contactPerson: string;
  contactPhone: string;
  materialCategory: MaterialCategory;
  chemicalName: string;
  tankerType: TankerType;
  bodyType: VehicleBodyType | string;
  requiredCapacity: number | string;
  compartmentsNeeded: number;
  pickupLocation: string;
  pickupCity: string;
  deliveryLocation: string;
  deliveryCity: string;
  loadingDate: string;
  loadingTimeWindow: string;
  expectedDeliveryDate: string;
  offeredRate: number | string;
  priority: RequestPriority;
  specialInstructions?: string;
  status?: LoadRequestStatus;
  msdsDocFile?: UploadedDocInfo | string | null;
}

export interface LoadRequestFormErrors {
  company?: string;
  contactPerson?: string;
  contactPhone?: string;
  materialCategory?: string;
  chemicalName?: string;
  tankerType?: string;
  bodyType?: string;
  requiredCapacity?: string;
  pickupLocation?: string;
  pickupCity?: string;
  deliveryLocation?: string;
  deliveryCity?: string;
  loadingDate?: string;
  expectedDeliveryDate?: string;
  offeredRate?: string;
}

export interface LoadRequestQueryParams {
  search?: string;
  status?: "ALL" | LoadRequestStatus;
  priority?: "ALL" | RequestPriority;
  materialCategory?: "ALL" | MaterialCategory;
  company?: "ALL" | string;
  startDate?: string;
  endDate?: string;
  sortBy?: keyof LoadRequest;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface LoadRequestPaginatedResult {
  data: LoadRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: {
    all: number;
    pending: number;
    assigned: number;
    inTransit: number;
    completed: number;
    cancelled: number;
  };
  priorityCounts: {
    urgent: number;
    high: number;
    normal: number;
  };
}

import { MaterialCategory } from "@/types/dashboard";
import { TankerType } from "@/types/fleet";

export type AssignmentStatus =
  | "Allocated"
  | "At Plant"
  | "Loaded"
  | "In Transit"
  | "Delivered"
  | "Released";

export interface CompartmentAllocation {
  compartmentNo: number;
  capacity: number; // in Litres
  loadedMaterial: string;
  grossWeightKg?: number;
}

export interface SecurityChecklist {
  tankerCleaned: boolean;
  gpsOnline: boolean;
  hazmatKitVerified: boolean;
  driverBriefed: boolean;
  fitnessValid: boolean;
}

export interface TruckAssignment {
  id: string; // e.g. "DISP-2025-0914"
  requestId?: string; // Linked Load Request ID (e.g. "REQ-8021")
  company: string; // e.g. "ChemCorp Ltd"
  vehicleId: string; // e.g. "TK-001"
  plateNo: string; // e.g. "AP09AB1234"
  tankerType: TankerType;
  bodyType: string; // e.g. "SS (Stainless Steel 316)"
  driver: string; // e.g. "Suresh Mohan"
  driverPhone: string;
  driverLicense: string;
  transporter: string; // e.g. "Ravi Kumar"
  materialCategory: MaterialCategory;
  chemicalName: string;
  allocatedCapacity: number; // in Litres
  compartmentAllocations: CompartmentAllocation[];
  origin: string; // Pickup plant / depot
  originCity: string;
  destination: string; // Delivery refinery / site
  destinationCity: string;
  assignmentDate: string;
  expectedLoadingDate: string;
  expectedDeliveryDate: string;
  freightRate: number; // in INR
  advancePaid: number; // in INR
  securityChecklist: SecurityChecklist;
  status: AssignmentStatus;
  gatePassNo: string; // e.g. "GP-99210"
  dispatchOfficer: string; // e.g. "Admin Dispatch Team"
  remarks?: string;
  createdAt: string;
}

export interface AssignmentFormData {
  id?: string;
  requestId?: string;
  company: string;
  vehicleId: string;
  driver: string;
  driverPhone: string;
  driverLicense: string;
  transporter: string;
  materialCategory: MaterialCategory;
  chemicalName: string;
  allocatedCapacity: number | string;
  compartmentAllocations: CompartmentAllocation[];
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  assignmentDate: string;
  expectedLoadingDate: string;
  expectedDeliveryDate: string;
  freightRate: number | string;
  advancePaid: number | string;
  securityChecklist: SecurityChecklist;
  remarks?: string;
  status?: AssignmentStatus;
}

export interface AssignmentFormErrors {
  company?: string;
  vehicleId?: string;
  driver?: string;
  chemicalName?: string;
  allocatedCapacity?: string;
  origin?: string;
  destination?: string;
  expectedLoadingDate?: string;
  expectedDeliveryDate?: string;
  freightRate?: string;
  securityChecklist?: string;
}

export interface AssignmentQueryParams {
  search?: string;
  status?: "ALL" | AssignmentStatus;
  company?: "ALL" | string;
  materialCategory?: "ALL" | MaterialCategory;
  vehicleId?: "ALL" | string;
  driver?: "ALL" | string;
  startDate?: string;
  endDate?: string;
  sortBy?: keyof TruckAssignment;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface AssignmentPaginatedResult {
  data: TruckAssignment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: {
    all: number;
    allocated: number;
    atPlant: number;
    loaded: number;
    inTransit: number;
    delivered: number;
    released: number;
  };
}

import { MaterialCategory } from "./dashboard";
export type { MaterialCategory };

export type TankerType =
  | "Chemical Tanker"
  | "Hazmat Tanker"
  | "Water Tanker"
  | "General Tanker";

export type FleetStatus = "Active" | "Transit" | "Maintenance" | "Idle";

export interface FleetVehicle {
  id: string; // e.g. "TK-001"
  plateNo: string; // e.g. "AP09AB1234"
  tankerType: TankerType;
  capacity: number; // in Litres (e.g. 20000)
  capacityDisplay: string; // e.g. "20,000 L"
  owner: string; // e.g. "Ravi Kumar"
  driver: string; // e.g. "Suresh Mohan"
  company: string; // e.g. "ChemCorp Ltd"
  material: MaterialCategory;
  status: FleetStatus;
  lastServiceDate?: string;
  registrationDate?: string;
  pucExpiry?: string;
  insuranceExpiry?: string;
  gpsStatus?: "Online" | "Offline";
  currentLocation?: string;
}

export interface VehicleFormData {
  id: string;
  plateNo: string;
  tankerType: TankerType;
  capacity: number | string;
  owner: string;
  driver: string;
  company: string;
  material: MaterialCategory;
  status: FleetStatus;
  lastServiceDate?: string;
  currentLocation?: string;
}

export interface VehicleFormErrors {
  id?: string;
  plateNo?: string;
  tankerType?: string;
  capacity?: string;
  owner?: string;
  driver?: string;
  company?: string;
  material?: string;
  status?: string;
}

export interface FleetQueryParams {
  search?: string;
  status?: "ALL" | FleetStatus;
  tankerType?: "ALL" | TankerType;
  material?: "ALL" | MaterialCategory;
  company?: "ALL" | string;
  date?: string;
  sortBy?: keyof FleetVehicle;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface FleetPaginatedResult {
  data: FleetVehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: {
    all: number;
    active: number;
    transit: number;
    maintenance: number;
    idle: number;
  };
}

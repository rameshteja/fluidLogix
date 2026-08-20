import { UploadedDocInfo } from "@/components/common/FileUploadDropzone";
import { MaterialCategory } from "./dashboard";
export type { MaterialCategory };

export type TankerType =
  | "Chemical Tanker"
  | "Hazmat Tanker"
  | "Water Tanker"
  | "General Tanker";

export type VehicleBodyType =
  | "MS"
  | "SS"
  | "Rubber Lined MS"
  | "Aluminium Alloy"
  | "Specialized Composite";

export interface TankerCompartment {
  compartmentNo: number;
  capacity: number;
}

export type FleetStatus = "Active" | "Transit" | "Maintenance" | "Idle";

export interface FleetVehicle {
  id: string; // e.g. "TK-001"
  plateNo: string; // e.g. "AP09AB1234"
  tankerType: TankerType;
  bodyType?: VehicleBodyType | string;
  capacity: number; // in Litres (e.g. 20000)
  capacityDisplay: string; // e.g. "20,000 L"
  compartmentsCount?: number;
  compartments?: TankerCompartment[];
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
  tankerImages?: (UploadedDocInfo | string)[];
  pollutionCertFile?: UploadedDocInfo | string | null;
  fitnessCertFile?: UploadedDocInfo | string | null;
}

export interface VehicleFormData {
  id: string;
  plateNo: string;
  tankerType: TankerType;
  bodyType?: VehicleBodyType | string;
  capacity: number | string;
  compartmentsCount?: number;
  compartments?: TankerCompartment[];
  owner: string;
  driver: string;
  company: string;
  material: MaterialCategory;
  status: FleetStatus;
  registrationDate?: string;
  lastServiceDate?: string;
  currentLocation?: string;
  tankerImages?: (UploadedDocInfo | string)[];
  pollutionCertFile?: UploadedDocInfo | string | null;
  fitnessCertFile?: UploadedDocInfo | string | null;
}

export interface VehicleFormErrors {
  id?: string;
  plateNo?: string;
  tankerType?: string;
  bodyType?: string;
  capacity?: string;
  compartmentsCount?: string;
  compartments?: string;
  owner?: string;
  driver?: string;
  company?: string;
  material?: string;
  status?: string;
  registrationDate?: string;
}

export interface FleetQueryParams {
  search?: string;
  status?: "ALL" | FleetStatus;
  tankerType?: "ALL" | TankerType;
  material?: "ALL" | MaterialCategory;
  company?: "ALL" | string;
  date?: string;
  startDate?: string;
  endDate?: string;
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

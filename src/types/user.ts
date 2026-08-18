import { UploadedDocInfo } from "@/components/common/FileUploadDropzone";

export type UserCategory = "Drivers" | "Owners" | "Companies";

export type UserStatus = "Active" | "Inactive" | "Suspended";

export type UserVerificationStatus = "Verified" | "Pending" | "Rejected";

export interface UserItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: UserCategory;
  licenseNo?: string; // For Drivers
  licenseExpiryDate?: string; // For Drivers (e.g. "2028-10-15")
  assignedVehicle?: string; // e.g. "TK-001"
  company?: string; // Operating company or owner's company
  owner?: string; // Fleet Owner (e.g., "Ravi Kumar", "Prakash Reddy")
  fleetSize?: number; // For Owners
  activeFleetCount?: number; // For Companies
  contactPerson?: string; // For Companies
  vehiclesCount?: number; // For Grid view cards
  driversCount?: number; // For Grid view cards
  bankAccount?: string; // For Grid view cards (e.g., "SBI ****4532")
  verified: UserVerificationStatus;
  status: UserStatus;
  dateRegistered: string;
  avatarUrl?: string;

  // Documents & Verification Attributes
  addressProofType?: string;
  addressProofFile?: UploadedDocInfo | string | null;
  licenseFile?: UploadedDocInfo | string | null;
  panNumber?: string;
  panFile?: UploadedDocInfo | string | null;
  gstNumber?: string;
  companyRegistrationCertFile?: UploadedDocInfo | string | null;
  incorporationCertFile?: UploadedDocInfo | string | null;
}

export type UserSortField =
  | "name"
  | "phone"
  | "licenseNo"
  | "licenseExpiryDate"
  | "assignedVehicle"
  | "company"
  | "owner"
  | "vehiclesCount"
  | "driversCount"
  | "verified"
  | "status"
  | "dateRegistered";

export type SortOrder = "asc" | "desc";

export interface UserFilterParams {
  category: UserCategory;
  search: string;
  status: UserStatus | "ALL";
  verified: UserVerificationStatus | "ALL";
  assignedVehicle: string | "ALL";
  company: string | "ALL";
  owner?: string | "ALL";
  date?: string;
  sortBy: UserSortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface UserFormData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  category: UserCategory;
  licenseNo?: string;
  licenseExpiryDate?: string;
  assignedVehicle?: string;
  company?: string;
  owner?: string;
  fleetSize?: number;
  contactPerson?: string;
  verified: UserVerificationStatus;
  status: UserStatus;

  // Documents & IDs
  addressProofType?: string;
  addressProofFile?: UploadedDocInfo | string | null;
  licenseFile?: UploadedDocInfo | string | null;
  panNumber?: string;
  panFile?: UploadedDocInfo | string | null;
  gstNumber?: string;
  companyRegistrationCertFile?: UploadedDocInfo | string | null;
  incorporationCertFile?: UploadedDocInfo | string | null;
}

export interface UserFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  licenseNo?: string;
  company?: string;
  gstNumber?: string;
  panNumber?: string;
}

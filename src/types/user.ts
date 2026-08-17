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
  assignedVehicle?: string; // e.g. "TK-001"
  company?: string; // Operating company or owner's company
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
}

export type UserSortField =
  | "name"
  | "phone"
  | "licenseNo"
  | "assignedVehicle"
  | "company"
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
  assignedVehicle?: string;
  company?: string;
  fleetSize?: number;
  contactPerson?: string;
  verified: UserVerificationStatus;
  status: UserStatus;
}

export interface UserFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  licenseNo?: string;
  company?: string;
}

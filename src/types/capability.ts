export type PermissionAction =
  | "view"
  | "add"
  | "edit"
  | "delete"
  | "export"
  | "print"
  | "approve"
  | "audit";

export interface PermissionActionMeta {
  id: PermissionAction;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  isDestructive?: boolean;
  requiresView?: boolean;
}

export const PERMISSION_ACTIONS_META: Record<PermissionAction, PermissionActionMeta> = {
  view: {
    id: "view",
    label: "View Records",
    shortLabel: "View",
    description: "Read & inspect records, dashboards, and detailed profile views",
    color: "text-sky-500 dark:text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    badgeClass: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
  },
  add: {
    id: "add",
    label: "Add / Create",
    shortLabel: "Add",
    description: "Create new logs, vehicles, bank accounts, and user records",
    color: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    requiresView: true,
  },
  edit: {
    id: "edit",
    label: "Edit / Update",
    shortLabel: "Edit",
    description: "Modify existing data, trip statuses, rates, and configurations",
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    requiresView: true,
  },
  delete: {
    id: "delete",
    label: "Delete / Archive",
    shortLabel: "Delete",
    description: "Remove, purge, or soft-delete records from the system database",
    color: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30",
    isDestructive: true,
    requiresView: true,
  },
  export: {
    id: "export",
    label: "Export Data",
    shortLabel: "Export",
    description: "Export datasets to CSV, Excel, or JSON formats",
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    badgeClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30",
    requiresView: true,
  },
  print: {
    id: "print",
    label: "Print Challan / PDF",
    shortLabel: "Print",
    description: "Generate official printable receipts, gate passes, and trip sheets",
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    badgeClass: "bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30",
    requiresView: true,
  },
  approve: {
    id: "approve",
    label: "Authorize / Approve",
    shortLabel: "Approve",
    description: "Approve financial settlements, dispatch releases, and user KYC",
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
    requiresView: true,
  },
  audit: {
    id: "audit",
    label: "Audit Logs",
    shortLabel: "Audit",
    description: "Access immutable change logs, operator trails, and IP tracking",
    color: "text-orange-500 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    badgeClass: "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30",
    requiresView: true,
  },
};

export interface ModuleCapability {
  id: string;
  name: string;
  code: string;
  description: string;
  categoryId: string;
  availableActions: PermissionAction[];
  riskLevel?: "low" | "medium" | "high" | "critical";
  complianceNote?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  code: string;
  iconName: string;
  description: string;
  modules: ModuleCapability[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  badgeColor: string;
  userCount: number;
  isSystemLocked?: boolean;
  securityLevel: "Master" | "Elevated" | "Standard" | "Restricted" | "Auditor";
  permissions: Record<string, PermissionAction[]>; // moduleId -> array of granted PermissionAction
  createdAt: string;
  updatedAt: string;
}

export interface RoleUserSummary {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  designation: string;
  roleId: string;
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  assignedOn: string;
}

export interface CapabilityFilterState {
  searchQuery: string;
  selectedCategoryId: string | "all";
  selectedActionFilter: PermissionAction | "all";
  statusFilter: "all" | "granted-only" | "denied-only" | "custom";
  viewMode: "matrix" | "accordion";
  showConflictsOnly?: boolean;
}

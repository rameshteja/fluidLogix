/**
 * FluidLogix Central Application & API Constants
 * Configured for NestJS Backend Integration
 */

// NestJS Backend Base URL (Configurable via Environment Variables)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// API Endpoints Mapping (NestJS Controllers & Routes)
export const API_ENDPOINTS = {
  // Authentication & Session Controller (/api/v1/auth)
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_OTP: "/auth/resend-otp",
    REFRESH_TOKEN: "/auth/refresh-token",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    CHANGE_PASSWORD: "/auth/change-password",
    UPDATE_PROFILE: "/auth/profile",
  },

  // Fleet & Tankers Controller (/api/v1/fleet)
  FLEET: {
    LIST: "/fleet/tankers",
    DETAILS: (id: string) => `/fleet/tankers/${id}`,
    CREATE: "/fleet/tankers",
    UPDATE: (id: string) => `/fleet/tankers/${id}`,
    DELETE: (id: string) => `/fleet/tankers/${id}`,
    DRIVERS: "/fleet/drivers",
    DRIVER_DETAILS: (id: string) => `/fleet/drivers/${id}`,
    CALIBRATION_CERTIFICATES: "/fleet/calibration",
    MAINTENANCE_LOGS: "/fleet/maintenance",
    EXPORT: "/fleet/tankers/export",
  },

  // Daily Load Logs & Dispatch Controller (/api/v1/load-logs)
  LOAD_LOGS: {
    LIST: "/load-logs",
    DETAILS: (id: string) => `/load-logs/${id}`,
    CREATE: "/load-logs",
    UPDATE: (id: string) => `/load-logs/${id}`,
    DELETE: (id: string) => `/load-logs/${id}`,
    DECANTING_CHECKIN: "/load-logs/decanting-checkin",
    WEIGHBRIDGE_SLIPS: "/load-logs/weighbridge",
    HAZMAT_MANIFEST: "/load-logs/hazmat-manifest",
    GATE_PASS: "/load-logs/gate-pass",
    EXPORT: "/load-logs/export",
    PRINT_CHALLAN: (id: string) => `/load-logs/${id}/challan-pdf`,
  },

  // Billing & Invoicing Controller (/api/v1/billing)
  BILLING: {
    INVOICES: "/billing/invoices",
    INVOICE_DETAILS: (id: string) => `/billing/invoices/${id}`,
    GENERATE_INVOICE: "/billing/invoices/generate",
    TRANSPORTER_BILLS: "/billing/transporter-bills",
    GST_COMPLIANCE: "/billing/gst-reconciliation",
    CREDIT_LIMITS: "/billing/credit-limits",
    PAYOUT_APPROVAL: "/billing/payouts/approve",
    EXPORT: "/billing/export",
    PRINT_INVOICE_PDF: (id: string) => `/billing/invoices/${id}/pdf`,
  },

  // Corporate Banking & Treasury Controller (/api/v1/banks)
  BANKS: {
    ACCOUNTS: "/banks/accounts",
    ACCOUNT_DETAILS: (id: string) => `/banks/accounts/${id}`,
    CREATE_ACCOUNT: "/banks/accounts",
    UPDATE_ACCOUNT: (id: string) => `/banks/accounts/${id}`,
    DELETE_ACCOUNT: (id: string) => `/banks/accounts/${id}`,
    VERIFY_IFSC: "/banks/verify-ifsc",
    FASTAG_WALLETS: "/banks/fastag-wallets",
    PAYOUT_BATCHES: "/banks/payout-batches",
    TRANSACTIONS: "/banks/transactions",
    EXPORT: "/banks/export",
  },

  // User Management & KYC Controller (/api/v1/users)
  USERS: {
    LIST: "/users",
    DETAILS: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PARTNERS: "/users/partners",
    CLIENTS: "/users/clients",
    KYC_APPROVAL: "/users/kyc-approval",
    STATUS_TOGGLE: (id: string) => `/users/${id}/status`,
  },

  // Capabilities & RBAC Controller (/api/v1/capabilities)
  CAPABILITIES: {
    ROLES: "/capabilities/roles",
    ROLE_DETAILS: (id: string) => `/capabilities/roles/${id}`,
    CREATE_ROLE: "/capabilities/roles",
    UPDATE_ROLE: (id: string) => `/capabilities/roles/${id}`,
    DELETE_ROLE: (id: string) => `/capabilities/roles/${id}`,
    MATRIX: "/capabilities/matrix",
    UPDATE_MATRIX: "/capabilities/matrix/update",
    USER_PERMISSIONS: (userId: string) => `/capabilities/users/${userId}`,
  },

  // Dashboard & Analytics Controller (/api/v1/dashboard)
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    STATS: "/dashboard/stats",
    LIVE_FLEET_TRACKING: "/dashboard/live-fleet",
    REVENUE_ANALYTICS: "/dashboard/revenue-analytics",
    COMPLIANCE_ALERTS: "/dashboard/compliance-alerts",
  },

  // Reports & Business Intelligence (/api/v1/reports)
  REPORTS: {
    FINANCIAL: "/reports/financial",
    TELEMATICS: "/reports/telematics",
    SAFETY_AUDIT: "/reports/safety-audit",
    DOWNLOAD_REPORT: (reportType: string) => `/reports/${reportType}/download`,
  },
} as const;

// LocalStorage & Cookie Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "fluidlogix_auth_token",
  REFRESH_TOKEN: "fluidlogix_refresh_token",
  USER_DATA: "fluidlogix_user",
  ACTIVE_ROLE: "fluidlogix_active_role",
  THEME_MODE: "fluidlogix_theme",
  RBAC_ROLES: "fluidlogix_rbac_roles_v3",
  SIDEBAR_COLLAPSED: "fluidlogix_sidebar_collapsed",
} as const;

// HTTP Request Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const HTTP_METHODS = {
  GET: "GET" as HttpMethod,
  POST: "POST" as HttpMethod,
  PUT: "PUT" as HttpMethod,
  PATCH: "PATCH" as HttpMethod,
  DELETE: "DELETE" as HttpMethod,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// App Global Configuration
export const APP_CONFIG = {
  APP_NAME: "FluidLogix",
  APP_TAGLINE: "Smart Chemical & Bulk Liquid Transport ERP",
  APP_VERSION: "v2.6.0",
  DEFAULT_TIMEOUT_MS: 15000,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DATE_FORMAT: "DD MMM YYYY",
  DATETIME_FORMAT: "DD MMM YYYY, hh:mm A",
} as const;

// Standard User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  FLEET_OWNER: "FLEET_OWNER",
  DRIVER: "DRIVER",
  COMPANY_CLIENT: "COMPANY_CLIENT",
  BILLING_ACCOUNTANT: "BILLING_ACCOUNTANT",
} as const;

// Permission Actions
export const PERMISSION_ACTIONS = {
  VIEW: "view",
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  EXPORT: "export",
  PRINT: "print",
  APPROVE: "approve",
  AUDIT: "audit",
} as const;

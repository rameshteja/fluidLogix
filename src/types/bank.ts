export type OwnerBankAccountType =
  | "Current Account"
  | "Savings Account"
  | "Proprietorship Current"
  | "Transporter Escrow"
  | "Overdraft Account";

export type OwnerVerificationStatus =
  | "Verified"
  | "Pending Verification"
  | "Rejected";

export type OwnerPayoutStatus =
  | "Ready for Payout"
  | "On Hold (KYC Pending)"
  | "Blocked";

export interface OwnerBankItem {
  id: string; // e.g. "OBNK-001"
  ownerName: string; // e.g. "Ravi Kumar"
  ownerPhone: string; // e.g. "+91 98451 22310"
  panNumber: string; // e.g. "ABCDE1234F"
  assignedTankers: string[]; // e.g. ["TK-001", "TK-008"]
  bankName: string; // e.g. "HDFC Bank"
  accountHolder: string; // e.g. "Ravi Kumar Transport & Logistics"
  accountNumber: string; // e.g. "50200084920194"
  maskedAccountNumber: string; // e.g. "•••• •••• 0194"
  accountType: OwnerBankAccountType;
  ifscCode: string; // e.g. "HDFC0001234"
  branchName: string; // e.g. "Visakhapatnam Port Branch"
  city: string; // e.g. "Visakhapatnam"
  state: string; // e.g. "Andhra Pradesh"
  verificationStatus: OwnerVerificationStatus;
  payoutStatus: OwnerPayoutStatus;
  isPrimaryPayoutAccount: boolean;
  upiId?: string; // e.g. "ravikumar.fleet@okhdfcbank"
  monthlySettlementAmt: number; // e.g. 277400
  monthlySettlementDisplay: string; // e.g. "₹2,77,400"
  totalSettledYTD: number; // e.g. 1845000
  totalSettledYTDDisplay: string; // e.g. "₹18,45,000"
  lastSettlementDate?: string; // e.g. "21 Jul 2025"
  lastTxnRef?: string; // e.g. "NEFT-IN8829104"
  tdsDeclarationSubmitted: boolean;
  pennyDropPassed: boolean;
  colorTheme: "amber" | "blue" | "emerald" | "purple" | "slate";
  createdDate: string; // e.g. "12 Jan 2024"
  notes?: string;
}

export type BankSortField =
  | "ownerName"
  | "bankName"
  | "accountNumber"
  | "monthlySettlementAmt"
  | "verificationStatus"
  | "payoutStatus"
  | "isPrimaryPayoutAccount";

export interface BankFilterParams {
  search?: string;
  owner?: string | "ALL";
  bankName?: string | "ALL";
  verificationStatus?: OwnerVerificationStatus | "ALL";
  payoutStatus?: OwnerPayoutStatus | "ALL";
  accountType?: string | "ALL";
  sortBy?: BankSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface BankStats {
  totalMonthlySettlement: number;
  totalMonthlySettlementDisplay: string;
  totalOwnersCount: number;
  verifiedOwnersCount: number;
  pendingPayoutsCount: number;
  totalDisbursedYTD: number;
  totalDisbursedYTDDisplay: string;
  totalTankersLinked: number;
}

export interface OwnerBankFormData {
  ownerName: string;
  ownerPhone: string;
  panNumber: string;
  assignedTankers: string[];
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: OwnerBankAccountType;
  ifscCode: string;
  branchName: string;
  city: string;
  state: string;
  upiId?: string;
  verificationStatus: OwnerVerificationStatus;
  payoutStatus: OwnerPayoutStatus;
  isPrimaryPayoutAccount: boolean;
  monthlySettlementAmt?: number;
  tdsDeclarationSubmitted: boolean;
  notes?: string;
}

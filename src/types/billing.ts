export type BillingStatus = "Paid" | "Pending" | "Generated" | "Overdue";

export interface MonthlyBillingItem {
  id: string; // e.g. "BILL-2025-07-001"
  vehicle: string; // e.g. "TK-001"
  plateNo: string; // e.g. "AP09AB1234"
  owner: string; // e.g. "Ravi Kumar"
  ownerPhone?: string; // e.g. "+91 98451 22310"
  bankAccount?: string; // e.g. "HDFC **** 4591"
  ifscCode?: string; // e.g. "HDFC0001234"
  month: string; // e.g. "July 2025" or "2025-07"
  trips: number; // e.g. 28
  totalWeightKg: number; // e.g. 498000
  totalWeightDisplay: string; // e.g. "498,000 kg"
  localTrips: number; // e.g. 8
  nonLocalTrips: number; // e.g. 20
  localAmt: number; // e.g. 18400
  localAmtDisplay: string; // e.g. "₹18,400"
  nonLocalAmt: number; // e.g. 116400
  nonLocalAmtDisplay: string; // e.g. "₹1,16,400"
  total: number; // e.g. 134800
  totalDisplay: string; // e.g. "₹1,34,800"
  status: BillingStatus;
  invoiceNo: string; // e.g. "INV-2025-07-001"
  generatedDate: string; // e.g. "01 Jul 2025"
  dueDate: string; // e.g. "10 Aug 2025"
  paidDate?: string; // e.g. "20 Jul 2025"
  paymentMethod?: string; // e.g. "NEFT Transfer"
  transactionRef?: string; // e.g. "TXN891238910"
  notes?: string;
}

export type BillingSortField =
  | "vehicle"
  | "plateNo"
  | "owner"
  | "trips"
  | "totalWeightKg"
  | "localTrips"
  | "nonLocalTrips"
  | "localAmt"
  | "nonLocalAmt"
  | "total"
  | "status";

export interface BillingFilterParams {
  search?: string;
  month?: string; // "July 2025", "June 2025", "ALL"
  status?: BillingStatus | "ALL";
  owner?: string;
  vehicle?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: BillingSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface BillingStats {
  totalPayable: number;
  totalPayableDisplay: string;
  billsPaidCount: number;
  totalBillsCount: number;
  billsPaidRatioDisplay: string; // "2 / 5"
  pendingAmount: number;
  pendingAmountDisplay: string;
  totalTrips: number;
}

export interface PaymentFormData {
  billingId: string;
  amount: number;
  paymentMethod: "NEFT/RTGS" | "UPI" | "Bank Transfer" | "Cheque";
  transactionRef: string;
  paidDate: string;
  notes?: string;
}

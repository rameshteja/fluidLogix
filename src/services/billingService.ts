import {
  BillingFilterParams,
  BillingSortField,
  BillingStats,
  MonthlyBillingItem,
} from "@/types/billing";

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("en-IN")} kg`;
}

export function calculateBillingStats(bills: MonthlyBillingItem[]): BillingStats {
  const totalPayable = bills.reduce((acc, b) => acc + (b.total || 0), 0);
  const paidBills = bills.filter((b) => b.status === "Paid");
  const billsPaidCount = paidBills.length;
  const totalBillsCount = bills.length;
  const billsPaidRatioDisplay = `${billsPaidCount} / ${totalBillsCount}`;

  const pendingBills = bills.filter(
    (b) => b.status === "Pending" || b.status === "Generated" || b.status === "Overdue"
  );
  const pendingAmount = pendingBills.reduce((acc, b) => acc + (b.total || 0), 0);

  const totalTrips = bills.reduce((acc, b) => acc + (b.trips || 0), 0);

  return {
    totalPayable,
    totalPayableDisplay: formatCurrency(totalPayable),
    billsPaidCount,
    totalBillsCount,
    billsPaidRatioDisplay,
    pendingAmount,
    pendingAmountDisplay: formatCurrency(pendingAmount),
    totalTrips,
  };
}

export function filterAndSortBilling(
  bills: MonthlyBillingItem[],
  params: BillingFilterParams
): {
  data: MonthlyBillingItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: BillingStats;
} {
  const {
    search = "",
    month = "July 2025",
    status = "ALL",
    owner = "ALL",
    vehicle = "ALL",
    minAmount,
    maxAmount,
    sortBy = "vehicle",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
  } = params;

  let filtered = [...bills];

  // 1. Month Filter
  if (month && month !== "ALL") {
    filtered = filtered.filter((b) => b.month.toLowerCase() === month.toLowerCase());
  }

  // 2. Search Query Filter (matches vehicle, plate, owner, invoice, status)
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((b) => {
      return (
        b.vehicle.toLowerCase().includes(q) ||
        b.plateNo.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.invoiceNo.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q) ||
        (b.notes || "").toLowerCase().includes(q)
      );
    });
  }

  // 3. Status Filter
  if (status && status !== "ALL") {
    filtered = filtered.filter((b) => b.status === status);
  }

  // 4. Owner Filter
  if (owner && owner !== "ALL") {
    filtered = filtered.filter((b) => b.owner.toLowerCase() === owner.toLowerCase());
  }

  // 5. Vehicle Filter
  if (vehicle && vehicle !== "ALL") {
    filtered = filtered.filter((b) => b.vehicle.toLowerCase() === vehicle.toLowerCase());
  }

  // 6. Amount Range Filter
  if (minAmount !== undefined && minAmount > 0) {
    filtered = filtered.filter((b) => b.total >= minAmount);
  }
  if (maxAmount !== undefined && maxAmount > 0) {
    filtered = filtered.filter((b) => b.total <= maxAmount);
  }

  // Calculate live stats for the current view
  const stats = calculateBillingStats(filtered);

  // 7. Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedData,
    total,
    totalPages,
    page: safePage,
    pageSize,
    stats,
  };
}

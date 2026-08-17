import {
  LoadLogFilterParams,
  LoadLogFormData,
  LoadLogFormErrors,
  LoadLogItem,
  LoadLogSortField,
  LoadLogStats,
} from "@/types/loadLog";

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("en-IN")} kg`;
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getLoadLogStats(logs: LoadLogItem[]): LoadLogStats {
  const totalDispatches = logs.length;
  const completed = logs.filter((l) => l.status === "Completed").length;
  const inTransit = logs.filter((l) => l.status === "In Transit").length;
  const pending = logs.filter((l) => l.status === "Pending").length;
  const cancelled = logs.filter((l) => l.status === "Cancelled").length;

  const totalWeightKg = logs.reduce((sum, l) => sum + (l.weightKg || 0), 0);
  const totalAmount = logs.reduce((sum, l) => sum + (l.amount || 0), 0);

  const totalWeightDisplay =
    totalWeightKg >= 1000
      ? `${(totalWeightKg / 1000).toFixed(1)} Tons`
      : `${totalWeightKg.toLocaleString()} kg`;

  return {
    totalDispatches,
    completed,
    inTransit,
    pending,
    cancelled,
    totalWeightKg,
    totalWeightDisplay,
    totalAmount,
    totalAmountDisplay: formatCurrency(totalAmount),
  };
}

export function filterAndSortLoadLogs(
  logs: LoadLogItem[],
  params: LoadLogFilterParams
): {
  data: LoadLogItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: LoadLogStats;
} {
  const {
    search = "",
    category = "ALL",
    status = "ALL",
    type = "ALL",
    vehicle = "ALL",
    company = "ALL",
    date = "",
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    pageSize = 6,
  } = params;

  let filtered = [...logs];

  // 1. Search Query Filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const idMatch = item.id.toLowerCase().includes(q);
      const vehicleMatch = item.vehicle.toLowerCase().includes(q);
      const driverMatch = item.driver.toLowerCase().includes(q);
      const companyMatch = item.company.toLowerCase().includes(q);
      const materialMatch = item.material.toLowerCase().includes(q);
      const fromMatch = (item.from || "").toLowerCase().includes(q);
      const toMatch = (item.to || "").toLowerCase().includes(q);
      const routeMatch = (item.route || "").toLowerCase().includes(q);
      const typeMatch = item.type.toLowerCase().includes(q);
      const statusMatch = item.status.toLowerCase().includes(q);
      const notesMatch = (item.notes || "").toLowerCase().includes(q);

      return (
        idMatch ||
        vehicleMatch ||
        driverMatch ||
        companyMatch ||
        materialMatch ||
        fromMatch ||
        toMatch ||
        routeMatch ||
        typeMatch ||
        statusMatch ||
        notesMatch
      );
    });
  }

  // 2. Category Filter
  if (category && category !== "ALL") {
    filtered = filtered.filter((item) => item.category === category);
  }

  // 3. Status Filter
  if (status && status !== "ALL") {
    filtered = filtered.filter((item) => item.status === status);
  }

  // 4. Trip Scope / Type Filter
  if (type && type !== "ALL") {
    filtered = filtered.filter((item) => item.type === type);
  }

  // 5. Vehicle Filter
  if (vehicle && vehicle !== "ALL") {
    filtered = filtered.filter(
      (item) => item.vehicle.toLowerCase() === vehicle.toLowerCase()
    );
  }

  // 6. Company Filter
  if (company && company !== "ALL") {
    filtered = filtered.filter(
      (item) => item.company.toLowerCase() === company.toLowerCase()
    );
  }

  // 7. Date Filter (Flexible normalization: matches "2025-07-19", "19 Jul 2025", "19-07-2025")
  if (date && date.trim()) {
    const target = date.trim().toLowerCase();
    filtered = filtered.filter((item) => {
      const itemRaw = (item.dateRaw || "").toLowerCase();
      const itemFormatted = item.date.toLowerCase();

      if (itemRaw === target || itemFormatted === target) return true;
      if (itemRaw.includes(target) || itemFormatted.includes(target)) return true;

      // Handle DD-MM-YYYY vs YYYY-MM-DD
      const targetParts = target.split("-");
      if (targetParts.length === 3) {
        if (targetParts[0].length === 4) {
          // target is YYYY-MM-DD
          const [yyyy, mm, dd] = targetParts;
          const altFormat = `${dd}-${mm}-${yyyy}`;
          return (
            itemRaw.includes(target) ||
            itemFormatted.includes(`${parseInt(dd, 10)}`)
          );
        } else {
          // target is DD-MM-YYYY
          const [dd, mm, yyyy] = targetParts;
          const isoFormat = `${yyyy}-${mm}-${dd}`;
          return itemRaw === isoFormat || itemFormatted.includes(`${parseInt(dd, 10)}`);
        }
      }
      return false;
    });
  }

  // Compute live stats based on filtered set
  const stats = getLoadLogStats(filtered);

  // 8. Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Special sort handling
    if (sortBy === "date") {
      valA = a.dateRaw || a.date;
      valB = b.dateRaw || b.date;
    } else if (sortBy === "weightKg") {
      valA = a.weightKg || 0;
      valB = b.weightKg || 0;
    } else if (sortBy === "amount") {
      valA = a.amount || 0;
      valB = b.amount || 0;
    }

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    return sortOrder === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
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

export function validateLoadLogForm(data: LoadLogFormData): {
  isValid: boolean;
  errors: LoadLogFormErrors;
} {
  const errors: LoadLogFormErrors = {};

  if (!data.vehicle || !data.vehicle.trim()) {
    errors.vehicle = "Vehicle tanker is required";
  }

  if (!data.driver || !data.driver.trim()) {
    errors.driver = "Driver name is required";
  }

  if (!data.company || !data.company.trim()) {
    errors.company = "Company / Hub name is required";
  }

  if (!data.material || !data.material.trim()) {
    errors.material = "Material name is required";
  }

  if (!data.weightKg || Number(data.weightKg) <= 0) {
    errors.weightKg = "Weight must be greater than 0 kg";
  }

  if (!data.from || !data.from.trim()) {
    errors.from = "Origin location is required";
  }

  if (!data.to || !data.to.trim()) {
    errors.to = "Destination location is required";
  }

  if (!data.loadTime || !data.loadTime.trim()) {
    errors.loadTime = "Load time is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

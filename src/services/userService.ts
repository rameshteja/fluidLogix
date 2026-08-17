import {
  UserFilterParams,
  UserFormData,
  UserFormErrors,
  UserItem,
  UserStatus,
} from "@/types/user";

export function filterAndSortUsers(
  users: UserItem[],
  params: UserFilterParams
): { data: UserItem[]; total: number; totalPages: number } {
  let result = users.filter((user) => user.category === params.category);

  // 1. Search Query Filter
  if (params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.licenseNo && u.licenseNo.toLowerCase().includes(q)) ||
        (u.assignedVehicle && u.assignedVehicle.toLowerCase().includes(q)) ||
        (u.company && u.company.toLowerCase().includes(q)) ||
        (u.contactPerson && u.contactPerson.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (params.status !== "ALL") {
    result = result.filter((u) => u.status === params.status);
  }

  // 3. Verification Filter
  if (params.verified !== "ALL") {
    result = result.filter((u) => u.verified === params.verified);
  }

  // 4. Assigned Vehicle Filter
  if (params.assignedVehicle !== "ALL") {
    result = result.filter((u) => u.assignedVehicle === params.assignedVehicle);
  }

  // 5. Company Filter
  if (params.company !== "ALL") {
    result = result.filter((u) => u.company === params.company);
  }

  // 6. Date Filter
  if (params.date && params.date.trim()) {
    result = result.filter((u) => u.dateRegistered === params.date?.trim());
  }

  // 6. Multi-field Sorting
  const { sortBy, sortOrder } = params;
  result.sort((a, b) => {
    let valA = a[sortBy] ?? "";
    let valB = b[sortBy] ?? "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 7. Pagination
  const total = result.length;
  const totalPages = Math.ceil(total / params.pageSize) || 1;
  const page = Math.min(Math.max(1, params.page), totalPages);

  const startIdx = (page - 1) * params.pageSize;
  const paginatedData = result.slice(startIdx, startIdx + params.pageSize);

  return {
    data: paginatedData,
    total,
    totalPages,
  };
}

export function validateUserForm(formData: UserFormData): {
  isValid: boolean;
  errors: UserFormErrors;
} {
  const errors: UserFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!formData.email.trim() || !formData.email.includes("@")) {
    errors.email = "Valid email address is required.";
  }

  if (formData.category === "Drivers" && !formData.licenseNo?.trim()) {
    errors.licenseNo = "License Number is required for Drivers.";
  }

  if (formData.category === "Companies" && !formData.company?.trim()) {
    errors.company = "Company Name is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

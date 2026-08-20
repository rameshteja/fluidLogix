import { initialLoadRequests } from "@/data/load-requests-data";
import {
  LoadRequest,
  LoadRequestFormData,
  LoadRequestFormErrors,
  LoadRequestPaginatedResult,
  LoadRequestQueryParams,
} from "@/types/loadRequest";

let loadRequestsStore: LoadRequest[] = [...initialLoadRequests];

export function validateLoadRequestForm(
  data: LoadRequestFormData
): { isValid: boolean; errors: LoadRequestFormErrors } {
  const errors: LoadRequestFormErrors = {};

  if (!data.company || !data.company.trim()) {
    errors.company = "Client company is required";
  }

  if (!data.contactPerson || !data.contactPerson.trim()) {
    errors.contactPerson = "Authorised contact person name is required";
  }

  if (!data.contactPhone || !data.contactPhone.trim()) {
    errors.contactPhone = "Contact phone number is required";
  }

  if (!data.chemicalName || !data.chemicalName.trim()) {
    errors.chemicalName = "Material / Chemical name is required";
  }

  if (!data.tankerType) {
    errors.tankerType = "Select required tanker type";
  }

  if (!data.bodyType) {
    errors.bodyType = "Select tanker body material";
  }

  const cap = Number(data.requiredCapacity);
  if (!data.requiredCapacity || isNaN(cap) || cap <= 0) {
    errors.requiredCapacity = "Enter valid required capacity in Liters";
  } else if (cap < 1000 || cap > 80000) {
    errors.requiredCapacity = "Capacity must be between 1,000 L and 80,000 L";
  }

  if (!data.pickupLocation || !data.pickupLocation.trim()) {
    errors.pickupLocation = "Pickup loading address is required";
  }

  if (!data.pickupCity || !data.pickupCity.trim()) {
    errors.pickupCity = "Pickup origin city is required";
  }

  if (!data.deliveryLocation || !data.deliveryLocation.trim()) {
    errors.deliveryLocation = "Delivery destination address is required";
  }

  if (!data.deliveryCity || !data.deliveryCity.trim()) {
    errors.deliveryCity = "Delivery destination city is required";
  }

  if (!data.loadingDate) {
    errors.loadingDate = "Loading date is required";
  }

  if (!data.expectedDeliveryDate) {
    errors.expectedDeliveryDate = "Expected delivery date is required";
  }

  const rate = Number(data.offeredRate);
  if (!data.offeredRate || isNaN(rate) || rate <= 0) {
    errors.offeredRate = "Enter valid offered freight rate in INR";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const LoadRequestService = {
  async getLoadRequests(params: LoadRequestQueryParams = {}): Promise<LoadRequestPaginatedResult> {
    const {
      search = "",
      status = "ALL",
      priority = "ALL",
      materialCategory = "ALL",
      company = "ALL",
      startDate = "",
      endDate = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 6,
    } = params;

    let filtered = [...loadRequestsStore];

    const statusCounts = {
      all: loadRequestsStore.length,
      pending: loadRequestsStore.filter((r) => r.status === "Pending").length,
      assigned: loadRequestsStore.filter((r) => r.status === "Assigned").length,
      inTransit: loadRequestsStore.filter((r) => r.status === "In Transit").length,
      completed: loadRequestsStore.filter((r) => r.status === "Completed").length,
      cancelled: loadRequestsStore.filter((r) => r.status === "Cancelled").length,
    };

    const priorityCounts = {
      urgent: loadRequestsStore.filter((r) => r.priority === "Urgent").length,
      high: loadRequestsStore.filter((r) => r.priority === "High").length,
      normal: loadRequestsStore.filter((r) => r.priority === "Normal").length,
    };

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.chemicalName.toLowerCase().includes(q) ||
          r.pickupCity.toLowerCase().includes(q) ||
          r.deliveryCity.toLowerCase().includes(q) ||
          r.contactPerson.toLowerCase().includes(q) ||
          r.bodyType.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (status && status !== "ALL") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Priority filter
    if (priority && priority !== "ALL") {
      filtered = filtered.filter((r) => r.priority.toLowerCase() === priority.toLowerCase());
    }

    // 4. Material filter
    if (materialCategory && materialCategory !== "ALL") {
      filtered = filtered.filter(
        (r) => r.materialCategory.toLowerCase() === materialCategory.toLowerCase()
      );
    }

    // 5. Company filter
    if (company && company !== "ALL") {
      filtered = filtered.filter((r) => r.company.toLowerCase() === company.toLowerCase());
    }

    // 6. Date filter
    if (startDate || endDate) {
      filtered = filtered.filter((r) => {
        if (!r.loadingDate) return false;
        if (startDate && r.loadingDate < startDate) return false;
        if (endDate && r.loadingDate > endDate) return false;
        return true;
      });
    }

    // 7. Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return Promise.resolve({
      data: paginatedData,
      total,
      page: safePage,
      pageSize,
      totalPages,
      statusCounts,
      priorityCounts,
    });
  },

  async getLoadRequestById(id: string): Promise<LoadRequest | null> {
    const found = loadRequestsStore.find((r) => r.id.toLowerCase() === id.toLowerCase());
    return Promise.resolve(found ? { ...found } : null);
  },

  async createLoadRequest(formData: LoadRequestFormData): Promise<LoadRequest> {
    const nextNum = Math.floor(8020 + loadRequestsStore.length + 1);
    const newId = `REQ-${nextNum}`;

    const newRequest: LoadRequest = {
      id: newId,
      company: formData.company.trim(),
      contactPerson: formData.contactPerson.trim(),
      contactPhone: formData.contactPhone.trim(),
      materialCategory: formData.materialCategory,
      chemicalName: formData.chemicalName.trim(),
      tankerType: formData.tankerType,
      bodyType: formData.bodyType,
      requiredCapacity: Number(formData.requiredCapacity) || 20000,
      compartmentsNeeded: Number(formData.compartmentsNeeded) || 1,
      pickupLocation: formData.pickupLocation.trim(),
      pickupCity: formData.pickupCity.trim(),
      deliveryLocation: formData.deliveryLocation.trim(),
      deliveryCity: formData.deliveryCity.trim(),
      loadingDate: formData.loadingDate,
      loadingTimeWindow: formData.loadingTimeWindow || "08:00 AM - 02:00 PM",
      expectedDeliveryDate: formData.expectedDeliveryDate,
      offeredRate: Number(formData.offeredRate) || 45000,
      priority: formData.priority || "Normal",
      specialInstructions: formData.specialInstructions || "",
      status: "Pending",
      msdsDocFile: formData.msdsDocFile || null,
      createdAt: new Date().toISOString(),
    };

    loadRequestsStore = [newRequest, ...loadRequestsStore];
    return Promise.resolve(newRequest);
  },

  async updateLoadRequest(id: string, formData: Partial<LoadRequestFormData>): Promise<LoadRequest> {
    const idx = loadRequestsStore.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) {
      throw new Error(`Load Request ${id} not found.`);
    }

    const current = loadRequestsStore[idx];
    const updated: LoadRequest = {
      ...current,
      ...(formData.company && { company: formData.company.trim() }),
      ...(formData.contactPerson && { contactPerson: formData.contactPerson.trim() }),
      ...(formData.contactPhone && { contactPhone: formData.contactPhone.trim() }),
      ...(formData.materialCategory && { materialCategory: formData.materialCategory }),
      ...(formData.chemicalName && { chemicalName: formData.chemicalName.trim() }),
      ...(formData.tankerType && { tankerType: formData.tankerType }),
      ...(formData.bodyType && { bodyType: formData.bodyType }),
      ...(formData.requiredCapacity !== undefined && {
        requiredCapacity: Number(formData.requiredCapacity),
      }),
      ...(formData.compartmentsNeeded !== undefined && {
        compartmentsNeeded: Number(formData.compartmentsNeeded),
      }),
      ...(formData.pickupLocation && { pickupLocation: formData.pickupLocation.trim() }),
      ...(formData.pickupCity && { pickupCity: formData.pickupCity.trim() }),
      ...(formData.deliveryLocation && { deliveryLocation: formData.deliveryLocation.trim() }),
      ...(formData.deliveryCity && { deliveryCity: formData.deliveryCity.trim() }),
      ...(formData.loadingDate && { loadingDate: formData.loadingDate }),
      ...(formData.loadingTimeWindow && { loadingTimeWindow: formData.loadingTimeWindow }),
      ...(formData.expectedDeliveryDate && { expectedDeliveryDate: formData.expectedDeliveryDate }),
      ...(formData.offeredRate !== undefined && { offeredRate: Number(formData.offeredRate) }),
      ...(formData.priority && { priority: formData.priority }),
      ...(formData.specialInstructions !== undefined && {
        specialInstructions: formData.specialInstructions,
      }),
      ...(formData.status && { status: formData.status }),
      ...(formData.msdsDocFile !== undefined && { msdsDocFile: formData.msdsDocFile }),
    };

    loadRequestsStore[idx] = updated;
    return Promise.resolve(updated);
  },

  async updateRequestStatus(
    id: string,
    status: LoadRequest["status"],
    assignmentMeta?: { vehicleId: string; driver: string; assignmentId: string }
  ): Promise<LoadRequest> {
    const idx = loadRequestsStore.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) {
      throw new Error(`Load Request ${id} not found.`);
    }

    const current = loadRequestsStore[idx];
    const updated: LoadRequest = {
      ...current,
      status,
      ...(assignmentMeta && {
        assignedVehicleId: assignmentMeta.vehicleId,
        assignedDriver: assignmentMeta.driver,
        assignmentId: assignmentMeta.assignmentId,
      }),
    };

    loadRequestsStore[idx] = updated;
    return Promise.resolve(updated);
  },

  async deleteLoadRequest(id: string): Promise<boolean> {
    const prev = loadRequestsStore.length;
    loadRequestsStore = loadRequestsStore.filter((r) => r.id.toLowerCase() !== id.toLowerCase());
    return Promise.resolve(loadRequestsStore.length < prev);
  },
};

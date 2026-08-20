import { initialTruckAssignments } from "@/data/assignments-data";
import { initialFleetVehicles } from "@/data/fleet-data";
import {
  AssignmentFormData,
  AssignmentFormErrors,
  AssignmentPaginatedResult,
  AssignmentQueryParams,
  TruckAssignment,
} from "@/types/assignment";
import { FleetVehicle } from "@/types/fleet";

let assignmentsStore: TruckAssignment[] = [...initialTruckAssignments];

export function validateAssignmentForm(
  data: AssignmentFormData
): { isValid: boolean; errors: AssignmentFormErrors } {
  const errors: AssignmentFormErrors = {};

  if (!data.company || !data.company.trim()) {
    errors.company = "Client company is required";
  }

  if (!data.vehicleId || !data.vehicleId.trim()) {
    errors.vehicleId = "Select an available fleet tanker truck";
  }

  if (!data.driver || !data.driver.trim()) {
    errors.driver = "Select an authorised driver";
  }

  if (!data.chemicalName || !data.chemicalName.trim()) {
    errors.chemicalName = "Cargo / Material name is required";
  }

  const cap = Number(data.allocatedCapacity);
  if (!data.allocatedCapacity || isNaN(cap) || cap <= 0) {
    errors.allocatedCapacity = "Enter valid allocated capacity in Liters";
  }

  if (!data.origin || !data.origin.trim()) {
    errors.origin = "Origin pickup location is required";
  }

  if (!data.destination || !data.destination.trim()) {
    errors.destination = "Destination delivery location is required";
  }

  if (!data.expectedLoadingDate) {
    errors.expectedLoadingDate = "Loading date is required";
  }

  if (!data.expectedDeliveryDate) {
    errors.expectedDeliveryDate = "Expected delivery date is required";
  }

  const rate = Number(data.freightRate);
  if (!data.freightRate || isNaN(rate) || rate <= 0) {
    errors.freightRate = "Agreed freight rate is required";
  }

  if (
    !data.securityChecklist.tankerCleaned ||
    !data.securityChecklist.gpsOnline ||
    !data.securityChecklist.hazmatKitVerified
  ) {
    errors.securityChecklist = "Mandatory safety checklist items (Tanker Cleaned, GPS Online, PPE/Hazmat Kit) must be verified";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const AssignmentService = {
  async getAssignments(params: AssignmentQueryParams = {}): Promise<AssignmentPaginatedResult> {
    const {
      search = "",
      status = "ALL",
      company = "ALL",
      materialCategory = "ALL",
      vehicleId = "ALL",
      driver = "ALL",
      startDate = "",
      endDate = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 6,
    } = params;

    let filtered = [...assignmentsStore];

    const statusCounts = {
      all: assignmentsStore.length,
      allocated: assignmentsStore.filter((a) => a.status === "Allocated").length,
      atPlant: assignmentsStore.filter((a) => a.status === "At Plant").length,
      loaded: assignmentsStore.filter((a) => a.status === "Loaded").length,
      inTransit: assignmentsStore.filter((a) => a.status === "In Transit").length,
      delivered: assignmentsStore.filter((a) => a.status === "Delivered").length,
      released: assignmentsStore.filter((a) => a.status === "Released").length,
    };

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.vehicleId.toLowerCase().includes(q) ||
          a.plateNo.toLowerCase().includes(q) ||
          a.driver.toLowerCase().includes(q) ||
          a.chemicalName.toLowerCase().includes(q) ||
          a.gatePassNo.toLowerCase().includes(q) ||
          a.originCity.toLowerCase().includes(q) ||
          a.destinationCity.toLowerCase().includes(q)
      );
    }

    // 2. Status
    if (status && status !== "ALL") {
      filtered = filtered.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Company
    if (company && company !== "ALL") {
      filtered = filtered.filter((a) => a.company.toLowerCase() === company.toLowerCase());
    }

    // 4. Material
    if (materialCategory && materialCategory !== "ALL") {
      filtered = filtered.filter(
        (a) => a.materialCategory.toLowerCase() === materialCategory.toLowerCase()
      );
    }

    // 5. Vehicle ID
    if (vehicleId && vehicleId !== "ALL") {
      filtered = filtered.filter((a) => a.vehicleId.toLowerCase() === vehicleId.toLowerCase());
    }

    // 6. Driver
    if (driver && driver !== "ALL") {
      filtered = filtered.filter((a) => a.driver.toLowerCase() === driver.toLowerCase());
    }

    // 7. Date
    if (startDate || endDate) {
      filtered = filtered.filter((a) => {
        if (!a.expectedLoadingDate) return false;
        if (startDate && a.expectedLoadingDate < startDate) return false;
        if (endDate && a.expectedLoadingDate > endDate) return false;
        return true;
      });
    }

    // 8. Sorting
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
    });
  },

  async getAssignmentById(id: string): Promise<TruckAssignment | null> {
    const found = assignmentsStore.find((a) => a.id.toLowerCase() === id.toLowerCase());
    return Promise.resolve(found ? { ...found } : null);
  },

  async createAssignment(formData: AssignmentFormData): Promise<TruckAssignment> {
    const nextNum = Math.floor(900 + assignmentsStore.length + 1);
    const newId = `DISP-2025-0${nextNum}`;
    const gatePass = `GP-${Math.floor(99200 + Math.random() * 800)}`;

    const newAssignment: TruckAssignment = {
      id: newId,
      requestId: formData.requestId || undefined,
      company: formData.company.trim(),
      vehicleId: formData.vehicleId.toUpperCase().trim(),
      plateNo: formData.vehicleId, // will be enriched from vehicle lookup if available
      tankerType: "Chemical Tanker",
      bodyType: "SS (Stainless Steel 316)",
      driver: formData.driver.trim(),
      driverPhone: formData.driverPhone || "+91 98451 22310",
      driverLicense: formData.driverLicense || "AP09-2018-00291",
      transporter: formData.transporter || "Fleet Transporter",
      materialCategory: formData.materialCategory,
      chemicalName: formData.chemicalName.trim(),
      allocatedCapacity: Number(formData.allocatedCapacity) || 20000,
      compartmentAllocations:
        formData.compartmentAllocations && formData.compartmentAllocations.length > 0
          ? formData.compartmentAllocations
          : [
              {
                compartmentNo: 1,
                capacity: Number(formData.allocatedCapacity) || 20000,
                loadedMaterial: formData.chemicalName.trim(),
              },
            ],
      origin: formData.origin.trim(),
      originCity: formData.originCity || "Visakhapatnam",
      destination: formData.destination.trim(),
      destinationCity: formData.destinationCity || "Kakinada",
      assignmentDate: formData.assignmentDate || new Date().toISOString().split("T")[0],
      expectedLoadingDate: formData.expectedLoadingDate,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      freightRate: Number(formData.freightRate) || 45000,
      advancePaid: Number(formData.advancePaid) || 20000,
      securityChecklist: formData.securityChecklist,
      status: "Allocated",
      gatePassNo: gatePass,
      dispatchOfficer: "Admin Operations Desk",
      remarks: formData.remarks || "Standard dispatch clearance issued.",
      createdAt: new Date().toISOString(),
    };

    // Enrich vehicle specs from fleet store if present
    const fleetVehicle = initialFleetVehicles.find(
      (v) => v.id.toLowerCase() === formData.vehicleId.toLowerCase()
    );
    if (fleetVehicle) {
      newAssignment.plateNo = fleetVehicle.plateNo;
      newAssignment.tankerType = fleetVehicle.tankerType;
      newAssignment.bodyType = String(fleetVehicle.bodyType || "MS");
      newAssignment.transporter = fleetVehicle.owner;
    }

    assignmentsStore = [newAssignment, ...assignmentsStore];
    return Promise.resolve(newAssignment);
  },

  async updateAssignment(id: string, formData: Partial<AssignmentFormData>): Promise<TruckAssignment> {
    const idx = assignmentsStore.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) {
      throw new Error(`Assignment ${id} not found.`);
    }

    const current = assignmentsStore[idx];
    const updated: TruckAssignment = {
      ...current,
      ...(formData.company && { company: formData.company.trim() }),
      ...(formData.vehicleId && { vehicleId: formData.vehicleId.toUpperCase().trim() }),
      ...(formData.driver && { driver: formData.driver.trim() }),
      ...(formData.driverPhone && { driverPhone: formData.driverPhone }),
      ...(formData.driverLicense && { driverLicense: formData.driverLicense }),
      ...(formData.materialCategory && { materialCategory: formData.materialCategory }),
      ...(formData.chemicalName && { chemicalName: formData.chemicalName.trim() }),
      ...(formData.allocatedCapacity !== undefined && {
        allocatedCapacity: Number(formData.allocatedCapacity),
      }),
      ...(formData.compartmentAllocations && {
        compartmentAllocations: formData.compartmentAllocations,
      }),
      ...(formData.origin && { origin: formData.origin.trim() }),
      ...(formData.originCity && { originCity: formData.originCity }),
      ...(formData.destination && { destination: formData.destination.trim() }),
      ...(formData.destinationCity && { destinationCity: formData.destinationCity }),
      ...(formData.expectedLoadingDate && { expectedLoadingDate: formData.expectedLoadingDate }),
      ...(formData.expectedDeliveryDate && { expectedDeliveryDate: formData.expectedDeliveryDate }),
      ...(formData.freightRate !== undefined && { freightRate: Number(formData.freightRate) }),
      ...(formData.advancePaid !== undefined && { advancePaid: Number(formData.advancePaid) }),
      ...(formData.securityChecklist && { securityChecklist: formData.securityChecklist }),
      ...(formData.remarks !== undefined && { remarks: formData.remarks }),
      ...(formData.status && { status: formData.status }),
    };

    assignmentsStore[idx] = updated;
    return Promise.resolve(updated);
  },

  async updateAssignmentStatus(
    id: string,
    status: TruckAssignment["status"]
  ): Promise<TruckAssignment> {
    const idx = assignmentsStore.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) {
      throw new Error(`Assignment ${id} not found.`);
    }

    const current = assignmentsStore[idx];
    const updated: TruckAssignment = {
      ...current,
      status,
    };

    assignmentsStore[idx] = updated;
    return Promise.resolve(updated);
  },

  async deleteAssignment(id: string): Promise<boolean> {
    const prev = assignmentsStore.length;
    assignmentsStore = assignmentsStore.filter((a) => a.id.toLowerCase() !== id.toLowerCase());
    return Promise.resolve(assignmentsStore.length < prev);
  },
};

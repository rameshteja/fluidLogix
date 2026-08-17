import { initialFleetVehicles } from "@/data/fleet-data";
import {
  FleetPaginatedResult,
  FleetQueryParams,
  FleetVehicle,
  VehicleFormData,
} from "@/types/fleet";

// In-memory store initialized with seed data (simulates database table)
let fleetStore: FleetVehicle[] = [...initialFleetVehicles];

/**
 * Fleet Data Service
 * Implements CRUD and querying. Ready to connect to NestJS REST backend.
 */
export const FleetService = {
  /**
   * Get paginated fleet list with search, status filters, and sorting
   * Emulates: GET /api/v1/fleet?search=...&status=...&page=1&pageSize=6
   */
  async getFleetVehicles(params: FleetQueryParams = {}): Promise<FleetPaginatedResult> {
    const {
      search = "",
      status = "ALL",
      tankerType = "ALL",
      material = "ALL",
      company = "ALL",
      sortBy = "id",
      sortOrder = "asc",
      page = 1,
      pageSize = 6,
    } = params;

    let filtered = [...fleetStore];

    // Compute status counts across full fleet
    const statusCounts = {
      all: fleetStore.length,
      active: fleetStore.filter((v) => v.status === "Active").length,
      transit: fleetStore.filter((v) => v.status === "Transit").length,
      maintenance: fleetStore.filter((v) => v.status === "Maintenance").length,
      idle: fleetStore.filter((v) => v.status === "Idle").length,
    };

    // 1. Search Query filter (matches plate, owner, driver, company, vehicle id, material)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (v) =>
          v.id.toLowerCase().includes(q) ||
          v.plateNo.toLowerCase().includes(q) ||
          v.owner.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.company.toLowerCase().includes(q) ||
          v.material.toLowerCase().includes(q) ||
          v.tankerType.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (status && status !== "ALL") {
      filtered = filtered.filter(
        (v) => v.status.toLowerCase() === status.toLowerCase()
      );
    }

    // 3. Tanker Type filter
    if (tankerType && tankerType !== "ALL") {
      filtered = filtered.filter(
        (v) => v.tankerType.toLowerCase() === tankerType.toLowerCase()
      );
    }

    // 4. Material filter
    if (material && material !== "ALL") {
      filtered = filtered.filter(
        (v) => v.material.toLowerCase() === material.toLowerCase()
      );
    }

    // 5. Company filter
    if (company && company !== "ALL") {
      filtered = filtered.filter(
        (v) => v.company.toLowerCase() === company.toLowerCase()
      );
    }

    // 5. Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal === undefined) return 0;
      if (bVal === undefined) return 0;

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

  /**
   * Get single vehicle by ID
   * Emulates: GET /api/v1/fleet/:id
   */
  async getVehicleById(id: string): Promise<FleetVehicle | null> {
    const found = fleetStore.find((v) => v.id.toLowerCase() === id.toLowerCase());
    return Promise.resolve(found ? { ...found } : null);
  },

  /**
   * Create new fleet vehicle
   * Emulates: POST /api/v1/fleet
   */
  async createVehicle(formData: VehicleFormData): Promise<FleetVehicle> {
    const capNum = Number(formData.capacity) || 20000;
    const newVehicle: FleetVehicle = {
      id: formData.id.toUpperCase().trim(),
      plateNo: formData.plateNo.toUpperCase().trim(),
      tankerType: formData.tankerType,
      capacity: capNum,
      capacityDisplay: `${capNum.toLocaleString()} L`,
      owner: formData.owner.trim(),
      driver: formData.driver.trim(),
      company: formData.company.trim(),
      material: formData.material,
      status: formData.status,
      lastServiceDate: formData.lastServiceDate || new Date().toISOString().split("T")[0],
      registrationDate: new Date().toISOString().split("T")[0],
      pucExpiry: "2026-12-31",
      insuranceExpiry: "2026-12-31",
      gpsStatus: "Online",
      currentLocation: formData.currentLocation || "HQ Transport Depot Bay 1",
    };

    // Prepend to store
    fleetStore = [newVehicle, ...fleetStore];
    return Promise.resolve(newVehicle);
  },

  /**
   * Update existing vehicle
   * Emulates: PUT /api/v1/fleet/:id
   */
  async updateVehicle(id: string, formData: Partial<VehicleFormData>): Promise<FleetVehicle> {
    const index = fleetStore.findIndex((v) => v.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found.`);
    }

    const current = fleetStore[index];
    const capNum = formData.capacity !== undefined ? Number(formData.capacity) : current.capacity;

    const updated: FleetVehicle = {
      ...current,
      ...(formData.plateNo && { plateNo: formData.plateNo.toUpperCase().trim() }),
      ...(formData.tankerType && { tankerType: formData.tankerType }),
      ...(formData.capacity !== undefined && {
        capacity: capNum,
        capacityDisplay: `${capNum.toLocaleString()} L`,
      }),
      ...(formData.owner && { owner: formData.owner.trim() }),
      ...(formData.driver && { driver: formData.driver.trim() }),
      ...(formData.company && { company: formData.company.trim() }),
      ...(formData.material && { material: formData.material }),
      ...(formData.status && { status: formData.status }),
      ...(formData.lastServiceDate && { lastServiceDate: formData.lastServiceDate }),
      ...(formData.currentLocation && { currentLocation: formData.currentLocation }),
    };

    fleetStore[index] = updated;
    return Promise.resolve(updated);
  },

  /**
   * Delete vehicle
   * Emulates: DELETE /api/v1/fleet/:id
   */
  async deleteVehicle(id: string): Promise<boolean> {
    const prevLen = fleetStore.length;
    fleetStore = fleetStore.filter((v) => v.id.toLowerCase() !== id.toLowerCase());
    return Promise.resolve(fleetStore.length < prevLen);
  },

  /**
   * Fetch all records matching filter for CSV / JSON export
   */
  async getAllFleetForExport(params: Omit<FleetQueryParams, "page" | "pageSize"> = {}): Promise<FleetVehicle[]> {
    const res = await this.getFleetVehicles({ ...params, page: 1, pageSize: 1000 });
    return res.data;
  },
};

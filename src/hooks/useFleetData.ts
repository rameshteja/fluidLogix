"use client";

import { useCallback, useEffect, useState } from "react";
import { FleetService } from "@/services/fleetService";
import {
  FleetPaginatedResult,
  FleetQueryParams,
  FleetStatus,
  FleetVehicle,
  VehicleFormData,
  VehicleFormErrors,
} from "@/types/fleet";
import { ExportColumn, exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

const fleetExportColumns: ExportColumn<FleetVehicle>[] = [
  { header: "Vehicle ID", key: "id" },
  { header: "Plate No.", key: "plateNo" },
  { header: "Tanker Type", key: "tankerType" },
  { header: "Capacity", formatter: (v) => v.capacityDisplay || `${v.capacity.toLocaleString()} L` },
  { header: "Owner", key: "owner" },
  { header: "Driver", key: "driver" },
  { header: "Company", key: "company" },
  { header: "Material", key: "material" },
  { header: "Status", key: "status" },
  { header: "Location", formatter: (v) => v.currentLocation || "HQ Depot" },
  { header: "Last Service", formatter: (v) => v.lastServiceDate || "-" },
];

/**
 * Validate Vehicle Form Data on Add / Edit
 */
export function validateVehicleForm(
  data: VehicleFormData,
  existingVehicles: FleetVehicle[],
  isEditing = false
): { isValid: boolean; errors: VehicleFormErrors } {
  const errors: VehicleFormErrors = {};

  // 1. Vehicle ID Validation
  if (!data.id || !data.id.trim()) {
    errors.id = "Vehicle ID is required (e.g. TK-007)";
  } else if (!/^TK-\d{3,4}$/i.test(data.id.trim())) {
    errors.id = "Vehicle ID format must be TK-xxx (e.g. TK-007)";
  } else if (!isEditing) {
    const exists = existingVehicles.some(
      (v) => v.id.toLowerCase() === data.id.trim().toLowerCase()
    );
    if (exists) {
      errors.id = `Vehicle ID ${data.id} is already registered in the fleet`;
    }
  }

  // 2. Plate Number Validation
  if (!data.plateNo || !data.plateNo.trim()) {
    errors.plateNo = "License plate number is required";
  } else {
    // Alphanumeric format, 6-12 characters, e.g. AP09AB1234, DL04MN6789
    const cleanPlate = data.plateNo.replace(/[\s-]/g, "").toUpperCase();
    if (cleanPlate.length < 6 || cleanPlate.length > 12) {
      errors.plateNo = "Enter a valid registration number (e.g. AP09AB1234)";
    }
  }

  // 3. Tanker Type
  if (!data.tankerType) {
    errors.tankerType = "Select tanker type";
  }

  // 4. Capacity
  const cap = Number(data.capacity);
  if (!data.capacity || isNaN(cap) || cap <= 0) {
    errors.capacity = "Enter a valid capacity in Liters (e.g. 20000)";
  } else if (cap < 1000 || cap > 60000) {
    errors.capacity = "Capacity must be between 1,000 L and 60,000 L";
  }

  // 5. Owner
  if (!data.owner || !data.owner.trim()) {
    errors.owner = "Owner / Transporter name is required";
  }

  // 6. Driver
  if (!data.driver || !data.driver.trim()) {
    errors.driver = "Assigned driver name is required";
  }

  // 7. Company
  if (!data.company || !data.company.trim()) {
    errors.company = "Client / Operating company is required";
  }

  // 8. Material
  if (!data.material) {
    errors.material = "Select hazardous / chemical material category";
  }

  // 9. Status
  if (!data.status) {
    errors.status = "Select current vehicle operational status";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Main Custom Hook for Fleet Management
 */
export function useFleetData(initialParams: FleetQueryParams = {}) {
  const [params, setParams] = useState<FleetQueryParams>({
    search: "",
    status: "ALL",
    tankerType: "ALL",
    material: "ALL",
    sortBy: "id",
    sortOrder: "asc",
    page: 1,
    pageSize: 6,
    ...initialParams,
  });

  const [result, setResult] = useState<FleetPaginatedResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
    statusCounts: {
      all: 0,
      active: 0,
      transit: 0,
      maintenance: 0,
      idle: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  // Fetch list with optional delay for visual loading feedback
  const fetchFleet = useCallback(async (queryParams: FleetQueryParams, minDelay = 0) => {
    setLoading(true);
    try {
      if (minDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, minDelay));
      }
      const res = await FleetService.getFleetVehicles(queryParams);
      setResult(res);
    } catch (err) {
      console.error("Failed to load fleet data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleet(params);
  }, [params, fetchFleet]);

  // Actions
  const setSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const setStatusFilter = (status: "ALL" | FleetStatus) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  };

  const setTankerTypeFilter = (tankerType: "ALL" | any) => {
    setParams((prev) => ({ ...prev, tankerType, page: 1 }));
  };

  const setMaterialFilter = (material: "ALL" | any) => {
    setParams((prev) => ({ ...prev, material, page: 1 }));
  };

  const setCompanyFilter = (company: "ALL" | string) => {
    setParams((prev) => ({ ...prev, company, page: 1 }));
  };

  const setDateFilter = (date: string) => {
    setParams((prev) => ({ ...prev, date, startDate: "", endDate: "", page: 1 }));
  };

  const setDateRangeFilter = (startDate: string, endDate: string) => {
    setParams((prev) => ({ ...prev, startDate, endDate, date: "", page: 1 }));
  };

  const resetFilters = () => {
    setParams({
      search: "",
      status: "ALL",
      tankerType: "ALL",
      material: "ALL",
      company: "ALL",
      date: "",
      startDate: "",
      endDate: "",
      sortBy: "id",
      sortOrder: "asc",
      page: 1,
      pageSize: params.pageSize || 6,
    });
  };

  const handleSort = (column: keyof FleetVehicle) => {
    setParams((prev) => {
      const isCurrent = prev.sortBy === column;
      const nextOrder = isCurrent && prev.sortOrder === "asc" ? "desc" : "asc";
      return { ...prev, sortBy: column, sortOrder: nextOrder, page: 1 };
    });
  };

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Add Vehicle
  const addVehicle = async (formData: VehicleFormData) => {
    const created = await FleetService.createVehicle(formData);
    await fetchFleet(params);
    return created;
  };

  // Edit Vehicle
  const editVehicle = async (id: string, formData: Partial<VehicleFormData>) => {
    const updated = await FleetService.updateVehicle(id, formData);
    await fetchFleet(params);
    return updated;
  };

  // Delete Vehicle
  const deleteVehicle = async (id: string) => {
    const success = await FleetService.deleteVehicle(id);
    await fetchFleet(params);
    return success;
  };

  // Modal Openers
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openEditModal = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const openViewModal = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsExportModalOpen(false);
    setSelectedVehicle(null);
  };

  // Advanced Configurable Export Handler
  const handleExport = async ({
    format,
    scope,
    selectedColumns,
    filename,
  }: {
    format: "pdf" | "csv" | "json";
    scope: "all" | "current_page" | "filtered";
    selectedColumns: string[];
    filename?: string;
  }) => {
    let exportData: FleetVehicle[] = [];

    if (scope === "current_page") {
      exportData = [...result.data];
    } else if (scope === "filtered") {
      exportData = await FleetService.getAllFleetForExport(params);
    } else {
      // "all"
      exportData = await FleetService.getAllFleetForExport({});
    }

    // Filter columns by user selection
    const activeColumns = fleetExportColumns.filter((col) =>
      selectedColumns.includes(col.header)
    );

    const targetFilename = filename || `fluidlogix-fleet-${scope}`;

    if (format === "csv") {
      exportToCSV<FleetVehicle>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "json") {
      exportToJSON<FleetVehicle>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "pdf") {
      exportToPDF<FleetVehicle>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
        title: "Fleet Management Report",
        subtitle: `FluidLogix Transport Network • Scope: ${
          scope === "all"
            ? "All Fleet"
            : scope === "current_page"
            ? `Page ${result.page}`
            : "Filtered Records"
        }`,
        summaryStats: [
          { label: "Exported Rows", value: exportData.length },
          {
            label: "Active",
            value: exportData.filter((v) => v.status === "Active").length,
          },
          {
            label: "In Transit",
            value: exportData.filter((v) => v.status === "Transit").length,
          },
          {
            label: "Maintenance",
            value: exportData.filter((v) => v.status === "Maintenance").length,
          },
        ],
        orientation: "landscape",
      });
    }
  };

  return {
    data: result.data,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages,
    statusCounts: result.statusCounts,
    loading,
    params,
    setSearch,
    setStatusFilter,
    setTankerTypeFilter,
    setMaterialFilter,
    setCompanyFilter,
    setDateFilter,
    setDateRangeFilter,
    setParams,
    resetFilters,
    handleSort,
    setPage,
    setPageSize,
    addVehicle,
    editVehicle,
    deleteVehicle,
    handleExport,
    availableExportColumns: fleetExportColumns.map((c) => ({
      id: c.header,
      label: c.header,
    })),
    refresh: () => fetchFleet(params, 350),
    // Modals
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isExportModalOpen,
    selectedVehicle,
    openAddModal,
    openEditModal,
    openViewModal,
    openExportModal,
    closeModals,
  };
}

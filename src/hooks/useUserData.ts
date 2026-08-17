"use client";

import { useMemo, useState } from "react";
import { initialUsersData } from "@/data/user-data";
import { filterAndSortUsers } from "@/services/userService";
import {
  UserCategory,
  UserFilterParams,
  UserFormData,
  UserItem,
  UserSortField,
  UserStatus,
  UserVerificationStatus,
} from "@/types/user";
import { ExportColumn, exportToCSV, exportToJSON, exportToPDF } from "@/utils/exportUtils";

const userExportColumns: ExportColumn<UserItem>[] = [
  { header: "User ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Category", key: "category" },
  { header: "Phone", key: "phone" },
  { header: "Email", key: "email" },
  { header: "License No.", formatter: (u) => u.licenseNo || "N/A" },
  { header: "Assigned Vehicle", formatter: (u) => u.assignedVehicle || "Unassigned" },
  { header: "Company", formatter: (u) => u.company || "Independent" },
  { header: "Verified", key: "verified" },
  { header: "Status", key: "status" },
  { header: "Date Registered", key: "dateRegistered" },
];

export function useUserData() {
  const [users, setUsers] = useState<UserItem[]>(initialUsersData);
  const [activeTab, setActiveTab] = useState<UserCategory>("Drivers");

  // Filter params
  const [params, setParams] = useState<UserFilterParams>({
    category: "Drivers",
    search: "",
    status: "ALL",
    verified: "ALL",
    assignedVehicle: "ALL",
    company: "ALL",
    date: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    pageSize: 6,
  });

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [activeUser, setActiveUser] = useState<UserItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Tab
  const handleTabChange = (category: UserCategory) => {
    setActiveTab(category);
    setSelectedIds([]);
    setParams((prev) => ({
      ...prev,
      category,
      page: 1,
      search: "",
      status: "ALL",
      verified: "ALL",
      assignedVehicle: "ALL",
      company: "ALL",
      date: "",
    }));
  };

  // Processed Data
  const { data: filteredUsers, total, totalPages } = useMemo(() => {
    return filterAndSortUsers(users, { ...params, category: activeTab });
  }, [users, params, activeTab]);

  // Total for category (unfiltered)
  const categoryTotalCount = useMemo(() => {
    return users.filter((u) => u.category === activeTab).length;
  }, [users, activeTab]);

  // Actions
  const handleSearch = (q: string) => {
    setParams((prev) => ({ ...prev, search: q, page: 1 }));
  };

  const setDateFilter = (date: string) => {
    setParams((prev) => ({ ...prev, date, page: 1 }));
  };

  const handleSort = (field: UserSortField) => {
    setParams((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sortBy: field, sortOrder: "asc" };
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (size: number) => {
    setParams((prev) => ({ ...prev, pageSize: size, page: 1 }));
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
    let exportData: UserItem[] = [];

    const categoryUsers = users.filter((u) => u.category === activeTab);

    if (scope === "current_page") {
      exportData = [...filteredUsers];
    } else if (scope === "filtered") {
      exportData = filterAndSortUsers(users, {
        ...params,
        category: activeTab,
        page: 1,
        pageSize: 10000,
      }).data;
    } else {
      // "all"
      exportData = categoryUsers;
    }

    const activeColumns = userExportColumns.filter((col) =>
      selectedColumns.includes(col.header)
    );

    const targetFilename = filename || `fluidlogix-users-${activeTab.toLowerCase()}-${scope}`;

    if (format === "csv") {
      exportToCSV<UserItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "json") {
      exportToJSON<UserItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
      });
    } else if (format === "pdf") {
      exportToPDF<UserItem>({
        filename: targetFilename,
        data: exportData,
        columns: activeColumns,
        title: `User Management Report - ${activeTab}`,
        subtitle: `FluidLogix Transport Network • Scope: ${
          scope === "all"
            ? `All ${activeTab}`
            : scope === "current_page"
            ? `Page ${params.page}`
            : "Filtered Records"
        }`,
        summaryStats: [
          { label: "Exported Rows", value: exportData.length },
          {
            label: "Verified",
            value: exportData.filter((u) => u.verified === "Verified").length,
          },
          {
            label: "Pending",
            value: exportData.filter((u) => u.verified === "Pending").length,
          },
          {
            label: "Active",
            value: exportData.filter((u) => u.status === "Active").length,
          },
        ],
        orientation: "landscape",
      });
    }
  };

  // CRUD Mutations
  const handleAddUser = async (formData: UserFormData): Promise<UserItem> => {
    const newUser: UserItem = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      licenseNo: formData.licenseNo,
      assignedVehicle: formData.assignedVehicle || "Unassigned",
      company: formData.company || "Independent",
      fleetSize: formData.fleetSize,
      contactPerson: formData.contactPerson,
      verified: formData.verified,
      status: formData.status,
      dateRegistered: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [newUser, ...prev]);
    showToast(`User ${newUser.name} added successfully!`);
    return newUser;
  };

  const handleEditUser = async (
    id: string,
    formData: Partial<UserFormData>
  ): Promise<UserItem> => {
    let updatedUser: UserItem | null = null;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          updatedUser = { ...user, ...formData };
          return updatedUser;
        }
        return user;
      })
    );

    showToast(`User ${id} details updated!`);
    return updatedUser!;
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast(`User ${id} removed.`);
  };

  // Bulk Actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    showToast(`${selectedIds.length} users removed.`);
    setSelectedIds([]);
  };

  const handleBulkStatusChange = (status: UserStatus) => {
    if (selectedIds.length === 0) return;
    setUsers((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status } : u))
    );
    showToast(`Updated status for ${selectedIds.length} users to ${status}.`);
  };

  return {
    users,
    filteredUsers,
    total,
    totalPages,
    categoryTotalCount,
    activeTab,
    params,
    setParams,
    selectedIds,
    toastMessage,

    // Modal States
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    isViewOpen,
    setIsViewOpen,
    isExportOpen,
    setIsExportOpen,
    activeUser,
    setActiveUser,

    // Handlers
    handleTabChange,
    handleSearch,
    setDateFilter,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleSelectAll,
    handleToggleSelect,
    handleBulkDelete,
    handleBulkStatusChange,
    handleExport,
    availableExportColumns: userExportColumns.map((c) => ({
      id: c.header,
      label: c.header,
    })),
  };
}

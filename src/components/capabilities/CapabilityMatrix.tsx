"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  Copy,
  Edit,
  Trash2,
  Users,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  Save,
  Check,
  Minus,
  AlertTriangle,
  Info,
  Layers,
  LayoutGrid,
  Eye,
  FileText,
  KeyRound,
  CheckCircle2,
  Truck,
  CreditCard,
  Landmark,
  BarChart3,
  X,
  Building2,
  UserCheck,
  Minimize2,
  Maximize2,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import {
  ModuleCapability,
  PermissionAction,
  PERMISSION_ACTIONS_META,
  ResourceCategory,
  RoleDefinition,
} from "@/types/capability";
import {
  CAPABILITY_CATEGORIES,
  INITIAL_ROLES,
  ROLE_PRESET_TEMPLATES,
} from "@/data/capability-data";
import RoleManagementModal from "./RoleManagementModal";
import RoleUserDrawer from "./RoleUserDrawer";
import ExportCapabilityModal from "./ExportCapabilityModal";
import ModuleAutocomplete from "./ModuleAutocomplete";
import CategoryAutocomplete from "./CategoryAutocomplete";

const ALL_PERMISSION_ACTIONS: PermissionAction[] = [
  "view",
  "add",
  "edit",
  "delete",
  "export",
  "print",
  "approve",
  "audit",
];

const ROLE_ICON_MAP: Record<string, React.ReactNode> = {
  SUPER_ADMIN: <ShieldCheck size={16} className="text-primary" />,
  FLEET_OWNER: <Truck size={16} className="text-emerald-500" />,
  DRIVER: <UserCheck size={16} className="text-sky-500" />,
  COMPANY_CLIENT: <Building2 size={16} className="text-purple-500" />,
  BILLING_ACCOUNTANT: <CreditCard size={16} className="text-indigo-500" />,
};

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Truck: <Truck size={16} className="text-primary" />,
  FileText: <FileText size={16} className="text-primary" />,
  CreditCard: <CreditCard size={16} className="text-primary" />,
  Landmark: <Landmark size={16} className="text-primary" />,
  Users: <Users size={16} className="text-primary" />,
  BarChart3: <BarChart3 size={16} className="text-primary" />,
  ShieldAlert: <ShieldAlert size={16} className="text-primary" />,
};

const STORAGE_KEY_ROLES = "fluidlogix_rbac_roles_v3";

export default function CapabilityMatrix() {
  // Roles & Working Permissions
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [allRolesWorkingPerms, setAllRolesWorkingPerms] = useState<
    Record<string, Record<string, PermissionAction[]>>
  >({});
  const [isModified, setIsModified] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRoleFocus, setSelectedRoleFocus] = useState<string>("all");

  // Handler for Autocomplete module selection with auto-expand and smooth scroll
  const handleSelectAutocompleteModule = (module: ModuleCapability | null) => {
    if (!module) {
      setSelectedModuleId(null);
      setSearchQuery("");
      return;
    }

    setSelectedModuleId(module.id);
    setSearchQuery(module.name);

    // Auto-expand category if collapsed
    if (collapsedCategories[module.categoryId]) {
      setCollapsedCategories((prev) => ({
        ...prev,
        [module.categoryId]: false,
      }));
    }

    // Smooth scroll and pulse highlight
    setTimeout(() => {
      const element = document.getElementById(`module-row-${module.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRowId(module.id);
        setTimeout(() => setHighlightedRowId(null), 3000);
      }
    }, 100);
  };

  // Row Collapsing State (Category IDs)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Role Column Collapsing State (Role IDs that are collapsed to compact summary column)
  const [collapsedRoles, setCollapsedRoles] = useState<Record<string, boolean>>({
    "role-super-admin": false,
    "role-owners": false,
    "role-drivers": false,
    "role-company": false,
    "role-billing-accountant": false,
  });

  // Action Columns Visibility (Global toggle for specific actions, e.g. hide audit)
  const [hiddenActions, setHiddenActions] = useState<Record<PermissionAction, boolean>>({
    view: false,
    add: false,
    edit: false,
    delete: false,
    export: false,
    print: false,
    approve: false,
    audit: false,
  });

  // Modals & Drawers
  const [activeRoleForDrawer, setActiveRoleForDrawer] = useState<RoleDefinition | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [roleModalState, setRoleModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "clone" | "edit";
    targetRole?: RoleDefinition | null;
  }>({ isOpen: false, mode: "create" });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoles(parsed);
          const initialMap: Record<string, Record<string, PermissionAction[]>> = {};
          parsed.forEach((r: RoleDefinition) => {
            initialMap[r.id] = JSON.parse(JSON.stringify(r.permissions || {}));
          });
          setAllRolesWorkingPerms(initialMap);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load roles from storage", e);
    }

    const initialMap: Record<string, Record<string, PermissionAction[]>> = {};
    INITIAL_ROLES.forEach((r) => {
      initialMap[r.id] = JSON.parse(JSON.stringify(r.permissions || {}));
    });
    setAllRolesWorkingPerms(initialMap);
  }, []);

  const allFlatModules = useMemo(() => {
    return CAPABILITY_CATEGORIES.flatMap((c) => c.modules);
  }, []);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle single permission for a specific role and module
  const togglePermission = (roleId: string, moduleId: string, action: PermissionAction) => {
    setAllRolesWorkingPerms((prev) => {
      const rolePerms = prev[roleId] || {};
      const current = rolePerms[moduleId] || [];
      const hasAction = current.includes(action);
      let updated: PermissionAction[];

      if (hasAction) {
        updated = current.filter((a) => a !== action);
      } else {
        if (action !== "view" && !current.includes("view")) {
          updated = [...current, "view", action];
        } else {
          updated = [...current, action];
        }
      }

      setIsModified(true);
      return {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [moduleId]: updated,
        },
      };
    });
  };

  // Row-Wise: Toggle all permissions for a module on a role
  const toggleModuleRowForRole = (roleId: string, module: ModuleCapability) => {
    setAllRolesWorkingPerms((prev) => {
      const rolePerms = prev[roleId] || {};
      const current = rolePerms[module.id] || [];
      const hasAll = module.availableActions.every((a) => current.includes(a));
      const updated = hasAll ? [] : [...module.availableActions];

      setIsModified(true);
      return {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [module.id]: updated,
        },
      };
    });
  };

  // Column-Wise: Toggle an action column across all modules for a specific role
  const toggleColumnActionForRole = (roleId: string, action: PermissionAction) => {
    const eligibleModules = allFlatModules.filter((m) => m.availableActions.includes(action));
    const rolePerms = allRolesWorkingPerms[roleId] || {};
    const allCurrentlyHave = eligibleModules.every((m) => (rolePerms[m.id] || []).includes(action));

    setAllRolesWorkingPerms((prev) => {
      const nextRolePerms = { ...(prev[roleId] || {}) };
      eligibleModules.forEach((m) => {
        const current = nextRolePerms[m.id] || [];
        if (allCurrentlyHave) {
          nextRolePerms[m.id] = current.filter((a) => a !== action);
        } else {
          if (!current.includes(action)) {
            if (action !== "view" && !current.includes("view") && m.availableActions.includes("view")) {
              nextRolePerms[m.id] = [...current, "view", action];
            } else {
              nextRolePerms[m.id] = [...current, action];
            }
          }
        }
      });
      setIsModified(true);
      return {
        ...prev,
        [roleId]: nextRolePerms,
      };
    });

    const roleName = roles.find((r) => r.id === roleId)?.name || "Role";
    showToast(
      allCurrentlyHave
        ? `Revoked "${PERMISSION_ACTIONS_META[action].shortLabel}" on all modules for ${roleName}`
        : `Granted "${PERMISSION_ACTIONS_META[action].shortLabel}" to all modules for ${roleName}`,
      "info"
    );
  };

  // Master: Grant or Revoke everything for a specific role
  const toggleMasterRoleAll = (roleId: string, grantAll: boolean) => {
    setAllRolesWorkingPerms((prev) => {
      const nextRolePerms: Record<string, PermissionAction[]> = {};
      allFlatModules.forEach((m) => {
        nextRolePerms[m.id] = grantAll ? [...m.availableActions] : [];
      });
      setIsModified(true);
      return {
        ...prev,
        [roleId]: nextRolePerms,
      };
    });
    const roleName = roles.find((r) => r.id === roleId)?.name || "Role";
    showToast(grantAll ? `Granted all capabilities to ${roleName}` : `Cleared all capabilities for ${roleName}`, "info");
  };

  // Category-Wise: Toggle all permissions for an entire category on a role
  const toggleCategoryPermissionsForRole = (roleId: string, category: ResourceCategory, grantAll: boolean) => {
    setAllRolesWorkingPerms((prev) => {
      const rolePerms = { ...(prev[roleId] || {}) };
      category.modules.forEach((mod) => {
        rolePerms[mod.id] = grantAll ? [...mod.availableActions] : [];
      });
      setIsModified(true);
      return {
        ...prev,
        [roleId]: rolePerms,
      };
    });
  };

  // Toggle single role collapse
  const toggleRoleCollapse = (roleId: string) => {
    setCollapsedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  // Unified single toggle for all roles
  const isAllRolesCollapsed = useMemo(() => {
    return roles.length > 0 && roles.every((r) => !!collapsedRoles[r.id]);
  }, [roles, collapsedRoles]);

  const handleToggleAllRoles = () => {
    const next: Record<string, boolean> = {};
    roles.forEach((r) => {
      next[r.id] = !isAllRolesCollapsed;
    });
    setCollapsedRoles(next);
    showToast(!isAllRolesCollapsed ? "Collapsed all role columns" : "Expanded all role columns", "info");
  };

  // Toggle single category row collapse
  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Unified single toggle for all categories (rows)
  const isAllCategoriesCollapsed = useMemo(() => {
    return CAPABILITY_CATEGORIES.every((c) => !!collapsedCategories[c.id]);
  }, [collapsedCategories]);

  const handleToggleAllCategories = () => {
    const next: Record<string, boolean> = {};
    CAPABILITY_CATEGORIES.forEach((c) => {
      next[c.id] = !isAllCategoriesCollapsed;
    });
    setCollapsedCategories(next);
    showToast(!isAllCategoriesCollapsed ? "Collapsed all category rows" : "Expanded all category rows", "info");
  };

  // Action column visibility toggle
  const toggleActionVisibility = (action: PermissionAction) => {
    setHiddenActions((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  // Visible Actions
  const visibleActions = useMemo(() => {
    return ALL_PERMISSION_ACTIONS.filter((act) => !hiddenActions[act]);
  }, [hiddenActions]);

  // Roles to display based on Role Focus Filter
  const displayedRoles = useMemo(() => {
    if (selectedRoleFocus === "all") return roles;
    return roles.filter((r) => r.id === selectedRoleFocus);
  }, [roles, selectedRoleFocus]);

  // Filter Categories & Modules
  const filteredCategories = useMemo(() => {
    return CAPABILITY_CATEGORIES.map((cat) => {
      if (selectedCategory !== "all" && cat.id !== selectedCategory) {
        return null;
      }

      const matchingModules = cat.modules.filter((mod) => {
        const matchesQuery =
          !searchQuery ||
          mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesQuery;
      });

      if (matchingModules.length === 0 && searchQuery) {
        return null;
      }

      return {
        ...cat,
        modules: matchingModules,
      };
    }).filter(Boolean) as ResourceCategory[];
  }, [searchQuery, selectedCategory]);

  // Save changes
  const saveAllCapabilities = () => {
    const updatedRoles = roles.map((r) => ({
      ...r,
      permissions: allRolesWorkingPerms[r.id] || r.permissions,
      updatedAt: new Date().toISOString(),
    }));

    setRoles(updatedRoles);
    setIsModified(false);
    try {
      localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(updatedRoles));
    } catch (e) {
      console.error(e);
    }
    showToast("Role Capability Matrix saved successfully!", "success");
  };

  // Revert changes
  const revertAllChanges = () => {
    const initialMap: Record<string, Record<string, PermissionAction[]>> = {};
    roles.forEach((r) => {
      initialMap[r.id] = JSON.parse(JSON.stringify(r.permissions || {}));
    });
    setAllRolesWorkingPerms(initialMap);
    setIsModified(false);
    showToast("Reverted all unsaved changes.", "info");
  };

  // Helper for column check state
  const getColumnStateForRole = (roleId: string, action: PermissionAction) => {
    const eligible = allFlatModules.filter((m) => m.availableActions.includes(action));
    const grantedCount = eligible.filter((m) => (allRolesWorkingPerms[roleId]?.[m.id] || []).includes(action)).length;
    if (grantedCount === 0) return "none";
    if (grantedCount === eligible.length) return "all";
    return "partial";
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-card px-4 py-3 text-xs font-bold text-foreground shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ================= 1. TOP TOOLBAR & QUICK CONTROLS ================= */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <KeyRound size={14} className="text-primary" />
              <span>FluidLogix Role-Based Access Control (RBAC)</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight mt-0.5">
              Role Capabilities & Permissions Matrix
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sticky multi-role grid with row & column collapsing, 1-click bulk selections, and 2-way pinned scrolling.
            </p>
          </div>

          {/* Actions & Export */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              <Download size={14} className="text-primary" />
              <span>Export / Print</span>
            </button>

            <button
              onClick={() => setRoleModalState({ isOpen: true, mode: "create" })}
              className="flex items-center gap-1.5 h-9 rounded-xl bg-primary px-3.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary-hover transition cursor-pointer"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>New Role</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-border">
          {/* Autocomplete Module Search Input */}
          <div className="flex-1 max-w-lg">
            <ModuleAutocomplete
              categories={CAPABILITY_CATEGORIES}
              selectedModuleId={selectedModuleId}
              onSelectModule={handleSelectAutocompleteModule}
              placeholder="Search & jump to module (e.g. Tankers, Invoices, GST, Bank, FASTag)..."
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Focus Filter */}
            <select
              value={selectedRoleFocus}
              onChange={(e) => setSelectedRoleFocus(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary cursor-pointer font-medium"
            >
              <option value="all">All {roles.length} Roles (Full Grid)</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  Focus: {r.name}
                </option>
              ))}
            </select>

            {/* Category Autocomplete Filter */}
            <CategoryAutocomplete
              categories={CAPABILITY_CATEGORIES}
              selectedCategoryId={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
            />
          </div>

          {/* Quick Collapse Unified Single Toggle Buttons */}
          <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3">
            {/* Single Unified Role Toggle */}
            <button
              type="button"
              onClick={handleToggleAllRoles}
              title={isAllRolesCollapsed ? "Expand all role columns" : "Collapse all role columns to summary"}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground hover:bg-muted hover:border-primary/40 transition cursor-pointer shadow-2xs"
            >
              {isAllRolesCollapsed ? (
                <Maximize2 size={13} className="text-primary" />
              ) : (
                <Minimize2 size={13} className="text-primary" />
              )}
              <span>{isAllRolesCollapsed ? "Expand Roles" : "Collapse Roles"}</span>
            </button>

            {/* Single Unified Row Toggle */}
            <button
              type="button"
              onClick={handleToggleAllCategories}
              title={isAllCategoriesCollapsed ? "Expand all category rows" : "Collapse all category rows"}
              className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground hover:bg-muted hover:border-primary/40 transition cursor-pointer shadow-2xs"
            >
              {isAllCategoriesCollapsed ? (
                <ChevronDown size={14} className="text-primary" />
              ) : (
                <ChevronUp size={14} className="text-primary" />
              )}
              <span>{isAllCategoriesCollapsed ? "Expand Rows" : "Collapse Rows"}</span>
            </button>
          </div>
        </div>

        {/* Action Column Visibility Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-border text-xs">
          <span className="text-[11px] text-muted-foreground font-semibold mr-1">
            Toggle Action Columns:
          </span>
          {ALL_PERMISSION_ACTIONS.map((action) => {
            const isHidden = hiddenActions[action];
            const meta = PERMISSION_ACTIONS_META[action];
            return (
              <button
                key={action}
                type="button"
                onClick={() => toggleActionVisibility(action)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  !isHidden
                    ? `${meta.bgColor} ${meta.borderColor} ${meta.color}`
                    : "border-border bg-muted/30 text-muted-foreground/40 line-through"
                }`}
              >
                {!isHidden && <Check size={10} className="stroke-[3]" />}
                <span>{meta.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. STICKY 2D RBAC CAPABILITY MATRIX GRID ================= */}
      <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Scrollable Container with Two-Way Sticky Headers */}
        <div className="overflow-auto max-h-[76vh] custom-scrollbar relative">
          <table className="w-full text-left text-xs border-collapse border-spacing-0">
            {/* ================= TOP STICKY HEADER: ROLES & CAPABILITY ACTIONS ================= */}
            <thead className="sticky top-0 z-30 bg-card shadow-sm">
              {/* Row 1: Role Headers */}
              <tr className="border-b border-border bg-muted/40 text-foreground">
                {/* Fixed Top-Left Corner: Pinned over left module column */}
                <th className="sticky left-0 top-0 z-40 bg-card p-3 sm:px-4 min-w-[280px] max-w-[320px] border-r border-b border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                      Capability Modules ({allFlatModules.length})
                    </span>
                    <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                      7 Groups
                    </span>
                  </div>
                </th>

                {/* Role Column Headers */}
                {displayedRoles.map((role) => {
                  const isCollapsed = !!collapsedRoles[role.id];
                  const rolePermCount = Object.values(allRolesWorkingPerms[role.id] || {}).reduce(
                    (acc, acts) => acc + acts.length,
                    0
                  );

                  return (
                    <th
                      key={role.id}
                      colSpan={isCollapsed ? 1 : visibleActions.length}
                      className="p-2.5 sm:px-3 text-center border-r border-b border-border bg-card transition-all"
                    >
                      <div className="flex flex-col items-center justify-center gap-1.5 min-w-[130px]">
                        {/* Role Title & Collapse Button */}
                        <div className="flex items-center justify-between w-full gap-2 px-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="shrink-0">{ROLE_ICON_MAP[role.code] || <Shield size={14} />}</span>
                            <span className="font-extrabold text-xs text-foreground truncate" title={role.name}>
                              {role.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleRoleCollapse(role.id)}
                              title={isCollapsed ? "Expand Role Actions" : "Collapse to Summary"}
                              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer border border-border/60"
                            >
                              {isCollapsed ? <Maximize2 size={11} /> : <Minimize2 size={11} />}
                            </button>
                          </div>
                        </div>

                        {/* Role Status Pill & Quick Grant/Clear */}
                        <div className="flex items-center justify-between w-full gap-1 px-1">
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${role.badgeColor}`}>
                            {role.securityLevel} • {rolePermCount} Active
                          </span>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => toggleMasterRoleAll(role.id, true)}
                                title={`Grant all capabilities to ${role.name}`}
                                className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer border border-primary/30"
                              >
                                All
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleMasterRoleAll(role.id, false)}
                                title={`Clear all capabilities for ${role.name}`}
                                className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer border border-border"
                              >
                                None
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Row 2: Capability Sub-Action Headers (View, Add, Edit, Delete, Export, Print, Approve, Audit) */}
              <tr className="border-b border-border bg-card text-muted-foreground font-bold text-[10px]">
                {/* Pinned Left Header Sub-Row */}
                <th className="sticky left-0 z-40 bg-card py-2 px-4 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-muted-foreground">
                  <span>Name, Code & Security Classification</span>
                </th>

                {/* Sub-Action Headers for each role */}
                {displayedRoles.map((role) => {
                  const isCollapsed = !!collapsedRoles[role.id];

                  if (isCollapsed) {
                    return (
                      <th
                        key={`${role.id}-collapsed`}
                        className="py-2 px-2 text-center border-r border-border bg-muted/20 min-w-[110px]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleRoleCollapse(role.id)}
                          className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <span>Summary</span>
                          <ChevronRight size={10} />
                        </button>
                      </th>
                    );
                  }

                  return visibleActions.map((action) => {
                    const meta = PERMISSION_ACTIONS_META[action];
                    const colState = getColumnStateForRole(role.id, action);

                    return (
                      <th
                        key={`${role.id}-${action}`}
                        className="py-2 px-1.5 text-center border-r border-border bg-card min-w-[62px]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleColumnActionForRole(role.id, action)}
                          title={`1-Click: Toggle "${meta.label}" on all modules for ${role.name}`}
                          className={`inline-flex items-center justify-center gap-0.5 w-full py-0.5 rounded text-[10px] font-bold transition cursor-pointer border ${
                            colState === "all"
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : colState === "partial"
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {colState === "all" ? (
                            <Check size={9} className="stroke-[3]" />
                          ) : colState === "partial" ? (
                            <Minus size={9} className="stroke-[3]" />
                          ) : null}
                          <span>{meta.shortLabel}</span>
                        </button>
                      </th>
                    );
                  });
                })}
              </tr>
            </thead>

            {/* ================= TABLE BODY WITH CATEGORY ACCORDIONS ================= */}
            <tbody className="divide-y divide-border">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={100}
                    className="p-12 text-center text-muted-foreground bg-background"
                  >
                    <Search size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs font-bold text-foreground">No capabilities found matching filters</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const isCatCollapsed = !!collapsedCategories[category.id];
                  const catModules = category.modules;

                  return (
                    <React.Fragment key={category.id}>
                      {/* Category Accordion Header Row */}
                      <tr className="bg-muted/30 font-extrabold text-foreground border-t-2 border-border/80">
                        {/* Pinned Left Category Header */}
                        <td className="sticky left-0 z-20 bg-muted/90 backdrop-blur-xs py-2.5 px-4 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                          <div
                            className="flex items-center justify-between gap-2 cursor-pointer select-none"
                            onClick={() => toggleCategoryCollapse(category.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                                {CATEGORY_ICON_MAP[category.iconName] || <Layers size={14} />}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {category.title}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground bg-card px-1 py-0.2 rounded border border-border">
                                {category.modules.length}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="p-1 text-muted-foreground hover:text-foreground"
                            >
                              {isCatCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>

                        {/* Category Bulk Controls for each role */}
                        {displayedRoles.map((role) => {
                          const isRoleCollapsed = !!collapsedRoles[role.id];
                          const totalCatPossible = catModules.reduce((acc, m) => acc + m.availableActions.length, 0);
                          const rolePerms = allRolesWorkingPerms[role.id] || {};
                          const grantedCatCount = catModules.reduce(
                            (acc, m) => acc + (rolePerms[m.id] || []).length,
                            0
                          );
                          const hasAllCat = totalCatPossible > 0 && grantedCatCount === totalCatPossible;

                          return (
                            <td
                              key={`${category.id}-${role.id}`}
                              colSpan={isRoleCollapsed ? 1 : visibleActions.length}
                              className="py-1.5 px-2 text-center border-r border-border bg-muted/40"
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground">
                                  {grantedCatCount}/{totalCatPossible}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleCategoryPermissionsForRole(role.id, category, !hasAllCat)
                                  }
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition cursor-pointer border ${
                                    hasAllCat
                                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500 hover:text-white"
                                      : "bg-primary/15 text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
                                  }`}
                                >
                                  {hasAllCat ? "Clear" : "All"}
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Module Rows (if category not collapsed) */}
                      {!isCatCollapsed &&
                        catModules.map((module) => {
                          return (
                            <tr
                              id={`module-row-${module.id}`}
                              key={module.id}
                              className={`transition-all duration-300 group ${
                                highlightedRowId === module.id
                                  ? "bg-primary/20 ring-2 ring-primary ring-inset shadow-md"
                                  : "hover:bg-muted/15"
                              }`}
                            >
                              {/* Pinned Left Module Name & Code */}
                              <td className="sticky left-0 z-20 bg-card py-3 px-4 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                <div className="space-y-0.5 max-w-[300px]">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-foreground text-xs leading-snug">
                                      {module.name}
                                    </span>
                                    <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1 rounded">
                                      {module.code}
                                    </span>
                                    {module.riskLevel === "critical" && (
                                      <span className="px-1 py-0.2 rounded text-[8px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                        CRITICAL
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                                    {module.description}
                                  </p>
                                </div>
                              </td>

                              {/* Permissions for each Role */}
                              {displayedRoles.map((role) => {
                                const isRoleCollapsed = !!collapsedRoles[role.id];
                                const perms = (allRolesWorkingPerms[role.id] || {})[module.id] || [];
                                const hasAllModule = module.availableActions.every((a) => perms.includes(a));

                                if (isRoleCollapsed) {
                                  return (
                                    <td
                                      key={`${module.id}-${role.id}-collapsed`}
                                      className="py-2.5 px-2 text-center border-r border-border bg-muted/5"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleModuleRowForRole(role.id, module)}
                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                          hasAllModule
                                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                            : perms.length > 0
                                            ? "bg-primary/15 text-primary border-primary/30"
                                            : "bg-muted/40 text-muted-foreground/50 border-border hover:border-primary/40"
                                        }`}
                                      >
                                        {hasAllModule ? "FULL" : perms.length > 0 ? `${perms.length} perms` : "NONE"}
                                      </button>
                                    </td>
                                  );
                                }

                                return visibleActions.map((action) => {
                                  const isAvailable = module.availableActions.includes(action);
                                  if (!isAvailable) {
                                    return (
                                      <td
                                        key={`${module.id}-${role.id}-${action}`}
                                        className="py-2.5 px-1 text-center border-r border-border text-muted-foreground/20 font-mono text-[10px]"
                                      >
                                        —
                                      </td>
                                    );
                                  }

                                  const isGranted = perms.includes(action);
                                  const meta = PERMISSION_ACTIONS_META[action];

                                  return (
                                    <td
                                      key={`${module.id}-${role.id}-${action}`}
                                      className="py-2.5 px-1 text-center border-r border-border"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(role.id, module.id, action)}
                                        title={`${role.name} → ${module.name}: ${isGranted ? "Revoke" : "Grant"} ${meta.label}`}
                                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition cursor-pointer border ${
                                          isGranted
                                            ? `${meta.bgColor} ${meta.borderColor} ${meta.color} font-bold shadow-xs scale-105`
                                            : "border-border bg-background text-muted-foreground/30 hover:border-primary/40 hover:text-foreground"
                                        }`}
                                      >
                                        {isGranted ? (
                                          <Check size={12} className="stroke-[3]" />
                                        ) : (
                                          <span className="text-[10px] font-bold opacity-0 group-hover:opacity-40">
                                            +
                                          </span>
                                        )}
                                      </button>
                                    </td>
                                  );
                                });
                              })}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 3. STICKY GLOBAL SAVE / REVERT BAR ================= */}
      {isModified && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl rounded-3xl border border-primary/50 bg-card/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-amber-500/30">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">
                  Unsaved Capability Modifications Detected
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Changes made to role capability matrices. Save to persist across the system.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={revertAllChanges}
                className="flex items-center gap-1 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Revert</span>
              </button>
              <button
                type="button"
                onClick={saveAllCapabilities}
                className="flex items-center gap-1.5 h-9 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-lg shadow-amber-500/25 hover:bg-primary-hover transition cursor-pointer"
              >
                <Save size={14} />
                <span>Save Capabilities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RoleManagementModal
        isOpen={roleModalState.isOpen}
        mode={roleModalState.mode}
        initialRole={roleModalState.targetRole || roles[0]}
        existingRoles={roles}
        onClose={() => setRoleModalState({ ...roleModalState, isOpen: false })}
        onSaveRole={(roleData, isNew) => {
          let newRolesList: RoleDefinition[];
          if (isNew) {
            const newRole = roleData as RoleDefinition;
            newRolesList = [...roles, newRole];
            setRoles(newRolesList);
            setAllRolesWorkingPerms((prev) => ({
              ...prev,
              [newRole.id]: newRole.permissions || {},
            }));
            showToast(`Created new role: ${newRole.name}`, "success");
          } else {
            newRolesList = roles.map((r) => (r.id === roleData.id ? { ...r, ...roleData } : r));
            setRoles(newRolesList);
            showToast(`Updated role details for ${roleData.name}`, "success");
          }
          try {
            localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(newRolesList));
          } catch (e) {
            console.error(e);
          }
        }}
      />

      <RoleUserDrawer
        isOpen={isUserDrawerOpen}
        onClose={() => setIsUserDrawerOpen(false)}
        role={activeRoleForDrawer || roles[0]}
        allRoles={roles}
      />

      <ExportCapabilityModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        roles={roles}
        categories={CAPABILITY_CATEGORIES}
      />
    </div>
  );
}

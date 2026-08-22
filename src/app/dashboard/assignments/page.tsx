"use client";

import { Plus, Radio, Share2, Sparkles, Truck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AssignTruckDrawer from "@/components/assignments/AssignTruckDrawer";
import AssignmentStats from "@/components/assignments/AssignmentStats";
import AssignmentsTable from "@/components/assignments/AssignmentsTable";
import EditAssignmentDrawer from "@/components/assignments/EditAssignmentDrawer";
import ViewAssignmentDrawer from "@/components/assignments/ViewAssignmentDrawer";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { AssignmentService } from "@/services/assignmentService";
import {
  AssignmentFormData,
  AssignmentPaginatedResult,
  AssignmentQueryParams,
  TruckAssignment,
} from "@/types/assignment";

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const requestIdFromUrl = searchParams.get("requestId");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<AssignmentPaginatedResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
    statusCounts: { all: 0, allocated: 0, atPlant: 0, loaded: 0, inTransit: 0, delivered: 0, released: 0 },
  });

  const [params, setParams] = useState<AssignmentQueryParams>({
    page: 1,
    pageSize: 6,
    startDate: new Date().toISOString().split("T")[0],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [preselectedReq, setPreselectedReq] = useState<string | null>(null);
  const [editAssignment, setEditAssignment] = useState<TruckAssignment | null>(null);
  const [viewAssignment, setViewAssignment] = useState<TruckAssignment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // If redirected with ?requestId, automatically trigger drawer
  useEffect(() => {
    if (requestIdFromUrl) {
      setPreselectedReq(requestIdFromUrl);
      setAssignDrawerOpen(true);
    }
  }, [requestIdFromUrl]);

  const fetchAssignments = async () => {
    setIsRefreshing(true);
    try {
      const res = await AssignmentService.getAssignments(params);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [params]);

  const handleParamsChange = (newParams: Partial<AssignmentQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleAssign = async (formData: AssignmentFormData) => {
    const created = await AssignmentService.createAssignment(formData);
    showToast(`Dispatch Pass ${created.id} generated for ${created.vehicleId}!`);
    await fetchAssignments();
    return created;
  };

  const handleEdit = async (id: string, formData: Partial<AssignmentFormData>) => {
    const updated = await AssignmentService.updateAssignment(id, formData);
    showToast(`Allocation ${id} updated.`);
    await fetchAssignments();
    return updated;
  };

  const handleDelete = async (id: string) => {
    await AssignmentService.deleteAssignment(id);
    showToast(`Allocation ${id} removed.`);
    await fetchAssignments();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          title="Truck Allocations"
          subtitle="Assign fleet tankers, drivers, verify safety checklist & issue gate passes"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Toast Notification properly aligned at top-right corner */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2.5 rounded-2xl border border-[#FFA500]/40 bg-card/95 backdrop-blur-md px-4 py-3 text-xs font-bold text-foreground shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFA500]/20 text-[#FFA500]">
              ✓
            </span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6 custom-scrollbar">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Truck Allocations & Dispatches
              </h1>
              <p className="text-xs text-muted-foreground">
                Match compatible tankers, allocate drivers, verify safety checklists & issue gate passes
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setPreselectedReq(null);
                  setAssignDrawerOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Plus size={15} className="stroke-[2.5]" />
                <span>Assign Tanker</span>
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <AssignmentStats stats={data.statusCounts} />

          {/* Allocations Data Table */}
          <AssignmentsTable
            data={data}
            params={params}
            onParamsChange={handleParamsChange}
            onOpenAssign={() => {
              setPreselectedReq(null);
              setAssignDrawerOpen(true);
            }}
            onOpenEdit={(item) => setEditAssignment(item)}
            onOpenView={(item) => setViewAssignment(item)}
            onDelete={handleDelete}
            onRefresh={fetchAssignments}
            isRefreshing={isRefreshing}
          />
        </main>
      </div>

      {/* Assign Tanker Drawer */}
      <AssignTruckDrawer
        isOpen={assignDrawerOpen}
        onClose={() => {
          setAssignDrawerOpen(false);
          setPreselectedReq(null);
        }}
        onAssign={handleAssign}
        preselectedRequestId={preselectedReq}
      />

      {/* Edit Allocation Drawer */}
      <EditAssignmentDrawer
        isOpen={!!editAssignment}
        onClose={() => setEditAssignment(null)}
        onEdit={handleEdit}
        assignment={editAssignment}
      />

      {/* View Allocation & Gate Pass Drawer */}
      <ViewAssignmentDrawer
        isOpen={!!viewAssignment}
        onClose={() => setViewAssignment(null)}
        onEditClick={(item) => {
          setViewAssignment(null);
          setEditAssignment(item);
        }}
        assignment={viewAssignment}
      />
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-muted-foreground">Loading allocations...</div>}>
      <AssignmentsContent />
    </Suspense>
  );
}

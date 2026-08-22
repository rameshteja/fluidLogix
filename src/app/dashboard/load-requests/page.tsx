"use client";

import { PackageSearch, Plus, Sparkles, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import CreateLoadRequestDrawer from "@/components/load-requests/CreateLoadRequestDrawer";
import EditLoadRequestDrawer from "@/components/load-requests/EditLoadRequestDrawer";
import LoadRequestStats from "@/components/load-requests/LoadRequestStats";
import LoadRequestsTable from "@/components/load-requests/LoadRequestsTable";
import ViewLoadRequestDrawer from "@/components/load-requests/ViewLoadRequestDrawer";
import { LoadRequestService } from "@/services/loadRequestService";
import {
  LoadRequest,
  LoadRequestFormData,
  LoadRequestPaginatedResult,
  LoadRequestQueryParams,
} from "@/types/loadRequest";

export default function LoadRequestsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [data, setData] = useState<LoadRequestPaginatedResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
    statusCounts: { all: 0, pending: 0, assigned: 0, inTransit: 0, completed: 0, cancelled: 0 },
    priorityCounts: { urgent: 0, high: 0, normal: 0 },
  });

  const [params, setParams] = useState<LoadRequestQueryParams>({
    page: 1,
    pageSize: 6,
    startDate: new Date().toISOString().split("T")[0],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<LoadRequest | null>(null);
  const [viewRequest, setViewRequest] = useState<LoadRequest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      const res = await LoadRequestService.getLoadRequests(params);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [params]);

  const handleParamsChange = (newParams: Partial<LoadRequestQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleCreate = async (formData: LoadRequestFormData) => {
    const created = await LoadRequestService.createLoadRequest(formData);
    showToast(`Requisition ${created.id} posted successfully!`);
    await fetchRequests();
    return created;
  };

  const handleEdit = async (id: string, formData: Partial<LoadRequestFormData>) => {
    const updated = await LoadRequestService.updateLoadRequest(id, formData);
    showToast(`Requisition ${id} updated successfully!`);
    await fetchRequests();
    return updated;
  };

  const handleDelete = async (id: string) => {
    await LoadRequestService.deleteLoadRequest(id);
    showToast(`Requisition ${id} removed.`);
    await fetchRequests();
  };

  const handleOpenAssign = (request: LoadRequest) => {
    router.push(`/dashboard/assignments?requestId=${encodeURIComponent(request.id)}`);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
        {/* Top Navbar */}
        <TopNavbar
          title="Load Requests"
          subtitle="Manage client tanker requisitions & cargo indents"
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

        {/* Load Requests Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6">
          {/* Header Action Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Company Load Requests
              </h1>
              <p className="text-xs text-muted-foreground">
                Review indents, filter by date/material & dispatch matching available fleet
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setCreateDrawerOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Plus size={15} className="stroke-[2.5]" />
                <span>Post Load Request</span>
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <LoadRequestStats stats={data.statusCounts} priorityStats={data.priorityCounts} />

          {/* Load Requests Data Table / Grid Workspace */}
          <LoadRequestsTable
            data={data}
            params={params}
            onParamsChange={handleParamsChange}
            onOpenCreate={() => setCreateDrawerOpen(true)}
            onOpenEdit={(r) => setEditRequest(r)}
            onOpenView={(r) => setViewRequest(r)}
            onOpenAssign={handleOpenAssign}
            onDelete={handleDelete}
            onRefresh={fetchRequests}
            isRefreshing={isRefreshing}
          />
        </main>
      </div>

      {/* Create Requisition Drawer */}
      <CreateLoadRequestDrawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onCreate={handleCreate}
      />

      {/* Edit Requisition Drawer */}
      <EditLoadRequestDrawer
        isOpen={!!editRequest}
        onClose={() => setEditRequest(null)}
        onEdit={handleEdit}
        request={editRequest}
      />

      {/* View Requisition Drawer */}
      <ViewLoadRequestDrawer
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        onEditClick={(r) => {
          setViewRequest(null);
          setEditRequest(r);
        }}
        onAssignClick={handleOpenAssign}
        request={viewRequest}
      />
    </div>
  );
}

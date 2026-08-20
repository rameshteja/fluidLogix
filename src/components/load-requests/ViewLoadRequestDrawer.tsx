"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Droplets,
  Edit,
  ExternalLink,
  FileCheck,
  FileText,
  Flame,
  Gauge,
  Layers,
  MapPin,
  Phone,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { MaterialCategory } from "@/types/dashboard";
import { LoadRequest, LoadRequestStatus, RequestPriority } from "@/types/loadRequest";

interface ViewLoadRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (request: LoadRequest) => void;
  onAssignClick: (request: LoadRequest) => void;
  request: LoadRequest | null;
}

export default function ViewLoadRequestDrawer({
  isOpen,
  onClose,
  onEditClick,
  onAssignClick,
  request,
}: ViewLoadRequestDrawerProps) {
  if (!isOpen || !request) return null;

  const getStatusBadge = (status: LoadRequestStatus) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Pending Assignment
          </span>
        );
      case "Assigned":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Assigned ({request.assignedVehicleId || "TK-Allocated"})
          </span>
        );
      case "Loading":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Loading at Plant
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-[#FFA500]">
            <span className="h-2 w-2 rounded-full bg-[#FFA500] animate-pulse" />
            In Transit
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
            Cancelled
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: RequestPriority) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-lg">
            <Flame size={12} />
            Urgent Requisition
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
            High Priority
          </span>
        );
      case "Normal":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted border border-border px-2.5 py-0.5 rounded-lg">
            Standard Order
          </span>
        );
    }
  };

  const getMaterialColor = (material: MaterialCategory) => {
    switch (material) {
      case "Chemical":
        return "text-[#FFA500] bg-[#FFA500]/10 border-[#FFA500]/25";
      case "Hazardous":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25";
      case "Waste Water":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25";
      case "Non-Hazard":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity drawer-backdrop-animate"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-2xl bg-card border-l border-border/80 shadow-2xl flex flex-col h-full overflow-hidden drawer-panel-animate drawer-glow-edge">
          {/* Header */}
          <div className="p-5 sm:px-6 border-b border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-sm font-mono font-bold text-xs">
                {request.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    {request.company}
                  </h2>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getPriorityBadge(request.priority)}
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Posted on {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEditClick(request);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <Edit size={13} />
                <span>Edit</span>
              </button>

              <button
                onClick={onClose}
                type="button"
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
            {/* Action Callout if Pending */}
            {request.status === "Pending" && (
              <div className="rounded-2xl border border-[#FFA500]/40 bg-[#FFA500]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <Zap size={15} className="text-[#FFA500]" />
                    <span>Requisition Ready for Tanker Allocation</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Match with available {request.tankerType} ({request.bodyType} body, {request.requiredCapacity.toLocaleString()} L)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAssignClick(request);
                  }}
                  className="rounded-xl bg-[#FFA500] px-4 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Truck size={14} className="stroke-[2.5]" />
                  <span>Assign Truck Now</span>
                </button>
              </div>
            )}

            {/* Metrics Highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Gauge size={14} className="text-[#FFA500]" />
                  <span>Required Capacity</span>
                </div>
                <div className="mt-1 text-lg font-bold text-foreground font-mono">
                  {request.requiredCapacity.toLocaleString()} Litres
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {request.compartmentsNeeded} Chamber Compartments
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span>Offered Freight</span>
                </div>
                <div className="mt-1 text-lg font-bold text-emerald-400 font-mono">
                  ₹{request.offeredRate.toLocaleString()}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Lump sum agreed payout
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ShieldAlert size={14} className="text-[#FFA500]" />
                  <span>Cargo Category</span>
                </div>
                <div className="mt-1.5">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getMaterialColor(
                      request.materialCategory
                    )}`}
                  >
                    {request.materialCategory}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Tanker: {request.bodyType} body
                </span>
              </div>
            </div>

            {/* Cargo & Requester Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Chemical Cargo */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60">
                  Cargo Specifications
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Chemical / Material Name</span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{request.chemicalName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Tanker Type</span>
                    <span className="font-semibold text-foreground">{request.tankerType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Body Material</span>
                    <span className="font-semibold text-[#FFA500]">{request.bodyType}</span>
                  </div>
                </div>
              </div>

              {/* Authorised Requester */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60">
                  Requester Contact Info
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Authorised Contact Person</span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{request.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Phone / WhatsApp</span>
                  <span className="text-xs font-mono font-semibold text-[#FFA500] block mt-0.5">{request.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Route & Schedule Timeline */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
              <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                <span>Route Manifest & Target Window</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Pickup: {request.pickupCity} → Drop: {request.deliveryCity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Origin Loading Depot</span>
                  </div>
                  <div className="text-xs font-medium text-foreground pl-3.5">
                    {request.pickupLocation} ({request.pickupCity})
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-3.5 font-mono pt-1">
                    Date: {request.loadingDate} ({request.loadingTimeWindow})
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFA500]">
                    <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
                    <span>Destination Delivery Site</span>
                  </div>
                  <div className="text-xs font-medium text-foreground pl-3.5">
                    {request.deliveryLocation} ({request.deliveryCity})
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-3.5 font-mono pt-1">
                    Target: {request.expectedDeliveryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions & Safety Protocols */}
            {request.specialInstructions && (
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center gap-2">
                  <Shield size={14} className="text-[#FFA500]" />
                  <span>Special Handling & Safety Protocols</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {request.specialInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:px-6 border-t border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground font-mono">
              Requisition Ref: <span className="text-[#FFA500] font-bold">{request.id}</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Close View
              </button>

              {request.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAssignClick(request);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
                >
                  <Truck size={14} className="stroke-[2.5]" />
                  <span>Assign Truck</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

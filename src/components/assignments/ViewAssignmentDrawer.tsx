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
  Gauge,
  Layers,
  MapPin,
  Phone,
  Printer,
  Radio,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { AssignmentStatus, TruckAssignment } from "@/types/assignment";
import { MaterialCategory } from "@/types/dashboard";

interface ViewAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (assignment: TruckAssignment) => void;
  assignment: TruckAssignment | null;
}

export default function ViewAssignmentDrawer({
  isOpen,
  onClose,
  onEditClick,
  assignment,
}: ViewAssignmentDrawerProps) {
  if (!isOpen || !assignment) return null;

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case "Allocated":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Allocated
          </span>
        );
      case "At Plant":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            At Plant (Loading Bay)
          </span>
        );
      case "Loaded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <CheckCircle2 size={12} />
            Loaded & Sealed
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-[#FFA500]">
            <span className="h-2 w-2 rounded-full bg-[#FFA500] animate-pulse" />
            In Transit (Highway)
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={12} />
            Delivered
          </span>
        );
      case "Released":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-muted-foreground/30 bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            Released / Available
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
                {assignment.vehicleId}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    {assignment.company}
                  </h2>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-[#FFA500] font-bold">
                    Pass: {assignment.gatePassNo}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    • Ref: {assignment.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Print Gate Pass"
              >
                <Printer size={13} />
                <span className="hidden sm:inline">Print Gate Pass</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onEditClick(assignment);
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
            {/* Key Metric Highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Truck size={14} className="text-[#FFA500]" />
                  <span>Assigned Vehicle</span>
                </div>
                <div className="mt-1 text-lg font-bold text-foreground font-mono">
                  {assignment.vehicleId}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Plate: {assignment.plateNo}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Gauge size={14} className="text-[#FFA500]" />
                  <span>Payload Volume</span>
                </div>
                <div className="mt-1 text-lg font-bold text-foreground font-mono">
                  {assignment.allocatedCapacity.toLocaleString()} L
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {assignment.bodyType} Body Tanker
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Radio size={14} className="text-emerald-400" />
                  <span>GPS Telemetry</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-400">Live Active</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Tracking on Highway</span>
              </div>
            </div>

            {/* Crew & Transporter Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center gap-2">
                  <User size={14} className="text-[#FFA500]" />
                  <span>Assigned Driver Details</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Driver Name</span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{assignment.driver}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Phone</span>
                    <span className="font-mono text-foreground">{assignment.driverPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">License No.</span>
                    <span className="font-mono text-[#FFA500]">{assignment.driverLicense}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center gap-2">
                  <Building2 size={14} className="text-[#FFA500]" />
                  <span>Transporter & Client Info</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Client Company</span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{assignment.company}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Transporter / Fleet Owner</span>
                  <span className="text-xs text-foreground block mt-0.5">{assignment.transporter}</span>
                </div>
              </div>
            </div>

            {/* Compartment Load Allocations */}
            {assignment.compartmentAllocations && assignment.compartmentAllocations.length > 0 && (
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gauge size={14} className="text-[#FFA500]" />
                    <span>Compartment Loading Manifest ({assignment.compartmentAllocations.length} Chambers)</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#FFA500]">
                    Total: {assignment.allocatedCapacity.toLocaleString()} L
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {assignment.compartmentAllocations.map((comp) => (
                    <div
                      key={comp.compartmentNo}
                      className="rounded-xl border border-border bg-background p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">
                          Chamber {comp.compartmentNo}
                        </div>
                        <div className="text-xs font-semibold text-foreground mt-0.5">
                          {comp.loadedMaterial}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-foreground text-xs">
                          {comp.capacity.toLocaleString()} L
                        </div>
                        {comp.grossWeightKg && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            ~{(comp.grossWeightKg / 1000).toFixed(1)} MT
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Route Timeline */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
              <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                <span>Route & Loading Schedule</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {assignment.originCity} → {assignment.destinationCity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Origin Loading Site</span>
                  </div>
                  <div className="text-xs font-medium text-foreground pl-3.5">
                    {assignment.origin} ({assignment.originCity})
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-3.5 font-mono pt-1">
                    Loading: {assignment.expectedLoadingDate}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFA500]">
                    <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
                    <span>Destination Delivery Site</span>
                  </div>
                  <div className="text-xs font-medium text-foreground pl-3.5">
                    {assignment.destination} ({assignment.destinationCity})
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-3.5 font-mono pt-1">
                    Target: {assignment.expectedDeliveryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Dispatch Safety Checklist Summary */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
              <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" />
                <span>Verified Pre-Dispatch Safety Audit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Tanker Degassed & Cleaned</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Live GPS Tracking Online</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Hazmat Kit & PPE on Board</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Driver Safety Protocol Briefed</span>
                </div>
              </div>
            </div>

            {/* Commercials & Gate Pass Ref */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground block">Commercial Settlement</span>
                <span className="text-sm font-bold text-foreground font-mono">
                  Agreed: ₹{assignment.freightRate.toLocaleString()} | Advance: ₹{assignment.advancePaid.toLocaleString()}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Gate Pass Authorization</span>
                <span className="text-xs font-mono font-bold text-[#FFA500]">
                  {assignment.gatePassNo} ({assignment.dispatchOfficer})
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:px-6 border-t border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground font-mono">
              Pass Ref: <span className="text-[#FFA500] font-bold">{assignment.id}</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Weight,
  X,
} from "lucide-react";
import { LoadLogItem } from "@/types/loadLog";

interface ViewLoadLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: LoadLogItem | null;
}

export default function ViewLoadLogModal({
  isOpen,
  onClose,
  log,
}: ViewLoadLogModalProps) {
  if (!isOpen || !log) return null;

  const getCategoryBadgeClass = () => {
    switch (log.category) {
      case "Chemical":
        return "text-[#FFA500] bg-[#FFA500]/10 border-[#FFA500]/30";
      case "Hazardous":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30";
      case "Waste Water":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30";
      case "Non-Hazard":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const getStatusBadge = () => {
    switch (log.status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Completed</span>
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>In Transit</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Clock size={13} />
            <span>Pending Dispatch</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
            <AlertCircle size={13} />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 font-bold">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-black text-[#FFA500] bg-[#FFA500]/10 px-2.5 py-0.5 rounded-lg border border-[#FFA500]/30 tracking-wide">
                  {log.id}
                </span>
                <span className="text-base font-bold text-foreground">
                  Daily Load Manifest Details
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dispatch Date: <span className="text-foreground font-semibold">{log.date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 text-xs">
          {/* 1. Route Visual Flow Timeline */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#FFA500]">
                <Navigation size={13} />
                <span>Transport Route & Waypoints</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                log.type === "Non-Local"
                  ? "bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/30"
                  : "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30"
              }`}>
                {log.type} Transit Scope
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
              {/* Origin */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <MapPin size={14} />
                  <span>Origin (Loading Point)</span>
                </div>
                <p className="text-sm font-bold text-foreground">{log.from}</p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock size={11} className="text-[#FFA500]" />
                  <span>Loading Time: <strong className="text-foreground">{log.loadTime} hrs</strong></span>
                </div>
              </div>

              {/* Direction Indicator */}
              <div className="hidden sm:flex flex-col items-center justify-center px-4">
                <div className="text-[10px] text-muted-foreground font-mono font-bold mb-1">
                  En Route
                </div>
                <div className="flex items-center gap-1 text-[#FFA500]">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 via-[#FFA500] to-cyan-500" />
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5 text-cyan-400 font-semibold">
                  <MapPin size={14} />
                  <span>Destination (Unloading Point)</span>
                </div>
                <p className="text-sm font-bold text-foreground">{log.to}</p>
                <div className="flex items-center sm:justify-end gap-1 text-[11px] text-muted-foreground">
                  <Clock size={11} className="text-[#38BDF8]" />
                  <span>Unloading Time: <strong className="text-foreground">{log.unloadTime || "In Transit"}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Grid Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Card: Cargo & Material */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5 border-b border-border pb-2">
                <Weight size={14} className="text-[#FFA500]" />
                <span>Cargo Specifications</span>
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Material Name:</span>
                  <span className="font-bold text-foreground text-sm">{log.material}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Category:</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getCategoryBadgeClass()}`}>
                    {log.category}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gross Weight:</span>
                  <span className="font-mono font-bold text-foreground text-sm">{log.weightDisplay}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hazard Classification:</span>
                  <span className="font-semibold text-foreground">{log.hazardClass || "Standard Material"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Security Seal No:</span>
                  <span className="font-mono font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded border border-[#FFA500]/25">
                    {log.sealNo || "SL-0000"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Vehicle, Driver & Company */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5 border-b border-border pb-2">
                <Truck size={14} className="text-[#FFA500]" />
                <span>Vehicle & Operator Info</span>
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned Tanker:</span>
                  <span className="font-mono font-black text-[#FFA500] text-sm bg-muted/60 px-2 py-0.5 rounded border border-border">
                    {log.vehicle}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver Name:</span>
                  <span className="font-bold text-foreground">{log.driver}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver Phone:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Phone size={11} className="text-[#FFA500]" />
                    {log.driverPhone || "+91 98450 00000"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Partner Company / Hub:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Building2 size={12} className="text-[#FFA500]" />
                    {log.company}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trip Billable Amount:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {log.amount ? `₹${log.amount.toLocaleString("en-IN")}` : "₹0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Dispatch Notes */}
          {log.notes && (
            <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-1">
              <span className="font-semibold text-muted-foreground text-[11px] flex items-center gap-1">
                <FileCheck size={13} className="text-[#FFA500]" />
                <span>Dispatch & Compliance Remarks</span>
              </span>
              <p className="text-foreground leading-relaxed text-xs">{log.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/30">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Manifest</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-secondary px-5 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  Edit,
  Eye,
  FileCheck,
  Fuel,
  Gauge,
  MapPin,
  Radio,
  Shield,
  ShieldAlert,
  Truck,
  User,
  X,
} from "lucide-react";
import { FleetStatus, FleetVehicle, MaterialCategory } from "@/types/fleet";

interface ViewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (vehicle: FleetVehicle) => void;
  vehicle: FleetVehicle | null;
}

export default function ViewVehicleModal({
  isOpen,
  onClose,
  onEditClick,
  vehicle,
}: ViewVehicleModalProps) {
  if (!isOpen || !vehicle) return null;

  const getStatusBadge = (status: FleetStatus) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Active Fleet
          </span>
        );
      case "Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            In Transit
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Under Maintenance
          </span>
        );
      case "Idle":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/25 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Idle / Depot
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1A344D] bg-[#0A1A2B] shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#142637] px-6 py-4 bg-[#081523]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-sm font-mono font-bold text-sm">
              {vehicle.id}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-[#F1F5F9] leading-tight">
                  {vehicle.plateNo}
                </h2>
                {getStatusBadge(vehicle.status)}
              </div>
              <p className="text-xs text-[#5E7995] font-medium mt-0.5">
                {vehicle.tankerType} • Registered Tanker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditClick(vehicle);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E3B56] bg-[#0C1F32] px-3 py-1.5 text-xs font-semibold text-[#FFA500] hover:bg-[#FFA500] hover:text-[#071522] transition cursor-pointer"
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#5A7692] hover:bg-[#0E2337] hover:text-[#F1F5F9] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#14293C] bg-[#071522] p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#7E9AB5]">
                <Gauge size={15} className="text-[#FFA500]" />
                <span>Payload Capacity</span>
              </div>
              <div className="mt-1.5 text-xl font-bold text-[#F1F5F9] font-mono">
                {vehicle.capacityDisplay}
              </div>
              <span className="text-[10px] text-[#55718E]">Calibrated Tank Volume</span>
            </div>

            <div className="rounded-xl border border-[#14293C] bg-[#071522] p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#7E9AB5]">
                <ShieldAlert size={15} className="text-[#EF4444]" />
                <span>Hazmat Classification</span>
              </div>
              <div className="mt-1.5">
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getMaterialColor(
                    vehicle.material
                  )}`}
                >
                  {vehicle.material}
                </span>
              </div>
              <span className="text-[10px] text-[#55718E] block mt-1">Hazard category compliance</span>
            </div>

            <div className="rounded-xl border border-[#14293C] bg-[#071522] p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#7E9AB5]">
                <Radio size={15} className="text-emerald-400" />
                <span>GPS Telemetry</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">
                  {vehicle.gpsStatus || "Online"}
                </span>
              </div>
              <span className="text-[10px] text-[#55718E]">Live Tracking Active</span>
            </div>
          </div>

          {/* Location / Hub info */}
          <div className="rounded-xl border border-[#14293C] bg-[#071522] p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8DA6BE] mb-1.5">
              <MapPin size={14} className="text-[#FFA500]" />
              <span>Current Geolocation & Hub</span>
            </div>
            <div className="text-xs text-[#E8EEF5] font-medium pl-5">
              {vehicle.currentLocation || "HQ Transport Yard, Main Logistics Hub"}
            </div>
          </div>

          {/* Transporter & Driver Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Owner & Company */}
            <div className="rounded-xl border border-[#14293C] bg-[#071522] p-4 space-y-3">
              <div className="text-xs font-bold text-[#F1F5F9] pb-2 border-b border-[#142637]">
                Ownership & Client
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00AEEF]/10 text-[#00AEEF]">
                  <User size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-[#5E7995]">Fleet Owner / Transporter</div>
                  <div className="text-xs font-semibold text-[#E2E8F0]">{vehicle.owner}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B6CFF]/10 text-[#8B6CFF]">
                  <Building2 size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-[#5E7995]">Assigned Industrial Client</div>
                  <div className="text-xs font-semibold text-[#E2E8F0]">{vehicle.company}</div>
                </div>
              </div>
            </div>

            {/* Driver & Assignment */}
            <div className="rounded-xl border border-[#14293C] bg-[#071522] p-4 space-y-3">
              <div className="text-xs font-bold text-[#F1F5F9] pb-2 border-b border-[#142637]">
                Driver & Safety Records
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00C897]/10 text-[#00C897]">
                  <User size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-[#5E7995]">Primary Driver</div>
                  <div className="text-xs font-semibold text-[#E2E8F0]">{vehicle.driver}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFA500]/10 text-[#FFA500]">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-[#5E7995]">Hazmat Safety Clearance</div>
                  <div className="text-xs font-semibold text-emerald-400">Verified & Certified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Maintenance Dates */}
          <div className="rounded-xl border border-[#14293C] bg-[#071522] p-4">
            <div className="text-xs font-bold text-[#F1F5F9] pb-2.5 border-b border-[#142637] mb-3">
              Compliance, PUC & Service Schedules
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div>
                <div className="text-[11px] text-[#5E7995]">Last Service</div>
                <div className="font-mono text-xs font-semibold text-[#E2E8F0] mt-0.5">
                  {vehicle.lastServiceDate || "2025-06-15"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5E7995]">PUC Expiry</div>
                <div className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">
                  {vehicle.pucExpiry || "2025-12-31"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5E7995]">Insurance Expiry</div>
                <div className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">
                  {vehicle.insuranceExpiry || "2026-03-15"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5E7995]">Registration Date</div>
                <div className="font-mono text-xs font-semibold text-[#8DA6BE] mt-0.5">
                  {vehicle.registrationDate || "2023-01-10"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#142637] px-6 py-3.5 bg-[#081523]">
          <div className="text-xs text-[#5E7995]">
            Vehicle ID: <span className="font-mono text-[#FFA500] font-bold">{vehicle.id}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FFA500] px-5 py-2 text-xs font-bold text-[#071522] hover:bg-[#FFB733] transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

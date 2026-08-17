"use client";

import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { UserItem } from "@/types/user";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
}

export default function ViewUserModal({
  isOpen,
  onClose,
  user,
}: ViewUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 font-bold text-base">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground leading-tight">
                  {user.name}
                </h2>
                <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded border border-[#FFA500]/20">
                  {user.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {user.category} Account Profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Status Badges */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Verification:</span>
              {user.verified === "Verified" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Verified</span>
                </span>
              ) : user.verified === "Pending" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <AlertTriangle size={14} />
                  <span>Pending</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <X size={14} />
                  <span>Rejected</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Phone size={13} className="text-[#FFA500]" /> Phone
              </span>
              <p className="font-semibold text-foreground">{user.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Mail size={13} className="text-[#FFA500]" /> Email
              </span>
              <p className="font-semibold text-foreground truncate">{user.email}</p>
            </div>

            {user.licenseNo && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <FileCheck size={13} className="text-[#FFA500]" /> License No.
                </span>
                <p className="font-mono font-bold text-[#FFA500]">{user.licenseNo}</p>
              </div>
            )}

            {user.assignedVehicle && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Truck size={13} className="text-[#FFA500]" /> Assigned Vehicle
                </span>
                <p className="font-mono font-bold text-[#FFA500]">
                  {user.assignedVehicle}
                </p>
              </div>
            )}

            {user.company && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Building2 size={13} className="text-[#FFA500]" /> Company / Hub
                </span>
                <p className="font-semibold text-foreground">{user.company}</p>
              </div>
            )}

            {user.fleetSize !== undefined && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Truck size={13} className="text-[#FFA500]" /> Fleet Size
                </span>
                <p className="font-semibold text-foreground">{user.fleetSize} Vehicles</p>
              </div>
            )}

            {user.activeFleetCount !== undefined && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Truck size={13} className="text-[#FFA500]" /> Active Fleet Count
                </span>
                <p className="font-semibold text-foreground">{user.activeFleetCount} Vehicles</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Calendar size={13} className="text-[#FFA500]" /> Date Registered
              </span>
              <p className="font-semibold text-foreground">{user.dateRegistered}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border px-6 py-3 bg-muted/30">
          <button
            onClick={onClose}
            className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

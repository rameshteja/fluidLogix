"use client";

import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Eye,
  FileCheck,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  User,
  X,
  ZoomIn,
} from "lucide-react";
import React, { useState } from "react";
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
  const [activeDocPreview, setActiveDocPreview] = useState<{
    name: string;
    url?: string;
  } | null>(null);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-amber-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground leading-tight">
                  {user.name}
                </h2>
                <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {user.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {user.category} Profile & Compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Status Badges */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                KYC Verification:
              </span>
              {user.verified === "Verified" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={15} />
                  <span>Verified</span>
                </span>
              ) : user.verified === "Pending" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle size={15} />
                  <span>Pending</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <X size={15} />
                  <span>Rejected</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Account Status:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  user.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-3.5 rounded-2xl border border-border bg-muted/10 p-4">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Phone size={13} className="text-primary" /> Phone
              </span>
              <p className="font-semibold text-foreground font-mono">{user.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Mail size={13} className="text-primary" /> Email
              </span>
              <p className="font-semibold text-foreground truncate">{user.email}</p>
            </div>

            {user.licenseNo && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <FileCheck size={13} className="text-primary" /> License No.
                </span>
                <p className="font-mono font-bold text-primary">{user.licenseNo}</p>
              </div>
            )}

            {user.licenseExpiryDate && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Calendar size={13} className="text-primary" /> License Expiry Date
                </span>
                <p className="font-mono font-semibold text-foreground">{user.licenseExpiryDate}</p>
              </div>
            )}

            {user.assignedVehicle && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Truck size={13} className="text-primary" /> Assigned Vehicle
                </span>
                <p className="font-mono font-bold text-foreground">
                  {user.assignedVehicle}
                </p>
              </div>
            )}

            {user.panNumber && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <CreditCard size={13} className="text-primary" /> PAN Number
                </span>
                <p className="font-mono font-bold text-foreground">{user.panNumber}</p>
              </div>
            )}

            {user.gstNumber && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Building2 size={13} className="text-primary" /> GSTIN
                </span>
                <p className="font-mono font-bold text-primary">{user.gstNumber}</p>
              </div>
            )}

            {user.owner && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <User size={13} className="text-primary" /> Fleet Owner
                </span>
                <p className="font-semibold text-foreground">{user.owner}</p>
              </div>
            )}

            {user.company && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Building2 size={13} className="text-primary" /> Company / Hub
                </span>
                <p className="font-semibold text-foreground">{user.company}</p>
              </div>
            )}

            {user.fleetSize !== undefined && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Truck size={13} className="text-primary" /> Fleet Size
                </span>
                <p className="font-semibold text-foreground">{user.fleetSize} Tankers</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Calendar size={13} className="text-primary" /> Registered On
              </span>
              <p className="font-semibold text-foreground">{user.dateRegistered}</p>
            </div>
          </div>

          {/* ================= UPLOADED KYC DOCUMENTS SECTION ================= */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Uploaded Documents & Compliance</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                256-Bit Encrypted Storage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Address Proof Card */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">
                      {user.addressProofType || "Address Proof"}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {typeof user.addressProofFile === "object" && user.addressProofFile?.name
                        ? user.addressProofFile.name
                        : "Verified Document.pdf"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveDocPreview({
                      name: user.addressProofType || "Address Proof",
                      url:
                        typeof user.addressProofFile === "object"
                          ? user.addressProofFile?.url
                          : undefined,
                    })
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 ml-2"
                  title="View document"
                >
                  <Eye size={13} />
                </button>
              </div>

              {/* Driving License / PAN / Incorporation Card */}
              {user.category === "Drivers" && (
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/20">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 shrink-0">
                      <FileCheck size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">
                        Driving Licence
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {typeof user.licenseFile === "object" && user.licenseFile?.name
                          ? user.licenseFile.name
                          : "DL_Scanned_Copy.pdf"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDocPreview({
                        name: "Driving Licence Document",
                        url:
                          typeof user.licenseFile === "object"
                            ? user.licenseFile?.url
                            : undefined,
                      })
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 ml-2"
                    title="View document"
                  >
                    <Eye size={13} />
                  </button>
                </div>
              )}

              {user.category === "Owners" && (
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/20">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
                      <CreditCard size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">
                        Transporter PAN Card
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {typeof user.panFile === "object" && user.panFile?.name
                          ? user.panFile.name
                          : "PAN_Document.pdf"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDocPreview({
                        name: "Transporter PAN Card Document",
                        url:
                          typeof user.panFile === "object"
                            ? user.panFile?.url
                            : undefined,
                      })
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 ml-2"
                    title="View document"
                  >
                    <Eye size={13} />
                  </button>
                </div>
              )}

              {user.category === "Companies" && (
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/20">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">
                        Registration Certificate
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {typeof user.companyRegistrationCertFile === "object" &&
                        user.companyRegistrationCertFile?.name
                          ? user.companyRegistrationCertFile.name
                          : typeof user.incorporationCertFile === "object" &&
                            user.incorporationCertFile?.name
                          ? user.incorporationCertFile.name
                          : "Company_Registration_Certificate.pdf"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDocPreview({
                        name: "Company Registration Certificate",
                        url:
                          typeof user.companyRegistrationCertFile === "object"
                            ? user.companyRegistrationCertFile?.url
                            : typeof user.incorporationCertFile === "object"
                            ? user.incorporationCertFile?.url
                            : undefined,
                      })
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 ml-2"
                    title="View document"
                  >
                    <Eye size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border px-6 py-3 bg-muted/20">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Document View Zoom Modal */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveDocPreview(null)}
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/30">
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-[#FFA500]" />
                <span className="text-xs font-bold text-foreground">
                  {activeDocPreview.name}
                </span>
              </div>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-background min-h-[220px]">
              {activeDocPreview.url ? (
                <img
                  src={activeDocPreview.url}
                  alt={activeDocPreview.name}
                  className="max-h-[50vh] max-w-full rounded-xl object-contain border border-border shadow-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-border bg-muted/20 space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-foreground">
                      {activeDocPreview.name}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PDF Document • Verified on File
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

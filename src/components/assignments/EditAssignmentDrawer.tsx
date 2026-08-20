"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Droplets,
  Edit3,
  Flame,
  Gauge,
  Layers,
  MapPin,
  Phone,
  Shield,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import { COMPANY_FILTER_OPTIONS } from "@/data/filterOptions";
import { initialFleetVehicles } from "@/data/fleet-data";
import { validateAssignmentForm } from "@/services/assignmentService";
import {
  AssignmentFormData,
  AssignmentFormErrors,
  AssignmentStatus,
  CompartmentAllocation,
  SecurityChecklist,
  TruckAssignment,
} from "@/types/assignment";
import { MaterialCategory } from "@/types/dashboard";

interface EditAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: Partial<AssignmentFormData>) => Promise<TruckAssignment>;
  assignment: TruckAssignment | null;
}

export default function EditAssignmentDrawer({
  isOpen,
  onClose,
  onEdit,
  assignment,
}: EditAssignmentDrawerProps) {
  const [formData, setFormData] = useState<AssignmentFormData>({
    company: "",
    vehicleId: "",
    driver: "",
    driverPhone: "",
    driverLicense: "",
    transporter: "",
    materialCategory: "Chemical",
    chemicalName: "",
    allocatedCapacity: 20000,
    compartmentAllocations: [],
    origin: "",
    originCity: "",
    destination: "",
    destinationCity: "",
    assignmentDate: "",
    expectedLoadingDate: "",
    expectedDeliveryDate: "",
    freightRate: 45000,
    advancePaid: 20000,
    securityChecklist: {
      tankerCleaned: true,
      gpsOnline: true,
      hazmatKitVerified: true,
      driverBriefed: true,
      fitnessValid: true,
    },
    status: "Allocated",
    remarks: "",
  });

  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (assignment) {
      setFormData({
        id: assignment.id,
        requestId: assignment.requestId,
        company: assignment.company,
        vehicleId: assignment.vehicleId,
        driver: assignment.driver,
        driverPhone: assignment.driverPhone,
        driverLicense: assignment.driverLicense,
        transporter: assignment.transporter,
        materialCategory: assignment.materialCategory,
        chemicalName: assignment.chemicalName,
        allocatedCapacity: assignment.allocatedCapacity,
        compartmentAllocations: assignment.compartmentAllocations || [],
        origin: assignment.origin,
        originCity: assignment.originCity,
        destination: assignment.destination,
        destinationCity: assignment.destinationCity,
        assignmentDate: assignment.assignmentDate,
        expectedLoadingDate: assignment.expectedLoadingDate,
        expectedDeliveryDate: assignment.expectedDeliveryDate,
        freightRate: assignment.freightRate,
        advancePaid: assignment.advancePaid,
        securityChecklist: assignment.securityChecklist,
        status: assignment.status,
        remarks: assignment.remarks || "",
      });
      setErrors({});
      setSuccessMsg("");
    }
  }, [assignment]);

  if (!isOpen || !assignment) return null;

  const handleChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AssignmentFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateAssignmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(assignment.id, formData);
      setSuccessMsg(`Dispatch Allocation ${assignment.id} successfully updated!`);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#0284c7] text-white shadow-md shadow-sky-500/20 font-bold">
                <Edit3 size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    Edit Truck Allocation
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded-md border border-[#FFA500]/20">
                    {assignment.id}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Update dispatch milestone status, driver assignment & commercial settlements
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-500 shrink-0">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              {/* Section 1: Dispatch Milestone Status */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Truck size={14} className="text-[#FFA500]" />
                  <span>Dispatch Milestone & Company Allocation</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Dispatch Milestone Status <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value as AssignmentStatus)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition font-bold"
                    >
                      <option value="Allocated">Allocated (Awaiting Docking)</option>
                      <option value="At Plant">At Plant (Docked for Loading)</option>
                      <option value="Loaded">Loaded (Sealed & Clearance Done)</option>
                      <option value="In Transit">In Transit (Active on Highway)</option>
                      <option value="Delivered">Delivered (Unloaded at Destination)</option>
                      <option value="Released">Released (Available for Re-assignment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Client Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Assigned Fleet Tanker
                    </label>
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => handleChange("vehicleId", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                    >
                      {initialFleetVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.id} - {v.plateNo} ({v.bodyType || "MS"} • {v.capacityDisplay})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Chemical Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.chemicalName}
                      onChange={(e) => handleChange("chemicalName", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Driver & Crew Details */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <User size={14} className="text-[#FFA500]" />
                  <span>Crew & Transporter</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Assigned Driver
                    </label>
                    <input
                      type="text"
                      value={formData.driver}
                      onChange={(e) => handleChange("driver", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Driver Phone
                    </label>
                    <input
                      type="text"
                      value={formData.driverPhone}
                      onChange={(e) => handleChange("driverPhone", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Commercial Terms & Advance */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <DollarSign size={14} className="text-[#FFA500]" />
                  <span>Agreed Commercials & Advance Payout</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Total Agreed Freight Rate (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={formData.freightRate}
                      onChange={(e) => handleChange("freightRate", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Advance Paid (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={formData.advancePaid}
                      onChange={(e) => handleChange("advancePaid", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1">
                    Operational Dispatch Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 sm:px-6 border-t border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-[#00AEEF] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:bg-[#0284c7] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Edit3 size={14} />
                    <span>Update Allocation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

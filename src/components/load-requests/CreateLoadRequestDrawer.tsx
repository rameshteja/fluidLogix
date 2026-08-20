"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Droplets,
  FileCheck2,
  FileText,
  Flame,
  Layers,
  MapPin,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import FileUploadDropzone from "@/components/common/FileUploadDropzone";
import { COMPANY_FILTER_OPTIONS } from "@/data/filterOptions";
import { validateLoadRequestForm } from "@/services/loadRequestService";
import { MaterialCategory } from "@/types/dashboard";
import { TankerType, VehicleBodyType } from "@/types/fleet";
import {
  LoadRequest,
  LoadRequestFormData,
  LoadRequestFormErrors,
  RequestPriority,
} from "@/types/loadRequest";

interface CreateLoadRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: LoadRequestFormData) => Promise<LoadRequest>;
}

const BODY_TYPES: { label: string; value: VehicleBodyType }[] = [
  { label: "SS (Stainless Steel 316/304)", value: "SS" },
  { label: "MS (Mild Steel)", value: "MS" },
  { label: "Rubber Lined MS (Acid Proof)", value: "Rubber Lined MS" },
  { label: "Aluminium Alloy", value: "Aluminium Alloy" },
  { label: "Specialized Composite / FRP", value: "Specialized Composite" },
];

export default function CreateLoadRequestDrawer({
  isOpen,
  onClose,
  onCreate,
}: CreateLoadRequestDrawerProps) {
  const [formData, setFormData] = useState<LoadRequestFormData>({
    company: "ChemCorp Ltd",
    contactPerson: "Ramesh Chandra",
    contactPhone: "+91 98451 22310",
    materialCategory: "Chemical",
    chemicalName: "Liquid Caustic Soda (48% Tech Grade)",
    tankerType: "Chemical Tanker",
    bodyType: "SS",
    requiredCapacity: 20000,
    compartmentsNeeded: 2,
    pickupLocation: "ChemCorp Plant 2, Industrial Corridor",
    pickupCity: "Visakhapatnam",
    deliveryLocation: "Apex Bulk Chemical Terminal, Berth 4",
    deliveryCity: "Kakinada",
    loadingDate: new Date().toISOString().split("T")[0],
    loadingTimeWindow: "08:00 AM - 12:00 PM",
    expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    offeredRate: 52000,
    priority: "Urgent",
    specialInstructions: "Driver must possess Hazmat certification and full PPE gear.",
    msdsDocFile: null,
  });

  const [errors, setErrors] = useState<LoadRequestFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (field: keyof LoadRequestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof LoadRequestFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateLoadRequestForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await onCreate(formData);
      setSuccessMsg(`Requisition ${created.id} submitted successfully!`);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 600);
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                <Plus size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">
                  Request Tanker for Load
                </h2>
                <p className="text-xs text-muted-foreground">
                  Post new cargo dispatch requisition & freight indent
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

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              {/* Section 1: Company & Authorised Requester */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Building2 size={14} className="text-[#FFA500]" />
                  <span>Company & Authorised Requester</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <AutocompleteFilter
                      label="Client Company *"
                      value={formData.company}
                      onChange={(val) => handleChange("company", val)}
                      options={COMPANY_FILTER_OPTIONS}
                      hideAllOption={true}
                      placeholder="Select industrial company..."
                      icon={<Building2 size={13} />}
                    />
                    {errors.company && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle size={12} />
                        <span>{errors.company}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Authorised Contact Person <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1">
                    Contact Phone / WhatsApp <span className="text-[#FFA500]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. +91 98451 22310"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background pl-8.5 pr-3 text-xs font-mono text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Material & Chemical Cargo Specs */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Droplets size={14} className="text-[#FFA500]" />
                  <span>Cargo & Chemical Classification</span>
                </div>

                {/* Material Category Pills */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-2">
                    Hazardous Material Classification <span className="text-[#FFA500]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["Chemical", "Hazardous", "Waste Water", "Non-Hazard"] as MaterialCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleChange("materialCategory", cat)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                          formData.materialCategory === cat
                            ? cat === "Hazardous"
                              ? "border-rose-500 bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                              : cat === "Chemical"
                              ? "border-[#FFA500] bg-[#FFA500]/15 text-[#FFA500] ring-1 ring-[#FFA500]/30"
                              : cat === "Waste Water"
                              ? "border-sky-500 bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30"
                              : "border-emerald-500 bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1">
                    Specific Chemical / Cargo Name <span className="text-[#FFA500]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Liquid Caustic Soda 48%, Sulfuric Acid 98%, Toluene"
                    value={formData.chemicalName}
                    onChange={(e) => handleChange("chemicalName", e.target.value)}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    required
                  />
                  {errors.chemicalName && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle size={12} />
                      <span>{errors.chemicalName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Section 3: Required Tanker & Body Material Specs */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Truck size={14} className="text-[#FFA500]" />
                  <span>Required Tanker Specifications</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Required Tanker Type <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.tankerType}
                      onChange={(e) => handleChange("tankerType", e.target.value as TankerType)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    >
                      <option value="Chemical Tanker">Chemical Tanker</option>
                      <option value="Hazmat Tanker">Hazmat Tanker</option>
                      <option value="Water Tanker">Water Tanker</option>
                      <option value="General Tanker">General Tanker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Tanker Body Material <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.bodyType}
                      onChange={(e) => handleChange("bodyType", e.target.value as VehicleBodyType)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition font-medium"
                    >
                      {BODY_TYPES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Required Payload Volume (Liters) <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="1000"
                      max="80000"
                      value={formData.requiredCapacity}
                      onChange={(e) => handleChange("requiredCapacity", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Chamber Compartments Needed <span className="text-[#FFA500]">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleChange("compartmentsNeeded", num)}
                          className={`flex-1 h-9 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            formData.compartmentsNeeded === num
                              ? "border-[#FFA500] bg-[#FFA500] text-[#071522] shadow-sm shadow-orange-500/20"
                              : "border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          {num} {num === 1 ? "Chamber" : "Chambers"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Route Manifest & Schedule */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <MapPin size={14} className="text-[#FFA500]" />
                  <span>Loading & Delivery Route Manifest</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Origin Pickup Point *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Origin Plant / Terminal Address"
                      value={formData.pickupLocation}
                      onChange={(e) => handleChange("pickupLocation", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Visakhapatnam)"
                      value={formData.pickupCity}
                      onChange={(e) => handleChange("pickupCity", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
                      <span>Destination Delivery Point *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Destination Refinery / Site Address"
                      value={formData.deliveryLocation}
                      onChange={(e) => handleChange("deliveryLocation", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Kakinada)"
                      value={formData.deliveryCity}
                      onChange={(e) => handleChange("deliveryCity", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Loading Date *
                    </label>
                    <input
                      type="date"
                      value={formData.loadingDate}
                      onChange={(e) => handleChange("loadingDate", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Loading Window Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00 AM - 12:00 PM"
                      value={formData.loadingTimeWindow}
                      onChange={(e) => handleChange("loadingTimeWindow", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Expected Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={formData.expectedDeliveryDate}
                      onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Commercial Freight & Requisition Priority */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <DollarSign size={14} className="text-[#FFA500]" />
                  <span>Commercial Freight & Priority</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Offered Freight Rate (INR ₹) <span className="text-[#FFA500]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        placeholder="52000"
                        value={formData.offeredRate}
                        onChange={(e) => handleChange("offeredRate", e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background pl-7 pr-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Requisition Urgency Level <span className="text-[#FFA500]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {(["Normal", "High", "Urgent"] as RequestPriority[]).map((pri) => (
                        <button
                          key={pri}
                          type="button"
                          onClick={() => handleChange("priority", pri)}
                          className={`flex-1 h-9 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                            formData.priority === pri
                              ? pri === "Urgent"
                                ? "border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/20 font-black"
                                : pri === "High"
                                ? "border-amber-500 bg-amber-500 text-[#071522] shadow-sm font-black"
                                : "border-emerald-500 bg-emerald-500 text-[#071522] shadow-sm font-black"
                              : "border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          {pri === "Urgent" && <Flame size={12} />}
                          <span>{pri}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1">
                    Special Safety Guidelines / Handling Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tanker must have double-valved bottom discharge, driver must carry full chemical PPE."
                    value={formData.specialInstructions}
                    onChange={(e) => handleChange("specialInstructions", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                  />
                </div>
              </div>

              {/* Section 6: Material Safety Data Sheet (MSDS) Upload */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <FileText size={14} className="text-[#FFA500]" />
                  <span>Material Safety Data Sheet (MSDS) Attachment</span>
                </div>
                <FileUploadDropzone
                  label="Upload Cargo MSDS / Certificate of Analysis (COA)"
                  hint="Chemical Safety Data Sheet (PDF, JPG up to 10MB)"
                  value={formData.msdsDocFile}
                  onChange={(file) => handleChange("msdsDocFile", file)}
                />
              </div>
            </div>

            {/* Sticky Footer Actions */}
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
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                    <span>Submitting Requisition...</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>Submit Load Request</span>
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

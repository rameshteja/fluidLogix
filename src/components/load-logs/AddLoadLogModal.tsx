"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FilePlus,
  MapPin,
  Shield,
  Truck,
  User,
  Weight,
  X,
} from "lucide-react";
import { useState } from "react";
import { validateLoadLogForm } from "@/services/loadLogsService";
import {
  LoadLogFormData,
  LoadLogFormErrors,
  LoadLogItem,
  LoadStatus,
  MaterialCategory,
  TripType,
} from "@/types/loadLog";

interface AddLoadLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: LoadLogFormData) => Promise<LoadLogItem>;
  defaultCategory?: MaterialCategory;
}

const VEHICLE_OPTIONS = [
  "TK-001",
  "TK-002",
  "TK-003",
  "TK-004",
  "TK-005",
  "TK-006",
  "TK-007",
  "TK-008",
  "TK-009",
  "TK-011",
  "TK-014",
  "TK-015",
  "TK-018",
  "TK-019",
  "TK-022",
];

const COMPANY_OPTIONS = [
  "ChemCorp Ltd",
  "HazWaste Solutions",
  "EcoWaste Corp",
  "IndusChem Ltd",
  "AquaTech Pvt Ltd",
  "BioClean Enviro",
  "Apex Solvents",
  "GreenEco Logistics",
  "PureFlow Systems",
];

const MATERIAL_PRESETS: Record<MaterialCategory, string[]> = {
  Chemical: ["Sulphuric Acid", "Nitric Acid", "Caustic Soda", "Phosphoric Acid", "Sodium Hypochlorite"],
  Hazardous: ["Chlorine Gas", "Hydrochloric Acid", "Liquid Ammonia", "Toxic Solvent Mix", "Anhydrous Ammonia"],
  "Waste Water": ["Industrial Effluent", "Sludge Water", "Chemical Effluent", "ETP Treated Water"],
  "Non-Hazard": ["Treated Water", "Demineralized Water", "Recycled Cooling Water", "Industrial Utility Water"],
};

export default function AddLoadLogModal({
  isOpen,
  onClose,
  onAdd,
  defaultCategory = "Chemical",
}: AddLoadLogModalProps) {
  const todayIso = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<LoadLogFormData>({
    date: todayIso,
    vehicle: "TK-001",
    driver: "Suresh Mohan",
    driverPhone: "+91 98451 22310",
    company: "ChemCorp Ltd",
    material: "Sulphuric Acid",
    category: defaultCategory,
    weightKg: 18500,
    from: "Visakhapatnam Port",
    to: "Hyderabad MIDC",
    type: "Non-Local",
    loadTime: "06:30",
    unloadTime: "18:45",
    status: "Completed",
    amount: 45000,
    sealNo: "SL-8842",
    hazardClass: "Class 8 - Corrosive Substance",
    notes: "",
  });

  const [errors, setErrors] = useState<LoadLogFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    field: keyof LoadLogFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "category") {
        const cat = value as MaterialCategory;
        const availableMaterials = MATERIAL_PRESETS[cat] || [];
        if (availableMaterials.length > 0 && !availableMaterials.includes(prev.material)) {
          updated.material = availableMaterials[0];
        }
      }
      return updated;
    });

    if (errors[field as keyof LoadLogFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateLoadLogForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await onAdd(formData);
      setSuccessMsg(`Log ${created.id} created successfully!`);
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
          {/* Sticky Header */}
          <div className="p-5 sm:px-6 border-b border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                <FilePlus size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">
                  Add New Load Log
                </h2>
                <p className="text-xs text-muted-foreground">
                  Register daily tanker cargo dispatch and route manifests
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

          {/* Success Alert */}
          {successMsg && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-500 shrink-0">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs">
              {/* Section 1: Trip & Route Details */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <MapPin size={14} className="text-[#FFA500]" />
                  <span>Trip Schedule & Route Manifest</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Dispatch Date <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Trip Scope
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleChange("type", e.target.value as TripType)
                      }
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Non-Local">Non-Local (Interstate)</option>
                      <option value="Local">Local (Intracity)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Trip Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleChange("status", e.target.value as LoadStatus)
                      }
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Origin (Loading Point) <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => handleChange("from", e.target.value)}
                      placeholder="e.g. Visakhapatnam Port Berth 4"
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition ${
                        errors.from
                          ? "border-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Destination (Unloading Point) <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => handleChange("to", e.target.value)}
                      placeholder="e.g. Hyderabad MIDC Chemical Complex"
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition ${
                        errors.to
                          ? "border-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Loading Time (HH:MM) <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.loadTime}
                      onChange={(e) => handleChange("loadTime", e.target.value)}
                      placeholder="06:30"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Unloading Time (HH:MM)
                    </label>
                    <input
                      type="text"
                      value={formData.unloadTime || ""}
                      onChange={(e) => handleChange("unloadTime", e.target.value)}
                      placeholder="18:45 or —"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle & Driver Allocation */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Truck size={14} className="text-[#FFA500]" />
                  <span>Tanker & Driver Assignment</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Assigned Tanker <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.vehicle}
                      onChange={(e) => handleChange("vehicle", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      {VEHICLE_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Client Company / Hub <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      {COMPANY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Driver Name <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.driver}
                      onChange={(e) => handleChange("driver", e.target.value)}
                      placeholder="e.g. Suresh Mohan"
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition ${
                        errors.driver
                          ? "border-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                      required
                    />
                    {errors.driver && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">{errors.driver}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Driver Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.driverPhone || ""}
                      onChange={(e) => handleChange("driverPhone", e.target.value)}
                      placeholder="+91 98451 22310"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Material & Load Specifications */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Shield size={14} className="text-[#FFA500]" />
                  <span>Cargo & Hazardous Classification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Category <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleChange("category", e.target.value as MaterialCategory)
                      }
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Chemical">Chemical</option>
                      <option value="Hazardous">Hazardous</option>
                      <option value="Waste Water">Waste Water</option>
                      <option value="Non-Hazard">Non-Hazard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Material <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => handleChange("material", e.target.value)}
                      placeholder="e.g. Sulphuric Acid"
                      list="material-suggestions"
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition ${
                        errors.material
                          ? "border-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                      required
                    />
                    <datalist id="material-suggestions">
                      {(MATERIAL_PRESETS[formData.category] || []).map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Net Weight (Kg) <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.weightKg}
                      onChange={(e) => handleChange("weightKg", Number(e.target.value))}
                      placeholder="e.g. 18500"
                      min={100}
                      max={50000}
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs font-mono text-foreground outline-none transition ${
                        errors.weightKg
                          ? "border-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Billing Rate / Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.amount || 0}
                      onChange={(e) => handleChange("amount", Number(e.target.value))}
                      placeholder="45000"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Security Seal Number
                    </label>
                    <input
                      type="text"
                      value={formData.sealNo || ""}
                      onChange={(e) => handleChange("sealNo", e.target.value)}
                      placeholder="SL-8842"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Hazard Class Classification
                    </label>
                    <input
                      type="text"
                      value={formData.hazardClass || ""}
                      onChange={(e) => handleChange("hazardClass", e.target.value)}
                      placeholder="Class 8 - Corrosive"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Dispatch Notes */}
              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Dispatch & Compliance Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="e.g. Temperature verified at loading dock. Emergency valve seal intact."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition resize-none"
                />
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
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                    <span>Creating Log...</span>
                  </>
                ) : (
                  <span>Create Load Log</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Edit,
  FileEdit,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { validateLoadLogForm } from "@/services/loadLogsService";
import {
  LoadLogFormData,
  LoadLogFormErrors,
  LoadLogItem,
  LoadStatus,
  MaterialCategory,
  TripType,
} from "@/types/loadLog";

interface EditLoadLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: LoadLogFormData) => Promise<LoadLogItem>;
  log: LoadLogItem | null;
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

export default function EditLoadLogModal({
  isOpen,
  onClose,
  onEdit,
  log,
}: EditLoadLogModalProps) {
  const [formData, setFormData] = useState<LoadLogFormData>({
    date: "",
    vehicle: "TK-001",
    driver: "",
    driverPhone: "",
    company: "ChemCorp Ltd",
    material: "",
    category: "Chemical",
    weightKg: 18500,
    from: "",
    to: "",
    type: "Non-Local",
    loadTime: "06:30",
    unloadTime: "18:45",
    status: "Completed",
    amount: 45000,
    sealNo: "",
    hazardClass: "",
    notes: "",
  });

  const [errors, setErrors] = useState<LoadLogFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (log) {
      setFormData({
        date: log.dateRaw || new Date().toISOString().split("T")[0],
        vehicle: log.vehicle,
        driver: log.driver,
        driverPhone: log.driverPhone || "",
        company: log.company,
        material: log.material,
        category: log.category,
        weightKg: log.weightKg,
        from: log.from,
        to: log.to,
        type: log.type,
        loadTime: log.loadTime,
        unloadTime: log.unloadTime,
        status: log.status,
        amount: log.amount || 0,
        sealNo: log.sealNo || "",
        hazardClass: log.hazardClass || "",
        notes: log.notes || "",
      });
      setErrors({});
      setSuccessMsg("");
    }
  }, [log]);

  if (!isOpen || !log) return null;

  const handleChange = (
    field: keyof LoadLogFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      await onEdit(log.id, formData);
      setSuccessMsg(`Log ${log.id} updated successfully!`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20">
              <FileEdit size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground leading-tight">
                  Edit Load Log
                </h2>
                <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded border border-[#FFA500]/25">
                  {log.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Update load dispatch parameters & status
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-xs">
          {/* Success Alert */}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400">
              <CheckCircle2 size={16} />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* 1. Date & Vehicle & Driver Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Dispatch Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Vehicle Tanker <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.vehicle}
                onChange={(e) => handleChange("vehicle", e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
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
                Driver Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.driver}
                onChange={(e) => handleChange("driver", e.target.value)}
                placeholder="Driver name"
                className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${errors.driver
                    ? "border-rose-500"
                    : "border-border focus:border-[#FFA500]"
                  }`}
                required
              />
            </div>
          </div>

          {/* 2. Driver Phone & Partner Company Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Driver Contact Phone
              </label>
              <input
                type="tel"
                value={formData.driverPhone || ""}
                onChange={(e) => handleChange("driverPhone", e.target.value)}
                placeholder="+91 98451 22310"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Client Company / Hub <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                {COMPANY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Category, Material & Weight Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Material Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleChange("category", e.target.value as MaterialCategory)
                }
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Chemical">Chemical</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Waste Water">Waste Water</option>
                <option value="Non-Hazard">Non-Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Material Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value)}
                placeholder="e.g. Sulphuric Acid"
                list="edit-material-suggestions"
                className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${errors.material
                    ? "border-rose-500"
                    : "border-border focus:border-[#FFA500]"
                  }`}
                required
              />
              <datalist id="edit-material-suggestions">
                {(MATERIAL_PRESETS[formData.category] || []).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Weight (Kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => handleChange("weightKg", Number(e.target.value))}
                min={100}
                max={50000}
                className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${errors.weightKg
                    ? "border-rose-500"
                    : "border-border focus:border-[#FFA500]"
                  }`}
                required
              />
            </div>
          </div>

          {/* 4. Origin (From) and Destination (To) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Origin (From Location) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.from}
                onChange={(e) => handleChange("from", e.target.value)}
                placeholder="Origin"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Destination (To Location) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.to}
                onChange={(e) => handleChange("to", e.target.value)}
                placeholder="Destination"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                required
              />
            </div>
          </div>

          {/* 5. Trip Scope, Load Time, Unload Time, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Trip Scope
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleChange("type", e.target.value as TripType)
                }
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Non-Local">Non-Local</option>
                <option value="Local">Local</option>
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Load Time
              </label>
              <input
                type="text"
                value={formData.loadTime}
                onChange={(e) => handleChange("loadTime", e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Unload Time
              </label>
              <input
                type="text"
                value={formData.unloadTime || ""}
                onChange={(e) => handleChange("unloadTime", e.target.value)}
                placeholder="18:45 or —"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as LoadStatus)
                }
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Completed">Completed</option>
                <option value="In Transit">In Transit</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* 6. Amount, Seal No, Hazard Class */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Billing Amount (₹)
              </label>
              <input
                type="number"
                value={formData.amount || 0}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Security Seal No
              </label>
              <input
                type="text"
                value={formData.sealNo || ""}
                onChange={(e) => handleChange("sealNo", e.target.value)}
                placeholder="SL-8842"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Hazard Class
              </label>
              <input
                type="text"
                value={formData.hazardClass || ""}
                onChange={(e) => handleChange("hazardClass", e.target.value)}
                placeholder="Class 8 - Corrosive"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>
          </div>

          {/* 7. Dispatch Notes */}
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Dispatch & Compliance Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#FFA500] px-5 py-2 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Droplets,
  Edit3,
  FileCheck,
  Gauge,
  Image as ImageIcon,
  MapPin,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import FileUploadDropzone from "@/components/common/FileUploadDropzone";
import MultiImageDropzone from "@/components/common/MultiImageDropzone";
import {
  FLEET_DRIVER_FILTER_OPTIONS,
  FLEET_OWNER_FILTER_OPTIONS,
} from "@/data/filterOptions";
import { validateVehicleForm } from "@/hooks/useFleetData";
import {
  FleetStatus,
  FleetVehicle,
  MaterialCategory,
  TankerType,
  VehicleBodyType,
  VehicleFormData,
  VehicleFormErrors,
} from "@/types/fleet";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: Partial<VehicleFormData>) => Promise<FleetVehicle>;
  vehicle: FleetVehicle | null;
  existingVehicles: FleetVehicle[];
}

const BODY_TYPE_OPTIONS: { label: string; value: VehicleBodyType }[] = [
  { label: "MS (Mild Steel)", value: "MS" },
  { label: "SS (Stainless Steel 304/316)", value: "SS" },
  { label: "Rubber Lined MS (Acid Resistant)", value: "Rubber Lined MS" },
  { label: "Aluminium Alloy", value: "Aluminium Alloy" },
  { label: "Specialized Composite / FRP", value: "Specialized Composite" },
];

export default function EditVehicleModal({
  isOpen,
  onClose,
  onEdit,
  vehicle,
  existingVehicles,
}: EditVehicleModalProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    id: "",
    plateNo: "",
    tankerType: "Chemical Tanker",
    bodyType: "MS",
    capacity: 20000,
    compartmentsCount: 1,
    compartments: [{ compartmentNo: 1, capacity: 20000 }],
    owner: "",
    driver: "",
    company: "ChemCorp Ltd",
    material: "Chemical",
    status: "Active",
    registrationDate: "",
    currentLocation: "",
    tankerImages: [],
    pollutionCertFile: null,
    fitnessCertFile: null,
  });

  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (vehicle) {
      const initComps =
        vehicle.compartments && vehicle.compartments.length > 0
          ? vehicle.compartments
          : [{ compartmentNo: 1, capacity: vehicle.capacity || 20000 }];
      const count = vehicle.compartmentsCount || initComps.length || 1;

      setFormData({
        id: vehicle.id,
        plateNo: vehicle.plateNo,
        tankerType: vehicle.tankerType,
        bodyType: (vehicle.bodyType as VehicleBodyType) || "MS",
        capacity: vehicle.capacity,
        compartmentsCount: count,
        compartments: initComps,
        owner: vehicle.owner,
        driver: vehicle.driver,
        company: vehicle.company,
        material: vehicle.material,
        status: vehicle.status,
        registrationDate: vehicle.registrationDate || new Date().toISOString().split("T")[0],
        currentLocation: vehicle.currentLocation || "",
        tankerImages: vehicle.tankerImages || [],
        pollutionCertFile: vehicle.pollutionCertFile || null,
        fitnessCertFile: vehicle.fitnessCertFile || null,
      });
      setErrors({});
      setSuccessMsg("");
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleChange = (
    field: keyof VehicleFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof VehicleFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCompartmentCountChange = (count: number) => {
    const safeCount = Math.max(1, Math.min(8, count));
    const currentComps = formData.compartments || [];
    let newComps = [];

    const currentTotal = Number(formData.capacity) || 20000;
    const equalShare = Math.round(currentTotal / safeCount);

    for (let i = 1; i <= safeCount; i++) {
      if (i <= currentComps.length && currentComps[i - 1].capacity > 0) {
        newComps.push({
          compartmentNo: i,
          capacity: currentComps[i - 1].capacity,
        });
      } else {
        newComps.push({
          compartmentNo: i,
          capacity: equalShare,
        });
      }
    }

    const sumCapacity = newComps.reduce((acc, c) => acc + (Number(c.capacity) || 0), 0);

    setFormData((prev) => ({
      ...prev,
      compartmentsCount: safeCount,
      compartments: newComps,
      capacity: sumCapacity,
    }));
    if (errors.compartments) {
      setErrors((prev) => ({ ...prev, compartments: undefined }));
    }
  };

  const handleIndividualCompartmentCapacityChange = (
    compNo: number,
    capacityVal: number | string
  ) => {
    const cap = Number(capacityVal) || 0;
    const currentComps = [...(formData.compartments || [])];
    const idx = currentComps.findIndex((c) => c.compartmentNo === compNo);

    if (idx !== -1) {
      currentComps[idx] = { ...currentComps[idx], capacity: cap };
    } else {
      currentComps.push({ compartmentNo: compNo, capacity: cap });
    }

    const sumCapacity = currentComps.reduce((acc, c) => acc + (Number(c.capacity) || 0), 0);

    setFormData((prev) => ({
      ...prev,
      compartments: currentComps,
      capacity: sumCapacity,
    }));
    if (errors.compartments) {
      setErrors((prev) => ({ ...prev, compartments: undefined }));
    }
  };

  const handleDistributeEvenly = () => {
    const count = formData.compartmentsCount || formData.compartments?.length || 1;
    const total = Number(formData.capacity) || 20000;
    const share = Math.round(total / count);

    const newComps = Array.from({ length: count }, (_, i) => ({
      compartmentNo: i + 1,
      capacity: share,
    }));

    setFormData((prev) => ({
      ...prev,
      compartments: newComps,
      capacity: share * count,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateVehicleForm(formData, existingVehicles, true);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(vehicle.id, formData);
      setSuccessMsg(`Vehicle ${vehicle.id} successfully updated!`);
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
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity drawer-backdrop-animate"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-2xl bg-card border-l border-border/80 shadow-2xl flex flex-col h-full overflow-hidden drawer-panel-animate drawer-glow-edge">
          <div className="p-5 sm:px-6 border-b border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#0284c7] text-white shadow-md shadow-sky-500/20">
                <Edit3 size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    Edit Tanker Specifications
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded-md border border-[#FFA500]/20">
                    {vehicle.id}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Update tanker specifications, driver assignment, compliance & fleet photos
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

          {successMsg && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-500 shrink-0">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Truck size={14} className="text-[#FFA500]" />
                  <span>Tanker Specifications & Body Type</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Vehicle ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.id}
                      className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono font-bold text-muted-foreground outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Plate Number <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AP09AB1234"
                      value={formData.plateNo}
                      onChange={(e) => handleChange("plateNo", e.target.value.toUpperCase())}
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs font-bold font-mono text-foreground outline-none transition ${
                        errors.plateNo
                          ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                          : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      }`}
                    />
                    {errors.plateNo && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle size={12} />
                        <span>{errors.plateNo}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Vehicle Registration Date
                    </label>
                    <input
                      type="date"
                      value={formData.registrationDate ?? ""}
                      onChange={(e) => handleChange("registrationDate", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Tanker Type <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.tankerType}
                      onChange={(e) => handleChange("tankerType", e.target.value as TankerType)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Chemical Tanker">Chemical Tanker</option>
                      <option value="Hazmat Tanker">Hazmat Tanker</option>
                      <option value="Water Tanker">Water Tanker</option>
                      <option value="General Tanker">General Tanker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Body Material Type <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.bodyType ?? "MS"}
                      onChange={(e) => handleChange("bodyType", e.target.value as VehicleBodyType)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition font-medium"
                    >
                      {BODY_TYPE_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Compartments & Dynamic Compartment Capacities */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Gauge size={14} className="text-[#FFA500]" />
                    <span>Compartment Configuration & Capacities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/25 px-2.5 py-0.5 rounded-lg">
                      Total: {Number(formData.capacity || 0).toLocaleString()} L
                    </span>
                    {(formData.compartmentsCount ?? 1) > 1 && (
                      <button
                        type="button"
                        onClick={handleDistributeEvenly}
                        className="text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        Distribute Evenly
                      </button>
                    )}
                  </div>
                </div>

                {/* Compartment Count Selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                    Number of Compartments <span className="text-[#FFA500]">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCompartmentCountChange(num)}
                        className={`h-9 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          (formData.compartmentsCount ?? 1) === num
                            ? "border-[#FFA500] bg-[#FFA500] text-[#071522] shadow-sm shadow-orange-500/20 font-black"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {num} {num === 1 ? "Compartment" : "Compartments"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Segmented Visual Tanker Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>Tanker Barrel Breakdown ({formData.compartmentsCount ?? 1} Chambers)</span>
                    <span className="font-mono text-foreground font-bold">
                      Sum: {Number(formData.capacity || 0).toLocaleString()} L
                    </span>
                  </div>
                  <div className="flex h-7 w-full rounded-xl overflow-hidden border border-border/80 bg-background p-0.5 gap-1 shadow-inner">
                    {(formData.compartments || []).map((comp, idx) => {
                      const total = Number(formData.capacity) || 1;
                      const pct = Math.max(8, Math.round(((Number(comp.capacity) || 0) / total) * 100));
                      const colors = [
                        "bg-gradient-to-r from-amber-500 to-orange-500 text-[#071522]",
                        "bg-gradient-to-r from-sky-500 to-blue-500 text-white",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-[#071522]",
                        "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
                        "bg-gradient-to-r from-rose-500 to-pink-500 text-white",
                        "bg-gradient-to-r from-cyan-500 to-teal-500 text-[#071522]",
                      ];
                      return (
                        <div
                          key={comp.compartmentNo}
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-lg flex items-center justify-center text-[10px] font-bold font-mono truncate px-1 transition-all shadow-xs ${
                            colors[idx % colors.length]
                          }`}
                          title={`Compartment ${comp.compartmentNo}: ${Number(comp.capacity || 0).toLocaleString()} L (${pct}%)`}
                        >
                          C{comp.compartmentNo}: {Number(comp.capacity || 0).toLocaleString()}L
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Separate Inputs for each Compartment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {(formData.compartments || []).map((comp) => (
                    <div
                      key={comp.compartmentNo}
                      className="rounded-xl border border-border bg-background p-3 space-y-1.5 focus-within:border-[#FFA500]/80 focus-within:ring-1 focus-within:ring-[#FFA500]/30 transition"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-[#FFA500]/20 text-[#FFA500] text-[10px] font-mono font-black">
                            {comp.compartmentNo}
                          </span>
                          <span>Compartment {comp.compartmentNo}</span>
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground">Liters</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="100"
                          min="100"
                          max="60000"
                          placeholder="e.g. 5000"
                          value={comp.capacity ?? ""}
                          onChange={(e) =>
                            handleIndividualCompartmentCapacityChange(
                              comp.compartmentNo,
                              e.target.value
                            )
                          }
                          className="h-8 w-full rounded-lg border border-border bg-muted/20 px-2.5 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {errors.compartments && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                    <AlertCircle size={12} />
                    <span>{errors.compartments}</span>
                  </p>
                )}
                {errors.capacity && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                    <AlertCircle size={12} />
                    <span>{errors.capacity}</span>
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <User size={14} className="text-[#FFA500]" />
                  <span>Transporter & Driver Allocation</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <AutocompleteFilter
                      label="Fleet Owner / Transporter *"
                      value={formData.owner ?? ""}
                      onChange={(val) => handleChange("owner", val)}
                      options={FLEET_OWNER_FILTER_OPTIONS}
                      hideAllOption={true}
                      placeholder="Search or select fleet owner..."
                      icon={<User size={13} />}
                    />
                    {errors.owner && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle size={12} />
                        <span>{errors.owner}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <AutocompleteFilter
                      label="Assigned Driver *"
                      value={formData.driver ?? ""}
                      onChange={(val) => handleChange("driver", val)}
                      options={FLEET_DRIVER_FILTER_OPTIONS}
                      hideAllOption={true}
                      placeholder="Search or select licensed driver..."
                      icon={<Truck size={13} />}
                    />
                    {errors.driver && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle size={12} />
                        <span>{errors.driver}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <Droplets size={14} className="text-[#FFA500]" />
                  <span>Logistics & Material Assignment</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Client / Company <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="ChemCorp Ltd">ChemCorp Ltd</option>
                      <option value="HazWaste Solutions">HazWaste Solutions</option>
                      <option value="AquaTech Pvt Ltd">AquaTech Pvt Ltd</option>
                      <option value="EcoWaste Corp">EcoWaste Corp</option>
                      <option value="IndusChem Ltd">IndusChem Ltd</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Material <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.material}
                      onChange={(e) => handleChange("material", e.target.value as MaterialCategory)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Chemical">Chemical (Orange)</option>
                      <option value="Hazardous">Hazardous (Red)</option>
                      <option value="Waste Water">Waste Water (Cyan)</option>
                      <option value="Non-Hazard">Non-Hazard (Green)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Status <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value as FleetStatus)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    >
                      <option value="Active">Active (Green)</option>
                      <option value="Transit">Transit (Blue)</option>
                      <option value="Maintenance">Maintenance (Amber)</option>
                      <option value="Idle">Idle (Gray)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1">
                    Current Location / Depot
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Visakhapatnam Port Hub, Berth 4"
                      value={formData.currentLocation ?? ""}
                      onChange={(e) => handleChange("currentLocation", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background pl-8.5 pr-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <FileCheck size={14} className="text-[#FFA500]" />
                  <span>Compliance & Regulatory Certificates</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FileUploadDropzone
                    label="Pollution Under Control (PUC) Certificate"
                    hint="Valid PUC Certificate (PDF, JPG, PNG)"
                    value={formData.pollutionCertFile}
                    onChange={(file) => handleChange("pollutionCertFile", file)}
                  />
                  <FileUploadDropzone
                    label="Transport Fitness Certificate (Form 38)"
                    hint="RTO Fitness Clearance Certificate (PDF, JPG, PNG)"
                    value={formData.fitnessCertFile}
                    onChange={(file) => handleChange("fitnessCertFile", file)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <ImageIcon size={14} className="text-[#FFA500]" />
                  <span>Tanker Photos & Physical Condition (Multiple Upload)</span>
                </div>
                <MultiImageDropzone
                  label="Upload Tanker Photos (Front, Side, Valves & Cabin)"
                  hint="Drag & drop multiple tanker images here or click to browse (PNG, JPG, WebP)"
                  images={formData.tankerImages ?? []}
                  onChange={(imgs) => handleChange("tankerImages", imgs)}
                  maxImages={8}
                />
              </div>
            </div>

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
                  <span>Update Tanker</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

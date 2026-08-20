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
  Flame,
  Gauge,
  Layers,
  MapPin,
  Phone,
  Plus,
  Radio,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import { COMPANY_FILTER_OPTIONS, FLEET_DRIVER_FILTER_OPTIONS } from "@/data/filterOptions";
import { initialFleetVehicles } from "@/data/fleet-data";
import { initialLoadRequests } from "@/data/load-requests-data";
import { validateAssignmentForm } from "@/services/assignmentService";
import {
  AssignmentFormData,
  AssignmentFormErrors,
  CompartmentAllocation,
  SecurityChecklist,
  TruckAssignment,
} from "@/types/assignment";
import { MaterialCategory } from "@/types/dashboard";
import { FleetVehicle } from "@/types/fleet";
import { LoadRequest } from "@/types/loadRequest";

interface AssignTruckDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: AssignmentFormData) => Promise<TruckAssignment>;
  preselectedRequestId?: string | null;
}

export default function AssignTruckDrawer({
  isOpen,
  onClose,
  onAssign,
  preselectedRequestId,
}: AssignTruckDrawerProps) {
  const [formData, setFormData] = useState<AssignmentFormData>({
    requestId: "",
    company: "ChemCorp Ltd",
    vehicleId: "TK-001",
    driver: "Suresh Mohan",
    driverPhone: "+91 98451 22310",
    driverLicense: "AP09-2018-00291",
    transporter: "Ravi Kumar",
    materialCategory: "Chemical",
    chemicalName: "Liquid Caustic Soda (48% Tech Grade)",
    allocatedCapacity: 20000,
    compartmentAllocations: [
      {
        compartmentNo: 1,
        capacity: 10000,
        loadedMaterial: "Liquid Caustic Soda 48%",
      },
      {
        compartmentNo: 2,
        capacity: 10000,
        loadedMaterial: "Liquid Caustic Soda 48%",
      },
    ],
    origin: "ChemCorp Plant 2, Industrial Corridor",
    originCity: "Visakhapatnam",
    destination: "Apex Bulk Terminal Berth 4",
    destinationCity: "Kakinada",
    assignmentDate: new Date().toISOString().split("T")[0],
    expectedLoadingDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    freightRate: 52000,
    advancePaid: 25000,
    securityChecklist: {
      tankerCleaned: true,
      gpsOnline: true,
      hazmatKitVerified: true,
      driverBriefed: true,
      fitnessValid: true,
    },
    remarks: "Direct industrial dispatch under strict chemical logistics protocol.",
  });

  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [vehicleBodyFilter, setVehicleBodyFilter] = useState<string>("ALL");

  // Handle preselected request link if passed from url
  useEffect(() => {
    if (preselectedRequestId) {
      const found = initialLoadRequests.find((r) => r.id === preselectedRequestId);
      if (found) {
        applyRequestToForm(found);
      }
    }
  }, [preselectedRequestId, isOpen]);

  const applyRequestToForm = (req: LoadRequest) => {
    // Pick compatible vehicle if available
    const compVehicle =
      initialFleetVehicles.find(
        (v) =>
          v.material === req.materialCategory ||
          v.bodyType === req.bodyType ||
          v.tankerType === req.tankerType
      ) || initialFleetVehicles[0];

    const comps: CompartmentAllocation[] =
      compVehicle && compVehicle.compartments && compVehicle.compartments.length > 0
        ? compVehicle.compartments.map((c) => ({
            compartmentNo: c.compartmentNo,
            capacity: c.capacity,
            loadedMaterial: req.chemicalName,
          }))
        : [
            {
              compartmentNo: 1,
              capacity: Number(req.requiredCapacity) || 20000,
              loadedMaterial: req.chemicalName,
            },
          ];

    setFormData((prev) => ({
      ...prev,
      requestId: req.id,
      company: req.company,
      chemicalName: req.chemicalName,
      materialCategory: req.materialCategory,
      allocatedCapacity: req.requiredCapacity,
      compartmentAllocations: comps,
      vehicleId: compVehicle ? compVehicle.id : prev.vehicleId,
      driver: compVehicle ? compVehicle.driver : prev.driver,
      transporter: compVehicle ? compVehicle.owner : prev.transporter,
      origin: req.pickupLocation,
      originCity: req.pickupCity,
      destination: req.deliveryLocation,
      destinationCity: req.deliveryCity,
      expectedLoadingDate: req.loadingDate,
      expectedDeliveryDate: req.expectedDeliveryDate,
      freightRate: req.offeredRate,
      advancePaid: Math.round(Number(req.offeredRate) * 0.5),
    }));
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AssignmentFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const v = initialFleetVehicles.find((vh) => vh.id === vehicleId);
    if (!v) return;

    const comps: CompartmentAllocation[] =
      v.compartments && v.compartments.length > 0
        ? v.compartments.map((c) => ({
            compartmentNo: c.compartmentNo,
            capacity: c.capacity,
            loadedMaterial: formData.chemicalName,
          }))
        : [
            {
              compartmentNo: 1,
              capacity: v.capacity,
              loadedMaterial: formData.chemicalName,
            },
          ];

    setFormData((prev) => ({
      ...prev,
      vehicleId: v.id,
      driver: v.driver || prev.driver,
      transporter: v.owner || prev.transporter,
      allocatedCapacity: v.capacity,
      compartmentAllocations: comps,
    }));
  };

  const toggleChecklistItem = (item: keyof SecurityChecklist) => {
    setFormData((prev) => ({
      ...prev,
      securityChecklist: {
        ...prev.securityChecklist,
        [item]: !prev.securityChecklist[item],
      },
    }));
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
      const created = await onAssign(formData);
      setSuccessMsg(`Dispatch Pass ${created.id} issued successfully to ${formData.vehicleId}!`);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const selectedVehicle = initialFleetVehicles.find((v) => v.id === formData.vehicleId);

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
                <Truck size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">
                  Assign Tanker to Company
                </h2>
                <p className="text-xs text-muted-foreground">
                  Allocate fleet vehicle, driver, verify safety checklist & issue gate pass
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
              {/* Section 1: Requisition Link & Client Company */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[#FFA500]" />
                    <span>Client Requisition & Company</span>
                  </div>
                  {formData.requestId && (
                    <span className="font-mono text-[11px] text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/25 px-2 py-0.5 rounded-lg">
                      Linked: {formData.requestId}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Link Open Load Requisition (Optional)
                    </label>
                    <select
                      value={formData.requestId || ""}
                      onChange={(e) => {
                        const reqId = e.target.value;
                        if (!reqId) {
                          handleChange("requestId", "");
                        } else {
                          const r = initialLoadRequests.find((x) => x.id === reqId);
                          if (r) applyRequestToForm(r);
                        }
                      }}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition font-medium"
                    >
                      <option value="">-- Direct Spot Contract / No Requisition --</option>
                      {initialLoadRequests.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id}: {r.company} ({r.chemicalName} - {r.requiredCapacity.toLocaleString()}L)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <AutocompleteFilter
                      label="Target Company *"
                      value={formData.company}
                      onChange={(val) => handleChange("company", val)}
                      options={COMPANY_FILTER_OPTIONS}
                      hideAllOption={true}
                      placeholder="Select client company..."
                      icon={<Building2 size={13} />}
                    />
                    {errors.company && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle size={12} />
                        <span>{errors.company}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Cargo / Chemical Name <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.chemicalName}
                      onChange={(e) => handleChange("chemicalName", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Material Classification
                    </label>
                    <select
                      value={formData.materialCategory}
                      onChange={(e) => handleChange("materialCategory", e.target.value as MaterialCategory)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    >
                      <option value="Chemical">Chemical</option>
                      <option value="Hazardous">Hazardous</option>
                      <option value="Waste Water">Waste Water</option>
                      <option value="Non-Hazard">Non-Hazard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Smart Fleet Tanker Matchmaker & Searchable Selection */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#FFA500]" />
                    <span>Smart Tanker Selection & Autocomplete</span>
                  </div>
                  {selectedVehicle && (
                    <span className="text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-lg">
                      {selectedVehicle.bodyType} Body • {selectedVehicle.capacity.toLocaleString()} L
                    </span>
                  )}
                </div>

                {/* Autocomplete Search Bar & Filter Chips */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search tanker by ID (e.g. TK-001), Plate Number, Driver, or Tanker Type..."
                      value={vehicleSearchQuery}
                      onChange={(e) => setVehicleSearchQuery(e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                    />
                    {vehicleSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setVehicleSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Body Material Quick Filters */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-muted-foreground text-[10px] font-medium mr-1">Filter Body:</span>
                    {["ALL", "SS", "MS", "Rubber Lined MS"].map((bType) => (
                      <button
                        key={bType}
                        type="button"
                        onClick={() => setVehicleBodyFilter(bType)}
                        className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                          vehicleBodyFilter === bType
                            ? "border-[#FFA500] bg-[#FFA500]/15 text-[#FFA500]"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {bType === "ALL" ? "All Tankers" : `${bType}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered Tanker Cards List */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-foreground/80">
                      Matching Tankers ({
                        initialFleetVehicles.filter((v) => {
                          if (vehicleBodyFilter !== "ALL" && v.bodyType !== vehicleBodyFilter) return false;
                          if (!vehicleSearchQuery.trim()) return true;
                          const q = vehicleSearchQuery.toLowerCase().trim();
                          return (
                            v.id.toLowerCase().includes(q) ||
                            v.plateNo.toLowerCase().includes(q) ||
                            v.driver.toLowerCase().includes(q) ||
                            v.tankerType.toLowerCase().includes(q) ||
                            (v.bodyType && v.bodyType.toLowerCase().includes(q))
                          );
                        }).length
                      }) <span className="text-[#FFA500]">*</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground">Click to assign instantly</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar p-0.5">
                    {initialFleetVehicles
                      .filter((v) => {
                        if (vehicleBodyFilter !== "ALL" && v.bodyType !== vehicleBodyFilter) return false;
                        if (!vehicleSearchQuery.trim()) return true;
                        const q = vehicleSearchQuery.toLowerCase().trim();
                        return (
                          v.id.toLowerCase().includes(q) ||
                          v.plateNo.toLowerCase().includes(q) ||
                          v.driver.toLowerCase().includes(q) ||
                          v.tankerType.toLowerCase().includes(q) ||
                          (v.bodyType && v.bodyType.toLowerCase().includes(q))
                        );
                      })
                      .map((v) => {
                        const isSelected = formData.vehicleId === v.id;
                        const isCategoryMatch = v.material === formData.materialCategory;
                        return (
                          <div
                            key={v.id}
                            onClick={() => handleVehicleSelect(v.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                              isSelected
                                ? "border-[#FFA500] bg-[#FFA500]/10 ring-1 ring-[#FFA500]/30 shadow-xs"
                                : "border-border bg-background hover:bg-muted/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-foreground text-xs">{v.id}</span>
                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {v.plateNo}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {isCategoryMatch && (
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    Match
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-[#FFA500]">{v.bodyType || "MS"}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="truncate max-w-[130px]">{v.tankerType}</span>
                              <span className="font-mono font-bold text-foreground">{v.capacityDisplay}</span>
                            </div>

                            <div className="text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/50 pt-1.5 mt-0.5">
                              <span className="truncate max-w-[140px]">Driver: {v.driver}</span>
                              <span className="text-emerald-400 font-semibold shrink-0">● Available</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Section 3: Driver & Transporter Allocation */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <User size={14} className="text-[#FFA500]" />
                  <span>Authorised Crew & Transporter</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Assigned Driver <span className="text-[#FFA500]">*</span>
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
                      Driver Phone <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.driverPhone}
                      onChange={(e) => handleChange("driverPhone", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Fleet Owner / Transporter
                    </label>
                    <input
                      type="text"
                      value={formData.transporter}
                      onChange={(e) => handleChange("transporter", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Compartment Chamber Allocation */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Gauge size={14} className="text-[#FFA500]" />
                    <span>Compartment Chamber Distribution</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Total: {Number(formData.allocatedCapacity).toLocaleString()} L
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.compartmentAllocations.map((comp, idx) => (
                    <div
                      key={comp.compartmentNo}
                      className="rounded-xl border border-border bg-background p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FFA500]/20 text-[#FFA500] text-[10px] font-mono font-bold">
                            {comp.compartmentNo}
                          </span>
                          <span>Chamber {comp.compartmentNo}</span>
                        </span>
                        <span className="font-mono font-bold text-[#FFA500] text-xs">
                          {comp.capacity.toLocaleString()} L
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] text-muted-foreground mb-0.5">
                          Cargo Allocated to Chamber {comp.compartmentNo}
                        </label>
                        <input
                          type="text"
                          value={comp.loadedMaterial}
                          onChange={(e) => {
                            const newComps = [...formData.compartmentAllocations];
                            newComps[idx].loadedMaterial = e.target.value;
                            handleChange("compartmentAllocations", newComps);
                          }}
                          className="h-7.5 w-full rounded-lg border border-border bg-muted/20 px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Route Manifest & Schedule */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <MapPin size={14} className="text-[#FFA500]" />
                  <span>Loading & Delivery Route</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Origin Pickup Point *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Origin Plant"
                      value={formData.origin}
                      onChange={(e) => handleChange("origin", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Origin City"
                      value={formData.originCity}
                      onChange={(e) => handleChange("originCity", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
                      <span>Destination Delivery Point *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Destination Terminal"
                      value={formData.destination}
                      onChange={(e) => handleChange("destination", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Destination City"
                      value={formData.destinationCity}
                      onChange={(e) => handleChange("destinationCity", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Expected Loading Date *
                    </label>
                    <input
                      type="date"
                      value={formData.expectedLoadingDate}
                      onChange={(e) => handleChange("expectedLoadingDate", e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Target Delivery Date *
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

              {/* Section 6: Commercial Terms & Advance */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <DollarSign size={14} className="text-[#FFA500]" />
                  <span>Agreed Commercials & Advance Payout</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Total Agreed Freight Rate (INR ₹) <span className="text-[#FFA500]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={formData.freightRate}
                        onChange={(e) => handleChange("freightRate", e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background pl-7 pr-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Advance Payout to Transporter (INR ₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={formData.advancePaid}
                        onChange={(e) => handleChange("advancePaid", e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background pl-7 pr-3 text-xs font-mono font-bold text-foreground outline-none focus:border-[#FFA500] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7: Pre-Dispatch Security & Safety Checklist */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="text-xs font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#FFA500]" />
                    <span>Pre-Dispatch Security & Safety Checklist</span>
                  </div>
                  <span className="text-[10px] text-[#FFA500] font-semibold">Mandatory Gate Audit</span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      key: "tankerCleaned" as keyof SecurityChecklist,
                      label: "Tanker Degassed, Cleaned & Vapor Free Certificate Verified",
                      desc: "Chamber barrel inspected for previous cargo residues",
                    },
                    {
                      key: "gpsOnline" as keyof SecurityChecklist,
                      label: "GPS Tracking Telemetry Signal Online",
                      desc: "Live IoT telematics active with live battery backup",
                    },
                    {
                      key: "hazmatKitVerified" as keyof SecurityChecklist,
                      label: "Hazmat Safety Kit, Spark Arrestor & Chemical PPE on Board",
                      desc: "Includes fire extinguishers, spill kits, and emergency eye wash",
                    },
                    {
                      key: "driverBriefed" as keyof SecurityChecklist,
                      label: "Driver Safety Protocol & Route Hazard Briefing Completed",
                      desc: "Driver acknowledged speed limit & emergency protocol",
                    },
                    {
                      key: "fitnessValid" as keyof SecurityChecklist,
                      label: "Vehicle Fitness Certificate & PUC Verified Active",
                      desc: "Valid Form 38 and Pollution Certificate in glovebox",
                    },
                  ].map((item) => {
                    const isChecked = formData.securityChecklist[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleChecklistItem(item.key)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                          isChecked
                            ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            isChecked
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border bg-background"
                          }`}
                        >
                          {isChecked && <CheckCircle2 size={13} className="stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <div className="text-xs font-bold leading-tight">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.securityChecklist && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                    <AlertCircle size={12} />
                    <span>{errors.securityChecklist}</span>
                  </p>
                )}
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
                    <span>Issuing Dispatch Pass...</span>
                  </>
                ) : (
                  <>
                    <Truck size={14} className="stroke-[2.5]" />
                    <span>Authorize & Issue Dispatch Pass</span>
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

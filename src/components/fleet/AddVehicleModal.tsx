"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Droplets,
  Gauge,
  MapPin,
  Shield,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { validateVehicleForm } from "@/hooks/useFleetData";
import { FleetStatus, FleetVehicle, MaterialCategory, TankerType, VehicleFormData, VehicleFormErrors } from "@/types/fleet";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: VehicleFormData) => Promise<FleetVehicle>;
  existingVehicles: FleetVehicle[];
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  onAdd,
  existingVehicles,
}: AddVehicleModalProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    id: "",
    plateNo: "",
    tankerType: "Chemical Tanker",
    capacity: 20000,
    owner: "",
    driver: "",
    company: "ChemCorp Ltd",
    material: "Chemical",
    status: "Active",
    currentLocation: "",
  });

  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    field: keyof VehicleFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific error on change
    if (errors[field as keyof VehicleFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateVehicleForm(formData, existingVehicles, false);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(formData);
      setSuccessMsg(`Vehicle ${formData.id} successfully added to fleet!`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1A344D] bg-[#0A1A2B] shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#142637] px-6 py-4 bg-[#081523]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20">
              <Truck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F1F5F9] leading-tight">
                Add New Vehicle
              </h2>
              <p className="text-xs text-[#5E7995]">
                Register tanker to transport fleet network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5A7692] hover:bg-[#0E2337] hover:text-[#F1F5F9] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-400">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Vehicle ID */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Vehicle ID <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. TK-007"
                value={formData.id}
                onChange={(e) => handleChange("id", e.target.value.toUpperCase())}
                className={`h-9 w-full rounded-lg border bg-[#071522] px-3 text-xs font-mono text-[#E8EEF5] outline-none transition ${
                  errors.id
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-[#1A324A] focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.id && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.id}</span>
                </p>
              )}
            </div>

            {/* License Plate Number */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Plate Number <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AP09AB1234"
                value={formData.plateNo}
                onChange={(e) => handleChange("plateNo", e.target.value.toUpperCase())}
                className={`h-9 w-full rounded-lg border bg-[#071522] px-3 text-xs font-bold text-[#E8EEF5] outline-none transition ${
                  errors.plateNo
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-[#1A324A] focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.plateNo && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.plateNo}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Tanker Type */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Tanker Type <span className="text-[#FFA500]">*</span>
              </label>
              <select
                value={formData.tankerType}
                onChange={(e) => handleChange("tankerType", e.target.value as TankerType)}
                className="h-9 w-full rounded-lg border border-[#1A324A] bg-[#071522] px-3 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="Chemical Tanker">Chemical Tanker</option>
                <option value="Hazmat Tanker">Hazmat Tanker</option>
                <option value="Water Tanker">Water Tanker</option>
                <option value="General Tanker">General Tanker</option>
              </select>
            </div>

            {/* Capacity in Litres */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Capacity (Liters) <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="number"
                step="500"
                min="1000"
                max="60000"
                placeholder="20000"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className={`h-9 w-full rounded-lg border bg-[#071522] px-3 text-xs font-mono text-[#E8EEF5] outline-none transition ${
                  errors.capacity
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-[#1A324A] focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.capacity}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Fleet Owner / Transporter <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                className={`h-9 w-full rounded-lg border bg-[#071522] px-3 text-xs text-[#E8EEF5] outline-none transition ${
                  errors.owner
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-[#1A324A] focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.owner && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.owner}</span>
                </p>
              )}
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Assigned Driver <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh Mohan"
                value={formData.driver}
                onChange={(e) => handleChange("driver", e.target.value)}
                className={`h-9 w-full rounded-lg border bg-[#071522] px-3 text-xs text-[#E8EEF5] outline-none transition ${
                  errors.driver
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-[#1A324A] focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.driver && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.driver}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Operating Company */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Client / Company <span className="text-[#FFA500]">*</span>
              </label>
              <select
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="h-9 w-full rounded-lg border border-[#1A324A] bg-[#071522] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="ChemCorp Ltd">ChemCorp Ltd</option>
                <option value="HazWaste Solutions">HazWaste Solutions</option>
                <option value="AquaTech Pvt Ltd">AquaTech Pvt Ltd</option>
                <option value="EcoWaste Corp">EcoWaste Corp</option>
                <option value="IndusChem Ltd">IndusChem Ltd</option>
              </select>
            </div>

            {/* Material Classification */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Material Classification <span className="text-[#FFA500]">*</span>
              </label>
              <select
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value as MaterialCategory)}
                className="h-9 w-full rounded-lg border border-[#1A324A] bg-[#071522] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="Chemical">Chemical (Orange)</option>
                <option value="Hazardous">Hazardous (Red)</option>
                <option value="Waste Water">Waste Water (Cyan)</option>
                <option value="Non-Hazard">Non-Hazard (Green)</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
                Operational Status <span className="text-[#FFA500]">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value as FleetStatus)}
                className="h-9 w-full rounded-lg border border-[#1A324A] bg-[#071522] px-2.5 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              >
                <option value="Active">Active (Green)</option>
                <option value="Transit">Transit (Blue)</option>
                <option value="Maintenance">Maintenance (Amber)</option>
                <option value="Idle">Idle (Gray)</option>
              </select>
            </div>
          </div>

          {/* Depot / Base Location */}
          <div>
            <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
              Current Location / Depot
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#56728D]" />
              <input
                type="text"
                placeholder="e.g. Visakhapatnam Port Hub, Berth 4"
                value={formData.currentLocation}
                onChange={(e) => handleChange("currentLocation", e.target.value)}
                className="h-9 w-full rounded-lg border border-[#1A324A] bg-[#071522] pl-8.5 pr-3 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#142637]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#1A324A] px-4 py-2 text-xs font-semibold text-[#8DA6BE] hover:bg-[#0E2337] hover:text-[#F1F5F9] transition cursor-pointer"
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
                  <span>Adding Vehicle...</span>
                </>
              ) : (
                <span>Register Vehicle</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Phone,
  Shield,
  Truck,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { validateUserForm } from "@/services/userService";
import {
  UserCategory,
  UserFormData,
  UserFormErrors,
  UserItem,
  UserStatus,
  UserVerificationStatus,
} from "@/types/user";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: UserFormData) => Promise<UserItem>;
  defaultCategory?: UserCategory;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  defaultCategory = "Drivers",
}: AddUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    email: "",
    category: defaultCategory,
    licenseNo: "",
    assignedVehicle: "TK-001",
    company: "ChemCorp Ltd",
    fleetSize: 5,
    contactPerson: "",
    verified: "Verified",
    status: "Active",
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    field: keyof UserFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof UserFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const validation = validateUserForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(formData);
      setSuccessMsg(`User ${formData.name} added successfully!`);
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20">
              <UserCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">
                Add New User
              </h2>
              <p className="text-xs text-muted-foreground">
                Register driver, owner, or company to system
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

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-400">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* User Category Segment */}
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
              Account Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Drivers", "Owners", "Companies"] as UserCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange("category", cat)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    formData.category === cat
                      ? "border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name / Company Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                {formData.category === "Companies" ? "Company Name" : "Full Name"}{" "}
                <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder={
                  formData.category === "Companies"
                    ? "e.g. Acme Transport"
                    : "e.g. Suresh Mohan"
                }
                value={formData.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${
                  errors.name
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Phone Number <span className="text-[#FFA500]">*</span>
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${
                  errors.phone
                    ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                    : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle size={12} />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">
              Email Address <span className="text-[#FFA500]">*</span>
            </label>
            <input
              type="email"
              placeholder="user@domain.com"
              value={formData.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`h-9 w-full rounded-lg border bg-background px-3 text-xs text-foreground outline-none transition ${
                errors.email
                  ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                  : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
              }`}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                <AlertCircle size={12} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Dynamic Fields based on Category */}
          {formData.category === "Drivers" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                  License Number <span className="text-[#FFA500]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DL-AP-1234567"
                  value={formData.licenseNo ?? ""}
                  onChange={(e) => handleChange("licenseNo", e.target.value.toUpperCase())}
                  className={`h-9 w-full rounded-lg border bg-background px-3 text-xs font-mono font-bold text-[#FFA500] outline-none transition ${
                    errors.licenseNo
                      ? "border-rose-500/70 focus:ring-1 focus:ring-rose-500"
                      : "border-border focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                  }`}
                />
                {errors.licenseNo && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                    <AlertCircle size={12} />
                    <span>{errors.licenseNo}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                  Assigned Tanker Vehicle
                </label>
                <select
                  value={formData.assignedVehicle ?? "TK-001"}
                  onChange={(e) => handleChange("assignedVehicle", e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="TK-001">TK-001 (Chemical)</option>
                  <option value="TK-002">TK-002 (Hazmat)</option>
                  <option value="TK-003">TK-003 (Water)</option>
                  <option value="TK-004">TK-004 (Waste Water)</option>
                  <option value="TK-005">TK-005 (General)</option>
                  <option value="TK-006">TK-006 (Chemical)</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
            </div>
          )}

          {formData.category === "Companies" && (
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. K. S. Rao"
                value={formData.contactPerson ?? ""}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Verification Status */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Verification Status
              </label>
              <select
                value={formData.verified ?? "Verified"}
                onChange={(e) => handleChange("verified", e.target.value as UserVerificationStatus)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Verified">Verified (Green)</option>
                <option value="Pending">Pending (Amber)</option>
                <option value="Rejected">Rejected (Red)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Account Status
              </label>
              <select
                value={formData.status ?? "Active"}
                onChange={(e) => handleChange("status", e.target.value as UserStatus)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                  <span>Adding...</span>
                </>
              ) : (
                <span>Register User</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

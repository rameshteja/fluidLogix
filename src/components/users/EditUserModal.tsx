"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Edit3,
  FileCheck,
  FileText,
  Phone,
  Shield,
  Truck,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import FileUploadDropzone, {
  UploadedDocInfo,
} from "@/components/common/FileUploadDropzone";
import {
  COMPANY_FILTER_OPTIONS,
  FLEET_OWNER_FILTER_OPTIONS,
  USER_VEHICLE_FILTER_OPTIONS,
} from "@/data/filterOptions";
import { validateUserForm } from "@/services/userService";
import {
  UserCategory,
  UserFormData,
  UserFormErrors,
  UserItem,
  UserStatus,
  UserVerificationStatus,
} from "@/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: Partial<UserFormData>) => Promise<UserItem>;
  user: UserItem | null;
}

const DRIVER_ADDRESS_PROOFS = [
  "Aadhaar Card",
  "Passport",
  "Voter ID Card",
  "Utility Bill (Electricity/Water)",
  "Ration Card",
];

const OWNER_ADDRESS_PROOFS = [
  "Aadhaar Card",
  "Passport",
  "Electricity Bill",
  "Rental Agreement",
  "Property Tax Receipt",
];

const COMPANY_ADDRESS_PROOFS = [
  "Electricity Bill",
  "Property Tax Receipt",
  "Commercial Lease Agreement",
  "Bank Statement",
];

export const COMPANY_TYPE_OPTIONS = [
  "Chemical Manufacturer",
  "Pharma & Biotech Refinery",
  "Hazmat Waste Processor",
  "Petrochemical & Fuel Refinery",
  "Effluent Treatment Plant (ETP)",
  "Industrial Manufacturing",
  "Bulk Liquid Terminal & Port",
  "Logistics & Freight Client",
  "Trading & Raw Material Supply",
];

export const MATERIAL_TYPE_OPTIONS = [
  "Chemical",
  "Hazardous",
  "Waste Water",
  "Non-Hazard",
  "Petroleum / Oils",
  "Acids & Alkalis",
  "Industrial Effluent",
  "Food Grade Liquids",
];

export default function EditUserModal({
  isOpen,
  onClose,
  onEdit,
  user,
}: EditUserModalProps) {
  // Category (fixed during edit or pre-selected)
  const [category, setCategory] = useState<UserCategory>("Drivers");

  // Common Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState<UserVerificationStatus>("Verified");
  const [status, setStatus] = useState<UserStatus>("Active");

  // Driver-specific State
  const [driverLicenseNo, setDriverLicenseNo] = useState("");
  const [driverLicenseExpiryDate, setDriverLicenseExpiryDate] = useState("2028-10-15");
  const [driverAssignedVehicle, setDriverAssignedVehicle] = useState("TK-001");
  const [driverCompany, setDriverCompany] = useState("ChemCorp Ltd");
  const [driverOwner, setDriverOwner] = useState("Ravi Kumar");
  const [driverAddressProofType, setDriverAddressProofType] = useState("Aadhaar Card");
  const [driverAddressProofFile, setDriverAddressProofFile] = useState<UploadedDocInfo | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<UploadedDocInfo | null>(null);

  // Owner-specific State
  const [ownerPanNumber, setOwnerPanNumber] = useState("");
  const [ownerGstNumber, setOwnerGstNumber] = useState("");
  const [ownerFleetSize, setOwnerFleetSize] = useState<number>(2);
  const [ownerAddressProofType, setOwnerAddressProofType] = useState("Aadhaar Card");
  const [ownerAddressProofFile, setOwnerAddressProofFile] = useState<UploadedDocInfo | null>(null);
  const [ownerPanFile, setOwnerPanFile] = useState<UploadedDocInfo | null>(null);

  // Company-specific State
  const [companyType, setCompanyType] = useState("Chemical Manufacturer");
  const [companyMaterialTypes, setCompanyMaterialTypes] = useState<string[]>([
    "Chemical",
    "Hazardous",
  ]);
  const [companyContactPerson, setCompanyContactPerson] = useState("");
  const [companyGstNumber, setCompanyGstNumber] = useState("");
  const [companyAddressProofType, setCompanyAddressProofType] = useState("Electricity Bill");
  const [companyAddressProofFile, setCompanyAddressProofFile] = useState<UploadedDocInfo | null>(null);
  const [companyRegistrationCertFile, setCompanyRegistrationCertFile] = useState<UploadedDocInfo | null>(null);

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setCategory(user.category);
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setVerified(user.verified);
      setStatus(user.status);

      if (user.category === "Drivers") {
        setDriverLicenseNo(user.licenseNo || "");
        setDriverLicenseExpiryDate(user.licenseExpiryDate || "2028-10-15");
        setDriverAssignedVehicle(user.assignedVehicle || "TK-001");
        setDriverCompany(user.company || "ChemCorp Ltd");
        setDriverOwner(user.owner || "Ravi Kumar");
        setDriverAddressProofType(user.addressProofType || "Aadhaar Card");
        setDriverAddressProofFile(
          typeof user.addressProofFile === "object" ? user.addressProofFile : null
        );
        setDriverLicenseFile(
          typeof user.licenseFile === "object" ? user.licenseFile : null
        );
      } else if (user.category === "Owners") {
        setOwnerPanNumber(user.panNumber || "");
        setOwnerGstNumber(user.gstNumber || "");
        setOwnerFleetSize(user.fleetSize || 2);
        setOwnerAddressProofType(user.addressProofType || "Aadhaar Card");
        setOwnerAddressProofFile(
          typeof user.addressProofFile === "object" ? user.addressProofFile : null
        );
        setOwnerPanFile(
          typeof user.panFile === "object" ? user.panFile : null
        );
      } else if (user.category === "Companies") {
        setCompanyType(user.companyType || "Chemical Manufacturer");
        setCompanyMaterialTypes(
          user.materialTypes && user.materialTypes.length > 0
            ? user.materialTypes
            : ["Chemical", "Hazardous"]
        );
        setCompanyContactPerson(user.contactPerson || "");
        setCompanyGstNumber(user.gstNumber || "");
        setCompanyAddressProofType(user.addressProofType || "Electricity Bill");
        setCompanyAddressProofFile(
          typeof user.addressProofFile === "object" ? user.addressProofFile : null
        );
        setCompanyRegistrationCertFile(
          typeof user.companyRegistrationCertFile === "object"
            ? user.companyRegistrationCertFile
            : typeof user.incorporationCertFile === "object"
            ? user.incorporationCertFile
            : null
        );
      }

      setErrors({});
      setSuccessMsg("");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    let payload: Partial<UserFormData>;

    if (category === "Drivers") {
      payload = {
        name,
        phone,
        email,
        category: "Drivers",
        licenseNo: driverLicenseNo.toUpperCase(),
        licenseExpiryDate: driverLicenseExpiryDate,
        assignedVehicle: driverAssignedVehicle,
        company: driverCompany,
        owner: driverOwner,
        verified,
        status,
        addressProofType: driverAddressProofType,
        addressProofFile: driverAddressProofFile,
        licenseFile: driverLicenseFile,
      };
    } else if (category === "Owners") {
      payload = {
        name,
        phone,
        email,
        category: "Owners",
        panNumber: ownerPanNumber.toUpperCase(),
        gstNumber: ownerGstNumber.toUpperCase(),
        fleetSize: ownerFleetSize,
        verified,
        status,
        addressProofType: ownerAddressProofType,
        addressProofFile: ownerAddressProofFile,
        panFile: ownerPanFile,
      };
    } else {
      payload = {
        name,
        phone,
        email,
        category: "Companies",
        company: name,
        companyType,
        materialTypes: companyMaterialTypes,
        contactPerson: companyContactPerson,
        gstNumber: companyGstNumber.toUpperCase(),
        verified,
        status,
        addressProofType: companyAddressProofType,
        addressProofFile: companyAddressProofFile,
        companyRegistrationCertFile,
        incorporationCertFile: companyRegistrationCertFile,
      };
    }

    const validation = validateUserForm({ ...user, ...payload } as UserFormData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(user.id, payload);
      setSuccessMsg(`User ${user.name} details updated!`);
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                <Edit3 size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">
                    Edit {user.name}
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded-md border border-[#FFA500]/25">
                    {user.id}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Update profile parameters, KYC documents & credentials for {user.category.slice(0, -1)}
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
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-400 shrink-0">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs">
              {/* General Information */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <User size={14} className="text-[#FFA500]" />
                  <span>Basic Account & Contact Info</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={category === "Companies" ? "sm:col-span-2" : ""}>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Full Legal / Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 ${
                        errors.name ? "border-destructive" : "border-border"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Primary Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground font-mono outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 ${
                        errors.phone ? "border-destructive" : "border-border"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* DRIVERS: License + Autocomplete Tanker + Autocomplete Operating Company */}
              {category === "Drivers" && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                    <Truck size={14} className="text-[#FFA500]" />
                    <span>Driver License & Fleet Assignment</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Commercial Driving License Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AP-09-2018-0029104"
                        value={driverLicenseNo}
                        onChange={(e) => {
                          setDriverLicenseNo(e.target.value.toUpperCase());
                          if (errors.licenseNo)
                            setErrors((prev) => ({ ...prev, licenseNo: undefined }));
                        }}
                        className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 ${
                          errors.licenseNo ? "border-destructive" : "border-border"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Licence Expiry Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={driverLicenseExpiryDate}
                        onChange={(e) => setDriverLicenseExpiryDate(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      />
                    </div>

                    <div>
                      <AutocompleteFilter
                        label="Assigned Vehicle Tanker"
                        value={driverAssignedVehicle}
                        onChange={(val) => setDriverAssignedVehicle(val)}
                        options={USER_VEHICLE_FILTER_OPTIONS}
                        hideAllOption={true}
                        placeholder="Search tanker ID (e.g. TK-001)..."
                        icon={<Truck size={13} />}
                      />
                    </div>

                    <div>
                      <AutocompleteFilter
                        label="Fleet Owner / Transporter"
                        value={driverOwner}
                        onChange={(val) => setDriverOwner(val)}
                        options={FLEET_OWNER_FILTER_OPTIONS}
                        hideAllOption={true}
                        placeholder="Search fleet owner..."
                        icon={<User size={13} />}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AutocompleteFilter
                        label="Operating Company Hub"
                        value={driverCompany}
                        onChange={(val) => setDriverCompany(val)}
                        options={COMPANY_FILTER_OPTIONS}
                        hideAllOption={true}
                        placeholder="Search operating company..."
                        icon={<Building2 size={13} />}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OWNERS: PAN, GST & Fleet Size */}
              {category === "Owners" && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                    <Building2 size={14} className="text-[#FFA500]" />
                    <span>Transporter Tax & Fleet Capacity</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Transporter PAN Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder="e.g. AAAPL1234F"
                        value={ownerPanNumber}
                        onChange={(e) => setOwnerPanNumber(e.target.value.toUpperCase())}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        GST Number (GSTIN)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="e.g. 36AAAPL1234F1Z5"
                        value={ownerGstNumber}
                        onChange={(e) => setOwnerGstNumber(e.target.value.toUpperCase())}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Registered Fleet Size
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ownerFleetSize}
                        onChange={(e) => setOwnerFleetSize(parseInt(e.target.value) || 1)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COMPANIES: Contact Person, Company Type, Material Types & GST */}
              {category === "Companies" && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                    <Building2 size={14} className="text-[#FFA500]" />
                    <span>Company Classification & Handled Materials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Type Dropdown */}
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Company / Industry Type <span className="text-[#FFA500]">*</span>
                      </label>
                      <select
                        value={companyType}
                        onChange={(e) => setCompanyType(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition font-medium"
                      >
                        {COMPANY_TYPE_OPTIONS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Authorized Contact Person */}
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Authorized Contact Person
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. S. Venkatraman (Logistics Head)"
                        value={companyContactPerson}
                        onChange={(e) => setCompanyContactPerson(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Company GSTIN <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      placeholder="e.g. 36AAACH1234E1Z1"
                      value={companyGstNumber}
                      onChange={(e) => setCompanyGstNumber(e.target.value.toUpperCase())}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                    />
                  </div>

                  {/* Material Types Multi-Select Dropdown / Pill Selector */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-muted-foreground">
                        Handled Material Types (Cargo contained/dispatched) <span className="text-[#FFA500]">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCompanyMaterialTypes([...MATERIAL_TYPE_OPTIONS])}
                          className="text-[10px] text-[#FFA500] hover:underline cursor-pointer"
                        >
                          Select All
                        </button>
                        <span className="text-muted-foreground text-[10px]">•</span>
                        <button
                          type="button"
                          onClick={() => setCompanyMaterialTypes([])}
                          className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Multi-select Interactive Tags Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MATERIAL_TYPE_OPTIONS.map((mat) => {
                        const isSelected = companyMaterialTypes.includes(mat);
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => {
                              setCompanyMaterialTypes((prev) =>
                                isSelected ? prev.filter((m) => m !== mat) : [...prev, mat]
                              );
                            }}
                            className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "border-[#FFA500] bg-[#FFA500]/15 text-[#FFA500] shadow-xs font-bold"
                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <span className="truncate">{mat}</span>
                            {isSelected && (
                              <CheckCircle2 size={13} className="shrink-0 text-[#FFA500]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {companyMaterialTypes.length === 0 && (
                      <p className="text-[11px] text-amber-400">
                        Please select at least one material category handled by this company.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Verification & Account Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    KYC Verification Status
                  </label>
                  <select
                    value={verified}
                    onChange={(e) =>
                      setVerified(e.target.value as UserVerificationStatus)
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending Verification</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as UserStatus)
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* ================= CATEGORY-SPECIFIC DOCUMENT UPLOADS ================= */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
                  <FileCheck size={14} className="text-[#FFA500]" />
                  <span>Document Uploads & KYC Verification ({category})</span>
                </div>

                {/* DRIVERS UPLOADS */}
                {category === "Drivers" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="block font-semibold text-muted-foreground mb-1">
                          Driver Address Proof Type
                        </label>
                        <select
                          value={driverAddressProofType}
                          onChange={(e) => setDriverAddressProofType(e.target.value)}
                          className="h-8.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                        >
                          {DRIVER_ADDRESS_PROOFS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FileUploadDropzone
                        label={`Upload Driver ${driverAddressProofType}`}
                        hint="Aadhaar, Voter ID, or Passport (PDF / JPG)"
                        value={driverAddressProofFile}
                        onChange={(file) => setDriverAddressProofFile(file)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Driving Licence Document
                      </label>
                      <FileUploadDropzone
                        label="Upload Driving Licence Card / Paper"
                        hint="Front & back scanned copy (PDF / JPG / PNG)"
                        value={driverLicenseFile}
                        onChange={(file) => setDriverLicenseFile(file)}
                      />
                    </div>
                  </div>
                )}

                {/* OWNERS UPLOADS */}
                {category === "Owners" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="block font-semibold text-muted-foreground mb-1">
                          Owner Address Proof Type
                        </label>
                        <select
                          value={ownerAddressProofType}
                          onChange={(e) => setOwnerAddressProofType(e.target.value)}
                          className="h-8.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                        >
                          {OWNER_ADDRESS_PROOFS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FileUploadDropzone
                        label={`Upload Owner ${ownerAddressProofType}`}
                        hint="Aadhaar, Utility Bill or Lease (PDF / JPG)"
                        value={ownerAddressProofFile}
                        onChange={(file) => setOwnerAddressProofFile(file)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Transporter PAN Card Document
                      </label>
                      <FileUploadDropzone
                        label="Upload PAN Card Document"
                        hint="Clear photo or scanned PDF of PAN card"
                        value={ownerPanFile}
                        onChange={(file) => setOwnerPanFile(file)}
                      />
                    </div>
                  </div>
                )}

                {/* COMPANIES UPLOADS */}
                {category === "Companies" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="block font-semibold text-muted-foreground mb-1">
                          Company Address Proof Type
                        </label>
                        <select
                          value={companyAddressProofType}
                          onChange={(e) => setCompanyAddressProofType(e.target.value)}
                          className="h-8.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                        >
                          {COMPANY_ADDRESS_PROOFS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FileUploadDropzone
                        label={`Upload Company ${companyAddressProofType}`}
                        hint="Electricity Bill, Lease, Bank Statement"
                        value={companyAddressProofFile}
                        onChange={(file) => setCompanyAddressProofFile(file)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Company Registration Certificate
                      </label>
                      <FileUploadDropzone
                        label="Upload Company Registration Certificate"
                        hint="MCA Certificate / Registration Document (PDF / JPG)"
                        value={companyRegistrationCertFile}
                        onChange={(file) => setCompanyRegistrationCertFile(file)}
                      />
                    </div>
                  </div>
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
                <CheckCircle2 size={14} />
                <span>{isSubmitting ? "Updating..." : "Update Details"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

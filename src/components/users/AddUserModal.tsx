"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  Phone,
  Shield,
  Truck,
  UploadCloud,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
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

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: UserFormData) => Promise<UserItem>;
  defaultCategory?: UserCategory;
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

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  defaultCategory = "Drivers",
}: AddUserModalProps) {
  // Active Category Tab
  const [category, setCategory] = useState<UserCategory>(defaultCategory);

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
  const [companyContactPerson, setCompanyContactPerson] = useState("");
  const [companyGstNumber, setCompanyGstNumber] = useState("");
  const [companyAddressProofType, setCompanyAddressProofType] = useState("Electricity Bill");
  const [companyAddressProofFile, setCompanyAddressProofFile] = useState<UploadedDocInfo | null>(null);
  const [companyRegistrationCertFile, setCompanyRegistrationCertFile] = useState<UploadedDocInfo | null>(null);

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    let payload: UserFormData;

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

    const validation = validateUserForm(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(payload);
      setSuccessMsg(`User ${name} added successfully!`);
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
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
              <UserCheck size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Add New {category.slice(0, -1)}
              </h2>
              <p className="text-xs text-muted-foreground">
                Register profile details, KYC documents & credentials
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

        {/* Category Selector Tabs */}
        <div className="flex border-b border-border bg-muted/10 px-6 pt-3">
          {(["Drivers", "Owners", "Companies"] as UserCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setErrors({});
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                category === cat
                  ? "border-[#FFA500] text-[#FFA500]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "Drivers" && <Truck size={14} />}
              {cat === "Owners" && <User size={14} />}
              {cat === "Companies" && <Building2 size={14} />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[72vh] overflow-y-auto custom-scrollbar text-xs"
        >
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Full Name / Entity Name *
              </label>
              <input
                type="text"
                required
                placeholder={
                  category === "Companies"
                    ? "e.g. Acme Chemical Logistics"
                    : "e.g. Ramesh Naidu"
                }
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500] ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98451 22310"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground font-mono outline-none transition focus:border-[#FFA500] ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. user@fluidlogix.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500] ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* DRIVERS: License + Autocomplete Tanker + Autocomplete Operating Company */}
            {category === "Drivers" && (
              <>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Driving License Number *
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
                    className={`h-9 w-full rounded-xl border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none transition focus:border-[#FFA500] ${
                      errors.licenseNo ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.licenseNo && (
                    <p className="mt-1 text-[11px] text-destructive">
                      {errors.licenseNo}
                    </p>
                  )}
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
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none transition focus:border-[#FFA500]"
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

                <div>
                  <AutocompleteFilter
                    label="Operating Company"
                    value={driverCompany}
                    onChange={(val) => setDriverCompany(val)}
                    options={COMPANY_FILTER_OPTIONS}
                    hideAllOption={true}
                    placeholder="Search operating company..."
                    icon={<Building2 size={13} />}
                  />
                </div>
              </>
            )}

            {/* OWNERS: PAN, GST & Fleet Size */}
            {category === "Owners" && (
              <>
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
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
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
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Registered Fleet Size (Tankers)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ownerFleetSize}
                    onChange={(e) => setOwnerFleetSize(parseInt(e.target.value) || 1)}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  />
                </div>
              </>
            )}

            {/* COMPANIES: Contact Person & GST */}
            {category === "Companies" && (
              <>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Authorized Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S. Venkatraman (Logistics Head)"
                    value={companyContactPerson}
                    onChange={(e) => setCompanyContactPerson(e.target.value)}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Company GSTIN *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="e.g. 36AAACH1234E1Z1"
                    value={companyGstNumber}
                    onChange={(e) => setCompanyGstNumber(e.target.value.toUpperCase())}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
                  />
                </div>
              </>
            )}

            {/* Verification Status */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                KYC Verification Status
              </label>
              <select
                value={verified}
                onChange={(e) =>
                  setVerified(e.target.value as UserVerificationStatus)
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending Verification</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* ================= CATEGORY-SPECIFIC DOCUMENT UPLOADS ================= */}
          <div className="pt-2 border-t border-border space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck size={16} className="text-[#FFA500]" />
              <h3 className="text-xs font-bold text-foreground">
                Document Uploads & KYC Verification ({category})
              </h3>
            </div>

            {/* DRIVERS UPLOADS */}
            {category === "Drivers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Driver Address Proof Type *
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
                    Driving Licence Document *
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
                      Owner Address Proof Type *
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
                    Transporter PAN Card Document *
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
                      Company Address Proof Type *
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
                    Company Registration Certificate *
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

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : `Save ${category.slice(0, -1)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import {
  Building2,
  Check,
  CreditCard,
  DollarSign,
  Landmark,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  FLEET_OWNER_FILTER_OPTIONS,
  INDIAN_BANKS_FILTER_OPTIONS,
} from "@/data/filterOptions";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import {
  OwnerBankAccountType,
  OwnerBankFormData,
  OwnerPayoutStatus,
  OwnerVerificationStatus,
} from "@/types/bank";

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OwnerBankFormData) => Promise<void>;
}

const COMMON_BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
  "Federal Bank",
  "Yes Bank",
];

const ACCOUNT_TYPES: OwnerBankAccountType[] = [
  "Proprietorship Current",
  "Current Account",
  "Savings Account",
  "Transporter Escrow",
  "Overdraft Account",
];

export default function AddBankModal({
  isOpen,
  onClose,
  onSubmit,
}: AddBankModalProps) {
  const [formData, setFormData] = useState<OwnerBankFormData>({
    ownerName: "Ravi Kumar",
    ownerPhone: "+91 98451 22310",
    panNumber: "AAAPL1234F",
    assignedTankers: ["TK-001"],
    bankName: "HDFC Bank",
    accountHolder: "Ravi Kumar Logistics",
    accountNumber: "",
    accountType: "Proprietorship Current",
    ifscCode: "",
    branchName: "",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    upiId: "",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    monthlySettlementAmt: 0,
    tdsDeclarationSubmitted: true,
    notes: "",
  });

  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleOwnerSelect = (ownerName: string) => {
    const selected = FLEET_OWNER_FILTER_OPTIONS.find(
      (o) => o.value === ownerName
    );
    let phone = "+91 98450 00000";
    let tankers = ["TK-001"];

    if (ownerName === "Ravi Kumar") {
      phone = "+91 98451 22310";
      tankers = ["TK-001", "TK-008"];
    } else if (ownerName === "Prakash Reddy") {
      phone = "+91 97120 44589";
      tankers = ["TK-002", "TK-011"];
    } else if (ownerName === "Kishore Patel") {
      phone = "+91 94401 88320";
      tankers = ["TK-004", "TK-015"];
    } else if (ownerName === "Venkat Babu") {
      phone = "+91 98200 99881";
      tankers = ["TK-005", "TK-019"];
    } else if (ownerName === "Deepak Shah") {
      phone = "+91 99300 44112";
      tankers = ["TK-006"];
    } else if (ownerName === "Srinivas Rao") {
      phone = "+91 98765 43210";
      tankers = ["TK-003"];
    }

    setFormData({
      ...formData,
      ownerName,
      ownerPhone: phone,
      accountHolder: `${ownerName} Transport Services`,
      assignedTankers: tankers,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.ownerName.trim()) {
      setError("Please select or enter the fleet owner's name.");
      return;
    }
    if (!formData.accountNumber.trim() || formData.accountNumber.length < 8) {
      setError("Please enter a valid account number (min 8 digits).");
      return;
    }
    if (formData.accountNumber !== confirmAccountNumber) {
      setError("Account numbers do not match.");
      return;
    }
    if (!formData.ifscCode.trim() || formData.ifscCode.length !== 11) {
      setError("IFSC Code must be exactly 11 alphanumeric characters.");
      return;
    }
    if (!formData.branchName.trim()) {
      setError("Branch name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add fleet owner bank details.");
    } finally {
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

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
              <Landmark size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Add Fleet Owner Settlement Account
              </h3>
              <p className="text-xs text-muted-foreground">
                Register bank details for monthly freight payout settlements
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fleet Owner Name */}
            <div>
              <AutocompleteFilter
                label="Fleet Owner / Transporter *"
                value={formData.ownerName}
                onChange={(val) => handleOwnerSelect(val)}
                options={FLEET_OWNER_FILTER_OPTIONS}
                hideAllOption={true}
                placeholder="Search fleet owner..."
                icon={<User size={13} />}
              />
            </div>

            {/* Owner Phone */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Registered Contact Phone *
              </label>
              <input
                type="text"
                required
                value={formData.ownerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, ownerPhone: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* PAN Card */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Transporter PAN Card Number *
              </label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="e.g. AAAPL1234F"
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    panNumber: e.target.value.toUpperCase(),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* Assigned Tankers */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Assigned Tankers
              </label>
              <input
                type="text"
                placeholder="e.g. TK-001, TK-008"
                value={formData.assignedTankers.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedTankers: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* Bank Name */}
            <div>
              <AutocompleteFilter
                label="Bank Name *"
                value={formData.bankName}
                onChange={(val) =>
                  setFormData({ ...formData, bankName: val })
                }
                options={INDIAN_BANKS_FILTER_OPTIONS}
                hideAllOption={true}
                placeholder="Search bank name..."
                icon={<Landmark size={13} />}
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Account Type *
              </label>
              <select
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as OwnerBankAccountType,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Holder */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Beneficiary Name (as per Bank Account) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ravi Kumar Logistics & Fleet Transport"
                value={formData.accountHolder}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolder: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Account Number *
              </label>
              <input
                type="password"
                required
                placeholder="Enter complete bank account number"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Confirm Account Number *
              </label>
              <input
                type="text"
                required
                placeholder="Re-enter bank account number"
                value={confirmAccountNumber}
                onChange={(e) =>
                  setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                IFSC Code (11 Chars) *
              </label>
              <input
                type="text"
                required
                maxLength={11}
                placeholder="e.g. HDFC0001234"
                value={formData.ifscCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ifscCode: e.target.value.toUpperCase(),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* Branch Name */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Branch Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Visakhapatnam Port Branch"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. Visakhapatnam"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            {/* UPI ID */}
            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Owner UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ravikumar@okhdfcbank"
                value={formData.upiId}
                onChange={(e) =>
                  setFormData({ ...formData, upiId: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>
          </div>

          {/* Verification & KYC Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  verificationStatus:
                    formData.verificationStatus === "Verified"
                      ? "Pending Verification"
                      : "Verified",
                })
              }
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                formData.verificationStatus === "Verified"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-border bg-muted/20"
              }`}
            >
              <div>
                <div className="font-bold text-foreground">
                  Penny Drop Verification
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Mark account verified via bank penny drop
                </div>
              </div>
              <div
                className={`h-5 w-9 shrink-0 rounded-full transition-colors relative ${
                  formData.verificationStatus === "Verified"
                    ? "bg-emerald-500"
                    : "bg-muted border border-border"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-background shadow-md transition-transform absolute top-0.5 ${
                    formData.verificationStatus === "Verified"
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  tdsDeclarationSubmitted: !formData.tdsDeclarationSubmitted,
                })
              }
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                formData.tdsDeclarationSubmitted
                  ? "border-[#FFA500]/40 bg-[#FFA500]/10"
                  : "border-border bg-muted/20"
              }`}
            >
              <div>
                <div className="font-bold text-foreground">
                  194C TDS Declaration
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Form 194C non-deduction declaration filed
                </div>
              </div>
              <div
                className={`h-5 w-9 shrink-0 rounded-full transition-colors relative ${
                  formData.tdsDeclarationSubmitted
                    ? "bg-[#FFA500]"
                    : "bg-muted border border-border"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-background shadow-md transition-transform absolute top-0.5 ${
                    formData.tdsDeclarationSubmitted
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block font-semibold text-muted-foreground mb-1.5">
              Settlement Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Primary settlement account for chemical corridor..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] resize-none"
            />
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
              <Check size={14} className="stroke-[3]" />
              <span>
                {isSubmitting
                  ? "Saving Transporter..."
                  : "Save Settlement Account"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

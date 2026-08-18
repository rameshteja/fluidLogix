"use client";

import {
  Building2,
  Check,
  CreditCard,
  Landmark,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FLEET_OWNER_FILTER_OPTIONS,
  INDIAN_BANKS_FILTER_OPTIONS,
} from "@/data/filterOptions";
import AutocompleteFilter from "@/components/common/AutocompleteFilter";
import {
  OwnerBankAccountType,
  OwnerBankFormData,
  OwnerBankItem,
  OwnerPayoutStatus,
  OwnerVerificationStatus,
} from "@/types/bank";

interface EditBankModalProps {
  isOpen: boolean;
  bank: OwnerBankItem | null;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<OwnerBankFormData>) => Promise<void>;
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
];

const ACCOUNT_TYPES: OwnerBankAccountType[] = [
  "Proprietorship Current",
  "Current Account",
  "Savings Account",
  "Transporter Escrow",
  "Overdraft Account",
];

export default function EditBankModal({
  isOpen,
  bank,
  onClose,
  onSubmit,
}: EditBankModalProps) {
  const [formData, setFormData] = useState<Partial<OwnerBankFormData>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bank) {
      setFormData({
        ownerName: bank.ownerName,
        ownerPhone: bank.ownerPhone,
        panNumber: bank.panNumber,
        assignedTankers: bank.assignedTankers,
        bankName: bank.bankName,
        accountHolder: bank.accountHolder,
        accountNumber: bank.accountNumber,
        accountType: bank.accountType,
        ifscCode: bank.ifscCode,
        branchName: bank.branchName,
        city: bank.city,
        state: bank.state,
        upiId: bank.upiId || "",
        verificationStatus: bank.verificationStatus,
        payoutStatus: bank.payoutStatus,
        isPrimaryPayoutAccount: bank.isPrimaryPayoutAccount,
        monthlySettlementAmt: bank.monthlySettlementAmt,
        tdsDeclarationSubmitted: bank.tdsDeclarationSubmitted,
        notes: bank.notes || "",
      });
    }
  }, [bank]);

  if (!isOpen || !bank) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    try {
      await onSubmit(bank.id, formData);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to update fleet owner bank details.");
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
                Edit Bank Settlement Details ({bank.ownerName})
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {bank.bankName} • {bank.maskedAccountNumber}
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
            <div>
              <AutocompleteFilter
                label="Fleet Owner / Transporter"
                value={formData.ownerName || ""}
                onChange={(val) =>
                  setFormData({ ...formData, ownerName: val })
                }
                options={FLEET_OWNER_FILTER_OPTIONS}
                hideAllOption={true}
                placeholder="Search fleet owner..."
                icon={<User size={13} />}
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={formData.ownerPhone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ownerPhone: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.panNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    panNumber: e.target.value.toUpperCase(),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <AutocompleteFilter
                label="Bank Name"
                value={formData.bankName || ""}
                onChange={(val) =>
                  setFormData({ ...formData, bankName: val })
                }
                options={INDIAN_BANKS_FILTER_OPTIONS}
                hideAllOption={true}
                placeholder="Search bank name..."
                icon={<Landmark size={13} />}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Beneficiary Name (Account Holder)
              </label>
              <input
                type="text"
                value={formData.accountHolder || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolder: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                maxLength={11}
                value={formData.ifscCode || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ifscCode: e.target.value.toUpperCase(),
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Branch Location
              </label>
              <input
                type="text"
                value={formData.branchName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Account Type
              </label>
              <select
                value={formData.accountType || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as OwnerBankAccountType,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                KYC Verification Status
              </label>
              <select
                value={formData.verificationStatus || "Verified"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verificationStatus: e.target.value as OwnerVerificationStatus,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Verified">Verified (Penny Drop Success)</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1.5">
                Payout Settlement Status
              </label>
              <select
                value={formData.payoutStatus || "Ready for Payout"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payoutStatus: e.target.value as OwnerPayoutStatus,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
              >
                <option value="Ready for Payout">Ready for Payout</option>
                <option value="On Hold (KYC Pending)">On Hold (KYC Pending)</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1.5">
              Settlement Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:border-[#FFA500] resize-none"
            />
          </div>

          {/* Footer */}
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
                {isSubmitting ? "Updating..." : "Update Settlement Account"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

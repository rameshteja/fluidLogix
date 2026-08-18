"use client";

import { AlertTriangle, Landmark, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { OwnerBankItem } from "@/types/bank";

interface DeleteBankModalProps {
  isOpen: boolean;
  bank: OwnerBankItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
}

export default function DeleteBankModal({
  isOpen,
  bank,
  onClose,
  onConfirm,
}: DeleteBankModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bank) return null;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await onConfirm(bank.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to delete owner bank account.");
    } finally {
      setIsDeleting(false);
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
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-destructive/5">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/15 text-destructive shadow-sm">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Delete Owner Bank Account
              </h3>
              <p className="text-xs text-muted-foreground">
                Remove transporter settlement banking record
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">
            Are you sure you want to remove the settlement bank account for{" "}
            <strong className="text-foreground">{bank.ownerName}</strong> (
            <span className="font-mono text-foreground">{bank.bankName} - {bank.maskedAccountNumber}</span>
            )?
          </p>

          <div className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beneficiary:</span>
              <span className="text-foreground font-semibold truncate max-w-[200px]">{bank.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IFSC:</span>
              <span className="text-foreground">{bank.ifscCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">July Payout Due:</span>
              <span className="text-[#FFA500] font-bold">{bank.monthlySettlementDisplay}</span>
            </div>
          </div>

          {bank.monthlySettlementAmt > 0 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-medium leading-relaxed">
              ⚠️ <strong>Note:</strong> This fleet owner has an active pending settlement of <strong>{bank.monthlySettlementDisplay}</strong> for July 2025 dispatches.
            </div>
          )}

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
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 rounded-xl bg-destructive px-5 py-2 text-xs font-bold text-destructive-foreground shadow-md hover:bg-destructive/90 transition cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{isDeleting ? "Deleting..." : "Delete Bank Account"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Building2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Landmark,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MonthlyBillingItem, PaymentFormData } from "@/types/billing";

interface PayNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: MonthlyBillingItem | null;
  onPay: (data: PaymentFormData) => Promise<void>;
}

export default function PayNowModal({
  isOpen,
  onClose,
  bill,
  onPay,
}: PayNowModalProps) {
  const todayIso = new Date().toISOString().split("T")[0];

  const [paymentMethod, setPaymentMethod] = useState<
    "NEFT/RTGS" | "UPI" | "Bank Transfer" | "Cheque"
  >("NEFT/RTGS");
  const [transactionRef, setTransactionRef] = useState("");
  const [paidDate, setPaidDate] = useState(todayIso);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bill) {
      const randomRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionRef(randomRef);
      setPaidDate(new Date().toISOString().split("T")[0]);
      setError("");
    }
  }, [bill]);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setError("Transaction reference number is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onPay({
        billingId: bill.id,
        amount: bill.total,
        paymentMethod,
        transactionRef,
        paidDate: new Date(paidDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        notes,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError("Failed to record payment transaction.");
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
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 font-bold">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">
                Process Freight Payout
              </h2>
              <p className="text-xs text-muted-foreground">
                Disburse monthly settlement for {bill.vehicle} ({bill.month})
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-400 font-semibold">
              {error}
            </div>
          )}

          {/* Payout Summary Box */}
          <div className="rounded-xl border border-[#FFA500]/30 bg-[#FFA500]/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Amount Payable
              </span>
              <div className="text-2xl font-black font-mono text-[#FFA500] mt-0.5">
                {bill.totalDisplay}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">Beneficiary:</span>
              <span className="font-bold text-foreground text-xs">{bill.owner}</span>
              <span className="font-mono text-[11px] text-muted-foreground block">{bill.vehicle} ({bill.plateNo})</span>
            </div>
          </div>

          {/* Bank Account Info */}
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark size={15} className="text-[#FFA500]" />
              <div>
                <span className="font-semibold text-foreground">{bill.bankAccount || "Registered Account"}</span>
                <span className="text-[10px] text-muted-foreground block font-mono">IFSC: {bill.ifscCode || "SBIN0001234"}</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Payment Method / Channel
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "NEFT/RTGS" | "UPI" | "Bank Transfer" | "Cheque"
                )
              }
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
            >
              <option value="NEFT/RTGS">NEFT / RTGS Corporate Gateway</option>
              <option value="Bank Transfer">Direct Online Bank Transfer (IMPS)</option>
              <option value="UPI">Corporate UPI Payout</option>
              <option value="Cheque">Commercial Account Payee Cheque</option>
            </select>
          </div>

          {/* Transaction Ref & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Transaction Reference / UTR No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UTR88921094"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Payment Settlement Date
              </label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              Payment Remarks (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cleared via monthly corporate batch run."
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#FFA500] px-5 py-2 font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  <span>Confirm & Mark as Paid</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

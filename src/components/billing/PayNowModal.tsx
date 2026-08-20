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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity drawer-backdrop-animate"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-lg bg-card border-l border-border/80 shadow-2xl flex flex-col h-full overflow-hidden drawer-panel-animate drawer-glow-edge">
          {/* Header */}
          <div className="p-5 sm:px-6 border-b border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20 font-bold">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">
                  Process Freight Settlement
                </h2>
                <p className="text-xs text-muted-foreground">
                  Record payout disbursement for {bill.vehicle} ({bill.month})
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

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs">
              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-rose-400 font-semibold shrink-0">
                  {error}
                </div>
              )}

              {/* Payout Summary Box */}
              <div className="rounded-2xl border border-[#FFA500]/30 bg-[#FFA500]/10 p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Net Settlement
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
              <div className="rounded-2xl border border-border bg-muted/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center text-[#FFA500]">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-xs block">{bill.bankAccount || "Registered Bank Account"}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">IFSC: {bill.ifscCode || "SBIN0001234"}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              </div>

              {/* Payment Method & Mode */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <label className="block text-foreground font-bold">
                  Payment Method / Gateway Channel
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as "NEFT/RTGS" | "UPI" | "Bank Transfer" | "Cheque"
                    )
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                >
                  <option value="NEFT/RTGS">NEFT / RTGS Corporate Gateway</option>
                  <option value="Bank Transfer">Direct Online Bank Transfer (IMPS)</option>
                  <option value="UPI">Corporate UPI Payout</option>
                  <option value="Cheque">Commercial Account Payee Cheque</option>
                </select>
              </div>

              {/* Transaction Ref & Date */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60">
                  Transaction Confirmation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      UTR / Transaction Reference <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. UTR88921094"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 font-mono transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">
                      Settlement Date
                    </label>
                    <input
                      type="date"
                      value={paidDate}
                      onChange={(e) => setPaidDate(e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Accounting Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Cleared via monthly corporate batch run."
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
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
                    <span>Processing Payout...</span>
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
    </div>
  );
}


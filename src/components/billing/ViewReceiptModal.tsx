"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Landmark,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Truck,
  User,
  Weight,
  X,
} from "lucide-react";
import { MonthlyBillingItem } from "@/types/billing";

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: MonthlyBillingItem | null;
  onPayNow?: (bill: MonthlyBillingItem) => void;
}

export default function ViewReceiptModal({
  isOpen,
  onClose,
  bill,
  onPayNow,
}: ViewReceiptModalProps) {
  if (!isOpen || !bill) return null;

  const isPaid = bill.status === "Paid";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 font-bold">
              <Droplets size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-black text-[#FFA500] bg-[#FFA500]/10 px-2.5 py-0.5 rounded-lg border border-[#FFA500]/30 tracking-wide">
                  {bill.invoiceNo}
                </span>
                <span className="text-base font-bold text-foreground">
                  Monthly Freight Invoice
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Billing Period: <span className="text-foreground font-semibold">{bill.month}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Paid in Full</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <Clock size={13} />
                <span>Pending Settlement</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 text-xs">
          {/* Top Banner: Beneficiary & Vehicle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
            {/* Left: Vehicle & Owner */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Fleet Owner / Beneficiary
              </span>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFA500]/15 text-[#FFA500] font-bold text-xs">
                  {bill.owner.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{bill.owner}</h3>
                  <p className="text-xs text-muted-foreground">{bill.ownerPhone || "+91 98450 00000"}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center gap-4 text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Vehicle ID:</span>
                  <span className="font-mono font-bold text-[#FFA500]">{bill.vehicle}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Plate No:</span>
                  <span className="font-mono font-bold text-foreground">{bill.plateNo}</span>
                </div>
              </div>
            </div>

            {/* Right: Bank Payout Account & Dates */}
            <div className="space-y-2 sm:border-l sm:border-border sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Payout Bank Details
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Landmark size={13} className="text-[#FFA500]" />
                  <span>{bill.bankAccount || "Registered Commercial Bank"}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  IFSC: {bill.ifscCode || "SBIN0001234"}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Generated Date:</span>
                  <span className="font-medium text-foreground">{bill.generatedDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Due Date:</span>
                  <span className="font-medium text-rose-400">{bill.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Payout Table */}
          <div className="rounded-xl border border-border bg-background overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border font-bold text-xs text-foreground flex items-center justify-between">
              <span>Freight Trip Itemization ({bill.month})</span>
              <span className="font-mono text-[#FFA500]">{bill.trips} Completed Trips</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-[11px] text-muted-foreground bg-muted/20">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Trip Count</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Net Freight Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Local Trips Row */}
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-foreground">Local Transport Trips</div>
                    <div className="text-[11px] text-muted-foreground">Within hub boundary / municipal industrial zones</div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400 font-mono">
                    {bill.localTrips} Trips
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                    {bill.localAmtDisplay}
                  </td>
                </tr>

                {/* Non-Local Trips Row */}
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-foreground">Non-Local (Long-Haul) Transit Trips</div>
                    <div className="text-[11px] text-muted-foreground">Inter-city & inter-state highway haulage</div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[#FFA500] font-mono">
                    {bill.nonLocalTrips} Trips
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                    {bill.nonLocalAmtDisplay}
                  </td>
                </tr>

                {/* Gross Total Weight */}
                <tr className="bg-muted/10">
                  <td className="py-2.5 px-4 text-muted-foreground font-medium">
                    Cumulative Cargo Weight Handled:
                  </td>
                  <td colSpan={2} className="py-2.5 px-4 text-right font-mono font-bold text-foreground">
                    {bill.totalWeightDisplay}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Payable Summary Bar */}
            <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border">
              <div>
                <div className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                  Total Monthly Payout
                </div>
                <div className="text-[10px] text-muted-foreground">Taxes & toll reconciliations applied</div>
              </div>
              <div className="text-xl font-black font-mono text-[#FFA500]">
                {bill.totalDisplay}
              </div>
            </div>
          </div>

          {/* Payment Proof / Settlement Status Section */}
          {isPaid ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 size={15} />
                <span>Payment Settlement Verified</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground text-[11px] block">Payment Date:</span>
                  <span className="font-semibold text-foreground">{bill.paidDate || "21 Jul 2025"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Payment Method:</span>
                  <span className="font-semibold text-foreground">{bill.paymentMethod || "NEFT Bank Transfer"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Transaction Reference:</span>
                  <span className="font-mono font-bold text-emerald-400">{bill.transactionRef || "TXN9920194"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock size={15} />
                <span>This bill is currently pending disbursement approval.</span>
              </div>
              {onPayNow && (
                <button
                  onClick={() => {
                    onClose();
                    onPayNow(bill);
                  }}
                  className="rounded-lg bg-[#FFA500] px-3 py-1 font-bold text-[#071522] shadow-sm hover:bg-[#FFB733] transition cursor-pointer"
                >
                  Pay Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/30">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Official Receipt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-secondary px-5 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

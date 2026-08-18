"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Edit,
  ExternalLink,
  Landmark,
  MapPin,
  Phone,
  QrCode,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { OwnerBankItem } from "@/types/bank";
import { getBankCardTheme } from "./BankTable";

interface ViewBankModalProps {
  isOpen: boolean;
  bank: OwnerBankItem | null;
  onClose: () => void;
  onEdit: (bank: OwnerBankItem) => void;
}

export default function ViewBankModal({
  isOpen,
  bank,
  onClose,
  onEdit,
}: ViewBankModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !bank) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {bank.ownerName}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <Check size={11} className="stroke-[3]" />
                  <span>{bank.verificationStatus}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {bank.bankName} • {bank.accountType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(bank);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar text-xs">
          {/* ================= 1. TRANSPORTER SETTLEMENT CARD ================= */}
          {(() => {
            const theme = getBankCardTheme(bank);
            return (
              <div
                className={`relative overflow-hidden rounded-2xl ${theme.gradient} p-6 text-white shadow-2xl border ${theme.border}`}
              >
                <div
                  className={`absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full ${theme.glow} blur-2xl pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col justify-between h-48">
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-widest ${theme.accentText}`}
                      >
                        Transporter Settlement Card
                      </div>
                      <div className="text-xl font-black tracking-tight mt-0.5">
                        {bank.bankName}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        Penny Drop Verified
                      </span>
                    </div>
                  </div>

                  {/* Middle Row */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-8 w-11 rounded-md bg-gradient-to-tr ${theme.chipGradient} border border-white/30 shadow-inner flex items-center justify-center`}
                    >
                      <div className="w-8 h-5 border border-black/30 rounded-xs" />
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase text-white/60 tracking-wider">
                        July 2025 Settlement Due
                      </div>
                      <div className="text-2xl font-black text-[#FFA500]">
                        {bank.monthlySettlementDisplay}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/50">
                        Beneficiary Entity
                      </div>
                      <div className="text-xs font-bold truncate max-w-[240px]">
                        {bank.accountHolder}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm tracking-widest font-bold">
                        {bank.maskedAccountNumber}
                      </div>
                      <div className="text-[9px] text-white/60 font-mono">
                        IFSC: {bank.ifscCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= 2. CREDENTIALS & TANKER LINK ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Complete Account Number */}
            <div className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1">
              <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
                <span>Account Number (Complete)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.accountNumber, "acc")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#FFA500] hover:underline cursor-pointer"
                >
                  {copiedKey === "acc" ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                  <span>{copiedKey === "acc" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-foreground">
                {bank.accountNumber}
              </div>
            </div>

            {/* IFSC Code */}
            <div className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1">
              <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
                <span>IFSC Code</span>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.ifscCode, "ifsc")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#FFA500] hover:underline cursor-pointer"
                >
                  {copiedKey === "ifsc" ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                  <span>{copiedKey === "ifsc" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-foreground uppercase">
                {bank.ifscCode}
              </div>
            </div>

            {/* Transporter PAN & Contact */}
            <div className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1">
              <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <User size={12} className="text-[#FFA500]" />
                <span>Transporter PAN & Phone</span>
              </div>
              <div className="font-mono text-xs font-bold text-foreground">
                PAN: {bank.panNumber}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {bank.ownerPhone}
              </div>
            </div>

            {/* Assigned Fleet Tankers */}
            <div className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1">
              <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <Truck size={12} className="text-[#FFA500]" />
                <span>Linked Fleet Tankers</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {bank.assignedTankers.map((t) => (
                  <span
                    key={t}
                    className="inline-block rounded-md bg-[#FFA500]/15 border border-[#FFA500]/30 px-2 py-0.5 text-[10px] font-bold text-[#FFA500] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 3. SETTLEMENT & COMPLIANCE STATS ================= */}
          <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Payout Compliance & YTD Settlement Total</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {bank.payoutStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div>
                <span className="text-muted-foreground">YTD Total Disbursed:</span>
                <div className="text-sm font-black text-foreground mt-0.5">
                  {bank.totalSettledYTDDisplay}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Last Settlement:</span>
                <div className="font-bold text-foreground mt-0.5">
                  {bank.lastSettlementDate || "Pending"}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Section 194C TDS:</span>
                <div className="font-bold text-emerald-400 mt-0.5">
                  {bank.tdsDeclarationSubmitted ? "Declaration Filed (0% / 1%)" : "1% TDS Enforced"}
                </div>
              </div>
            </div>
          </div>

          {/* Branch Location & Notes */}
          <div className="p-3.5 rounded-2xl border border-border bg-background space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <MapPin size={12} className="text-[#FFA500]" />
              <span>Branch & Clearing Hub:</span>
              <span className="font-normal text-muted-foreground">
                {bank.branchName}, {bank.city}, {bank.state}
              </span>
            </div>
            {bank.notes && (
              <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                {bank.notes}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(bank);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
            >
              <Edit size={13} />
              <span>Edit Bank Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Calendar,
  CheckCircle2,
  FileCheck2,
  Layers,
  Sparkles,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MonthlyBillingItem } from "@/types/billing";

interface GenerateBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  selectedTrucks?: MonthlyBillingItem[];
  onGenerate: (data: { monthName: string; targetIds?: string[] }) => Promise<void>;
}

export default function GenerateBillsModal({
  isOpen,
  onClose,
  selectedMonth,
  selectedTrucks = [],
  onGenerate,
}: GenerateBillsModalProps) {
  const [month, setMonth] = useState(selectedMonth || "July 2025");
  const [generationScope, setGenerationScope] = useState<"selected" | "all">(
    selectedTrucks.length > 0 ? "selected" : "all"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMonth(selectedMonth || "July 2025");
      setGenerationScope(selectedTrucks.length > 0 ? "selected" : "all");
    }
  }, [isOpen, selectedMonth, selectedTrucks]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsGenerating(true);
    try {
      const targetIds =
        generationScope === "selected" && selectedTrucks.length > 0
          ? selectedTrucks.map((t) => t.id)
          : undefined;

      await onGenerate({
        monthName: month,
        targetIds,
      });
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 400);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const hasSelection = selectedTrucks.length > 0;

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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                <Zap size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">
                  {hasSelection && generationScope === "selected"
                    ? `Generate Bills (${selectedTrucks.length} Trucks)`
                    : "Generate Monthly Invoices"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Batch freight calculation & settlement cycle processing
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

          {/* Form / Content Body */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs">
              {/* Target Scope Selection if trucks are selected */}
              {hasSelection && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                  <label className="block text-foreground font-bold">
                    Invoice Generation Scope
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGenerationScope("selected")}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        generationScope === "selected"
                          ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground ring-1 ring-[#FFA500]/30 shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-bold text-xs">Selected Trucks ({selectedTrucks.length})</div>
                      <div className="text-[10px] text-[#FFA500] font-mono mt-0.5 truncate">
                        {selectedTrucks.map((t) => t.vehicle).join(", ")}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenerationScope("all")}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        generationScope === "all"
                          ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground ring-1 ring-[#FFA500]/30 shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-bold text-xs">Entire Active Fleet</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        All trucks for {month}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Month Selector */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <label className="block text-foreground font-bold flex items-center gap-2">
                  <Calendar size={14} className="text-[#FFA500]" />
                  <span>Billing Cycle Period</span>
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-semibold outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                >
                  <option value="July 2025">July 2025 (Current Billing Cycle)</option>
                  <option value="June 2025">June 2025</option>
                  <option value="May 2025">May 2025</option>
                  <option value="April 2025">April 2025</option>
                </select>
              </div>

              {/* Selected Trucks List Pills if selected scope */}
              {hasSelection && generationScope === "selected" && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>Target Tankers ({selectedTrucks.length})</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Ready for audit</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
                    {selectedTrucks.map((t) => (
                      <span
                        key={t.id}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/25 px-2.5 py-1 rounded-xl shadow-xs"
                      >
                        <Truck size={12} />
                        <span>{t.vehicle}</span>
                        <span className="text-foreground text-[10px] font-sans font-normal">({t.owner})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Automated Billing Rules Summary */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs pb-2 border-b border-border/60">
                  <FileCheck2 size={15} className="text-[#FFA500]" />
                  <span>Automated Calculation Rules</span>
                </div>
                <ul className="space-y-2 text-[11px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Aggregates all verified Local and Non-Local tanker dispatches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Computes freight metrics, TDS deductibles, fuel surcharges & net payable amounts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Generates itemized PDF statements and updates accounting ledger status.</span>
                  </li>
                </ul>
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
                type="button"
                onClick={handleConfirm}
                disabled={isGenerating}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                    <span>Generating Invoices...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="stroke-[2.5]" />
                    <span>
                      {hasSelection && generationScope === "selected"
                        ? `Generate for ${selectedTrucks.length} Truck(s)`
                        : "Run Batch Generation"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


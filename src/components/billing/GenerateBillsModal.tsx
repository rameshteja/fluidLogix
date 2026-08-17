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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 font-bold">
              <Zap size={20} className="fill-[#FFA500]/20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">
                {hasSelection && generationScope === "selected"
                  ? `Generate Bills for ${selectedTrucks.length} Trucks`
                  : "Generate Monthly Bills"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Batch freight calculation from verified trip logs
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Target Scope Selection if trucks are selected */}
          {hasSelection && (
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5">
                Generation Target Scope:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGenerationScope("selected")}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    generationScope === "selected"
                      ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground ring-1 ring-[#FFA500]/30"
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
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    generationScope === "all"
                      ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground ring-1 ring-[#FFA500]/30"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="font-bold text-xs">All Fleet Trucks</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Entire fleet for {month}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Month Selector */}
          <div>
            <label className="block text-muted-foreground font-semibold mb-1.5">
              Billing Cycle Month:
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground font-semibold outline-none focus:border-[#FFA500]"
            >
              <option value="July 2025">July 2025 (Current Cycle)</option>
              <option value="June 2025">June 2025</option>
              <option value="May 2025">May 2025</option>
              <option value="April 2025">April 2025</option>
            </select>
          </div>

          {/* Selected Trucks List Pills if selected scope */}
          {hasSelection && generationScope === "selected" && (
            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                Selected Tanker Trucks for Billing:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {selectedTrucks.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/25 px-2 py-0.5 rounded-md"
                  >
                    <Truck size={11} />
                    <span>{t.vehicle}</span>
                    <span className="text-foreground text-[10px]">({t.owner})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Automated Billing Rules Summary */}
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <FileCheck2 size={15} className="text-[#FFA500]" />
              <span>Automated Calculation Rules:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Aggregates all completed Local and Non-Local tanker dispatches.</li>
              <li>Computes freight rates, fuel toll surcharges & net payable amount.</li>
              <li>Generates or updates formal invoice statements for selected scope.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isGenerating}
            className="rounded-lg bg-[#FFA500] px-5 py-2 font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isGenerating ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                <span>Generating Statements...</span>
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
  );
}

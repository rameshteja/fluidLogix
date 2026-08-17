"use client";

import {
  Check,
  CheckSquare,
  Download,
  FileSpreadsheet,
  FileText,
  Square,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type ExportFormat = "pdf" | "csv" | "json";
export type ExportScope = "all" | "current_page" | "filtered";

export interface ColumnOption {
  id: string;
  label: string;
}

export interface ExportConfig {
  format: ExportFormat;
  scope: ExportScope;
  selectedColumns: string[];
  filename?: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  defaultFilename: string;
  availableColumns: ColumnOption[];
  totalRecordsCount: number;
  currentPageCount: number;
  filteredCount: number;
  onExport: (config: ExportConfig) => Promise<void> | void;
}

export default function ExportModal({
  isOpen,
  onClose,
  title,
  defaultFilename,
  availableColumns,
  totalRecordsCount,
  currentPageCount,
  filteredCount,
  onExport,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [scope, setScope] = useState<ExportScope>("all");
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [filename, setFilename] = useState(defaultFilename);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize all columns selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCols(availableColumns.map((c) => c.id));
      setFilename(defaultFilename);
      setFormat("pdf");
      setScope("all");
      setIsExporting(false);
    }
  }, [isOpen, availableColumns, defaultFilename]);

  if (!isOpen) return null;

  const toggleColumn = (id: string) => {
    if (selectedCols.includes(id)) {
      if (selectedCols.length > 1) {
        setSelectedCols(selectedCols.filter((colId) => colId !== id));
      }
    } else {
      setSelectedCols([...selectedCols, id]);
    }
  };

  const selectAllColumns = () => {
    setSelectedCols(availableColumns.map((c) => c.id));
  };

  const deselectAllColumns = () => {
    // Keep at least the first column selected
    if (availableColumns.length > 0) {
      setSelectedCols([availableColumns[0].id]);
    }
  };

  const isAllSelected = selectedCols.length === availableColumns.length;

  const handleExportClick = async () => {
    if (selectedCols.length === 0) return;
    setIsExporting(true);
    try {
      await onExport({
        format,
        scope,
        selectedColumns: selectedCols,
        filename: filename.trim() || defaultFilename,
      });
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  const getFormatBadge = (fmt: ExportFormat) => {
    switch (fmt) {
      case "pdf":
        return {
          icon: FileText,
          label: "PDF Report",
          desc: "Landscape styled document for printing & archiving",
          ext: ".pdf",
          color: "text-[#FFA500] border-[#FFA500]/30 bg-[#FFA500]/10",
        };
      case "csv":
        return {
          icon: FileSpreadsheet,
          label: "CSV Spreadsheet",
          desc: "Excel & Google Sheets compatible tabular data",
          ext: ".csv",
          color: "text-[#00C897] border-[#00C897]/30 bg-[#00C897]/10",
        };
      case "json":
        return {
          icon: Download,
          label: "JSON Dataset",
          desc: "Raw structured JSON objects for API developers",
          ext: ".json",
          color: "text-[#38BDF8] border-[#38BDF8]/30 bg-[#38BDF8]/10",
        };
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
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#1A344D] bg-[#0A1A2B] shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#142637] px-6 py-4 bg-[#081523]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20">
              <Download size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F1F5F9] leading-tight">
                {title}
              </h2>
              <p className="text-xs text-[#5E7995]">
                Configure export format, row scope & columns
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5A7692] hover:bg-[#0E2337] hover:text-[#F1F5F9] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* 1. Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#8DA6BE] mb-2">
              1. Choose Export Format
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {(["pdf", "csv", "json"] as ExportFormat[]).map((fmt) => {
                const config = getFormatBadge(fmt);
                const Icon = config.icon;
                const isSelected = format === fmt;

                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-[#FFA500] bg-[#FFA500]/10 shadow-[0_0_12px_rgba(255,165,0,0.12)] ring-1 ring-[#FFA500]/30"
                        : "border-[#172D40] bg-[#071522] hover:border-[#2C4863] hover:bg-[#0C1F32]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={isSelected ? "text-[#FFA500]" : "text-[#7E9AB5]"} />
                        <span className="font-bold text-[#E8EEF5]">{config.label}</span>
                      </div>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-[#FFA500]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#6A86A2] leading-tight">
                      {config.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Scope Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#8DA6BE] mb-2">
              2. Select Records Scope
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {/* All Records */}
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  scope === "all"
                    ? "border-[#FFA500] bg-[#FFA500]/10 ring-1 ring-[#FFA500]/30"
                    : "border-[#172D40] bg-[#071522] hover:border-[#2C4863]"
                }`}
              >
                <div className="font-bold text-[#E8EEF5]">All Records</div>
                <div className="text-[11px] font-semibold text-[#FFA500] mt-0.5 font-mono">
                  {totalRecordsCount} Total
                </div>
                <div className="text-[10px] text-[#6A86A2] mt-0.5">
                  Complete dataset export
                </div>
              </button>

              {/* Current Page */}
              <button
                type="button"
                onClick={() => setScope("current_page")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  scope === "current_page"
                    ? "border-[#FFA500] bg-[#FFA500]/10 ring-1 ring-[#FFA500]/30"
                    : "border-[#172D40] bg-[#071522] hover:border-[#2C4863]"
                }`}
              >
                <div className="font-bold text-[#E8EEF5]">Current Page</div>
                <div className="text-[11px] font-semibold text-[#38BDF8] mt-0.5 font-mono">
                  {currentPageCount} Records
                </div>
                <div className="text-[10px] text-[#6A86A2] mt-0.5">
                  Rows currently visible
                </div>
              </button>

              {/* Filtered Records */}
              <button
                type="button"
                onClick={() => setScope("filtered")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  scope === "filtered"
                    ? "border-[#FFA500] bg-[#FFA500]/10 ring-1 ring-[#FFA500]/30"
                    : "border-[#172D40] bg-[#071522] hover:border-[#2C4863]"
                }`}
              >
                <div className="font-bold text-[#E8EEF5]">Filtered Scope</div>
                <div className="text-[11px] font-semibold text-[#00C897] mt-0.5 font-mono">
                  {filteredCount} Matching
                </div>
                <div className="text-[10px] text-[#6A86A2] mt-0.5">
                  Matching search & filters
                </div>
              </button>
            </div>
          </div>

          {/* 3. Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#8DA6BE]">
                3. Choose Columns ({selectedCols.length} of {availableColumns.length} selected)
              </label>

              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={selectAllColumns}
                  className="text-[#FFA500] hover:underline cursor-pointer font-medium"
                >
                  Select All
                </button>
                <span className="text-[#3A526A]">|</span>
                <button
                  type="button"
                  onClick={deselectAllColumns}
                  className="text-[#7E9AB5] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 rounded-xl border border-[#162D42] bg-[#071522] p-3 max-h-48 overflow-y-auto">
              {availableColumns.map((col) => {
                const checked = selectedCols.includes(col.id);

                return (
                  <label
                    key={col.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition select-none ${
                      checked
                        ? "bg-[#0E2437] text-[#F1F5F9] font-medium"
                        : "text-[#6A86A2] hover:bg-[#0B1D2F] hover:text-[#9FB7CE]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.id)}
                      className="h-3.5 w-3.5 rounded border-[#1E3A54] bg-[#0B1A28] accent-[#FFA500] cursor-pointer"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. File Name */}
          <div>
            <label className="block text-xs font-semibold text-[#8DA6BE] mb-1">
              File Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#172D40] bg-[#071522] px-3 text-xs text-[#E8EEF5] outline-none focus:border-[#FFA500]"
              />
              <span className="absolute right-3 text-xs font-mono text-[#5A7692]">
                .{format}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#142637] px-6 py-4 bg-[#081523]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#1A324A] px-4 py-2 text-xs font-semibold text-[#8DA6BE] hover:bg-[#0E2337] hover:text-[#F1F5F9] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExportClick}
            disabled={isExporting || selectedCols.length === 0}
            className="rounded-lg bg-[#FFA500] px-5 py-2 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-[#071522] border-t-transparent animate-spin" />
                <span>Generating {format.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <Download size={14} className="stroke-[2.5]" />
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

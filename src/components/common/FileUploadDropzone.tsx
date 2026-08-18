"use client";

import {
  Check,
  Download,
  Eye,
  File,
  FileCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
  ZoomIn,
} from "lucide-react";
import React, { useRef, useState } from "react";

export interface UploadedDocInfo {
  name: string;
  size?: string;
  url?: string;
  type?: string;
  uploadedAt?: string;
}

interface FileUploadDropzoneProps {
  label: string;
  hint?: string;
  value?: UploadedDocInfo | string | null;
  onChange: (fileInfo: UploadedDocInfo | null) => void;
  accept?: string;
  maxSizeMb?: number;
  required?: boolean;
  className?: string;
}

export default function FileUploadDropzone({
  label,
  hint = "PDF, JPG, PNG up to 10MB",
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMb = 10,
  required = false,
  className = "",
}: FileUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current file info
  const docInfo: UploadedDocInfo | null = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") {
      return {
        name: value.split("/").pop() || "Document.pdf",
        url: value,
        size: "1.2 MB",
        type: value.endsWith(".png") || value.endsWith(".jpg") || value.endsWith(".jpeg")
          ? "image"
          : "pdf",
        uploadedAt: "Just now",
      };
    }
    return value;
  }, [value]);

  const handleFileProcess = (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMb}MB limit.`);
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const objectUrl = URL.createObjectURL(file);

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    onChange({
      name: file.name,
      size: sizeStr,
      url: objectUrl,
      type: isImage ? "image" : isPdf ? "pdf" : "doc",
      uploadedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-muted-foreground">
          {label} {required && <span className="text-[#FFA500]">*</span>}
        </label>
        {docInfo && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <Check size={11} className="stroke-[3]" />
            <span>Ready</span>
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Empty Dropzone / Upload Target */}
      {!docInfo ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
            isDragOver
              ? "border-[#FFA500] bg-[#FFA500]/10 scale-[1.01]"
              : "border-border/80 bg-background/50 hover:bg-muted/40 hover:border-[#FFA500]/50"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted group-hover:bg-[#FFA500]/15 group-hover:text-[#FFA500] text-muted-foreground transition shadow-sm mb-2">
            <UploadCloud size={18} />
          </div>

          <div className="text-xs font-semibold text-foreground group-hover:text-[#FFA500] transition">
            Click to upload or drag & drop
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>
        </div>
      ) : (
        /* Uploaded File Preview Card */
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-md transition hover:border-[#FFA500]/30 group">
          <div className="flex items-center gap-3">
            {/* Thumbnail / Document Type Icon */}
            {docInfo.type === "image" && docInfo.url ? (
              <div
                onClick={() => setPreviewModalOpen(true)}
                className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-border bg-muted cursor-pointer group/thumb"
              >
                <img
                  src={docInfo.url}
                  alt={docInfo.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition text-white">
                  <ZoomIn size={14} />
                </div>
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <FileText size={22} />
              </div>
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-foreground truncate">
                  {docInfo.name}
                </h4>
                <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono font-semibold text-muted-foreground uppercase">
                  {docInfo.type || "FILE"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 font-mono">
                {docInfo.size && <span>{docInfo.size}</span>}
                {docInfo.uploadedAt && (
                  <>
                    <span>•</span>
                    <span>Uploaded {docInfo.uploadedAt}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {docInfo.url && (
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                  title="Preview document"
                >
                  <Eye size={13} />
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-[#FFA500] hover:bg-muted transition cursor-pointer"
                title="Replace file"
              >
                <UploadCloud size={13} />
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                title="Remove file"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewModalOpen && docInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/30">
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-[#FFA500]" />
                <span className="text-xs font-bold text-foreground truncate max-w-xs sm:max-w-md">
                  {docInfo.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-background min-h-[280px]">
              {docInfo.type === "image" && docInfo.url ? (
                <img
                  src={docInfo.url}
                  alt={docInfo.name}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain border border-border shadow-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border bg-muted/20 space-y-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <FileText size={36} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-foreground">
                      {docInfo.name}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PDF Document • {docInfo.size || "1.2 MB"}
                    </p>
                  </div>
                  {docInfo.url && (
                    <a
                      href={docInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2 text-xs font-bold text-[#071522] shadow-md hover:bg-[#FFB733] transition"
                    >
                      <Eye size={13} />
                      <span>Open in Browser</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  Camera,
  Check,
  Eye,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
  ZoomIn,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { UploadedDocInfo } from "./FileUploadDropzone";

interface MultiImageDropzoneProps {
  label: string;
  hint?: string;
  images: (UploadedDocInfo | string)[];
  onChange: (images: UploadedDocInfo[]) => void;
  maxImages?: number;
  maxSizeMb?: number;
  className?: string;
}

export default function MultiImageDropzone({
  label,
  hint = "PNG, JPG, WebP up to 10MB each (Multiple photos supported)",
  images = [],
  onChange,
  maxImages = 8,
  maxSizeMb = 10,
  className = "",
}: MultiImageDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize image list into UploadedDocInfo[]
  const normalizedImages: UploadedDocInfo[] = React.useMemo(() => {
    return images.map((img, idx) => {
      if (typeof img === "string") {
        return {
          name: img.split("/").pop() || `Tanker-Photo-${idx + 1}.jpg`,
          url: img,
          size: "1.5 MB",
          type: "image",
          uploadedAt: "Uploaded",
        };
      }
      return img;
    });
  }, [images]);

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((f) => f.type.startsWith("image/"));

    if (validImageFiles.length === 0) {
      alert("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    const availableSlots = maxImages - normalizedImages.length;
    if (availableSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const filesToAdd = validImageFiles.slice(0, availableSlots);

    const newUploadedDocs: UploadedDocInfo[] = filesToAdd.map((file) => {
      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`File ${file.name} exceeds ${maxSizeMb}MB size limit.`);
      }
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        name: file.name,
        size: sizeStr,
        url: URL.createObjectURL(file),
        type: "image",
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    onChange([...normalizedImages, ...newUploadedDocs]);
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
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // reset input value so re-uploading same file name works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = normalizedImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and counter */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
        <span className="text-[11px] font-mono font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
          {normalizedImages.length} / {maxImages} Photos
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Main Drag & Drop Zone when empty or Grid when images exist */}
      {normalizedImages.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center ${
            isDragOver
              ? "border-[#FFA500] bg-[#FFA500]/10 scale-[1.01] shadow-lg shadow-orange-500/10"
              : "border-border/80 bg-background/60 hover:border-[#FFA500]/60 hover:bg-muted/30"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud size={22} className="stroke-[2.5]" />
          </div>
          <p className="text-xs font-bold text-foreground">
            Drag & drop tanker images here, or{" "}
            <span className="text-[#FFA500] underline underline-offset-2">browse files</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {hint}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {normalizedImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-border bg-card shadow-xs"
              >
                {/* Thumbnail Image */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Main/Cover Badge on 1st Photo */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#FFA500] text-[#071522] px-1.5 py-0.5 rounded-md shadow-sm">
                    Cover Photo
                  </span>
                )}

                {/* Hover Overlay with View & Delete Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                  <button
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    title="Enlarge preview"
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 transition cursor-pointer backdrop-blur-xs"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveImage(idx, e)}
                    title="Remove image"
                    className="p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 transition cursor-pointer backdrop-blur-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Bottom filename strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white truncate font-medium">
                  {img.name}
                </div>
              </div>
            ))}

            {/* Add More Photos Slot */}
            {normalizedImages.length < maxImages && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-4/3 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer p-2 text-center ${
                  isDragOver
                    ? "border-[#FFA500] bg-[#FFA500]/10"
                    : "border-border/80 bg-background/40 hover:border-[#FFA500]/60 hover:bg-muted/40"
                }`}
              >
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-[#FFA500] mb-1">
                  <Plus size={16} />
                </div>
                <span className="text-[10px] font-bold text-foreground">Add Photo</span>
                <span className="text-[9px] text-muted-foreground">or Drag & Drop</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {activePreviewIndex !== null && normalizedImages[activePreviewIndex] && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setActivePreviewIndex(null)}
          />
          <div className="relative max-w-2xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <ImageIcon size={16} className="text-[#FFA500]" />
                <span className="truncate max-w-sm">{normalizedImages[activePreviewIndex].name}</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  ({activePreviewIndex + 1} of {normalizedImages.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewIndex(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 bg-black/90 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={normalizedImages[activePreviewIndex].url}
                alt={normalizedImages[activePreviewIndex].name}
                className="max-h-[65vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

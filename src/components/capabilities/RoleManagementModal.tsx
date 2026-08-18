"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Copy, Sparkles, AlertCircle, Check } from "lucide-react";
import { RoleDefinition } from "@/types/capability";

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: Partial<RoleDefinition>, isNew: boolean) => void;
  initialRole?: RoleDefinition | null;
  existingRoles: RoleDefinition[];
  mode: "create" | "clone" | "edit";
}

const BADGE_COLOR_OPTIONS = [
  { label: "Amber Primary", value: "bg-primary/20 text-primary border-primary/40", preview: "bg-amber-500" },
  { label: "Emerald Green", value: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", preview: "bg-emerald-500" },
  { label: "Sky Blue", value: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30", preview: "bg-sky-500" },
  { label: "Indigo Purple", value: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30", preview: "bg-indigo-500" },
  { label: "Royal Purple", value: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30", preview: "bg-purple-500" },
  { label: "Teal Turquoise", value: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30", preview: "bg-teal-500" },
  { label: "Rose Crimson", value: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30", preview: "bg-rose-500" },
  { label: "Slate Neutral", value: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30", preview: "bg-slate-500" },
];

export default function RoleManagementModal({
  isOpen,
  onClose,
  onSaveRole,
  initialRole,
  existingRoles,
  mode,
}: RoleManagementModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [securityLevel, setSecurityLevel] = useState<RoleDefinition["securityLevel"]>("Standard");
  const [badgeColor, setBadgeColor] = useState(BADGE_COLOR_OPTIONS[0].value);
  const [cloneSourceId, setCloneSourceId] = useState(initialRole?.id || existingRoles[0]?.id || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialRole) {
      setName(initialRole.name);
      setCode(initialRole.code);
      setDescription(initialRole.description);
      setSecurityLevel(initialRole.securityLevel);
      setBadgeColor(initialRole.badgeColor);
    } else if (mode === "clone" && initialRole) {
      setName(`${initialRole.name} (Copy)`);
      setCode(`${initialRole.code}_COPY`);
      setDescription(`Cloned from ${initialRole.name}: ${initialRole.description}`);
      setSecurityLevel(initialRole.securityLevel);
      setBadgeColor(initialRole.badgeColor);
      setCloneSourceId(initialRole.id);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setSecurityLevel("Standard");
      setBadgeColor(BADGE_COLOR_OPTIONS[1].value);
      setCloneSourceId(existingRoles[0]?.id || "");
    }
    setError(null);
  }, [mode, initialRole, isOpen, existingRoles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please specify a descriptive role name.");
      return;
    }
    if (!code.trim()) {
      setError("Role code cannot be empty.");
      return;
    }

    const isNew = mode === "create" || mode === "clone";

    let permissionsToUse: Record<string, any> = {};
    if (mode === "clone") {
      const sourceRole = existingRoles.find((r) => r.id === cloneSourceId);
      if (sourceRole) {
        permissionsToUse = JSON.parse(JSON.stringify(sourceRole.permissions));
      }
    } else if (mode === "create") {
      // Start with blank or basic view permissions
      permissionsToUse = {};
    } else if (initialRole) {
      permissionsToUse = initialRole.permissions;
    }

    const payload: Partial<RoleDefinition> = {
      ...(initialRole && mode === "edit" ? { id: initialRole.id } : { id: `role-${Date.now()}` }),
      name: name.trim(),
      code: code.trim().toUpperCase().replace(/\s+/g, "_"),
      description: description.trim(),
      securityLevel,
      badgeColor,
      userCount: mode === "edit" ? (initialRole?.userCount || 0) : 0,
      isSystemLocked: false,
      permissions: permissionsToUse,
      updatedAt: new Date().toISOString(),
      ...(isNew ? { createdAt: new Date().toISOString() } : {}),
    };

    onSaveRole(payload, isNew);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-sm">
              {mode === "clone" ? <Copy size={18} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {mode === "create" && "Create New Custom Role"}
                {mode === "clone" && "Clone Role & Capabilities"}
                {mode === "edit" && `Edit Role: ${initialRole?.name}`}
              </h2>
              <p className="text-xs text-muted-foreground">
                Define access boundary, security level & visual badge
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === "clone" && (
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Source Role to Clone Capabilities From
              </label>
              <select
                value={cloneSourceId}
                onChange={(e) => setCloneSourceId(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              >
                {existingRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.securityLevel} • {Object.keys(r.permissions).length} modules configured)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Role Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Hazardous Materials Dispatcher"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (mode !== "edit" && !code) {
                    setCode(e.target.value.toUpperCase().replace(/\s+/g, "_"));
                  }
                }}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                System Code Identifier <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. HAZ_DISP"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Role Scope & Responsibility Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe what operational or administrative duties users with this role perform..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Security Rating Level
              </label>
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value as any)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              >
                <option value="Master">Master (Full System Access)</option>
                <option value="Elevated">Elevated (Management & Approvals)</option>
                <option value="Standard">Standard (Operational Entry)</option>
                <option value="Restricted">Restricted (Vendor / Driver Portal)</option>
                <option value="Auditor">Auditor (Read-Only Compliance)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Badge Color Accent
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {BADGE_COLOR_OPTIONS.map((c) => {
                  const isSelected = badgeColor === c.value;
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setBadgeColor(c.value)}
                      title={c.label}
                      className={`h-7 w-7 rounded-lg ${c.preview} flex items-center justify-center transition cursor-pointer ${
                        isSelected ? "ring-2 ring-foreground scale-110 shadow-md" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white drop-shadow-md stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Preview Pill */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">Live Badge Preview:</span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                <Sparkles size={12} />
                <span>{name.trim() || "Role Preview"}</span>
              </span>
              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {code.trim() || "CODE"}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-lg shadow-amber-500/20 hover:bg-primary-hover transition cursor-pointer"
            >
              {mode === "create" && "Create Role"}
              {mode === "clone" && "Clone Role & Capabilities"}
              {mode === "edit" && "Save Role Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

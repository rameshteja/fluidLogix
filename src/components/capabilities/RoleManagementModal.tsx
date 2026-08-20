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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity drawer-backdrop-animate"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-xl bg-card border-l border-border/80 shadow-2xl flex flex-col h-full overflow-hidden drawer-panel-animate drawer-glow-edge">
          {/* Header */}
          <div className="p-5 sm:px-6 border-b border-border/80 bg-muted/20 backdrop-blur-md flex items-center justify-between shrink-0">
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
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive shrink-0">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {mode === "clone" && (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2">
                  <label className="block text-xs font-bold text-foreground">
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

              {/* Role Identifiers */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60">
                  Role Identity & System Code
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1.5">
                      Role Display Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hazardous Dispatcher"
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
                    <label className="block text-muted-foreground font-semibold mb-1.5">
                      System Identifier Code <span className="text-primary">*</span>
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
                  <label className="block text-muted-foreground font-semibold mb-1.5">
                    Role Scope & Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what operational or administrative duties users with this role perform..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>

              {/* Security & Visual Style */}
              <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60">
                  Security Level & Visual Theme
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1.5">
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
                    <label className="block text-muted-foreground font-semibold mb-1.5">
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
              </div>

              {/* Live Preview Pill */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Live Badge Preview:</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                    <Sparkles size={12} />
                    <span>{name.trim() || "Role Preview"}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/60">
                    {code.trim() || "CODE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
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
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {mode === "create" && "Create Role"}
                {mode === "clone" && "Clone Role & Capabilities"}
                {mode === "edit" && "Save Role Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


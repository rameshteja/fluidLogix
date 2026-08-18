"use client";

import React, { useState } from "react";
import { X, Download, Printer, FileText, Check, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { RoleDefinition, ResourceCategory, PERMISSION_ACTIONS_META, PermissionAction } from "@/types/capability";

interface ExportCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: RoleDefinition[];
  categories: ResourceCategory[];
  activeRoleId?: string;
}

export default function ExportCapabilityModal({
  isOpen,
  onClose,
  roles,
  categories,
  activeRoleId,
}: ExportCapabilityModalProps) {
  const [selectedRoleScope, setSelectedRoleScope] = useState<"current" | "all">(
    activeRoleId ? "current" : "all"
  );
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "print">("csv");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const currentRole = roles.find((r) => r.id === activeRoleId) || roles[0];
  const targetRoles = selectedRoleScope === "current" ? [currentRole] : roles;

  const handleExport = () => {
    setIsExporting(true);

    if (exportFormat === "json") {
      const exportData = targetRoles.map((r) => ({
        roleId: r.id,
        roleName: r.name,
        roleCode: r.code,
        securityLevel: r.securityLevel,
        assignedUserCount: r.userCount,
        lastUpdated: r.updatedAt,
        matrix: categories.map((cat) => ({
          category: cat.title,
          modules: cat.modules.map((m) => ({
            moduleId: m.id,
            moduleName: m.name,
            code: m.code,
            grantedPermissions: r.permissions[m.id] || [],
          })),
        })),
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FluidLogix_RBAC_Matrix_${selectedRoleScope === "current" ? currentRole.code : "ALL_ROLES"}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      onClose();
    } else if (exportFormat === "csv") {
      // Build CSV Headers
      const actions: PermissionAction[] = ["view", "add", "edit", "delete", "export", "print", "approve", "audit"];
      let csv = "Role Name,Role Code,Security Level,Category,Module Name,Module Code," + actions.map((a) => a.toUpperCase()).join(",") + "\n";

      targetRoles.forEach((role) => {
        categories.forEach((cat) => {
          cat.modules.forEach((mod) => {
            const perms = role.permissions[mod.id] || [];
            const actionFlags = actions.map((a) => (perms.includes(a) ? "YES" : "NO")).join(",");
            csv += `"${role.name}","${role.code}","${role.securityLevel}","${cat.title}","${mod.name}","${mod.code}",${actionFlags}\n`;
          });
        });
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FluidLogix_RBAC_Matrix_${selectedRoleScope === "current" ? currentRole.code : "ALL_ROLES"}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      onClose();
    } else if (exportFormat === "print") {
      // Generate print window
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setIsExporting(false);
        return;
      }

      const actions: PermissionAction[] = ["view", "add", "edit", "delete", "export", "print", "approve", "audit"];

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FluidLogix - Role Capabilities & RBAC Matrix</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #0F172A; }
            h1 { font-size: 18px; margin-bottom: 4px; color: #071522; }
            .subtitle { font-size: 11px; color: #64748B; margin-bottom: 20px; }
            .role-block { margin-bottom: 30px; page-break-after: always; }
            .role-header { background: #071522; color: #FFA500; padding: 10px 14px; border-radius: 6px; font-weight: 800; font-size: 14px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #F1F5F9; color: #334155; text-align: left; padding: 8px 10px; border: 1px solid #CBD5E1; font-weight: 700; }
            td { padding: 6px 10px; border: 1px solid #E2E8F0; }
            .cat-row { background: #F8FAFC; font-weight: 800; color: #071522; }
            .yes-badge { display: inline-block; background: #DCFCE7; color: #166534; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-size: 10px; text-align: center; }
            .no-badge { color: #94A3B8; text-align: center; font-size: 12px; }
            .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 10px; color: #94A3B8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h1>FluidLogix Enterprise • RBAC Capability & Permissions Report</h1>
          <div class="subtitle">Generated on: ${new Date().toLocaleString()} | Compliance & Audit Authority Copy</div>
      `;

      targetRoles.forEach((role) => {
        html += `
          <div class="role-block">
            <div class="role-header">
              <span>ROLE: ${role.name} (${role.code})</span>
              <span>SECURITY RATING: ${role.securityLevel.toUpperCase()}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Module Name</th>
                  <th style="width: 15%;">Code</th>
                  ${actions.map((a) => `<th style="text-align:center;">${PERMISSION_ACTIONS_META[a].shortLabel}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
        `;

        categories.forEach((cat) => {
          html += `
            <tr class="cat-row">
              <td colspan="${2 + actions.length}">${cat.title}</td>
            </tr>
          `;
          cat.modules.forEach((mod) => {
            const perms = role.permissions[mod.id] || [];
            html += `
              <tr>
                <td><strong>${mod.name}</strong></td>
                <td style="font-family:monospace; font-size:10px;">${mod.code}</td>
                ${actions
                  .map((a) => {
                    const isAvail = mod.availableActions.includes(a);
                    if (!isAvail) return `<td style="text-align:center; color:#CBD5E1;">—</td>`;
                    const hasPerm = perms.includes(a);
                    return `<td style="text-align:center;">${
                      hasPerm ? '<span class="yes-badge">YES</span>' : '<span class="no-badge">✕</span>'
                    }</td>`;
                  })
                  .join("")}
              </tr>
            `;
          });
        });

        html += `
              </tbody>
            </table>
          </div>
        `;
      });

      html += `
          <div class="footer">
            <span>FluidLogix Liquid & Hazardous Logistics Portal</span>
            <span>Page End • Confidential Statutory Record</span>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/25">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Export Capability Matrix
              </h3>
              <p className="text-xs text-muted-foreground">
                Download audit sheet or printable compliance report
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

        <div className="mt-5 space-y-4">
          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Select Export Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRoleScope("current")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedRoleScope === "current"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="font-bold text-xs">{currentRole?.name}</div>
                <div className="text-[10px] text-muted-foreground">Active Role Matrix Only</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleScope("all")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedRoleScope === "all"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="font-bold text-xs">All System Roles</div>
                <div className="text-[10px] text-muted-foreground">{roles.length} roles total</div>
              </button>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Select Output Format
            </label>
            <div className="space-y-2">
              {[
                { id: "csv", label: "CSV Spreadsheet (.csv)", icon: FileSpreadsheet, desc: "Standard tabular matrix for Excel, Google Sheets, or BI tools" },
                { id: "json", label: "JSON Data File (.json)", icon: FileText, desc: "Raw structured JSON for API integration or automated backup" },
                { id: "print", label: "Printable Compliance Audit Report (PDF)", icon: Printer, desc: "Formatted PDF ready for audit review, signatures, and printing" },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = exportFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-foreground">{fmt.label}</div>
                      <div className="text-[11px] text-muted-foreground">{fmt.desc}</div>
                    </div>
                    {isSelected && <Check size={16} className="text-primary stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Modules Included:</span>
            <span className="font-bold text-foreground">
              {categories.reduce((acc, c) => acc + c.modules.length, 0)} Enterprise Modules
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="h-9 flex items-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-lg shadow-amber-500/20 hover:bg-primary-hover transition cursor-pointer"
            >
              {exportFormat === "print" ? <Printer size={14} /> : <Download size={14} />}
              <span>{exportFormat === "print" ? "Open Print Sheet" : "Download Export"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

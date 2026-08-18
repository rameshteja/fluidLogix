"use client";

import React, { useState } from "react";
import { X, Users, Search, UserCheck, Mail, Building2, Shield, Plus } from "lucide-react";
import { RoleDefinition, RoleUserSummary } from "@/types/capability";
import { SAMPLE_ROLE_USERS } from "@/data/capability-data";

interface RoleUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleDefinition | null;
  allRoles: RoleDefinition[];
}

export default function RoleUserDrawer({
  isOpen,
  onClose,
  role,
  allRoles,
}: RoleUserDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersList, setUsersList] = useState<RoleUserSummary[]>(SAMPLE_ROLE_USERS);

  if (!isOpen || !role) return null;

  const assignedUsers = usersList.filter(
    (u) =>
      u.roleId === role.id &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/25">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Assigned Team Members
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.badgeColor}`}>
                    {role.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ({assignedUsers.length} users)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search member by name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {assignedUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs font-semibold text-foreground">No active members found</p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                  There are no users currently assigned to this role matching your search query.
                </p>
              </div>
            ) : (
              assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-border bg-background p-3.5 hover:border-primary/40 hover:bg-muted/10 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Mail size={10} />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-primary" />
                      <span>{user.department}</span>
                    </div>
                    <span>Assigned: {user.assignedOn}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="h-9 w-full rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

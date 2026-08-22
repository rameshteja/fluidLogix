"use client";

import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Droplets,
  FileText,
  Landmark,
  LayoutGrid,
  LogOut,
  PackageSearch,
  Settings,
  Share2,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Load Requests",
    href: "/dashboard/load-requests",
    icon: PackageSearch,
  },
  {
    name: "Allocations",
    href: "/dashboard/assignments",
    icon: Share2,
  },
  {
    name: "Fleet",
    href: "/dashboard/fleet",
    icon: Truck,
  },
  {
    name: "Load Logs",
    href: "/dashboard/load-logs",
    icon: FileText,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Banks",
    href: "/dashboard/banks",
    icon: Landmark,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  mobileOpen: propMobileOpen,
  onCloseMobile: propOnCloseMobile,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebar = useSidebar();

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : sidebar.isCollapsed;
  const onToggleCollapse = propOnToggleCollapse !== undefined ? propOnToggleCollapse : sidebar.toggleCollapse;
  const mobileOpen = propMobileOpen !== undefined ? propMobileOpen : sidebar.mobileOpen;
  const onCloseMobile = propOnCloseMobile !== undefined ? propOnCloseMobile : sidebar.closeMobile;

  const renderContent = (collapsed: boolean) => (
    <div className="relative flex h-full w-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none overflow-x-hidden transition-all duration-300 ease-in-out">
      {/* 1. STICKY TOP BRAND HEADER */}
      <div
        className={`shrink-0 flex items-center border-b border-sidebar-border bg-sidebar/95 backdrop-blur z-20 transition-all duration-300 ${
          collapsed
            ? "justify-center px-2 py-4 min-h-[68px]"
            : "justify-between px-4 py-4 min-h-[68px]"
        }`}
      >
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 group overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
          title="FluidLogix Admin Portal"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-amber-500/25 transition-transform group-hover:scale-105">
            <Droplets size={19} className="stroke-[2.5]" />
          </div>

          {!collapsed && (
            <div className="animate-in fade-in duration-200 truncate">
              <div className="text-base font-bold tracking-tight text-sidebar-foreground leading-tight">
                FluidLogix
              </div>
              <div className="text-[11px] font-medium text-muted-foreground">
                Admin Portal
              </div>
            </div>
          )}
        </Link>

        {/* Close Button for Mobile Drawer */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE MIDDLE NAVIGATION MENUS (Zero horizontal scroll) */}
      <nav className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 space-y-1.5 custom-scrollbar ${
        collapsed ? "px-2" : "px-3"
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          if (collapsed) {
            return (
              <div key={item.name} className="relative group flex justify-center w-full">
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,165,0,0.15)] border border-primary/30 font-bold"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                  }`}
                  aria-label={item.name}
                >
                  <Icon
                    size={19}
                    className={`transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </Link>

                {/* Floating Tooltip */}
                <div className="pointer-events-none fixed z-50 hidden group-hover:flex items-center" style={{ left: "85px" }}>
                  <div className="rounded-lg border border-border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                    {item.name}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,165,0,0.08)] border border-primary/25 font-bold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. STICKY BOTTOM ACTIONS (SETTINGS & SIGNOUT) */}
      <div className={`shrink-0 border-t border-sidebar-border py-3 space-y-1 bg-sidebar/95 backdrop-blur z-20 overflow-x-hidden ${
        collapsed ? "px-2" : "px-3"
      }`}>
        {/* Settings Link */}
        {collapsed ? (
          <div className="relative group flex justify-center w-full">
            <Link
              href="/dashboard/settings"
              onClick={onCloseMobile}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                pathname === "/dashboard/settings"
                  ? "bg-primary/15 text-primary border border-primary/30 font-bold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              aria-label="Settings"
            >
              <Settings
                size={19}
                className={pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground"}
              />
            </Link>
            <div className="pointer-events-none fixed z-50 hidden group-hover:flex items-center" style={{ left: "85px" }}>
              <div className="rounded-lg border border-border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                Settings
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/dashboard/settings"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition ${
              pathname === "/dashboard/settings"
                ? "bg-primary/10 text-primary border border-primary/25 font-bold"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Settings
              size={18}
              className={pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground"}
            />
            <span className="truncate">Settings</span>
          </Link>
        )}

        {/* Sign Out (Logout) Link */}
        {collapsed ? (
          <div className="relative group flex justify-center w-full">
            <Link
              href="/login"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              aria-label="Sign Out"
            >
              <LogOut size={19} />
            </Link>
            <div className="pointer-events-none fixed z-50 hidden group-hover:flex items-center" style={{ left: "85px" }}>
              <div className="rounded-lg border border-destructive/30 bg-popover px-2.5 py-1 text-xs font-semibold text-destructive shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                Sign Out
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="truncate">Sign Out</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Fixed Sidebar with Dynamic Collapsible Width */}
      <aside
        className={`hidden md:flex shrink-0 flex-col h-screen sticky top-0 transition-[width] duration-300 ease-in-out z-30 relative ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {renderContent(isCollapsed)}

        {/* Floating Edge Toggle Handle (On the left sidebar border below the top navbar) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex absolute -right-3.5 top-20 z-40 h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md hover:bg-[#FFA500] hover:text-[#071522] hover:scale-110 transition-all cursor-pointer"
            title={isCollapsed ? "Expand sidebar panel" : "Collapse sidebar panel"}
            aria-label={isCollapsed ? "Expand sidebar panel" : "Collapse sidebar panel"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} className="stroke-[2.5]" />
            ) : (
              <ChevronLeft size={14} className="stroke-[2.5]" />
            )}
          </button>
        )}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {renderContent(false)}
          </div>
        </div>
      )}
    </>
  );
}

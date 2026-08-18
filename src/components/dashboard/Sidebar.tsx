"use client";

import {
  CreditCard,
  Droplets,
  FileText,
  Landmark,
  LayoutGrid,
  LogOut,
  Settings,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
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
}

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-sidebar text-sidebar-foreground border-r border-sidebar-border px-4 py-5 transition-colors duration-200">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-2 pb-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-amber-500/20 transition group-hover:scale-105">
              <Droplets size={18} className="stroke-[2.5]" />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight text-sidebar-foreground leading-tight">
                FluidLogix
              </div>
              <div className="text-[11px] font-medium text-muted-foreground">
                Admin Portal
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

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
                  className={`transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border pt-4 space-y-1">
        <Link
          href="/dashboard/profile"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition ${
            pathname === "/dashboard/profile"
              ? "bg-primary/10 text-primary border border-primary/25 font-bold"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <User size={18} className={pathname === "/dashboard/profile" ? "text-primary" : "text-muted-foreground"} />
          <span>Admin Profile</span>
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition ${
            pathname === "/dashboard/settings"
              ? "bg-primary/10 text-primary border border-primary/25 font-bold"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Settings size={18} className={pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground"} />
          <span>Settings</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
        >
          <LogOut size={18} className="text-muted-foreground group-hover:text-destructive" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

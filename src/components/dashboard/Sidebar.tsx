"use client";

import {
  CreditCard,
  Droplets,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  Truck,
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
    <div className="flex h-full flex-col justify-between bg-[#081523] border-r border-[#142637] px-4 py-5">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-2 pb-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-sm shadow-orange-500/20 transition group-hover:scale-105">
              <Droplets size={18} className="stroke-[2.5]" />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight text-[#F1F5F9] leading-tight">
                FluidLogix
              </div>
              <div className="text-[11px] font-medium text-[#5E7995]">
                Admin Portal
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-[#6E8BA7] hover:bg-[#0E2337] hover:text-[#F1F5F9] lg:hidden cursor-pointer"
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
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-150 ${isActive
                    ? "bg-[#FFA500]/10 text-[#FFA500] shadow-[0_0_15px_rgba(255,165,0,0.08)] border border-[#FFA500]/25"
                    : "text-[#7590AA] hover:bg-[#0D2235] hover:text-[#E8EEF5] border border-transparent"
                  }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${isActive ? "text-[#FFA500]" : "text-[#627F9D] group-hover:text-[#FFA500]"
                    }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-[#132535] pt-4 space-y-1">
        <Link
          href="/dashboard/settings"
          onClick={onCloseMobile}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#7590AA] hover:bg-[#0D2235] hover:text-[#E8EEF5] transition"
        >
          <Settings size={18} className="text-[#627F9D]" />
          <span>Settings</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#7590AA] hover:bg-[#181F2C] hover:text-[#EF4444] transition"
        >
          <LogOut size={18} className="text-[#627F9D] group-hover:text-[#EF4444]" />
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

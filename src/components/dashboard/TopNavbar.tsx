"use client";

import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Shield,
  Sliders,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

const notifications = [
  {
    id: 1,
    title: "Trip TK-002 dispatched",
    desc: "Chlorine Gas payload en route to Kakinada Industrial",
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Monthly Invoice generated",
    desc: "Invoice for ChemCorp Ltd (₹4.2L) is ready for review",
    time: "45m ago",
    unread: true,
  },
  {
    id: 3,
    title: "Hazmat Compliance verified",
    desc: "Driver Ramesh K. passed quarterly safety test",
    time: "2h ago",
    unread: false,
  },
];

export default function TopNavbar({
  onToggleMobileMenu,
  title = "Dashboard Overview",
  subtitle = "Sunday, 20 July 2025",
}: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#142637] bg-[#071522]/90 px-4 py-3.5 backdrop-blur-md sm:px-8">
      {/* Left: Title & Date + Mobile Menu Trigger */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-1.5 text-[#7E9AB5] hover:bg-[#0E2337] hover:text-[#F1F5F9] lg:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
            {title}
          </h1>
          <p className="text-xs font-medium text-[#5E7995]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#56728D]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="h-9 w-full rounded-full border border-[#172D40] bg-[#0A1A2A] pl-9 pr-3 text-xs text-[#E8EEF5] placeholder:text-[#526D87] outline-none transition focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/25"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#56728D] hover:text-[#E8EEF5]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#172D40] bg-[#0A1A2A] text-[#7E9AB5] transition hover:border-[#2C4863] hover:text-[#F1F5F9] cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {/* Unread badge dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FFA500] ring-2 ring-[#071522]" />
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-[#162D42] bg-[#0B1D2F] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#142637] pb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F1F5F9]">
                    Notifications
                  </span>
                  <span className="rounded-full bg-[#FFA500]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FFA500]">
                    2 new
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#FFA500] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-2.5 transition text-xs ${n.unread
                        ? "bg-[#0E253A]/90 border border-[#1E3A54]"
                        : "hover:bg-[#0D2032]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#E2E8F0]">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#5A7692]">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#7A95AF] leading-tight">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar (SA) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-full cursor-pointer focus:outline-none"
            aria-label="User profile menu"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] font-bold text-xs shadow-md shadow-orange-500/20 transition hover:scale-105">
              SA
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#162D42] bg-[#0B1D2F] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#142637]">
                <div className="text-xs font-semibold text-[#F1F5F9]">
                  Super Admin
                </div>
                <div className="text-[11px] text-[#5E7995] truncate">
                  admin@fluidlogix.com
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Full System Control
                </div>
              </div>

              <div className="mt-1 space-y-0.5 text-xs">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#7A95AF] hover:bg-[#0E2337] hover:text-[#E8EEF5] transition"
                >
                  <User size={14} />
                  <span>Admin Profile</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#7A95AF] hover:bg-[#0E2337] hover:text-[#E8EEF5] transition"
                >
                  <Sliders size={14} />
                  <span>Portal Preferences</span>
                </Link>

                <div className="border-t border-[#142637] my-1" />

                <Link
                  href="/login"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[#EF4444] hover:bg-[#1C1520] transition"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Shield,
  ShieldCheck,
  Sliders,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useSidebar } from "@/context/SidebarContext";

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  onToggleMobileMenu: propOnToggleMobileMenu,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
  title = "Dashboard Overview",
  subtitle = "Sunday, 20 July 2025",
}: TopNavbarProps) {
  const sidebar = useSidebar();
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : sidebar.isCollapsed;
  const onToggleCollapse = propOnToggleCollapse !== undefined ? propOnToggleCollapse : sidebar.toggleCollapse;
  const onToggleMobileMenu = propOnToggleMobileMenu !== undefined ? propOnToggleMobileMenu : sidebar.openMobile;

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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 text-card-foreground px-4 py-3 backdrop-blur-md sm:px-6 transition-colors duration-200 min-h-[68px]">
      {/* Left: Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Menu Trigger (Mobile only) */}
        <button
          onClick={onToggleMobileMenu}
          className="flex md:hidden items-center justify-center h-10 w-10 rounded-xl border border-border bg-muted/50 text-foreground hover:bg-[#FFA500]/15 hover:text-[#FFA500] transition cursor-pointer shadow-sm"
          aria-label="Open Mobile Menu"
        >
          <Menu size={20} />
        </button>

        {/* Title & Subtitle */}
        <div className="flex flex-col justify-center">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-[11px] font-medium text-muted-foreground leading-none mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme Toggle, Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="h-9 w-full rounded-full border border-border bg-muted/50 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/25"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-foreground cursor-pointer shadow-sm"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {/* Unread badge dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-border bg-popover text-popover-foreground p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border pb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    Notifications
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    2 new
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-2.5 transition text-xs ${
                      n.unread
                        ? "bg-muted/80 border border-border"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle align="right" />

        {/* User Profile Avatar (RK) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-full cursor-pointer focus:outline-none"
            aria-label="User profile menu"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-amber-500/20 transition hover:scale-105">
              RK
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-popover text-popover-foreground p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-border">
                <div className="text-xs font-bold text-foreground">
                  Ramesh Kantamreddi
                </div>
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  ramesh.kreddi@gmail.com
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Super Administrator
                </div>
              </div>

              <div className="mt-1 space-y-0.5 text-xs">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <User size={14} />
                  <span>Admin Profile</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Sliders size={14} />
                  <span>Portal Preferences</span>
                </Link>

                {/* Capability Menu Option */}
                <Link
                  href="/dashboard/capabilities"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <ShieldCheck size={14} className="text-primary" />
                  <span>Role Capabilities</span>
                </Link>

                <div className="border-t border-border my-1" />

                <Link
                  href="/login"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-destructive hover:bg-destructive/10 transition"
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

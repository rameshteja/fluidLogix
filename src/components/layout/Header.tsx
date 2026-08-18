"use client";

import { ArrowRight, Droplets, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  path: string;
  isInternal: boolean;
}

const navigation: NavItem[] = [
  { label: "Features", href: "/#features", path: "/", isInternal: false },
  { label: "About Us", href: "/about", path: "/about", isInternal: true },
  {
    label: "Owner Registration Request",
    href: "/register/owner",
    path: "/register/owner",
    isInternal: true,
  },
  {
    label: "Company Registration Request",
    href: "/register/company",
    path: "/register/company",
    isInternal: true,
  },
  { label: "Roles", href: "/#roles", path: "/#roles", isInternal: false },
  { label: "Contact Us", href: "/contact", path: "/contact", isInternal: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.isInternal) {
      return pathname === item.path || pathname.startsWith(`${item.path}/`);
    }
    // For root landing sections
    return pathname === "/" && item.path === "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] shadow-sm group-hover:scale-105 transition-transform">
            <Droplets size={18} className="text-primary-foreground" />
          </div>

          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-[#FFA500] transition-colors">
            FluidLogix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 lg:gap-6 md:flex">
          {navigation.map((item) => {
            const active = isItemActive(item);

            if (item.isInternal) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-xs lg:text-sm transition-all duration-150 relative py-1 ${
                    active
                      ? "text-[#FFA500] font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#FFA500] after:rounded-full"
                      : "text-muted-foreground font-medium hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className="text-xs lg:text-sm font-medium text-muted-foreground transition hover:text-foreground py-1"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle align="right" />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-2 text-xs lg:text-sm font-bold text-[#071522] transition hover:bg-[#FFB52E] shadow-sm shadow-orange-500/20 hover:scale-102"
          >
            Sign In
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Button & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle align="right" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-foreground transition hover:bg-muted cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-5 py-5 md:hidden shadow-lg animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const active = isItemActive(item);

              if (item.isInternal) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-semibold px-3 py-2.5 rounded-xl transition ${
                      active
                        ? "bg-[#FFA500]/15 text-[#FFA500] font-bold border border-[#FFA500]/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-muted"
                >
                  {item.label}
                </a>
              );
            })}

            <Link
              href="/login"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-5 py-2.5 text-xs font-bold text-[#071522]"
            >
              Sign In to Portal
              <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
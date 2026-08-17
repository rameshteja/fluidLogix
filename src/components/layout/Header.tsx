"use client";

import { Menu, X, ArrowRight, Droplets } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Roles", href: "#roles" },
  { label: "Support", href: "#support" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-[#071522] shadow-sm">
            <Droplets size={18} className="text-primary-foreground" />
          </div>

          <span className="text-lg font-bold tracking-tight text-foreground">
            FluidLogix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle align="right" />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-2.5 text-sm font-semibold text-[#071522] transition hover:bg-[#FFB52E] shadow-sm"
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
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/login"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#FFA500] px-5 py-3 text-sm font-semibold text-[#071522]"
            >
              Sign In
              <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
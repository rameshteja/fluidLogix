"use client";

import { Menu, X, ArrowRight, Droplets } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Roles", href: "#roles" },
  { label: "Support", href: "#support" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#172A3A] bg-[#081521]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-[#071522]">
            <Droplets size={18} className="text-primary-foreground" />
          </div>

          <span className="text-lg font-bold tracking-tight text-[#E8EEF5]">
            FluidLogix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[#607B98] transition hover:text-[#E8EEF5]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Sign In */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-2.5 text-sm font-semibold text-[#071522] transition hover:bg-[#FFB52E]"
          >
            Sign In
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#E8EEF5] md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#172A3A] bg-[#081521] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[#9AAFC2]"
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
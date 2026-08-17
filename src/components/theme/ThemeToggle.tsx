"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  align?: "left" | "right";
  className?: string;
}

export default function ThemeToggle({
  align = "right",
  className = "",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { label: string; value: Theme; icon: React.ElementType }[] = [
    { label: "Light", value: "light", icon: Sun },
    { label: "Dark", value: "dark", icon: Moon },
    { label: "System", value: "system", icon: Monitor },
  ];

  // Current button icon based on active choice
  const CurrentIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-150 hover:bg-accent/10 hover:border-primary/50 cursor-pointer shadow-sm focus:outline-none"
        aria-label="Toggle theme mode"
        title={`Current theme: ${theme} (${resolvedTheme})`}
      >
        <CurrentIcon size={16} className="text-primary transition-transform duration-200" />
      </button>

      {open && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-36 rounded-xl border border-border bg-popover p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Theme Mode
          </div>
          <div className="mt-1 space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

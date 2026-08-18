"use client";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AutocompleteOption } from "@/data/filterOptions";

interface AutocompleteFilterProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: AutocompleteOption[];
  allOptionLabel?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  hideAllOption?: boolean;
  required?: boolean;
}

export default function AutocompleteFilter({
  label,
  value,
  onChange,
  options,
  allOptionLabel = "All Options",
  placeholder = "Type to search...",
  icon,
  className = "",
  disabled = false,
  hideAllOption = false,
  required = false,
}: AutocompleteFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (!value || value === "ALL") return null;
    return (
      options.find(
        (opt) => opt.value.toLowerCase() === value.toLowerCase()
      ) || null
    );
  }, [options, value]);

  // Keep input text in sync when value changes or dropdown closes
  useEffect(() => {
    if (!isOpen) {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else {
        setInputValue("");
      }
    }
  }, [value, selectedOption, isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered options based on typing in the input box
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim() || (!isOpen && selectedOption)) {
      return options;
    }
    const q = inputValue.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchValue = opt.value.toLowerCase().includes(q);
      const matchSublabel = (opt.sublabel || "").toLowerCase().includes(q);
      const matchSearchText = (opt.searchText || "").toLowerCase().includes(q);
      const matchBadge = (opt.badge || "").toLowerCase().includes(q);
      return (
        matchLabel ||
        matchValue ||
        matchSublabel ||
        matchSearchText ||
        matchBadge
      );
    });
  }, [options, inputValue, isOpen, selectedOption]);

  const handleSelectOption = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setActiveIndex(-1);
    const target = options.find(
      (o) => o.value.toLowerCase() === optValue.toLowerCase()
    );
    if (target) {
      setInputValue(target.label);
    } else {
      setInputValue("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("ALL");
    setInputValue("");
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const totalItems = filteredOptions.length + 1; // +1 for ALL option
        return prev < totalItems - 1 ? prev + 1 : 0;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const totalItems = filteredOptions.length + 1;
        return prev > 0 ? prev - 1 : totalItems - 1;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex === 0) {
        handleSelectOption("ALL");
      } else if (activeIndex > 0 && filteredOptions[activeIndex - 1]) {
        handleSelectOption(filteredOptions[activeIndex - 1].value);
      } else if (filteredOptions.length > 0) {
        handleSelectOption(filteredOptions[0].value);
      }
    }
  };

  const getBadgeClass = (category?: string, badge?: string) => {
    const text = (category || badge || "").toLowerCase();
    if (text.includes("chem") || text.includes("corrosive")) {
      return "bg-[#FFA500]/15 text-[#FFA500] border-[#FFA500]/30";
    }
    if (
      text.includes("haz") ||
      text.includes("toxic") ||
      text.includes("gas")
    ) {
      return "bg-red-500/15 text-red-400 border-red-500/30";
    }
    if (
      text.includes("waste") ||
      text.includes("water") ||
      text.includes("effluent")
    ) {
      return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    }
    if (
      text.includes("active") ||
      text.includes("eco") ||
      text.includes("non-haz")
    ) {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  const isAllSelected = !value || value === "ALL";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-muted-foreground font-semibold mb-1 text-xs">
          {label}
        </label>
      )}

      {/* Input / Combobox Box */}
      <div className="relative">
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(true);
              inputRef.current?.focus();
            }
          }}
          className={`flex h-8.5 w-full items-center justify-between rounded-lg border bg-background px-2.5 text-xs transition cursor-pointer ${
            isOpen
              ? "border-[#FFA500] ring-1 ring-[#FFA500]/40 shadow-sm"
              : isAllSelected
              ? "border-border hover:border-border/80"
              : "border-[#FFA500]/60 bg-[#FFA500]/5 font-medium"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
            {icon ? (
              <span
                className={`shrink-0 transition-colors ${
                  !isAllSelected ? "text-[#FFA500]" : "text-muted-foreground"
                }`}
              >
                {icon}
              </span>
            ) : (
              <Search
                size={12}
                className={`shrink-0 ${
                  !isAllSelected ? "text-[#FFA500]" : "text-muted-foreground"
                }`}
              />
            )}

            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              value={isOpen ? inputValue : selectedOption?.label || ""}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!isOpen) setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                setIsOpen(true);
                // Select all text on focus for fast replacement typing
                inputRef.current?.select();
              }}
              onKeyDown={handleKeyDown}
              placeholder={isAllSelected ? allOptionLabel : placeholder}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none font-normal truncate"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {!isAllSelected && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                title="Clear filter"
              >
                <X size={11} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer p-0.5"
            >
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#FFA500]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[280px] sm:min-w-[310px] rounded-2xl border border-border/80 bg-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          {/* Quick Search Info / Count Bar */}
          <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] text-muted-foreground border-b border-border/60">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <span>Filter Options</span>
            </span>
            <span className="text-[10px] font-mono text-[#FFA500]">
              {filteredOptions.length} match{filteredOptions.length === 1 ? "" : "es"}
            </span>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-56 overflow-y-auto custom-scrollbar space-y-1 pr-0.5"
          >
            {/* "All" Option */}
            {!hideAllOption && (
              <button
                type="button"
                onClick={() => handleSelectOption("ALL")}
                onMouseEnter={() => setActiveIndex(0)}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition cursor-pointer text-left ${
                  isAllSelected
                    ? "bg-[#FFA500]/15 text-[#FFA500] font-semibold border border-[#FFA500]/30"
                    : activeIndex === 0
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="font-medium">{allOptionLabel}</span>
                {isAllSelected && (
                  <Check size={13} className="text-[#FFA500] shrink-0" />
                )}
              </button>
            )}

            {/* Filtered Items */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected =
                  value && value.toLowerCase() === opt.value.toLowerCase();
                const isItemActive = activeIndex === idx + 1;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    onMouseEnter={() => setActiveIndex(idx + 1)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#FFA500]/15 text-[#FFA500] font-semibold border border-[#FFA500]/30"
                        : isItemActive
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span
                            className={`inline-block rounded-full border px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider shrink-0 ${getBadgeClass(
                              opt.category,
                              opt.badge
                            )}`}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.sublabel && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={13} className="text-[#FFA500] shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">
                <p>No matching results for &ldquo;{inputValue}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    inputRef.current?.focus();
                  }}
                  className="mt-1 text-[11px] text-[#FFA500] hover:underline cursor-pointer font-medium"
                >
                  Clear search query
                </button>
              </div>
            )}
          </div>

          {/* Footer keyboard navigation hint */}
          <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground px-1">
            <span>Type to filter list</span>
            <span className="font-mono">↑ ↓ navigate • ↵ select</span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  X,
  ChevronDown,
  Layers,
  Truck,
  FileText,
  CreditCard,
  Landmark,
  Users,
  BarChart3,
  ShieldAlert,
  Sparkles,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { ModuleCapability, ResourceCategory } from "@/types/capability";

interface ModuleAutocompleteProps {
  categories: ResourceCategory[];
  selectedModuleId: string | null;
  onSelectModule: (module: ModuleCapability | null) => void;
  onScrollToModule?: (moduleId: string) => void;
  placeholder?: string;
  className?: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Truck: <Truck size={14} className="text-primary" />,
  FileText: <FileText size={14} className="text-primary" />,
  CreditCard: <CreditCard size={14} className="text-primary" />,
  Landmark: <Landmark size={14} className="text-primary" />,
  Users: <Users size={14} className="text-primary" />,
  BarChart3: <BarChart3 size={14} className="text-primary" />,
  ShieldAlert: <ShieldAlert size={14} className="text-primary" />,
};

const RISK_BADGE_MAP: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  high: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

export default function ModuleAutocomplete({
  categories,
  selectedModuleId,
  onSelectModule,
  onScrollToModule,
  placeholder = "Search & jump to any module (e.g. Tankers, Invoices, GST, Bank, FASTag)...",
  className = "",
}: ModuleAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten all modules with category context
  const allModulesWithCategory = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.modules.map((mod) => ({
        ...mod,
        categoryTitle: cat.title,
        categoryCode: cat.code,
        categoryIcon: cat.iconName,
      }))
    );
  }, [categories]);

  // Selected module object
  const selectedModule = useMemo(() => {
    if (!selectedModuleId) return null;
    return allModulesWithCategory.find((m) => m.id === selectedModuleId) || null;
  }, [allModulesWithCategory, selectedModuleId]);

  // Filter modules based on query
  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allModulesWithCategory;

    return allModulesWithCategory.filter((mod) => {
      return (
        mod.name.toLowerCase().includes(q) ||
        mod.code.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.categoryTitle.toLowerCase().includes(q) ||
        (mod.complianceNote && mod.complianceNote.toLowerCase().includes(q))
      );
    });
  }, [allModulesWithCategory, query]);

  // Group filtered modules by category
  const groupedModules = useMemo(() => {
    const groups: { categoryTitle: string; categoryIcon: string; categoryCode: string; items: typeof filteredModules }[] = [];
    const map = new Map<string, typeof filteredModules>();

    filteredModules.forEach((mod) => {
      if (!map.has(mod.categoryTitle)) {
        map.set(mod.categoryTitle, []);
      }
      map.get(mod.categoryTitle)!.push(mod);
    });

    categories.forEach((cat) => {
      const items = map.get(cat.title);
      if (items && items.length > 0) {
        groups.push({
          categoryTitle: cat.title,
          categoryIcon: cat.iconName,
          categoryCode: cat.code,
          items,
        });
      }
    });

    return groups;
  }, [filteredModules, categories]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlight index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredModules]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredModules.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredModules.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredModules[highlightedIndex]) {
        handleSelect(filteredModules[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (module: (typeof allModulesWithCategory)[0]) => {
    onSelectModule(module);
    setQuery(module.name);
    setIsOpen(false);
    if (onScrollToModule) {
      onScrollToModule(module.id);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSelectModule(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Quick jump suggestions (Popular modules)
  const popularModules = useMemo(() => {
    const popularIds = [
      "tankers-registry",
      "load-entries",
      "customer-invoicing",
      "bank-master",
      "fastag-fuel-cards",
    ];
    return allModulesWithCategory.filter((m) => popularIds.includes(m.id));
  }, [allModulesWithCategory]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Box */}
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-150 bg-background ${
          isOpen
            ? "border-primary ring-2 ring-primary/30 shadow-lg shadow-amber-500/10"
            : "border-border hover:border-primary/40"
        }`}
      >
        <Search
          size={16}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            isOpen ? "text-primary" : "text-muted-foreground"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "") {
              onSelectModule(null);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 w-full rounded-2xl bg-transparent pl-10 pr-20 text-xs text-foreground placeholder:text-muted-foreground outline-none font-medium"
        />

        {/* Right side icons / clear */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-150 ${isOpen ? "rotate-180 text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-2 max-h-[380px] overflow-y-auto rounded-3xl border border-border bg-card/98 backdrop-blur-md p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 custom-scrollbar"
        >
          {/* Header Summary */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border text-[11px] text-muted-foreground">
            <span>
              Found <strong className="text-foreground">{filteredModules.length}</strong> modules
            </span>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              ↑↓ to navigate • Enter to select
            </span>
          </div>

          {/* Quick Jump Suggestions when query is empty */}
          {!query && (
            <div className="p-2 border-b border-border mb-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-primary" />
                <span>Frequently Managed Modules</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularModules.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelect(m)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-muted/60 hover:bg-primary/15 hover:text-primary hover:border-primary/40 border border-border text-foreground transition cursor-pointer"
                  >
                    <span>{m.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">({m.code})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty Results */}
          {filteredModules.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search size={28} className="mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-xs font-bold text-foreground">No capability module found</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Try searching for &quot;Tankers&quot;, &quot;Driver&quot;, &quot;Invoicing&quot;, &quot;Tax&quot;, &quot;FASTag&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 mt-1">
              {groupedModules.map((group) => (
                <div key={group.categoryTitle} className="space-y-1">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/30 rounded-lg">
                    {CATEGORY_ICON_MAP[group.categoryIcon] || <Layers size={12} />}
                    <span>{group.categoryTitle}</span>
                    <span className="text-[9px] font-mono text-muted-foreground ml-auto">
                      {group.items.length} modules
                    </span>
                  </div>

                  {/* Module Items */}
                  <div className="space-y-0.5">
                    {group.items.map((mod) => {
                      const isSelected = selectedModuleId === mod.id;
                      const globalIndex = filteredModules.findIndex((m) => m.id === mod.id);
                      const isHighlighted = globalIndex === highlightedIndex;

                      return (
                        <div
                          key={mod.id}
                          onClick={() => handleSelect(mod)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`flex items-start justify-between gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-100 ${
                            isHighlighted || isSelected
                              ? "bg-primary/15 border border-primary/30 shadow-xs"
                              : "hover:bg-muted/40 border border-transparent"
                          }`}
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-foreground">
                                {mod.name}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded border border-border">
                                {mod.code}
                              </span>
                              {mod.riskLevel && (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                    RISK_BADGE_MAP[mod.riskLevel] || "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {mod.riskLevel.toUpperCase()}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {mod.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-center">
                            {isSelected && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                <Check size={11} className="stroke-[3]" />
                              </div>
                            )}
                            <ArrowRight
                              size={13}
                              className={`transition-opacity ${
                                isHighlighted ? "opacity-100 text-primary" : "opacity-0"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Action: Clear Selection */}
          {selectedModuleId && (
            <div className="pt-2 mt-2 border-t border-border flex justify-between items-center px-2">
              <span className="text-[11px] text-muted-foreground">
                Filtering by: <strong className="text-foreground">{selectedModule?.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                Reset / Show All Modules
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

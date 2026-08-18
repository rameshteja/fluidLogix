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
  Check,
  ArrowRight,
  Filter,
} from "lucide-react";
import { ResourceCategory } from "@/types/capability";

interface CategoryAutocompleteProps {
  categories: ResourceCategory[];
  selectedCategoryId: string; // "all" or specific category ID
  onSelectCategory: (categoryId: string) => void;
  placeholder?: string;
  className?: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Truck: <Truck size={15} className="text-primary" />,
  FileText: <FileText size={15} className="text-primary" />,
  CreditCard: <CreditCard size={15} className="text-primary" />,
  Landmark: <Landmark size={15} className="text-primary" />,
  Users: <Users size={15} className="text-primary" />,
  BarChart3: <BarChart3 size={15} className="text-primary" />,
  ShieldAlert: <ShieldAlert size={15} className="text-primary" />,
};

export default function CategoryAutocomplete({
  categories,
  selectedCategoryId,
  onSelectCategory,
  placeholder = "Filter Category...",
  className = "",
}: CategoryAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCategoryObj = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((cat) => {
      return (
        cat.title.toLowerCase().includes(q) ||
        cat.code.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.modules.some(
          (m) => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
        )
      );
    });
  }, [categories, query]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredCategories.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredCategories.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCategories[highlightedIndex]) {
        handleSelect(filteredCategories[highlightedIndex].id);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    const cat = categories.find((c) => c.id === categoryId);
    setQuery(cat ? cat.title : "");
    setIsOpen(false);
  };

  const handleResetToAll = () => {
    onSelectCategory("all");
    setQuery("");
    setIsOpen(false);
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div ref={containerRef} className={`relative min-w-[220px] ${className}`}>
      {/* Input Box */}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-150 bg-background ${
          isOpen
            ? "border-primary ring-2 ring-primary/30 shadow-md"
            : "border-border hover:border-primary/40"
        }`}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {selectedCategoryObj ? (
            CATEGORY_ICON_MAP[selectedCategoryObj.iconName] || <Layers size={14} className="text-primary" />
          ) : (
            <Layers size={14} className="text-muted-foreground" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query || (selectedCategoryObj ? selectedCategoryObj.title : "")}
          onFocus={() => {
            setIsOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-9 w-full rounded-xl bg-transparent pl-9 pr-14 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none"
        />

        {/* Right Action Icons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selectedCategoryId !== "all" && (
            <button
              type="button"
              onClick={handleResetToAll}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Reset to All Categories"
            >
              <X size={12} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
            aria-label="Toggle category dropdown"
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-150 ${isOpen ? "rotate-180 text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-[320px] overflow-y-auto rounded-2xl border border-border bg-card/98 backdrop-blur-md p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 custom-scrollbar">
          {/* All Categories Option */}
          <div
            onClick={handleResetToAll}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition text-xs font-bold ${
              selectedCategoryId === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers size={14} />
              <span>All 7 Categories (Show All)</span>
            </div>
            {selectedCategoryId === "all" && <Check size={13} className="stroke-[3]" />}
          </div>

          <div className="border-t border-border my-1" />

          {/* Categorized Options */}
          {filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No matching categories
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredCategories.map((cat, idx) => {
                const isSelected = selectedCategoryId === cat.id;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-start justify-between gap-2 p-2 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? "bg-primary/15 border border-primary/30 text-foreground"
                        : isHighlighted
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="p-1 rounded-lg bg-muted border border-border mt-0.5 shrink-0">
                        {CATEGORY_ICON_MAP[cat.iconName] || <Layers size={13} />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate">{cat.title}</span>
                          <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1 rounded">
                            {cat.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {cat.modules.length} modules • {cat.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0 mt-1">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/utils/constant";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(collapsed));
    } catch {
      // ignore
    }
  };

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setCollapsed,
        mobileOpen,
        openMobile,
        closeMobile,
        toggleMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    // Return self-contained standalone state when used outside SidebarProvider
    const [standaloneCollapsed, setStandaloneCollapsed] = useState(false);
    const [standaloneMobile, setStandaloneMobile] = useState(false);

    useEffect(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
        if (saved !== null) {
          setStandaloneCollapsed(saved === "true");
        }
      } catch {
        // ignore
      }
    }, []);

    const standaloneToggleCollapse = () => {
      setStandaloneCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
        } catch {
          // ignore
        }
        return next;
      });
    };

    return {
      isCollapsed: standaloneCollapsed,
      toggleCollapse: standaloneToggleCollapse,
      setCollapsed: (c: boolean) => {
        setStandaloneCollapsed(c);
        try {
          localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(c));
        } catch {}
      },
      mobileOpen: standaloneMobile,
      openMobile: () => setStandaloneMobile(true),
      closeMobile: () => setStandaloneMobile(false),
      toggleMobile: () => setStandaloneMobile((p) => !p),
    };
  }
  return context;
}

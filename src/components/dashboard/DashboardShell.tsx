"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import FloatingChat from "./FloatingChat";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200">
      <Sidebar
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onToggleMobileMenu={() => setSidebarOpen(true)} />

        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <FloatingChat />
    </div>
  );
}
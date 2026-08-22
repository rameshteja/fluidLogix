"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import CapabilityMatrix from "@/components/capabilities/CapabilityMatrix";

export default function CapabilitiesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          title="Role Capabilities"
          subtitle="System security tiers & role permissions"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6 custom-scrollbar">
          <CapabilityMatrix />
        </main>
      </div>
    </div>
  );
}

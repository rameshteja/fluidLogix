"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import FleetTable from "@/components/fleet/FleetTable";

export default function FleetPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
        {/* Top Navbar */}
        <TopNavbar
          title="Fleet"
          subtitle="Sunday, 20 July 2025"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Fleet Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6">
          <FleetTable />
        </main>
      </div>
    </div>
  );
}

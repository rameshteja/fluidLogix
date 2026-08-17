"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import ComingSoonView from "@/components/common/ComingSoonView";

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex selection:bg-[#FFA500] selection:text-[#071522]">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
        <TopNavbar
          title="System Settings"
          subtitle="Platform preferences, Hazmat compliance rules & API keys"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6">
          <ComingSoonView
            title="System & Compliance Settings"
            category="Administration & Security"
            badge="Under Development"
            expectedDate="August 2025 Release"
            description="Manage global Hazmat protocols, tanker inspection alert schedules, automated SMS dispatch triggers, API integrations, and admin role permissions."
            features={[
              "Configurable Hazmat UN compliance thresholds & inspection periods",
              "Automated driver license & fitness expiry notification workflows",
              "Telematics & GPS IoT gateway webhook settings",
              "Multi-tenant security policies, 2FA, and audit logging",
            ]}
          />
        </main>
      </div>
    </div>
  );
}

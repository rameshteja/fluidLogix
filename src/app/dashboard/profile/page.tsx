"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import ComingSoonView from "@/components/common/ComingSoonView";

export default function ProfilePage() {
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
          title="Admin Profile"
          subtitle="Super Administrator account settings & security credentials"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6">
          <ComingSoonView
            title="Super Admin Profile & Security"
            category="User Profile & Security Management"
            badge="Under Development"
            expectedDate="August 2025 Release"
            description="Manage personal credentials, session tokens, activity logs, personal dashboard layout customizations, and multi-factor biometric authentication."
            features={[
              "Personal credentials & password rotation policy manager",
              "Active sessions inspector with remote device termination",
              "Notification preference center (SMS, WhatsApp, Email)",
              "Personalized widget layout & quick shortcut organizer",
            ]}
          />
        </main>
      </div>
    </div>
  );
}

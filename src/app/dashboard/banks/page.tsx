"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import BankTable from "@/components/banks/BankTable";

export default function BanksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex selection:bg-[#FFA500] selection:text-[#071522]">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
        <TopNavbar
          title="Fleet Owner Banking & Settlements"
          subtitle="Transporter bank accounts, penny drop verification & monthly payout dispatches"
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto space-y-6">
          <BankTable />
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import StatCards from "@/components/dashboard/StatCards";
import RevenueTrendChart from "@/components/dashboard/RevenueTrendChart";
import MaterialDonutChart from "@/components/dashboard/MaterialDonutChart";
import RecentLoadLogsTable from "@/components/dashboard/RecentLoadLogsTable";

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
        {/* Top Navbar */}
        <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1500px] w-full mx-auto">
          {/* Row 1: Key Metric Cards */}
          <StatCards />

          {/* Row 2: Charts (Revenue & Trip Trend + Loads by Material Donut) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-8">
              <RevenueTrendChart />
            </div>

            {/* Loads by Material Donut Breakdown */}
            <div className="lg:col-span-4">
              <MaterialDonutChart />
            </div>
          </div>

          {/* Row 3: Recent Load Logs Table */}
          <RecentLoadLogsTable />
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import StatCards from "@/components/dashboard/StatCards";
import HighchartsRevenueTrend from "@/components/dashboard/HighchartsRevenueTrend";
import HighchartsMaterialDonut from "@/components/dashboard/HighchartsMaterialDonut";
import HighchartsFleetUtilization from "@/components/dashboard/HighchartsFleetUtilization";
import HighchartsRoutePerformance from "@/components/dashboard/HighchartsRoutePerformance";
import RecentLoadLogsTable from "@/components/dashboard/RecentLoadLogsTable";

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200 flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] w-full mx-auto custom-scrollbar">
          {/* Row 1: Key Metric Cards */}
          <StatCards />

          {/* Row 2: Highcharts Financial Trends & Cargo Breakdown (Equal Height Stretch) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Revenue Trend Highcharts (Line / Column / Area) */}
            <div className="lg:col-span-8 h-full flex flex-col">
              <HighchartsRevenueTrend />
            </div>

            {/* Loads by Material Donut / Bar Highcharts */}
            <div className="lg:col-span-4 h-full flex flex-col">
              <HighchartsMaterialDonut />
            </div>
          </div>

          {/* Row 3: Highcharts Fleet Operational Efficiency & Top Corridors (Equal Height Stretch) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Fleet Status Matrix & Turnaround (Stacked / Combo / Area) */}
            <div className="lg:col-span-7 h-full flex flex-col">
              <HighchartsFleetUtilization />
            </div>

            {/* Top Freight Corridors (Horizontal Bar / Column / Pie) */}
            <div className="lg:col-span-5 h-full flex flex-col">
              <HighchartsRoutePerformance />
            </div>
          </div>

          {/* Row 4: Recent Load Logs Table */}
          <RecentLoadLogsTable />
        </main>
      </div>
    </div>
  );
}

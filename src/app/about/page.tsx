"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Droplets,
  Eye,
  FileCheck,
  Globe2,
  HeartHandshake,
  Landmark,
  Leaf,
  Layers,
  MapPin,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Hazmat & PESO Safety First",
    description:
      "Zero-tolerance safety standards for hazardous chemicals, acids, solvents, and fuels with strict regulatory compliance and live IoT monitoring.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
  },
  {
    icon: Layers,
    title: "End-to-End Liquid Traceability",
    description:
      "Digitized weightbridge verification, QR-coded load slips, and real-time transit telemetry replace error-prone manual paper registers.",
    color: "text-[#FFA500]",
    bg: "bg-[#FFA500]/15 border-[#FFA500]/30",
  },
  {
    icon: Landmark,
    title: "Empowering Fleet Owners",
    description:
      "Guaranteed weekly bank payment settlements, 194C TDS compliance automation, and direct load dispatch contracts for transporter profitability.",
    color: "text-sky-400",
    bg: "bg-sky-500/15 border-sky-500/30",
  },
  {
    icon: Zap,
    title: "Predictive Logistics Dispatch",
    description:
      "Algorithmic tanker assignment that matches plant capacity demand with certified drivers and optimal hazmat-compliant tankers.",
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
  },
];

const IMPACT_METRICS = [
  { value: "50,000+", label: "Safe Liquid Dispatches Delivered" },
  { value: "1,200+", label: "Verified Chemical & Water Tankers" },
  { value: "99.98%", label: "On-Time Plant SLA Fulfillment" },
  { value: "₹45+ Cr", label: "Disbursed to Fleet Owners on Schedule" },
];

const PLATFORM_PILLARS = [
  {
    role: "For Chemical & Manufacturing Plants",
    badge: "Enterprise Logistics",
    desc: "Guarantee continuous factory operations with reliable bulk tanker supply, scheduled dispatches, digital receipts, and real-time GPS transit updates.",
    features: [
      "Scheduled factory demand dispatching",
      "Digital weightbridge & load slip sync",
      "Live tanker GPS tracking & temperature sensing",
      "Automated monthly corporate billing & e-Invoicing",
    ],
  },
  {
    role: "For Fleet Owners & Transporters",
    badge: "Transporter Network",
    desc: "Monetize your heavy tanker fleet with consistent monthly loads, zero dead-mileage, verified drivers, and automated weekly bank disbursements.",
    features: [
      "Instant load allocation & route contracts",
      "Direct bank settlements via NEFT/RTGS",
      "Driver KYC, licence expiry & document wallet",
      "194C TDS auto-declaration filing support",
    ],
  },
  {
    role: "For Tanker Drivers",
    badge: "Driver Safety & Compliance",
    desc: "Equip professional tanker drivers with digital trip sheets, emergency spill response access, transparent trip allowances, and verified credentials.",
    features: [
      "Digital QR trip pass on mobile",
      "Emergency SOS & hazmat incident helpline",
      "Verified digital license & KYC credentials",
      "Instant trip completion confirmation",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Breadcrumb Back Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-[#FFA500] transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-xs font-bold font-mono">
              <Sparkles size={13} />
              <span>ABOUT FLUIDLOGIX</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              Pioneering the Future of{" "}
              <span className="text-[#FFA500]">Liquid Freight Logistics</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
              FluidLogix is the dedicated digital operating platform designed specifically for hazardous chemical, industrial solvent, petro-liquid, and bulk water tanker transportation across India.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/register/owner"
                className="rounded-xl bg-[#FFA500] px-6 py-3 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition"
              >
                Join as Fleet Owner
              </Link>
              <Link
                href="/register/company"
                className="rounded-xl border border-border bg-background px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Onboard Your Plant Facility
              </Link>
            </div>
          </div>

          {/* Impact Stats Strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_METRICS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#FFA500] font-mono mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. THE PROBLEM & OUR MISSION */}
        <section className="py-16 border-t border-border bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono mb-3">
                  <ShieldCheck size={13} />
                  <span>OUR MISSION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4">
                  Transforming Heavy Liquid Transport with Digital Integrity
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  For decades, industrial liquid transportation has relied on fragmented intermediaries, paper logbooks, unverified driver documents, and delayed payment cycles that hurt transporters.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  FluidLogix unites chemical manufacturers, fleet owners, verified drivers, and regulatory checkpoints on a unified cloud interface. With end-to-end load logging, GPS tracking, and instant bank settlements, we eliminate logistics blind spots.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Real-time hazmat & PESO compliance verification</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>100% automated weekly payment settlements for fleet owners</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Live GPS dispatch and electronic weightbridge load slips</span>
                  </div>
                </div>
              </div>

              {/* Graphical Overview Box */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <Droplets size={18} className="text-[#FFA500]" />
                  <span>The FluidLogix Operational Ecosystem</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="h-8 w-8 rounded-xl bg-[#FFA500]/15 text-[#FFA500] flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <strong className="text-foreground block">Plant Demand Allocation</strong>
                      <span className="text-muted-foreground">Chemical plants publish scheduled liquid cargo demand directly to the network.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <strong className="text-foreground block">Certified Tanker & Driver Dispatch</strong>
                      <span className="text-muted-foreground">Nearby verified tankers and hazmat-certified drivers are dispatched with digital QR passes.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <strong className="text-foreground block">Live Transit Traceability</strong>
                      <span className="text-muted-foreground">GPS tracking, route adherence, and digital weight slips ensure complete cargo integrity.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <strong className="text-foreground block">Automated Weekly Bank Settlement</strong>
                      <span className="text-muted-foreground">Transporters receive guaranteed bank payouts with automatic TDS and fuel reconciliation.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE VALUES */}
        <section className="py-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Built on Core Safety & Transporter Values
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Our technology and operational principles ensure safety, speed, and fairness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CORE_VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between hover:border-[#FFA500]/40 transition duration-200"
                  >
                    <div>
                      <div className={`h-11 w-11 rounded-2xl ${val.bg} flex items-center justify-center mb-4 border`}>
                        <Icon size={22} className={val.color} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-2">
                        {val.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. PLATFORM PILLARS (WHO WE SERVE) */}
        <section className="py-16 border-t border-border bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Specialized Solutions for Every Stakeholder
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Purpose-engineered workflows designed for industrial plants, fleet owners, and commercial tanker drivers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLATFORM_PILLARS.map((pillar) => (
                <div
                  key={pillar.role}
                  className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-[10px] font-bold uppercase tracking-wider mb-3">
                      {pillar.badge}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {pillar.role}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {pillar.desc}
                    </p>

                    <div className="space-y-2.5 text-xs border-t border-border/60 pt-4">
                      {pillar.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span className="text-foreground/90 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA BOTTOM */}
        <section className="py-16 border-t border-border text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/30 px-3.5 py-1 rounded-full mb-4">
              <Truck size={14} />
              <span>READY TO SCALE YOUR FLEET OPERATIONS?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Experience the FluidLogix Difference Today
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-8">
              Join leading chemical manufacturers and 1,200+ fleet owners across India on the country&apos;s leading liquid freight network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register/owner"
                className="w-full sm:w-auto rounded-xl bg-[#FFA500] px-7 py-3 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition"
              >
                Owner Registration Request
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-xl border border-border bg-background px-7 py-3 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Contact Our Logistics Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  FileText,
  CreditCard,
  ShieldCheck,
  Users,
  Activity,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/HeroSlider";

const stats = [
  {
    value: "2,400+",
    label: "Trips This Year",
  },
  {
    value: "186",
    label: "Active Vehicles",
  },
  {
    value: "42",
    label: "Partner Companies",
  },
  {
    value: "99.2%",
    label: "On-time Delivery",
  },
];

const features = [
  {
    title: "Fleet Management",
    description:
      "Track all tankers and trucks — capacity, type, number, driver assignment, and live status from a single view.",
    icon: Truck,
    color: "text-[#FFA500]",
    bg: "bg-[#FFA500]/10",
  },
  {
    title: "Daily Load Logs",
    description:
      "Every loading and unloading event is timestamped, geotagged, and linked to the specific driver and company.",
    icon: FileText,
    color: "text-[#00AEEF]",
    bg: "bg-[#00AEEF]/10",
  },
  {
    title: "Monthly Billing",
    description:
      "Auto-generate per-vehicle invoices based on total weight carried, with separate local and non-local rate calculations.",
    icon: CreditCard,
    color: "text-[#00C897]",
    bg: "bg-[#00C897]/10",
  },
  {
    title: "Hazmat Compliance",
    description:
      "Classify every load — Chemical, Hazardous, Waste Water, or Non-Hazardous — with proper handling flags.",
    icon: ShieldCheck,
    color: "text-[#FF4D6D]",
    bg: "bg-[#FF4D6D]/10",
  },
  {
    title: "Multi-Role Portal",
    description:
      "Admin, owners, drivers, and companies each get tailored dashboards from a single secure login portal.",
    icon: Users,
    color: "text-[#8B6CFF]",
    bg: "bg-[#8B6CFF]/10",
  },
  {
    title: "Real-time Tracking",
    description:
      "Monitor trip status, vehicle location, and load weight in real time. Instant alerts for delays or issues.",
    icon: Activity,
    color: "text-[#FF4DAB]",
    bg: "bg-[#FF4DAB]/10",
  },
];

const roles = [
  {
    title: "Super Admin",
    color: "#FFA500",
    permissions: [
      "Manage all users & vehicles",
      "Assign tankers to requests",
      "Generate & track billing",
      "View all logs & reports",
      "System configuration",
    ],
  },
  {
    title: "Fleet Owner",
    color: "#00AEEF",
    permissions: [
      "View owned vehicles",
      "Manage linked drivers",
      "View monthly billing",
      "Update bank details",
      "Track trip history",
    ],
  },
  {
    title: "Driver",
    color: "#00C897",
    permissions: [
      "View assigned loads",
      "Log loading & unloading",
      "Update trip status",
      "View earning summary",
      "Report incidents",
    ],
  },
  {
    title: "Company",
    color: "#8B6CFF",
    permissions: [
      "Submit load requests",
      "Track assigned tankers",
      "Monitor dispatch status",
      "Download trip reports",
      "View past invoices",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#071522] text-[#E8EEF5]">
      <Header />

      {/* HERO */}
      <main>
        {/* Hero Slider */}
        <HeroSlider />
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 text-center sm:pt-24 lg:px-8 lg:pb-24">

            {/* Badge */}
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFA500]/20 bg-[#FFA500]/10 px-4 py-2 text-xs font-semibold text-[#FFA500]">
              <span>⚡</span>
              Chemical & Water Transport Platform
            </div>

            {/* Heading */}
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Manage Every Load,
              <br />
              <span className="text-[#FFA500]">Every Tanker,</span> Every Trip
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#607B98] sm:text-base">
              FluidLogix brings fleet owners, drivers, and chemical companies
              onto one platform — with complete traceability, hazmat
              compliance, and automated monthly billing.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-7 py-3.5 text-sm font-bold text-[#071522] shadow-lg shadow-orange-500/10 transition hover:bg-[#FFB52E]"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-[#1A3042] px-7 py-3.5 text-sm font-semibold text-[#E8EEF5] transition hover:bg-[#0D2031]"
              >
                View Admin Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#1A3042] bg-[#0D2031] px-4 py-5 transition hover:-translate-y-1 hover:border-[#29455C] hover:bg-[#10283D]"
                >
                  <div className="text-xl font-bold text-[#FFA500] sm:text-2xl">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs text-[#607B98]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="border-t border-[#172A3A] py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Everything Your Fleet Operation Needs
              </h2>
              <p className="mt-3 text-sm text-[#607B98]">
                Purpose-built for chemical and hazardous material transport
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-[#1A3042] bg-[#0D2031] p-6 transition hover:-translate-y-1 hover:border-[#29455C] hover:bg-[#10283D]"
                  >
                    <div
                      className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon size={19} className={feature.color} />
                    </div>

                    <h3 className="text-base font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#607B98]">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section
          id="roles"
          className="border-t border-[#172A3A] py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                One Portal — Four Roles
              </h2>
              <p className="mt-3 text-sm text-[#607B98]">
                Each user type sees exactly what they need to do their job
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-xl border bg-[#0D2031] p-5"
                  style={{
                    borderColor: `${role.color}55`,
                  }}
                >
                  <h3 className="mb-5 text-sm font-bold">
                    {role.title}
                  </h3>
                  <div className="space-y-3">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex gap-2 text-xs text-[#7891A8]"
                      >
                        <CheckCircle2
                          size={14}
                          style={{ color: role.color }}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="support"
          className="border-t border-[#172A3A] py-20"
        >
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to digitize your fleet operations?
            </h2>
            <p className="mt-4 text-sm text-[#607B98]">
              Built on React, Node.js, and MongoDB — deploy on your
              infrastructure.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FFA500] px-7 py-3.5 text-sm font-bold text-[#071522] transition hover:bg-[#FFB52E]"
            >
              Start Free Demo
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
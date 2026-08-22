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
  Phone,
  Mail,
  MapPin,
  Sparkles,
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
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
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl text-foreground">
              Manage Every Load,
              <br />
              <span className="text-[#FFA500]">Every Tanker,</span> Every Trip
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              FluidLogix brings fleet owners, drivers, and chemical companies
              onto one platform — with complete traceability, hazmat
              compliance, and automated monthly billing.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-7 py-3.5 text-sm font-bold text-[#071522] shadow-lg shadow-orange-500/10 transition hover:bg-[#FFB52E]"
              >
                Sign In to Portal
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/register/owner"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFA500]/40 bg-[#FFA500]/10 px-5 py-3.5 text-sm font-bold text-[#FFA500] transition hover:bg-[#FFA500]/20"
              >
                <Truck size={16} />
                <span>Owner Registration</span>
              </Link>
              <Link
                href="/register/company"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <Users size={16} />
                <span>Company Registration</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card text-card-foreground px-4 py-5 transition hover:-translate-y-1 hover:border-primary/40 shadow-sm"
                >
                  <div className="text-xl font-bold text-[#FFA500] sm:text-2xl">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
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
          className="border-t border-border py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl text-foreground">
                Everything Your Fleet Operation Needs
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Purpose-built for chemical and hazardous material transport
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-border bg-card text-card-foreground p-6 transition hover:-translate-y-1 hover:border-primary/40 shadow-sm"
                  >
                    <div
                      className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon size={19} className={feature.color} />
                    </div>

                    <h3 className="text-base font-bold text-card-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
          className="border-t border-border py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl text-foreground">
                One Portal — Four Roles
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Each user type sees exactly what they need to do their job
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm"
                  style={{
                    borderColor: `${role.color}55`,
                  }}
                >
                  <h3 className="mb-5 text-sm font-bold text-card-foreground">
                    {role.title}
                  </h3>
                  <div className="space-y-3">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex gap-2 text-xs text-muted-foreground"
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

        {/* CONTACT & SUPPORT SPOTLIGHT */}
        <section
          id="support"
          className="border-t border-border py-20 bg-muted/20"
        >
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-[#FFA500]/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-xs font-bold font-mono">
                    <Sparkles size={13} />
                    <span>DIRECT OPERATIONS CONTACT</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Ready to digitize your fleet operations?
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Connect directly with our logistics team for tanker allocations, route setup, or enterprise integrations.
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#FFA500] px-6 py-3 text-xs font-bold text-[#071522] transition hover:bg-[#FFB52E] shadow-sm"
                    >
                      Start Free Demo
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-xs font-semibold text-foreground transition hover:bg-muted"
                    >
                      <span>Full Contact Desk</span>
                    </Link>
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-background/80 p-5 shadow-lg space-y-3.5 backdrop-blur">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/70">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FFA500] to-[#FFB733] text-[#071522] font-black text-sm shadow-md shadow-orange-500/20">
                      RK
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        Ramesh Kantamreddi
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Operations & Logistics Lead
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="text-[#FFA500] shrink-0" />
                      <a
                        href="tel:+919848845035"
                        className="font-mono text-foreground hover:text-[#FFA500] font-semibold transition"
                      >
                        +91 9848845035
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Mail size={14} className="text-[#FFA500] shrink-0" />
                      <a
                        href="mailto:ramesh.kreddi@gmail.com"
                        className="font-mono text-foreground hover:text-[#FFA500] font-semibold transition"
                      >
                        ramesh.kreddi@gmail.com
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin size={14} className="text-[#FFA500] shrink-0" />
                      <span className="text-foreground">Visakhapatnam, Andhra Pradesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
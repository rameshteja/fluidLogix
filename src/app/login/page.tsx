import {
  ArrowLeft,
  Droplets,
  LockKeyhole,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/theme/ThemeToggle";

const keyHighlights = [
  {
    title: "Real-Time Tanker Tracking",
    desc: "Live GPS, loading status & route logs",
    icon: Truck,
  },
  {
    title: "Automated Weight Invoicing",
    desc: "Instant per-vehicle billing & receipts",
    icon: Zap,
  },
  {
    title: "Multi-Role Security",
    desc: "Role-based access & encrypted data",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
      <div className="flex min-h-screen flex-col lg:grid lg:h-screen lg:grid-cols-12 lg:overflow-hidden">

        {/* =====================================================
            LEFT PANEL - Visual Brand Showcase (Desktop)
        ====================================================== */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-6 lg:col-span-6 lg:flex xl:p-10 2xl:p-12 text-card-foreground">

          {/* Subtle Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-500/5 blur-[80px]" />

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-amber-500/20 transition group-hover:scale-105">
                <Droplets size={18} className="stroke-[2.5]" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  FluidLogix
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle align="right" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft size={13} />
                <span>Back to home</span>
              </Link>
            </div>
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 my-auto py-2 xl:py-4">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary mb-3">
              <Sparkles size={12} className="text-primary" />
              <span>Enterprise Fleet Network</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
              Water & Chemical Transport
              <br />
              <span className="text-primary">
                Managed Simply & Safely
              </span>
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground xl:text-sm max-w-md">
              Unified portal for fleet owners, drivers, and transport partners to coordinate tanker dispatches, load tonnages, and automated billing.
            </p>

            {/* Highlights Grid */}
            <div className="mt-4 space-y-2 max-w-md">
              {keyHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 backdrop-blur transition hover:bg-muted/50"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon size={14} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-foreground leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT PANEL - Authentication Form
        ====================================================== */}
        <section className="relative flex min-h-screen flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:col-span-6 lg:h-screen lg:min-h-0 lg:p-6 xl:p-8 bg-background text-foreground">

          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

          {/* Mobile Top Navigation & Logo (Visible only on < lg) */}
          <div className="mx-auto mb-4 flex w-full max-w-[390px] items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-sm shadow-orange-500/20">
                <Droplets size={16} className="stroke-[2.5]" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                FluidLogix
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle align="right" />
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-[#FFA500]"
              >
                <ArrowLeft size={12} />
                <span>Home</span>
              </Link>
            </div>
          </div>

          {/* Centered Login Form Card */}
          <div className="relative z-10 my-auto w-full">
            <Suspense
              fallback={
                <div className="w-full max-w-[400px] mx-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-border bg-card/60 backdrop-blur">
                  <div className="h-9 w-9 rounded-xl bg-primary/20 animate-pulse flex items-center justify-center text-primary">
                    <Droplets size={18} className="animate-spin" />
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
                  <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
                  <div className="h-10 w-full bg-primary/20 rounded-xl animate-pulse" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          {/* Mobile Footer Note */}
          <div className="relative z-10 mt-3 text-center text-[10px] text-muted-foreground lg:hidden">
            <span>Secured with JWT authentication & HTTPS encryption</span>
          </div>

        </section>

      </div>
    </main>
  );
}
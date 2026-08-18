import {
  ArrowLeft,
  Droplets,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import ForgotPasswordFlow from "@/components/auth/ForgotPasswordFlow";
import ThemeToggle from "@/components/theme/ThemeToggle";

const recoveryHighlights = [
  {
    title: "Encrypted OTP Verification",
    desc: "Single-use 6-digit cryptographic verification",
    icon: KeyRound,
  },
  {
    title: "Multi-Role Safety Gateway",
    desc: "Strict access control across all 5 operational roles",
    icon: ShieldCheck,
  },
  {
    title: "Instant Credential Sync",
    desc: "Real-time credential updates across portal & mobile",
    icon: Zap,
  },
];

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
      <div className="flex min-h-screen flex-col lg:grid lg:h-screen lg:grid-cols-12 lg:overflow-hidden">
        {/* =====================================================
            LEFT PANEL - Visual Brand Showcase (Desktop)
        ====================================================== */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-6 lg:col-span-6 lg:flex xl:p-10 2xl:p-12 text-card-foreground">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-500/5 blur-[80px]" />

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5 transition">
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
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft size={13} />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 my-auto py-2 xl:py-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary mb-3">
              <Sparkles size={12} className="text-primary" />
              <span>Identity & Access Governance</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
              Secure Account
              <br />
              <span className="text-primary">
                Password Recovery
              </span>
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground xl:text-sm max-w-md">
              FluidLogix zero-trust security infrastructure ensures your fleet operations, bank master records, and billing data remain protected during credential reset.
            </p>

            {/* Highlights Grid */}
            <div className="mt-5 space-y-2.5 max-w-md">
              {recoveryHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 backdrop-blur transition hover:bg-muted/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Security Notice */}
          <div className="relative z-10 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
            Protected by FluidLogix 256-bit encryption & multi-factor authentication.
          </div>
        </section>

        {/* =====================================================
            RIGHT PANEL - Recovery Flow Form
        ====================================================== */}
        <section className="relative flex min-h-screen flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:col-span-6 lg:h-screen lg:min-h-0 lg:p-6 xl:p-8 bg-background text-foreground overflow-y-auto">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

          {/* Mobile Top Navigation (Visible only on < lg) */}
          <div className="mx-auto mb-4 flex w-full max-w-[420px] items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-amber-500/20">
                <Droplets size={16} className="stroke-[2.5]" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                FluidLogix
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle align="right" />
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
              >
                <ArrowLeft size={12} />
                <span>Login</span>
              </Link>
            </div>
          </div>

          {/* Recovery Form Flow */}
          <ForgotPasswordFlow />
        </section>
      </div>
    </main>
  );
}

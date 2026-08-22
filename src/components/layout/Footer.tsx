import Link from "next/link";
import {
  Droplets,
  Mail,
  MapPin,
  Phone,
  User,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Top Footer: Main Info & Contact Details */}
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                <Droplets size={20} className="text-primary-foreground stroke-[2.5]" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-foreground block">
                  FluidLogix
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Bulk Liquid & Chemical Transport
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed">
              India&apos;s premier digital platform for chemical tanker operations, hazardous liquid dispatch, GPS tracking, and automated transporter billing.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Follow & Connect
              </div>
              <div className="flex items-center gap-2">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition duration-150"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63a1.63 1.63 0 0 0 1.63 1.63 1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition duration-150"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition duration-150"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition duration-150"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition duration-150"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Direct Contact & Operations Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contact & Operations
            </h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <User size={15} className="text-[#FFA500] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Ramesh Kantamreddi</strong>
                  <span>Head of Operations & Logistics</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#FFA500] shrink-0" />
                <a
                  href="tel:+919848845035"
                  className="font-mono text-foreground hover:text-[#FFA500] transition"
                >
                  +91 9848845035
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#FFA500] shrink-0" />
                <a
                  href="mailto:ramesh.kreddi@gmail.com"
                  className="font-mono text-foreground hover:text-[#FFA500] transition"
                >
                  ramesh.kreddi@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#FFA500] shrink-0 mt-0.5" />
                <span>Visakhapatnam, Andhra Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Col 3: Portal Registration Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Onboarding Portals
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/register/owner"
                  className="hover:text-primary transition flex items-center gap-1.5"
                >
                  <span>Fleet Owner Registration</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link
                  href="/register/company"
                  className="hover:text-primary transition flex items-center gap-1.5"
                >
                  <span>Company Facility Onboarding</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition font-bold text-foreground flex items-center gap-1.5"
                >
                  <span>Sign In to Portal</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link
                  href="/forgot-password"
                  className="hover:text-primary transition flex items-center gap-1.5"
                >
                  <span>Account Recovery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform & Support
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary transition">
                  Fleet Features & Tracking
                </Link>
              </li>
              <li>
                <Link href="/#roles" className="hover:text-primary transition">
                  Role-Based Control Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About FluidLogix
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  24/7 Operations Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-border bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 FluidLogix Freight Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Hazmat & Dispatch Systems Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
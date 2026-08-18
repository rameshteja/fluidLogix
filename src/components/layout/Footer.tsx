import Link from "next/link";
import { Droplets } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              <Droplets size={18} className="text-primary-foreground" />
            </div>

            <span className="text-sm font-semibold text-foreground">
              FluidLogix
            </span>
          </Link>

          <span className="text-xs text-muted-foreground">
            © 2026 All rights reserved
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
          <Link href="/#features" className="hover:text-primary transition">
            Features
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About Us
          </Link>
          <Link href="/register/owner" className="hover:text-primary transition">
            Owner Registration
          </Link>
          <Link href="/register/company" className="hover:text-primary transition">
            Company Registration
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact & Support
          </Link>
          <Link href="/login" className="hover:text-primary transition font-bold text-foreground">
            Sign In
          </Link>
          <Link href="/forgot-password" className="hover:text-primary transition">
            Account Recovery
          </Link>
        </div>
      </div>
    </footer>
  );
}
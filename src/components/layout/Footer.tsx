import Link from "next/link";
import { Droplets } from "lucide-react";
export default function Footer() {
  return (
    <footer className="border-t border-[#172A3A] bg-[#071522]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 md:flex-row md:items-center md:justify-between lg:px-8">

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFA500] text-sm font-bold text-[#071522]">
            <Droplets size={18} className="text-primary-foreground" />
          </div>

          <span className="text-sm font-semibold text-[#E8EEF5]">
            FluidLogix
          </span>

          <span className="text-xs text-[#607B98]">
            © 2025 All rights reserved
          </span>
        </div>

        <div className="flex flex-wrap gap-5 text-xs text-[#607B98]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}
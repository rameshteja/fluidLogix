"use client";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const roles = [
  {
    id: "admin",
    label: "Admin",
    roleTitle: "Super Admin",
    desc: "Full Access",
    icon: Shield,
  },
  {
    id: "owner",
    label: "Owner",
    roleTitle: "Fleet Owner",
    desc: "Vehicles",
    icon: UserRound,
  },
  {
    id: "driver",
    label: "Driver",
    roleTitle: "Driver",
    desc: "Trips & Logs",
    icon: Truck,
  },
  {
    id: "company",
    label: "Company",
    roleTitle: "Transport Partner",
    desc: "Orders",
    icon: Building2,
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeRoleObj =
    roles.find((role) => role.id === selectedRole) ?? roles[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    console.log({
      selectedRole,
      rememberMe,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {/* Header */}
      <div className="mb-4 text-center sm:text-left">
        <h1 className="text-xl sm:text-[22px] font-bold tracking-tight text-[#E8EEF5]">
          Sign in to your account
        </h1>
        <p className="mt-0.5 text-xs text-[#7E97B0]">
          Chemical & Water Transport Management Portal
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#7E97B0]">
            Sign in as
          </label>
          <span className="text-[11px] font-medium text-[#FFA500]">
            {activeRoleObj.roleTitle}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-150 cursor-pointer ${active
                    ? "border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500] shadow-[0_0_12px_rgba(255,165,0,0.12)] ring-1 ring-[#FFA500]/30"
                    : "border-[#1A3042] bg-[#0B1A28]/60 text-[#67829E] hover:border-[#2C4863] hover:bg-[#0D2235] hover:text-[#C5D5E6]"
                  }`}
              >
                <Icon
                  size={17}
                  className={`mb-0.5 transition-transform group-hover:scale-110 ${active ? "text-[#FFA500]" : "text-[#7891A8]"
                    }`}
                />
                <span className="text-[11px] font-semibold tracking-tight leading-tight">
                  {role.label}
                </span>
                <span
                  className={`text-[9px] truncate max-w-full tracking-tighter ${active ? "text-[#FFA500]/80" : "text-[#526D87]"
                    }`}
                >
                  {role.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-[#94A9BE] mb-1"
          >
            Email Address
          </label>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57728D] transition group-focus-within:text-[#FFA500]">
              <Mail size={15} />
            </div>

            <input
              id="email"
              name="email"
              type="email"
              placeholder={
                selectedRole === "admin"
                  ? "admin@fluidlogix.com"
                  : selectedRole === "owner"
                    ? "owner@fleetcorp.com"
                    : selectedRole === "driver"
                      ? "driver@fluidlogix.com"
                      : "partner@logistics.com"
              }
              autoComplete="email"
              required
              className="h-10 w-full rounded-lg border border-[#1E344A] bg-[#0B1A28]/90 pl-9 pr-3 text-xs sm:text-sm text-[#E8EEF5] outline-none placeholder:text-[#4A647E] transition focus:border-[#FFA500] focus:bg-[#0D2032] focus:ring-1 focus:ring-[#FFA500]/30"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#94A9BE]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#FFA500] transition hover:text-[#FFB938] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57728D] transition group-focus-within:text-[#FFA500]">
              <Lock size={15} />
            </div>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="h-10 w-full rounded-lg border border-[#1E344A] bg-[#0B1A28]/90 pl-9 pr-10 text-xs sm:text-sm text-[#E8EEF5] outline-none placeholder:text-[#4A647E] transition focus:border-[#FFA500] focus:bg-[#0D2032] focus:ring-1 focus:ring-[#FFA500]/30"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#57728D] transition hover:text-[#E8EEF5] cursor-pointer p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-[#829BB3] hover:text-[#C5D5E6] transition">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-[#1E344A] bg-[#0B1A28] accent-[#FFA500] cursor-pointer"
            />
            <span>Keep me signed in on this device</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full h-10 rounded-lg bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-[#071522] font-semibold text-xs sm:text-sm tracking-wide transition-all duration-150 hover:from-[#FFB21D] hover:to-[#FFA500] hover:shadow-[0_0_16px_rgba(255,165,0,0.25)] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/15 disabled:opacity-75"
        >
          <span>{isSubmitting ? "Signing in..." : `Sign In as ${activeRoleObj.label}`}</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-150 group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Registration & Account Support */}
      <div className="mt-4 pt-3.5 border-t border-[#16293B] text-center text-xs text-[#637F9C]">
        <span>New to FluidLogix? </span>
        <Link
          href="/register"
          className="font-medium text-[#FFA500] transition hover:text-[#FFB938] hover:underline"
        >
          Create account
        </Link>
        <span className="mx-2 text-[#243B50]">·</span>
        <Link
          href="/verify-account"
          className="font-medium text-[#829BB3] transition hover:text-[#E8EEF5] hover:underline"
        >
          Verify account
        </Link>
      </div>
    </div>
  );
}
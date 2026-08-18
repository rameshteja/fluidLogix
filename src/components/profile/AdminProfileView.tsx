"use client";

import {
  Activity,
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe,
  HardDrive,
  History,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  MapPin,
  Moon,
  Phone,
  QrCode,
  RefreshCw,
  Save,
  Send,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Trash2,
  Truck,
  Upload,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

type ProfileTab =
  | "personal"
  | "security"
  | "permissions"
  | "notifications"
  | "audit";

interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  location: string;
  timezone: string;
  language: string;
  dateFormat: string;
  bio: string;
}

export default function AdminProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState<AdminProfileData>({
    firstName: "Suresh",
    lastName: "Teja",
    email: "admin@fluidlogix.io",
    phone: "+91 98450 11223",
    jobTitle: "Super Administrator & Head of Fleet Operations",
    department: "Executive Logistics & Financial Compliance",
    location: "Hyderabad Operations Center & MIDC Hub",
    timezone: "Asia/Kolkata (IST, GMT+5:30)",
    language: "English (India)",
    dateFormat: "DD MMM YYYY (e.g., 20 Jul 2025)",
    bio: "Super Administrator overseeing fluid logistics, chemical tanker operations, hazardous dispatch protocols, and automated billing settlements across all South India transit corridors.",
  });

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    billingAlerts: true,
    hazardousEmergency: true,
    gpsViolations: true,
    dailyReport: true,
    kycSubmissions: true,
    maintenanceReminders: true,
    emailDigest: true,
    smsCritical: true,
    whatsappDispatches: true,
  });

  // 2FA Modal / View
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile details updated successfully!");
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match");
      return;
    }
    showToast("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-[#071522] text-emerald-400 px-4 py-3 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. HERO PROFILE CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl transition-all duration-200">
        {/* Ambient background blur effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-[#FFA500]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Core Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative group shrink-0">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FFA500] via-[#FFB733] to-[#FF8C00] text-[#071522] font-black text-2xl sm:text-3xl shadow-xl shadow-orange-500/20 ring-4 ring-background">
                <span>ST</span>
              </div>
              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-background"
                title="Active Super Admin Session"
              >
                <Check size={13} className="stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFA500]/40 bg-[#FFA500]/10 px-3 py-0.5 text-xs font-bold text-[#FFA500]">
                  <ShieldCheck size={13} />
                  <span>Super Administrator</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Master Session</span>
                </span>
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                {profile.jobTitle} • {profile.department}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#FFA500]" />
                  <span className="font-mono">{profile.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#FFA500]" />
                  <span className="font-mono">{profile.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#FFA500]" />
                  <span>{profile.location.split("&")[0]}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Security Rating */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Security Rating
                </div>
                <div className="text-xs font-bold text-foreground">
                  Tier 1 Master (100%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("audit");
                  showToast("Switched to Audit History log");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                <History size={13} />
                <span>Audit Trail</span>
              </button>

              <button
                type="button"
                onClick={() => showToast("Exporting admin compliance audit statement...")}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-3.5 py-1.5 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
              >
                <Download size={13} />
                <span>Export Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Profile Metric Ribbons */}
        <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium">
              Employee ID
            </div>
            <div className="text-sm font-mono font-bold text-foreground mt-0.5">
              FLX-ADM-001
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium">
              Privilege Level
            </div>
            <div className="text-sm font-bold text-[#FFA500] mt-0.5">
              Root Full Access
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium">
              Two-Factor Auth
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              <Check size={14} className="stroke-[3]" />
              <span>TOTP Active</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium">
              Admin Since
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">
              Jan 2024 (19 Mos)
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. PROFILE TAB NAVIGATION ================= */}
      <div className="flex overflow-x-auto custom-scrollbar items-center gap-2 border-b border-border pb-3">
        {[
          { id: "personal", label: "Personal & Org", icon: <User size={14} /> },
          { id: "security", label: "Security & 2FA", icon: <Shield size={14} /> },
          {
            id: "permissions",
            label: "Role & Privileges",
            icon: <KeyRound size={14} />,
          },
          {
            id: "notifications",
            label: "Notification Hub",
            icon: <Bell size={14} />,
          },
          { id: "audit", label: "Admin Audit Log", icon: <History size={14} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FFA500] text-[#071522] shadow-md shadow-orange-500/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 3. TAB CONTENT VIEWS ================= */}

      {/* TAB 1: PERSONAL & ORGANIZATION DETAILS */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Personal Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Update your operational credentials and profile contact information
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Official Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, jobTitle: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) =>
                      setProfile({ ...profile, department: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Operating Hub & Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Administrative Scope & Notes
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500]/30 transition resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Regional & Platform Preferences */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Globe size={15} className="text-[#FFA500]" />
                <span>Regional & System Preferences</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    System Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) =>
                      setProfile({ ...profile, timezone: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  >
                    <option value="Asia/Kolkata (IST, GMT+5:30)">
                      Asia/Kolkata (IST, GMT+5:30)
                    </option>
                    <option value="Asia/Dubai (GST, GMT+4:00)">
                      Asia/Dubai (GST, GMT+4:00)
                    </option>
                    <option value="Asia/Singapore (SGT, GMT+8:00)">
                      Asia/Singapore (SGT, GMT+8:00)
                    </option>
                    <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Display Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) =>
                      setProfile({ ...profile, language: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  >
                    <option value="English (India)">English (India)</option>
                    <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                    <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                    <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Date & Timestamp Format
                  </label>
                  <select
                    value={profile.dateFormat}
                    onChange={(e) =>
                      setProfile({ ...profile, dateFormat: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  >
                    <option value="DD MMM YYYY (e.g., 20 Jul 2025)">
                      DD MMM YYYY (20 Jul 2025)
                    </option>
                    <option value="YYYY-MM-DD (2025-07-20)">
                      YYYY-MM-DD (2025-07-20)
                    </option>
                    <option value="DD/MM/YYYY (20/07/2025)">
                      DD/MM/YYYY (20/07/2025)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 size={15} className="text-[#FFA500]" />
                <span>Operating Hub Entity</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registered under FluidLogix Transport & Industrial Logistics Core
                Operations Ltd. CIN: U60200TG2023PTC174892.
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono text-[#FFA500]">
                <span>Corridor HQ: MIDC Berth 4</span>
                <span className="rounded-md bg-[#FFA500]/10 px-2 py-0.5 text-[10px] font-bold">
                  Verified Org
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & TWO-FACTOR AUTHENTICATION */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          {/* Password Management */}
          <form
            onSubmit={handleUpdatePassword}
            className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Lock size={16} className="text-[#FFA500]" />
                  <span>Change Password</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ensure password has at least 8 characters with numbers & symbols
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-9 w-full rounded-xl border border-border bg-background pl-3 pr-9 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="h-9 w-full rounded-xl border border-border bg-background pl-3 pr-9 text-xs text-foreground outline-none focus:border-[#FFA500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Password Strength:</span>
                      <span className="font-bold text-[#FFA500]">
                        {strength <= 25
                          ? "Weak"
                          : strength <= 50
                          ? "Fair"
                          : strength <= 75
                          ? "Good"
                          : "Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 25
                            ? "bg-red-500 w-1/4"
                            : strength <= 50
                            ? "bg-amber-500 w-2/4"
                            : strength <= 75
                            ? "bg-blue-500 w-3/4"
                            : "bg-emerald-500 w-full"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-9 rounded-xl bg-[#FFA500] text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
            >
              Update Password
            </button>
          </form>

          {/* Two-Factor Authentication (2FA) */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Two-Factor Authentication</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Protect super admin privileges with hardware TOTP tokens
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
                Active
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Smartphone size={15} className="text-emerald-400" />
                <span>Authenticator App (TOTP) Configured</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your Microsoft / Google Authenticator app is linked to account{" "}
                <strong className="text-foreground">admin@fluidlogix.io</strong>.
                Verification codes are required during new sign-ins.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#FFA500] hover:underline cursor-pointer"
              >
                <KeyRound size={13} />
                <span>
                  {showRecoveryCodes ? "Hide Backup Codes" : "View 8 Backup Codes"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => showToast("Re-authenticating 2FA credentials...")}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Reconfigure Key
              </button>
            </div>

            {showRecoveryCodes && (
              <div className="rounded-2xl border border-border bg-muted/40 p-3 space-y-2 text-xs animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-foreground block">
                  Emergency Recovery Codes (Single Use):
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <span className="bg-background p-1 rounded border border-border">
                    8492-9102-1102
                  </span>
                  <span className="bg-background p-1 rounded border border-border">
                    3391-4820-9941
                  </span>
                  <span className="bg-background p-1 rounded border border-border">
                    1092-4829-5510
                  </span>
                  <span className="bg-background p-1 rounded border border-border">
                    7729-1029-3810
                  </span>
                </div>
              </div>
            )}

            {/* Active Sessions List */}
            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Active Logged-In Sessions:
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-2.5">
                    <Laptop size={15} className="text-emerald-400" />
                    <div>
                      <div className="font-semibold text-foreground">
                        Windows 11 PC • Chrome 127
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Hyderabad, IN • 182.72.102.44 • Current Session
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">
                    Active Now
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={15} className="text-[#FFA500]" />
                    <div>
                      <div className="font-semibold text-foreground">
                        iPhone 15 Pro • FluidLogix App
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Visakhapatnam, IN • 49.204.12.8 • 2h ago
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Terminated mobile session")}
                    className="text-[10px] font-semibold text-red-400 hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE & PERMISSION MATRIX */}
      {activeTab === "permissions" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <KeyRound size={16} className="text-[#FFA500]" />
                <span>Super Administrator Privilege Matrix</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                All administrative capabilities assigned to Tier 1 Root Operators
              </p>
            </div>
            <span className="rounded-full bg-[#FFA500]/15 border border-[#FFA500]/30 px-3 py-1 text-xs font-bold text-[#FFA500]">
              Full Privileges Granted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Fleet & Tanker Governance",
                desc: "Authorize new tankers, assign drivers, approve inspections & update maintenance statuses.",
                level: "Full Master Access",
                icon: <Truck size={18} className="text-[#FFA500]" />,
              },
              {
                title: "Hazardous Cargo & Dispatches",
                desc: "Verify tonnage dispatches, release electronic seals & authorize chemical corridor transit.",
                level: "Signatory Authority",
                icon: <Zap size={18} className="text-red-400" />,
              },
              {
                title: "Monthly Billing & Direct Settlements",
                desc: "Generate monthly statements, initiate direct bank payouts & verify transaction receipts.",
                level: "Financial Signatory",
                icon: <CreditCard size={18} className="text-emerald-400" />,
              },
              {
                title: "User & Transporter Provisioning",
                desc: "Manage drivers, transporter KYC documents, company registrations & suspend accounts.",
                level: "User Admin",
                icon: <Users size={18} className="text-cyan-400" />,
              },
              {
                title: "Compliance & Audit Trail Export",
                desc: "Access historical trip logs, download audited CSV/PDF tax statements & inspection reports.",
                level: "Compliance Root",
                icon: <Activity size={18} className="text-purple-400" />,
              },
              {
                title: "API Keys & Webhook Gateway",
                desc: "Generate secure REST API tokens, manage GPS tracker webhooks & telemetry endpoints.",
                level: "DevOps Master",
                icon: <Server size={18} className="text-amber-400" />,
              },
            ].map((perm) => (
              <div
                key={perm.title}
                className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2 hover:border-[#FFA500]/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-background border border-border shadow-sm">
                    {perm.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <Check size={11} className="stroke-[3]" />
                    <span>{perm.level}</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  {perm.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {perm.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATION & ALERT HUB */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Bell size={16} className="text-[#FFA500]" />
                <span>Notification & Alert Preferences</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Control which operational events trigger real-time push, SMS, or email alerts
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Notification preferences updated")}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-1.5 text-xs font-bold text-[#071522] hover:bg-[#FFB733] transition cursor-pointer"
            >
              <Save size={13} />
              <span>Save Preferences</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "billingAlerts" as const,
                title: "Overdue & Pending Billing Settlements",
                desc: "Receive immediate notifications when statement payouts approach payment due dates.",
              },
              {
                key: "hazardousEmergency" as const,
                title: "Hazardous Chemical Transit Alerts",
                desc: "High priority alerts if hazardous cargo encounters transit delay or pressure anomalies.",
              },
              {
                key: "gpsViolations" as const,
                title: "Tanker Speed & Route Geo-fence Violations",
                desc: "Instant notification when tankers deviate from designated industrial corridors.",
              },
              {
                key: "dailyReport" as const,
                title: "Daily Operations Summary Digest (08:00 AM)",
                desc: "Automated morning summary of daily dispatches, tonnages, and completed trips.",
              },
              {
                key: "kycSubmissions" as const,
                title: "New Transporter / Driver Registrations",
                desc: "Alerts when new fleet owners or drivers submit documents for verification.",
              },
              {
                key: "maintenanceReminders" as const,
                title: "Vehicle Fitness & PUC Expiration Warnings",
                desc: "Advance reminder 15 days prior to tanker insurance or safety certificate expiry.",
              },
            ].map((item) => {
              const isChecked = notifications[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      [item.key]: !isChecked,
                    })
                  }
                  className={`flex items-start justify-between p-4 rounded-2xl border transition cursor-pointer select-none ${
                    isChecked
                      ? "border-[#FFA500]/40 bg-[#FFA500]/5"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="pr-4 space-y-1">
                    <div className="text-xs font-bold text-foreground">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`h-5 w-9 shrink-0 rounded-full transition-colors relative ${
                      isChecked ? "bg-[#FFA500]" : "bg-muted border border-border"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-background shadow-md transition-transform absolute top-0.5 ${
                        isChecked ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN AUDIT LOG & HISTORY */}
      {activeTab === "audit" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <History size={16} className="text-[#FFA500]" />
                <span>Super Admin Audit Log & Trail</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Immutable chronological log of sensitive administrative actions and settlements
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Audit log CSV exported")}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              <Download size={13} />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                action: "Authorized Billing Settlement",
                detail:
                  "Marked invoice INV-2025-07-002 as Paid (₹1,12,400) for TK-002 (Prakash Reddy) via Direct Transfer.",
                time: "20 Jul 2025 • 05:45 PM",
                ip: "182.72.102.44",
                badge: "Financial",
                badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
              },
              {
                action: "Assigned Fleet Driver",
                detail:
                  "Assigned verified driver Suresh Mohan to Chemical Tanker TK-001 (Visakhapatnam Corridor).",
                time: "20 Jul 2025 • 02:15 PM",
                ip: "182.72.102.44",
                badge: "Fleet Dispatch",
                badgeColor: "bg-[#FFA500]/15 text-[#FFA500] border-[#FFA500]/30",
              },
              {
                action: "Generated Monthly Statements",
                detail:
                  "Batch generated July 2025 monthly statements for 5 fleet owner accounts totaling ₹5,86,800.",
                time: "20 Jul 2025 • 09:30 AM",
                ip: "182.72.102.44",
                badge: "Billing",
                badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
              },
              {
                action: "Hazardous Cargo Clearance",
                detail:
                  "Approved Class 8 Sulphuric Acid transit permit for ChemCorp Ltd from Visakhapatnam Port.",
                time: "19 Jul 2025 • 06:30 AM",
                ip: "182.72.102.44",
                badge: "Hazardous",
                badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
              },
              {
                action: "Updated Transporter KYC",
                detail:
                  "Approved verified KYC status and bank details for Fleet Owner Kishore Patel (SBI Account).",
                time: "18 Jul 2025 • 04:10 PM",
                ip: "182.72.102.44",
                badge: "KYC Compliance",
                badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
              },
            ].map((log, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-muted/15 hover:bg-muted/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {log.action}
                    </span>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider ${log.badgeColor}`}
                    >
                      {log.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {log.detail}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 text-[11px] text-muted-foreground font-mono">
                  <div>{log.time}</div>
                  <div className="text-[10px] text-muted-foreground/70">
                    IP: {log.ip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

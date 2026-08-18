"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Copy,
  CreditCard,
  Database,
  Download,
  Eye,
  EyeOff,
  Flame,
  Globe,
  HardDrive,
  History,
  Key,
  KeyRound,
  Laptop,
  Layers,
  LayoutGrid,
  Lock,
  Moon,
  Paintbrush,
  Palette,
  Phone,
  Power,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Scale,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tablet,
  Terminal,
  Trash2,
  Truck,
  Upload,
  User,
  Users,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";

type SettingsTab =
  | "appearance"
  | "dispatch"
  | "hazardous"
  | "billing"
  | "telematics"
  | "api";

export default function PortalPreferencesView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: "system", // "dark" | "light" | "system"
    accentColor: "orange", // "orange" | "cyan" | "emerald" | "purple"
    density: "comfortable", // "comfortable" | "compact" | "spacious"
    defaultLanding: "overview", // "overview" | "load-logs" | "fleet" | "billing"
    defaultPageSize: "10",
    refreshInterval: "30",
    animations: true,
    glassmorphism: true,
  });

  // 2. Dispatch Automation Settings
  const [dispatch, setDispatch] = useState({
    autoSealGenerator: true,
    overloadToleranceKg: 500,
    highwaySpeedLimit: 60,
    midcSpeedLimit: 35,
    maxContinuousHours: 4.5,
    autoGeofenceArrival: true,
    requireDriverSignature: true,
    escortForHazmat: true,
  });

  // 3. Hazardous & Safety Compliance Settings
  const [hazardous, setHazardous] = useState({
    class8AcidsStrict: true,
    class2GasEscort: true,
    class9EffluentTesting: true,
    mandatoryPreTripChecklist: true,
    pucExpiryWarningDays: 15,
    insuranceExpiryWarningDays: 30,
    emergencyHotline: "+91 1800 425 9900",
    autoPollutionBoardSync: true,
  });

  // 4. Billing & Financial Rules
  const [billing, setBilling] = useState({
    localTripBaseRate: 2300,
    nonLocalPerKmRate: 42,
    billingCycleDay: "1st of Month",
    paymentDueDays: 15,
    tdsDeductionPercent: 1.0,
    autoGenerateStatements: true,
    defaultBankGateway: "HDFC Corporate Direct Portal",
    notifyOwnerOnPayout: true,
  });

  // 5. Telematics & IoT Settings
  const [telematics, setTelematics] = useState({
    provider: "FluidLogix IoT Core Engine (v4.2)",
    transitPingSeconds: 10,
    idlePingSeconds: 60,
    kalmanDriftFilter: true,
    geofenceRadiusMeters: 500,
    ingressEndpoint: "https://api.fluidlogix.io/v1/telemetry/ingress",
  });

  // 6. API Keys & Webhooks
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Portal preferences saved and applied globally!");
    }, 600);
  };

  const handleResetDefaults = () => {
    showToast("Preferences reset to platform defaults.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-[#FFA500]/50 bg-[#071522] text-[#FFA500] px-4 py-3 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-[#FFA500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. HERO HEADER CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl transition-all duration-200">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#FFA500]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                <Sliders size={18} className="stroke-[2.5]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Portal Preferences & System Rules
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>v2.4.0 Live Enterprise</span>
              </span>
            </div>

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Configure system display themes, automated tanker dispatch rules, hazardous material safety tolerances, billing rate policies, telematics IoT ingress, and developer API credentials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-4 py-2 text-xs font-bold text-[#071522] shadow-md shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
            >
              <Save size={13} />
              <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </div>

        {/* Global Cluster Stats Banner */}
        <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <Server size={13} className="text-[#FFA500]" />
              <span>Cluster Region</span>
            </div>
            <div className="text-xs font-bold text-foreground mt-1">
              ap-south-1 (Mumbai Primary)
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <Radio size={13} className="text-emerald-400" />
              <span>IoT Telematics Ingress</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Operational (99.98%)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-cyan-400" />
              <span>Automated Statement Run</span>
            </div>
            <div className="text-xs font-bold text-foreground mt-1">
              1st of Month (00:00 IST)
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-purple-400" />
              <span>Hazmat UN Protocols</span>
            </div>
            <div className="text-xs font-bold text-foreground mt-1">
              Class 2, 8, 9 Enforced
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TABBED CATEGORY NAVIGATION ================= */}
      <div className="flex overflow-x-auto custom-scrollbar items-center gap-2 border-b border-border pb-3">
        {[
          {
            id: "appearance",
            label: "Appearance & UI",
            icon: <Palette size={14} />,
          },
          {
            id: "dispatch",
            label: "Dispatch Automation",
            icon: <Truck size={14} />,
          },
          {
            id: "hazardous",
            label: "Hazmat & Safety",
            icon: <Flame size={14} />,
          },
          {
            id: "billing",
            label: "Billing & Rates",
            icon: <CreditCard size={14} />,
          },
          {
            id: "telematics",
            label: "Telematics & IoT",
            icon: <Radio size={14} />,
          },
          {
            id: "api",
            label: "API Keys & Webhooks",
            icon: <Code size={14} />,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
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

      {/* ================= 3. TAB VIEWS ================= */}

      {/* TAB 1: APPEARANCE & UI */}
      {activeTab === "appearance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Paintbrush size={16} className="text-[#FFA500]" />
              <span>Theme & Interface Styling</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-2">
                  Color Mode Preference
                </label>
                <div className="flex items-center gap-3">
                  <ThemeToggle align="left" />
                  <span className="text-muted-foreground text-[11px]">
                    Toggle between Obsidian Dark, Crisp Light, or Auto System Sync.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-2">
                  Table Display Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "comfortable", label: "Comfortable", desc: "Spacious rows" },
                    { id: "compact", label: "Compact", desc: "High density" },
                    { id: "spacious", label: "Spacious", desc: "Card preview" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setAppearance({ ...appearance, density: d.id })
                      }
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        appearance.density === d.id
                          ? "border-[#FFA500] bg-[#FFA500]/10 text-foreground"
                          : "border-border bg-muted/20 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-bold text-xs">{d.label}</div>
                      <div className="text-[10px] text-muted-foreground">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Default Landing Page on Login
                </label>
                <select
                  value={appearance.defaultLanding}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      defaultLanding: e.target.value,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="overview">Dashboard Overview</option>
                  <option value="load-logs">Daily Load Logs</option>
                  <option value="fleet">Fleet Management</option>
                  <option value="billing">Monthly Billing</option>
                  <option value="users">Users & Transporters</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Default Table Page Size
                </label>
                <select
                  value={appearance.defaultPageSize}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      defaultPageSize: e.target.value,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="6">6 records per page</option>
                  <option value="10">10 records per page (Recommended)</option>
                  <option value="25">25 records per page</option>
                  <option value="50">50 records per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visual Effects & Performance */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Sparkles size={16} className="text-[#FFA500]" />
              <span>Animations & Performance</span>
            </h3>

            <div className="space-y-3.5">
              {[
                {
                  key: "animations" as const,
                  title: "Smooth Micro-Animations",
                  desc: "Enable subtle hover, fade, and zoom transitions across dashboard tables and modal dialogs.",
                },
                {
                  key: "glassmorphism" as const,
                  title: "Glassmorphic Blur Overlays",
                  desc: "Render frosted backdrop blurs on top navigation, popovers, and filter drawers.",
                },
              ].map((item) => {
                const isChecked = appearance[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() =>
                      setAppearance({
                        ...appearance,
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

              <div className="p-4 rounded-2xl border border-border bg-muted/20 text-xs space-y-2">
                <span className="font-bold text-foreground block">
                  Automatic Data Polling Interval
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Interval for refreshing load logs & billing calculations automatically in background.
                </p>
                <select
                  value={appearance.refreshInterval}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      refreshInterval: e.target.value,
                    })
                  }
                  className="h-8.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="15">Every 15 Seconds (Real-Time Transit)</option>
                  <option value="30">Every 30 Seconds (Balanced)</option>
                  <option value="60">Every 60 Seconds (Low Network)</option>
                  <option value="0">Manual Refresh Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH & OPERATIONS AUTOMATION */}
      {activeTab === "dispatch" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Truck size={16} className="text-[#FFA500]" />
              <span>Automated Dispatch Rules</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Highway Speed Limit (km/h)
                  </label>
                  <input
                    type="number"
                    value={dispatch.highwaySpeedLimit}
                    onChange={(e) =>
                      setDispatch({
                        ...dispatch,
                        highwaySpeedLimit: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    MIDC / Port Limit (km/h)
                  </label>
                  <input
                    type="number"
                    value={dispatch.midcSpeedLimit}
                    onChange={(e) =>
                      setDispatch({
                        ...dispatch,
                        midcSpeedLimit: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Overload Weight Tolerance Buffer (kg)
                </label>
                <input
                  type="number"
                  value={dispatch.overloadToleranceKg}
                  onChange={(e) =>
                    setDispatch({
                      ...dispatch,
                      overloadToleranceKg: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Dispatches exceeding tanker capacity + buffer will trigger safety review flag.
                </span>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Max Continuous Driving Hours (Rest Protocol)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={dispatch.maxContinuousHours}
                  onChange={(e) =>
                    setDispatch({
                      ...dispatch,
                      maxContinuousHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Electronic Seal & Arrival Rules</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: "autoSealGenerator" as const,
                  title: "Auto-Generate Digital Seal No (SL-XXXX)",
                  desc: "Automatically assign cryptographically unique seal numbers upon dispatch creation.",
                },
                {
                  key: "autoGeofenceArrival" as const,
                  title: "Auto-Trigger Arrival on Geo-fence Entry",
                  desc: "Automatically prompt driver & hub manager when vehicle enters destination CETP / plant perimeter.",
                },
                {
                  key: "requireDriverSignature" as const,
                  title: "Require Digital Driver Delivery Sign-off",
                  desc: "Mandate driver biometric / PIN verification before changing load status to Completed.",
                },
                {
                  key: "escortForHazmat" as const,
                  title: "Flag Escort Requirement for Class 2.3 Cargo",
                  desc: "Enforce escort vehicle tracking for pressurized gas canisters and high-toxicity routes.",
                },
              ].map((item) => {
                const isChecked = dispatch[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() =>
                      setDispatch({
                        ...dispatch,
                        [item.key]: !isChecked,
                      })
                    }
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                      isChecked
                        ? "border-[#FFA500]/40 bg-[#FFA500]/5"
                        : "border-border bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="pr-4 space-y-0.5">
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
        </div>
      )}

      {/* TAB 3: HAZARDOUS & SAFETY COMPLIANCE */}
      {activeTab === "hazardous" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Flame size={16} className="text-red-400" />
              <span>Hazardous Cargo UN Protocol Rules</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: "class8AcidsStrict" as const,
                  title: "Class 8 — Corrosive Acids Protocol (Sulphuric Acid)",
                  desc: "Enforce specialized lining inspection and secondary spill tray verification for all TK-001/008 dispatches.",
                },
                {
                  key: "class2GasEscort" as const,
                  title: "Class 2.3 — Toxic Compressed Gas (Chlorine)",
                  desc: "Mandate real-time pressure sensor telemetry pinging every 10 seconds during transit.",
                },
                {
                  key: "class9EffluentTesting" as const,
                  title: "Class 9 — Industrial Waste Water Neutralization",
                  desc: "Require pre-discharge pH certificate upload before unloading at CETP plants.",
                },
                {
                  key: "mandatoryPreTripChecklist" as const,
                  title: "Mandatory Digital Safety Pre-Trip Audit",
                  desc: "Block dispatch generation unless emergency spill kit, PPE suit, and extinguisher are marked checked.",
                },
              ].map((item) => {
                const isChecked = hazardous[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() =>
                      setHazardous({
                        ...hazardous,
                        [item.key]: !isChecked,
                      })
                    }
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                      isChecked
                        ? "border-red-500/40 bg-red-500/5"
                        : "border-border bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="pr-4 space-y-0.5">
                      <div className="text-xs font-bold text-foreground">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div
                      className={`h-5 w-9 shrink-0 rounded-full transition-colors relative ${
                        isChecked ? "bg-red-500" : "bg-muted border border-border"
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

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShieldAlert size={16} className="text-[#FFA500]" />
              <span>Inspection & Expiration Thresholds</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  PUC Pollution Certificate Expiration Warning (Days)
                </label>
                <input
                  type="number"
                  value={hazardous.pucExpiryWarningDays}
                  onChange={(e) =>
                    setHazardous({
                      ...hazardous,
                      pucExpiryWarningDays: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Insurance Policy Expiration Warning (Days)
                </label>
                <input
                  type="number"
                  value={hazardous.insuranceExpiryWarningDays}
                  onChange={(e) =>
                    setHazardous({
                      ...hazardous,
                      insuranceExpiryWarningDays:
                        parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Emergency Response Team (ERT) 24/7 Hotline
                </label>
                <input
                  type="text"
                  value={hazardous.emergencyHotline}
                  onChange={(e) =>
                    setHazardous({
                      ...hazardous,
                      emergencyHotline: e.target.value,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
              </div>

              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>State Pollution Control Board Sync (APPCB/TSPCB)</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hazardous manifestation logs are cryptographically hashed and synced daily to environmental regulatory portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & FINANCIAL RULES */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Scale size={16} className="text-emerald-400" />
              <span>Base Freight Rate Calculator</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Local Dispatch Flat Rate (Up to 25 km)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#FFA500]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={billing.localTripBaseRate}
                    onChange={(e) =>
                      setBilling({
                        ...billing,
                        localTripBaseRate: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Non-Local Long-Haul Freight Rate (per Ton-km)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#FFA500]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={billing.nonLocalPerKmRate}
                    onChange={(e) =>
                      setBilling({
                        ...billing,
                        nonLocalPerKmRate: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  TDS Deduction Rate on Transporter Payouts (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={billing.tdsDeductionPercent}
                    onChange={(e) =>
                      setBilling({
                        ...billing,
                        tdsDeductionPercent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Standard 1.0% deduction under Section 194C of the Income Tax Act.
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <CreditCard size={16} className="text-[#FFA500]" />
              <span>Statement Cycles & Payment Rules</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Automated Statement Generation Run
                </label>
                <select
                  value={billing.billingCycleDay}
                  onChange={(e) =>
                    setBilling({ ...billing, billingCycleDay: e.target.value })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="1st of Month">1st of Every Month (00:00 IST)</option>
                  <option value="15th of Month">15th of Every Month</option>
                  <option value="20th of Month">20th of Every Month (Current Cycle)</option>
                  <option value="End of Month">Last Calendar Day of Month</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Payment Due Grace Period (Days)
                </label>
                <input
                  type="number"
                  value={billing.paymentDueDays}
                  onChange={(e) =>
                    setBilling({
                      ...billing,
                      paymentDueDays: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Default Corporate Banking Payout Gateway
                </label>
                <select
                  value={billing.defaultBankGateway}
                  onChange={(e) =>
                    setBilling({
                      ...billing,
                      defaultBankGateway: e.target.value,
                    })
                  }
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                >
                  <option value="HDFC Corporate Direct Portal">
                    HDFC Bank Corporate Portal (Direct NEFT/RTGS)
                  </option>
                  <option value="ICICI E-Banking Gateway">
                    ICICI Corporate Direct Transfer
                  </option>
                  <option value="SBI Global Corporate Gateway">
                    State Bank of India Corporate Portal
                  </option>
                  <option value="Axis Bank Direct Payouts">
                    Axis Bank E-Treasury Gateway
                  </option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-foreground">
                    SMS / WhatsApp Payment Notification
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Send instant transaction receipt to fleet owner mobile.
                  </div>
                </div>
                <div
                  onClick={() =>
                    setBilling({
                      ...billing,
                      notifyOwnerOnPayout: !billing.notifyOwnerOnPayout,
                    })
                  }
                  className={`h-5 w-9 shrink-0 rounded-full transition-colors relative cursor-pointer ${
                    billing.notifyOwnerOnPayout
                      ? "bg-[#FFA500]"
                      : "bg-muted border border-border"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-background shadow-md transition-transform absolute top-0.5 ${
                      billing.notifyOwnerOnPayout
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELEMATICS & IOT GATEWAY */}
      {activeTab === "telematics" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Radio size={16} className="text-[#FFA500]" />
                <span>IoT Telematics Ingress Gateway Configuration</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                High-throughput telemetry ingestion parameters for tanker GPS and pressure sensors
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
              Gateway Online (Port 8443)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                In-Transit GPS Refresh Interval (Seconds)
              </label>
              <input
                type="number"
                value={telematics.transitPingSeconds}
                onChange={(e) =>
                  setTelematics({
                    ...telematics,
                    transitPingSeconds: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Idle / Parked Refresh Interval (Seconds)
              </label>
              <input
                type="number"
                value={telematics.idlePingSeconds}
                onChange={(e) =>
                  setTelematics({
                    ...telematics,
                    idlePingSeconds: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Port / MIDC Terminal Geo-fence Buffer (Meters)
              </label>
              <input
                type="number"
                value={telematics.geofenceRadiusMeters}
                onChange={(e) =>
                  setTelematics({
                    ...telematics,
                    geofenceRadiusMeters: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500]"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Primary Telemetry Engine
              </label>
              <input
                type="text"
                disabled
                value={telematics.provider}
                className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground font-mono opacity-80"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-muted-foreground font-semibold mb-1">
                Public Telemetry Ingress Webhook Endpoint
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={telematics.ingressEndpoint}
                  className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(telematics.ingressEndpoint, "Ingress URL")
                  }
                  className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
                >
                  {copiedField === "Ingress URL" ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: API KEYS & WEBHOOKS */}
      {activeTab === "api" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Key size={16} className="text-[#FFA500]" />
                <span>REST API Credentials & Webhook Tokens</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Authenticate ERP integrations, customs clearing portals & GPS trackers
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Generated new API token pair")}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFA500] px-3.5 py-1.5 text-xs font-bold text-[#071522] hover:bg-[#FFB733] transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Generate Key</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Live Production API Key */}
            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Production Live API Key (v1)</span>
                </div>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type={apiKeyVisible ? "text" : "password"}
                  readOnly
                  value="flx_live_9a8f4c2198004e28bf812a3901"
                  className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                >
                  {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      "flx_live_9a8f4c2198004e28bf812a3901",
                      "Production API Key"
                    )
                  }
                  className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
                >
                  {copiedField === "Production API Key" ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Sandbox API Key */}
            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Sandbox / Testing Environment Key</span>
                </div>
                <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400 font-mono">
                  SANDBOX
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="flx_test_418bc291aa892019c0018d9904"
                  className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      "flx_test_418bc291aa892019c0018d9904",
                      "Sandbox API Key"
                    )
                  }
                  className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
                >
                  {copiedField === "Sandbox API Key" ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Lock size={14} className="text-[#FFA500]" />
                  <span>Webhook Signing Secret (HMAC-SHA256)</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  whsec_••••••••••••••
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="whsec_994101829abc90019284810294"
                  className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      "whsec_994101829abc90019284810294",
                      "Webhook Signing Secret"
                    )
                  }
                  className="flex items-center gap-1.5 h-9 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-[#FFA500] transition cursor-pointer"
                >
                  {copiedField === "Webhook Signing Secret" ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

"use client";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FileUploadDropzone, {
  UploadedDocInfo,
} from "@/components/common/FileUploadDropzone";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Fleet Owner Onboarding",
  "Company Enterprise Contract",
  "Billing & Settlement Query",
  "GPS & IoT Sensor Integration",
  "Driver Verification & Compliance",
  "Emergency Roadside & Spill Response",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [inquiryType, setInquiryType] = useState("General Inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<UploadedDocInfo | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(`TKT-FL-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-[#FFA500] transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-xs font-bold font-mono mb-3">
            <Sparkles size={13} />
            <span>24/7 TANKER DISPATCH & SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Get in Touch with <span className="text-[#FFA500]">FluidLogix</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Have questions about fleet integration, live dispatch tracking, owner settlements, or hazmat chemical transport? Our specialized logistics team is here to help.
          </p>
        </div>

        {/* Quick Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: Helpline */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:border-[#FFA500]/40 transition shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#FFA500]/15 text-[#FFA500] flex items-center justify-center mb-3">
              <Phone size={20} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Toll-Free Support</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Instant 24x7 helpline for drivers & dispatch
            </p>
            <a
              href="tel:18002093584"
              className="text-xs font-mono font-bold text-[#FFA500] hover:underline"
            >
              1800-209-FLUID (35843)
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:border-[#FFA500]/40 transition shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
              <Mail size={20} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Email Inquiries</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Response within 15 minutes guaranteed
            </p>
            <a
              href="mailto:support@fluidlogix.io"
              className="text-xs font-mono font-bold text-foreground hover:text-[#FFA500] transition"
            >
              support@fluidlogix.io
            </a>
          </div>

          {/* Card 3: HQ Location */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:border-[#FFA500]/40 transition shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3">
              <Building2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Corporate HQ</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Cyber Gateway, HITEC City
            </p>
            <span className="text-xs text-foreground font-medium">
              Hyderabad, TS 500081
            </span>
          </div>

          {/* Card 4: Operations Hub */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:border-[#FFA500]/40 transition shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
              <Truck size={20} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Operations Control</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Trans-Harbour Chemical Corridor
            </p>
            <span className="text-xs text-foreground font-medium">
              Navi Mumbai, MH 400705
            </span>
          </div>
        </div>

        {/* Main Content: Form & Live Support Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Interactive Contact Form */}
          <div className="lg:col-span-8">
            {isSubmitted ? (
              <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6">
                  <CheckCircle2 size={36} />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-xs font-bold font-mono mb-4">
                  <Sparkles size={13} />
                  <span>INQUIRY TICKET CREATED</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                  Thank You, {name}!
                </h2>

                <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
                  Your message has been assigned to our logistics specialist team. You will receive an update at <strong className="text-foreground">{email}</strong> within 15 minutes.
                </p>

                <div className="inline-block bg-muted/40 border border-border px-5 py-2.5 rounded-2xl font-mono text-base font-extrabold text-[#FFA500] mb-8">
                  {ticketId}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage("");
                      setSubject("");
                    }}
                    className="w-full sm:w-auto rounded-xl bg-[#FFA500] px-6 py-2.5 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <Link
                    href="/"
                    className="w-full sm:w-auto rounded-xl border border-border bg-background px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl">
                <div className="border-b border-border pb-5 mb-6">
                  <h2 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#FFA500]" />
                    <span>Send Us a Direct Message</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill out the details below and an authorized FluidLogix operations officer will contact you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Mahindra"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. anand@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98451 22310"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono outline-none focus:border-[#FFA500] transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Company / Fleet Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Premier Chemical Logistics"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      />
                    </div>
                  </div>

                  {/* Row 3: Inquiry Category & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Inquiry Category *
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bulk tanker dispatch rate contract"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                      />
                    </div>
                  </div>

                  {/* Row 4: Detailed Message */}
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Detailed Message / Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please share details regarding required tanker count, pickup hub, chemical material type, or integration query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition resize-none"
                    ></textarea>
                  </div>

                  {/* Row 5: Document / Screenshot Attachment */}
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Attach Document / Invoice / Material Spec (Optional)
                    </label>
                    <FileUploadDropzone
                      label="Upload Attachment"
                      hint="PDF, JPG, PNG (up to 10MB)"
                      value={attachment}
                      onChange={(file) => setAttachment(file)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span>Confidential & secure transmission • 15 min SLA</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-8 py-3 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
                    >
                      <Send size={15} />
                      <span>{isSubmitting ? "Sending Message..." : "Submit Inquiry"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right: Operational FAQs & Fast Action Links */}
          <div className="lg:col-span-4 space-y-5 text-xs">
            {/* Quick Registration Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Truck size={16} className="text-[#FFA500]" />
                <span>Looking to Register?</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-xs">
                Submit an instant registration request to onboard your fleet or company without waiting for an inquiry callback.
              </p>

              <div className="space-y-2.5 pt-1">
                <Link
                  href="/register/owner"
                  className="flex items-center justify-between w-full p-3 rounded-xl border border-[#FFA500]/40 bg-[#FFA500]/10 hover:bg-[#FFA500]/20 font-bold text-[#FFA500] transition"
                >
                  <span>Fleet Owner Registration</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/register/company"
                  className="flex items-center justify-between w-full p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted font-bold text-foreground transition"
                >
                  <span>Company Facility Registration</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Operational Commitment Box */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                <span>Our Response Commitments</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">15-Minute Response Time</strong>
                    <span className="text-muted-foreground">For all live load dispatch and active route inquiries.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">24/7 Hazmat Protocol</strong>
                    <span className="text-muted-foreground">Dedicated response desk for chemical load traceability.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">Direct Settlement Desk</strong>
                    <span className="text-muted-foreground">Fast owner payment reconciliations & 194C TDS support.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

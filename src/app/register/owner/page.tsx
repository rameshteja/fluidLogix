"use client";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Droplets,
  FileCheck,
  Phone,
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const OWNER_ADDRESS_PROOFS = [
  "Aadhaar Card",
  "Passport",
  "Electricity Bill",
  "Rental Agreement",
  "Property Tax Receipt",
];

export default function OwnerRegistrationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [fleetSize, setFleetSize] = useState<number>(2);
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [addressProofType, setAddressProofType] = useState("Aadhaar Card");
  const [addressProofFile, setAddressProofFile] = useState<UploadedDocInfo | null>(null);
  const [panFile, setPanFile] = useState<UploadedDocInfo | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setRequestId(`REQ-OWN-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
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

        {isSubmitted ? (
          /* Success Screen */
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6">
              <CheckCircle2 size={36} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#FFA500] text-xs font-bold font-mono mb-4">
              <Sparkles size={13} />
              <span>REQUEST SUBMITTED SUCCESSFULLY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Fleet Owner Registration Request Received!
            </h1>

            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
              Thank you, <strong className="text-foreground">{name}</strong>. Your partner registration request and KYC documents have been securely logged under reference ID:
            </p>

            <div className="inline-block bg-muted/40 border border-border px-5 py-2.5 rounded-2xl font-mono text-base font-extrabold text-[#FFA500] mb-8">
              {requestId}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left text-xs bg-muted/20 border border-border/60 p-4 rounded-2xl mb-8">
              <div>
                <span className="text-muted-foreground block mb-0.5">Applicant</span>
                <span className="font-bold text-foreground">{name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Fleet Size</span>
                <span className="font-bold text-foreground font-mono">{fleetSize} Tankers</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Verification</span>
                <span className="font-bold text-amber-400">Under Review</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto rounded-xl bg-[#FFA500] px-6 py-2.5 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition"
              >
                Return to Home
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl border border-border bg-background px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Access Portal Login
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl">
            {/* Header Title */}
            <div className="border-b border-border pb-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#FF8C00] text-[#071522] shadow-md shadow-orange-500/20">
                  <Truck size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    New Fleet Owner Registration Request
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Partner with FluidLogix network to monetize chemical & water tanker fleets with automated load dispatch and weekly settlements.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Section 1: Personal & Fleet Identity */}
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-3 text-muted-foreground uppercase tracking-wider">
                  <User size={14} className="text-[#FFA500]" />
                  <span>1. Fleet Owner Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Naidu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Mobile Number (WhatsApp Enabled) *
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
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh.naidu@transports.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Transport Agency / Firm Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Naidu Chemical Roadways"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Fleet & Tax Details */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-3 text-muted-foreground uppercase tracking-wider">
                  <CreditCard size={14} className="text-[#FFA500]" />
                  <span>2. Tax & Fleet Capacity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Transporter PAN Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. AAAPL1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 36AAAPL1234F1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground font-mono uppercase outline-none focus:border-[#FFA500] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      No. of Tankers in Fleet *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={fleetSize}
                      onChange={(e) => setFleetSize(parseInt(e.target.value) || 1)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: KYC Document Uploads */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-3 text-muted-foreground uppercase tracking-wider">
                  <FileCheck size={14} className="text-[#FFA500]" />
                  <span>3. KYC Document Verification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">
                        Select Address Proof Type *
                      </label>
                      <select
                        value={addressProofType}
                        onChange={(e) => setAddressProofType(e.target.value)}
                        className="h-8.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#FFA500]"
                      >
                        {OWNER_ADDRESS_PROOFS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FileUploadDropzone
                      label={`Upload ${addressProofType}`}
                      hint="Aadhaar, Utility Bill, or Lease (PDF/JPG)"
                      value={addressProofFile}
                      onChange={(file) => setAddressProofFile(file)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Upload PAN Card Scanned Document *
                    </label>
                    <FileUploadDropzone
                      label="Upload PAN Card Document"
                      hint="Clear photo or scanned PDF of PAN"
                      value={panFile}
                      onChange={(file) => setPanFile(file)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Encrypted submission • Direct compliance review within 24 hours</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-8 py-3 text-xs font-bold text-[#071522] shadow-lg shadow-orange-500/20 hover:bg-[#FFB733] transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  <span>{isSubmitting ? "Submitting Request..." : "Submit Owner Registration Request"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

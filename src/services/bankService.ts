import {
  BankFilterParams,
  BankStats,
  OwnerBankFormData,
  OwnerBankItem,
} from "@/types/bank";

export const INITIAL_OWNER_BANKS: OwnerBankItem[] = [
  {
    id: "OBNK-001",
    ownerName: "Ravi Kumar",
    ownerPhone: "+91 98451 22310",
    panNumber: "AAAPL1234F",
    assignedTankers: ["TK-001", "TK-008"],
    bankName: "HDFC Bank",
    accountHolder: "Ravi Kumar Logistics & Fleet Transport",
    accountNumber: "50200084920194",
    maskedAccountNumber: "•••• •••• 0194",
    accountType: "Proprietorship Current",
    ifscCode: "HDFC0001234",
    branchName: "Visakhapatnam Port Commercial Branch",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "ravikumar.fleet@okhdfcbank",
    monthlySettlementAmt: 277400,
    monthlySettlementDisplay: "₹2,77,400",
    totalSettledYTD: 2480000,
    totalSettledYTDDisplay: "₹24,80,000",
    lastSettlementDate: "21 Jul 2025",
    lastTxnRef: "NEFT-IN8829104",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "amber",
    createdDate: "15 Jan 2024",
    notes: "Primary account for TK-001 & TK-008 chemical long-haul freight settlements.",
  },
  {
    id: "OBNK-002",
    ownerName: "Prakash Reddy",
    ownerPhone: "+91 97120 44589",
    panNumber: "BCDEF5678G",
    assignedTankers: ["TK-002", "TK-011"],
    bankName: "ICICI Bank",
    accountHolder: "Prakash Reddy Transport Enterprise",
    accountNumber: "000405019284",
    maskedAccountNumber: "•••• •••• 9284",
    accountType: "Current Account",
    ifscCode: "ICIC0005678",
    branchName: "Banjara Hills Road No. 12",
    city: "Hyderabad",
    state: "Telangana",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "prakash.reddy@icici",
    monthlySettlementAmt: 210600,
    monthlySettlementDisplay: "₹2,10,600",
    totalSettledYTD: 1940000,
    totalSettledYTDDisplay: "₹19,40,000",
    lastSettlementDate: "20 Jul 2025",
    lastTxnRef: "RTGS-ICICI902194",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "blue",
    createdDate: "02 Feb 2024",
    notes: "Hazmat cargo dispatches from Hyderabad to Kakinada industrial corridor.",
  },
  {
    id: "OBNK-003",
    ownerName: "Kishore Patel",
    ownerPhone: "+91 94401 88320",
    panNumber: "CDEFG9012H",
    assignedTankers: ["TK-004", "TK-015"],
    bankName: "State Bank of India",
    accountHolder: "Patel Bulk Logistics Solutions",
    accountNumber: "39201948201",
    maskedAccountNumber: "•••• •••• 8201",
    accountType: "Current Account",
    ifscCode: "SBIN0004321",
    branchName: "Industrial Area Branch, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "kishore.patel@sbi",
    monthlySettlementAmt: 191600,
    monthlySettlementDisplay: "₹1,91,600",
    totalSettledYTD: 1720000,
    totalSettledYTDDisplay: "₹17,20,000",
    lastSettlementDate: "19 Jul 2025",
    lastTxnRef: "NEFT-SBIN772910",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "emerald",
    createdDate: "20 Mar 2024",
    notes: "Non-hazardous bulk effluent and chemical transport settlements.",
  },
  {
    id: "OBNK-004",
    ownerName: "Venkat Babu",
    ownerPhone: "+91 98200 99881",
    panNumber: "DEFGH3456I",
    assignedTankers: ["TK-005", "TK-019"],
    bankName: "Axis Bank",
    accountHolder: "Babu Roadways Logistics Pvt Ltd",
    accountNumber: "9180200481920",
    maskedAccountNumber: "•••• •••• 1920",
    accountType: "Current Account",
    ifscCode: "UTIB0002233",
    branchName: "Guindy Industrial Estate Branch",
    city: "Chennai",
    state: "Tamil Nadu",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "venkatbabu@axisbank",
    monthlySettlementAmt: 239800,
    monthlySettlementDisplay: "₹2,39,800",
    totalSettledYTD: 2150000,
    totalSettledYTDDisplay: "₹21,50,000",
    lastSettlementDate: "21 Jul 2025",
    lastTxnRef: "NEFT-UTIB884910",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "purple",
    createdDate: "10 Apr 2024",
    notes: "Corridor settlements for Chennai to Visakhapatnam direct trips.",
  },
  {
    id: "OBNK-005",
    ownerName: "Deepak Shah",
    ownerPhone: "+91 99300 44112",
    panNumber: "EFGHI7890J",
    assignedTankers: ["TK-006"],
    bankName: "Kotak Mahindra Bank",
    accountHolder: "Shah Transport Corp",
    accountNumber: "2019482019",
    maskedAccountNumber: "•••• •••• 2019",
    accountType: "Proprietorship Current",
    ifscCode: "KKBK0001920",
    branchName: "MIDC Industrial Area, Pune",
    city: "Pune",
    state: "Maharashtra",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "deepak.shah@kotak",
    monthlySettlementAmt: 98400,
    monthlySettlementDisplay: "₹98,400",
    totalSettledYTD: 890000,
    totalSettledYTDDisplay: "₹8,90,000",
    lastSettlementDate: "18 Jul 2025",
    lastTxnRef: "NEFT-KKBK991024",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "amber",
    createdDate: "05 May 2024",
    notes: "Hazmat bio-cleaning transport monthly settlements.",
  },
  {
    id: "OBNK-006",
    ownerName: "Srinivas Rao",
    ownerPhone: "+91 98765 43210",
    panNumber: "FGHIJ1234K",
    assignedTankers: ["TK-003"],
    bankName: "Bank of Baroda",
    accountHolder: "Srinivas Rao Tanker Services",
    accountNumber: "0928010002938",
    maskedAccountNumber: "•••• •••• 2938",
    accountType: "Savings Account",
    ifscCode: "BARB0NARIMA",
    branchName: "Nariman Point Commercial",
    city: "Mumbai",
    state: "Maharashtra",
    verificationStatus: "Verified",
    payoutStatus: "Ready for Payout",
    isPrimaryPayoutAccount: true,
    upiId: "srinivas.rao@bob",
    monthlySettlementAmt: 72500,
    monthlySettlementDisplay: "₹72,500",
    totalSettledYTD: 650000,
    totalSettledYTDDisplay: "₹6,50,000",
    lastSettlementDate: "19 Jul 2025",
    lastTxnRef: "NEFT-BARB102948",
    tdsDeclarationSubmitted: true,
    pennyDropPassed: true,
    colorTheme: "slate",
    createdDate: "18 Jun 2024",
    notes: "Waste water treatment tanker operations for AquaTech Pvt Ltd.",
  },
  {
    id: "OBNK-007",
    ownerName: "Anil Sharma",
    ownerPhone: "+91 98112 33445",
    panNumber: "GHIJK5678L",
    assignedTankers: ["TK-012"],
    bankName: "Punjab National Bank",
    accountHolder: "Anil Sharma Road Carriers",
    accountNumber: "109200210048",
    maskedAccountNumber: "•••• •••• 0048",
    accountType: "Current Account",
    ifscCode: "PUNB0109200",
    branchName: "Jubilee Hills Commercial Branch",
    city: "Hyderabad",
    state: "Telangana",
    verificationStatus: "Pending Verification",
    payoutStatus: "On Hold (KYC Pending)",
    isPrimaryPayoutAccount: true,
    upiId: "anil.sharma@pnb",
    monthlySettlementAmt: 64800,
    monthlySettlementDisplay: "₹64,800",
    totalSettledYTD: 120000,
    totalSettledYTDDisplay: "₹1,20,000",
    lastSettlementDate: "Pending KYC",
    tdsDeclarationSubmitted: false,
    pennyDropPassed: false,
    colorTheme: "slate",
    createdDate: "10 Jul 2025",
    notes: "New transporter onboarding. Bank penny drop verification underway.",
  },
];

let ownerBanksState: OwnerBankItem[] = [...INITIAL_OWNER_BANKS];

export function getOwnerBanks(params: BankFilterParams = {}) {
  let filtered = [...ownerBanksState];

  // 1. Search Query (Owner Name, Phone, Bank Name, Account No, IFSC, Tanker)
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (b) =>
        b.ownerName.toLowerCase().includes(q) ||
        b.ownerPhone.toLowerCase().includes(q) ||
        b.panNumber.toLowerCase().includes(q) ||
        b.bankName.toLowerCase().includes(q) ||
        b.accountHolder.toLowerCase().includes(q) ||
        b.accountNumber.toLowerCase().includes(q) ||
        b.maskedAccountNumber.toLowerCase().includes(q) ||
        b.ifscCode.toLowerCase().includes(q) ||
        b.branchName.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.assignedTankers.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 2. Owner Filter
  if (params.owner && params.owner !== "ALL") {
    filtered = filtered.filter((b) => b.ownerName === params.owner);
  }

  // 3. Bank Filter
  if (params.bankName && params.bankName !== "ALL") {
    filtered = filtered.filter((b) => b.bankName === params.bankName);
  }

  // 4. Verification Status Filter
  if (params.verificationStatus && params.verificationStatus !== "ALL") {
    filtered = filtered.filter(
      (b) => b.verificationStatus === params.verificationStatus
    );
  }

  // 5. Payout Status Filter
  if (params.payoutStatus && params.payoutStatus !== "ALL") {
    filtered = filtered.filter((b) => b.payoutStatus === params.payoutStatus);
  }

  // 6. Sorting
  if (params.sortBy) {
    filtered.sort((a, b) => {
      let aVal = a[params.sortBy as keyof OwnerBankItem] ?? "";
      let bVal = b[params.sortBy as keyof OwnerBankItem] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return params.sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      }

      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        const aNum = aVal ? 1 : 0;
        const bNum = bVal ? 1 : 0;
        return params.sortOrder === "desc" ? bNum - aNum : aNum - bNum;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return params.sortOrder === "desc"
        ? strB.localeCompare(strA)
        : strA.localeCompare(strB);
    });
  } else {
    // Default sort: highest settlement amount first
    filtered.sort((a, b) => b.monthlySettlementAmt - a.monthlySettlementAmt);
  }

  const total = filtered.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function getBankStats(): BankStats {
  const totalMonthlySettlement = ownerBanksState.reduce(
    (sum, b) => sum + b.monthlySettlementAmt,
    0
  );

  const totalDisbursedYTD = ownerBanksState.reduce(
    (sum, b) => sum + b.totalSettledYTD,
    0
  );

  const verifiedOwnersCount = ownerBanksState.filter(
    (b) => b.verificationStatus === "Verified"
  ).length;

  const pendingPayoutsCount = ownerBanksState.filter(
    (b) => b.payoutStatus !== "Ready for Payout"
  ).length;

  const totalTankersLinked = ownerBanksState.reduce(
    (sum, b) => sum + b.assignedTankers.length,
    0
  );

  return {
    totalMonthlySettlement,
    totalMonthlySettlementDisplay: formatINR(totalMonthlySettlement),
    totalOwnersCount: ownerBanksState.length,
    verifiedOwnersCount,
    pendingPayoutsCount,
    totalDisbursedYTD,
    totalDisbursedYTDDisplay: formatINR(totalDisbursedYTD),
    totalTankersLinked,
  };
}

export function getOwnerBankById(id: string): OwnerBankItem | undefined {
  return ownerBanksState.find((b) => b.id === id);
}

export function createOwnerBank(data: OwnerBankFormData): OwnerBankItem {
  const newId = `OBNK-00${ownerBanksState.length + 1}`;
  const lastFour = data.accountNumber.slice(-4);
  const masked = `•••• •••• ${lastFour}`;

  const newBank: OwnerBankItem = {
    id: newId,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    panNumber: (data.panNumber || "").toUpperCase(),
    assignedTankers: data.assignedTankers || [],
    bankName: data.bankName,
    accountHolder: data.accountHolder,
    accountNumber: data.accountNumber,
    maskedAccountNumber: masked,
    accountType: data.accountType,
    ifscCode: data.ifscCode.toUpperCase(),
    branchName: data.branchName,
    city: data.city,
    state: data.state || "Telangana",
    verificationStatus: data.verificationStatus || "Verified",
    payoutStatus: data.payoutStatus || "Ready for Payout",
    isPrimaryPayoutAccount: data.isPrimaryPayoutAccount ?? true,
    upiId: data.upiId || `${data.ownerName.toLowerCase().replace(/\s+/g, "")}@bank`,
    monthlySettlementAmt: data.monthlySettlementAmt || 0,
    monthlySettlementDisplay: formatINR(data.monthlySettlementAmt || 0),
    totalSettledYTD: 0,
    totalSettledYTDDisplay: "₹0",
    tdsDeclarationSubmitted: data.tdsDeclarationSubmitted ?? true,
    pennyDropPassed: data.verificationStatus === "Verified",
    colorTheme: getThemeForBank(data.bankName),
    createdDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    notes: data.notes || "",
  };

  ownerBanksState = [newBank, ...ownerBanksState];
  return newBank;
}

export function updateOwnerBank(
  id: string,
  data: Partial<OwnerBankFormData>
): OwnerBankItem | undefined {
  const index = ownerBanksState.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  const current = ownerBanksState[index];

  let masked = current.maskedAccountNumber;
  if (data.accountNumber && data.accountNumber !== current.accountNumber) {
    masked = `•••• •••• ${data.accountNumber.slice(-4)}`;
  }

  const updated: OwnerBankItem = {
    ...current,
    ...data,
    ifscCode: (data.ifscCode || current.ifscCode).toUpperCase(),
    panNumber: (data.panNumber || current.panNumber).toUpperCase(),
    maskedAccountNumber: masked,
    monthlySettlementAmt:
      data.monthlySettlementAmt !== undefined
        ? data.monthlySettlementAmt
        : current.monthlySettlementAmt,
    monthlySettlementDisplay:
      data.monthlySettlementAmt !== undefined
        ? formatINR(data.monthlySettlementAmt)
        : current.monthlySettlementDisplay,
  };

  ownerBanksState[index] = updated;
  return updated;
}

export function deleteOwnerBank(id: string): boolean {
  const bank = ownerBanksState.find((b) => b.id === id);
  if (!bank) return false;

  ownerBanksState = ownerBanksState.filter((b) => b.id !== id);
  return true;
}

export function verifyPennyDrop(id: string): OwnerBankItem | undefined {
  const index = ownerBanksState.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  ownerBanksState[index] = {
    ...ownerBanksState[index],
    verificationStatus: "Verified",
    pennyDropPassed: true,
    payoutStatus: "Ready for Payout",
  };

  return ownerBanksState[index];
}

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function getThemeForBank(
  name: string
): "amber" | "blue" | "emerald" | "purple" | "slate" {
  const n = name.toLowerCase();
  if (n.includes("hdfc")) return "amber";
  if (n.includes("icici") || n.includes("axis")) return "blue";
  if (n.includes("state bank") || n.includes("sbi")) return "emerald";
  if (n.includes("kotak")) return "purple";
  return "slate";
}

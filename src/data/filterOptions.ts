export interface AutocompleteOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  category?: string;
  searchText?: string;
}

export const VEHICLE_FILTER_OPTIONS: AutocompleteOption[] = [
  {
    value: "TK-001",
    label: "TK-001",
    sublabel: "AP09AB1234 • Chemical Tanker (20,000 L)",
    badge: "Active",
    category: "Chemical",
    searchText: "TK-001 AP09AB1234 Ravi Kumar ChemCorp Chemical 20000",
  },
  {
    value: "TK-002",
    label: "TK-002",
    sublabel: "TS07CD5678 • Hazmat Tanker (15,000 L)",
    badge: "Transit",
    category: "Hazardous",
    searchText: "TK-002 TS07CD5678 Prakash Reddy HazWaste Hazardous 15000",
  },
  {
    value: "TK-003",
    label: "TK-003",
    sublabel: "MH12EF9012 • Water Tanker (25,000 L)",
    badge: "Maintenance",
    category: "Waste Water",
    searchText: "TK-003 MH12EF9012 Srinivas Rao AquaTech Waste Water 25000",
  },
  {
    value: "TK-004",
    label: "TK-004",
    sublabel: "KA05GH3456 • General Tanker (18,000 L)",
    badge: "Active",
    category: "Non-Hazard",
    searchText: "TK-004 KA05GH3456 Kishore Patel EcoWaste Non-Hazard 18000",
  },
  {
    value: "TK-005",
    label: "TK-005",
    sublabel: "TN22IJ7890 • Chemical Tanker (20,000 L)",
    badge: "Active",
    category: "Chemical",
    searchText: "TK-005 TN22IJ7890 Venkat Babu IndusChem Chemical 20000",
  },
  {
    value: "TK-006",
    label: "TK-006",
    sublabel: "MH04KL2345 • Hazmat Tanker (22,000 L)",
    badge: "Active",
    category: "Hazardous",
    searchText: "TK-006 MH04KL2345 Deepak Shah BioClean Hazardous 22000",
  },
  {
    value: "TK-008",
    label: "TK-008",
    sublabel: "AP39EF1234 • Chemical Tanker (24,000 L)",
    badge: "Active",
    category: "Chemical",
    searchText: "TK-008 AP39EF1234 Ravi Kumar Apex Solvents Chemical 24000",
  },
  {
    value: "TK-011",
    label: "TK-011",
    sublabel: "TS09MN7890 • Water Tanker (16,000 L)",
    badge: "Active",
    category: "Waste Water",
    searchText: "TK-011 TS09MN7890 Prakash Reddy GreenEco Waste Water 16000",
  },
  {
    value: "TK-015",
    label: "TK-015",
    sublabel: "KA04OP4567 • Hazmat Tanker (20,000 L)",
    badge: "Active",
    category: "Hazardous",
    searchText: "TK-015 KA04OP4567 Kishore Patel ChemCorp Hazardous 20000",
  },
  {
    value: "TK-019",
    label: "TK-019",
    sublabel: "TN09QR8901 • General Tanker (18,000 L)",
    badge: "Transit",
    category: "Non-Hazard",
    searchText: "TK-019 TN09QR8901 Venkat Babu IndusChem Non-Hazard 18000",
  },
];

export const COMPANY_FILTER_OPTIONS: AutocompleteOption[] = [
  {
    value: "ChemCorp Ltd",
    label: "ChemCorp Ltd",
    sublabel: "Visakhapatnam Port Hub • Bulk Chemicals",
    badge: "Chemical",
    searchText: "ChemCorp Ltd Visakhapatnam Chemical TK-001 TK-015",
  },
  {
    value: "HazWaste Solutions",
    label: "HazWaste Solutions",
    sublabel: "Kakinada Industrial Area • Hazardous Waste",
    badge: "Hazardous",
    searchText: "HazWaste Solutions Kakinada Hazardous Toxic Gas TK-002",
  },
  {
    value: "EcoWaste Corp",
    label: "EcoWaste Corp",
    sublabel: "Pune MIDC / Nasik • Effluent Recycling",
    badge: "Waste Water",
    searchText: "EcoWaste Corp Pune Nasik Waste Water Effluent TK-004",
  },
  {
    value: "IndusChem Ltd",
    label: "IndusChem Ltd",
    sublabel: "Ranipet Hub • Industrial Solvents",
    badge: "Chemical",
    searchText: "IndusChem Ltd Ranipet Solvents Chemical TK-005 TK-019",
  },
  {
    value: "AquaTech Pvt Ltd",
    label: "AquaTech Pvt Ltd",
    sublabel: "Nagpur Hub • Industrial Water & CETP",
    badge: "Water",
    searchText: "AquaTech Pvt Ltd Nagpur Waste Water TK-003",
  },
  {
    value: "BioClean Enviro",
    label: "BioClean Enviro",
    sublabel: "Bhopal MIDC • Organic Solvents & Acids",
    badge: "Hazardous",
    searchText: "BioClean Enviro Bhopal Hazardous Solvents TK-006",
  },
  {
    value: "Apex Solvents",
    label: "Apex Solvents",
    sublabel: "Vizag Chemical Corridor • Bulk Acids",
    badge: "Chemical",
    searchText: "Apex Solvents Vizag Chemical Corridor TK-008",
  },
  {
    value: "GreenEco Logistics",
    label: "GreenEco Logistics",
    sublabel: "Hyderabad Terminal • General Freight",
    badge: "Logistics",
    searchText: "GreenEco Logistics Hyderabad Terminal TK-011",
  },
];

export const FLEET_OWNER_FILTER_OPTIONS: AutocompleteOption[] = [
  {
    value: "Ravi Kumar",
    label: "Ravi Kumar",
    sublabel: "AP Fleet (TK-001, TK-008) • HDFC Bank",
    badge: "2 Tankers",
    searchText: "Ravi Kumar AP Fleet TK-001 TK-008 HDFC Bank +91 98451 22310",
  },
  {
    value: "Prakash Reddy",
    label: "Prakash Reddy",
    sublabel: "TS Fleet (TK-002, TK-011) • ICICI Bank",
    badge: "2 Tankers",
    searchText: "Prakash Reddy TS Fleet TK-002 TK-011 ICICI Bank +91 97120 44589",
  },
  {
    value: "Kishore Patel",
    label: "Kishore Patel",
    sublabel: "KA Fleet (TK-004, TK-015) • SBI Bank",
    badge: "2 Tankers",
    searchText: "Kishore Patel KA Fleet TK-004 TK-015 SBI Bank +91 94401 88320",
  },
  {
    value: "Venkat Babu",
    label: "Venkat Babu",
    sublabel: "TN Fleet (TK-005, TK-019) • Axis Bank",
    badge: "2 Tankers",
    searchText: "Venkat Babu TN Fleet TK-005 TK-019 Axis Bank +91 98200 99881",
  },
  {
    value: "Deepak Shah",
    label: "Deepak Shah",
    sublabel: "MH Fleet (TK-006) • Kotak Bank",
    badge: "1 Tanker",
    searchText: "Deepak Shah MH Fleet TK-006 Kotak Bank +91 99300 44112",
  },
  {
    value: "Srinivas Rao",
    label: "Srinivas Rao",
    sublabel: "MH Fleet (TK-003) • Bank of Baroda",
    badge: "1 Tanker",
    searchText: "Srinivas Rao MH Fleet TK-003 Bank of Baroda +91 98765 43210",
  },
];

export const USER_VEHICLE_FILTER_OPTIONS: AutocompleteOption[] = [
  ...VEHICLE_FILTER_OPTIONS,
  {
    value: "Unassigned",
    label: "Unassigned",
    sublabel: "Drivers without vehicle assignment",
    badge: "Unassigned",
    category: "Non-Hazard",
    searchText: "Unassigned None No Vehicle Available",
  },
];

export const INDIAN_BANKS_FILTER_OPTIONS: AutocompleteOption[] = [
  {
    value: "HDFC Bank",
    label: "HDFC Bank",
    sublabel: "Housing Development Finance Corp • Private Commercial",
    badge: "Top Tier",
    searchText: "HDFC Bank Housing Development Finance Corporation HDFC0001234",
  },
  {
    value: "ICICI Bank",
    label: "ICICI Bank",
    sublabel: "Industrial Credit & Investment Corp • Direct API Gateway",
    badge: "Top Tier",
    searchText: "ICICI Bank Industrial Credit and Investment Corporation ICIC0005678",
  },
  {
    value: "State Bank of India",
    label: "State Bank of India",
    sublabel: "SBI • Largest Public Sector Commercial Bank",
    badge: "PSU Master",
    searchText: "State Bank of India SBI Public Sector SBIN0004321",
  },
  {
    value: "Axis Bank",
    label: "Axis Bank",
    sublabel: "Corporate E-Treasury & NEFT/RTGS Gateway",
    badge: "Private",
    searchText: "Axis Bank UTI E-Treasury UTIB0002233",
  },
  {
    value: "Kotak Mahindra Bank",
    label: "Kotak Mahindra Bank",
    sublabel: "Kotak Connect Host-to-Host Integration",
    badge: "Private",
    searchText: "Kotak Mahindra Bank KKBK KKBK0001920",
  },
  {
    value: "Punjab National Bank",
    label: "Punjab National Bank",
    sublabel: "PNB • Public Sector Commercial Bank",
    badge: "PSU",
    searchText: "Punjab National Bank PNB PUNB PUNB0109200",
  },
  {
    value: "Bank of Baroda",
    label: "Bank of Baroda",
    sublabel: "BOB • Commercial Banking & Escrow Accounts",
    badge: "PSU",
    searchText: "Bank of Baroda BOB BARB BARB0NARIMA",
  },
  {
    value: "Canara Bank",
    label: "Canara Bank",
    sublabel: "Public Sector Commercial Bank",
    badge: "PSU",
    searchText: "Canara Bank CNRB",
  },
  {
    value: "Union Bank of India",
    label: "Union Bank of India",
    sublabel: "Commercial & Logistics Accounts",
    badge: "PSU",
    searchText: "Union Bank of India UBIN",
  },
  {
    value: "IndusInd Bank",
    label: "IndusInd Bank",
    sublabel: "Commercial Vehicle Finance & Fleet Escrows",
    badge: "Private",
    searchText: "IndusInd Bank INDB Vehicle Fleet",
  },
  {
    value: "Federal Bank",
    label: "Federal Bank",
    sublabel: "Commercial Digital Banking Gateway",
    badge: "Private",
    searchText: "Federal Bank FDRL",
  },
  {
    value: "Yes Bank",
    label: "Yes Bank",
    sublabel: "UPI & Instant Transporter Payouts",
    badge: "Private",
    searchText: "Yes Bank YESB",
  },
  {
    value: "IDBI Bank",
    label: "IDBI Bank",
    sublabel: "Industrial Development Bank of India",
    badge: "PSU",
    searchText: "IDBI Bank IBKL",
  },
  {
    value: "Indian Bank",
    label: "Indian Bank",
    sublabel: "Public Sector Commercial Banking",
    badge: "PSU",
    searchText: "Indian Bank IDIB",
  },
];


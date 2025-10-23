import type { DisposalRule } from "@/components/disposal-rule-card";
import { subDays } from "date-fns";

// Comprehensive disposal rules for different regions
export const DISPOSAL_RULES: DisposalRule[] = [
  {
    id: "BBMP-WET-1",
    category: "wet",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru Wet Waste Segregation",
    description: "All organic, biodegradable waste generated from kitchens and gardens must be segregated and composted or handed over to BBMP collection daily or every other day.",
    steps: [
      "Collect all food scraps, fruit and vegetable peels, cooked food leftovers, garden waste (leaves, flowers) in a separate bin.",
      "Ensure no plastic, glass, metal, or non-biodegradable items are mixed with wet waste.",
      "Compost wet waste at home if possible, or hand it over to the BBMP waste collector daily or every other day."
    ],
    dosList: [
      "Segregate wet waste daily.",
      "Compost kitchen and garden waste at home.",
      "Ensure wet waste is free from non-biodegradable contaminants.",
      "Use tight-lidded bins to prevent pests and odor."
    ],
    dontsList: [
      "Mix wet waste with dry, recyclable, medical, or hazardous waste.",
      "Dispose of plastic bags, sanitary napkins, or e-waste in wet waste bins.",
      "Let wet waste accumulate for more than 2 days to prevent spoilage and odors."
    ],
    externalLinks: [
      {
        title: "BBMP Solid Waste Management Policy",
        url: "https://bbmp.gov.in/solid-waste-management"
      },
      {
        title: "KSPCB Guidelines for Waste Management",
        url: "https://kspcb.karnataka.gov.in/Waste_Management_Rules"
      }
    ],
    lastUpdated: subDays(new Date(), 15).toISOString(),
  },
  {
    id: "BBMP-DRY-1",
    category: "dry",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru Dry Waste Segregation (Non-Recyclable & Mixed Dry)",
    description: "This category includes non-biodegradable waste that cannot be easily recycled due to contamination, mixed materials, or lack of processing facilities.",
    steps: [
      "Collect items like thermal paper receipts, multi-layered plastic packaging, contaminated plastic/paper, rubber, leather, sponges, and old clothes in a separate dry waste bag/bin.",
      "Ensure these items are relatively clean and dry to prevent odors and pest infestation.",
      "Hand over collected dry waste to the BBMP dry waste collector, typically once or twice a week."
    ],
    dosList: [
      "Segregate all non-wet waste into dry waste (which includes recyclables).",
      "Ensure dry waste is not contaminated with food or liquids.",
      "Bag small dry waste items securely."
    ],
    dontsList: [
      "Mix wet waste, medical waste, or hazardous waste with dry waste.",
      "Dispose of large construction debris or e-waste with regular dry waste.",
      "Attempt to recycle items that are heavily contaminated or made of mixed, non-separable materials."
    ],
    externalLinks: [
      {
        title: "BBMP Solid Waste Management Policy",
        url: "https://bbmp.gov.in/solid-waste-management"
      }
    ],
    defaultInterval: 7,
    lastUpdated: subDays(new Date(), 10).toISOString(),
  },
  {
    id: "BBMP-REC-1",
    category: "recyclable",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru Recyclable Waste Segregation (Clean & Sorted)",
    description: "Clean and dry recyclable materials like paper, cardboard, plastic bottles, glass bottles, and metal cans are collected separately for further processing at Dry Waste Collection Centers (DWCCs).",
    steps: [
      "Rinse plastic and glass containers to remove food residue.",
      "Flatten cardboard boxes and plastic bottles to save space.",
      "Collect newspapers, magazines, clean plastic packaging, glass bottles, and metal cans in a separate bag/bin.",
      "Hand over these segregated recyclables to the BBMP dry waste collector or directly to the nearest Dry Waste Collection Center (DWCC)."
    ],
    dosList: [
      "Clean and dry all recyclable items thoroughly.",
      "Remove labels where possible, especially from glass bottles.",
      "Flatten items to optimize collection space.",
      "Support local DWCCs by dropping off recyclables directly if convenient."
    ],
    dontsList: [
      "Dispose of food-contaminated items as recyclables.",
      "Mix broken ceramics, light bulbs, or window glass with recyclable glass.",
      "Include medical waste, e-waste, or hazardous waste with recyclables."
    ],
    externalLinks: [
      {
        title: "BBMP Dry Waste Collection Centers",
        url: "https://bbmp.gov.in/dry-waste-collection-centers"
      }
    ],
    defaultInterval: 14,
    lastUpdated: subDays(new Date(), 8).toISOString(),
  },
  {
    id: "BBMP-HAZ-1",
    category: "hazardous",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru Hazardous Waste Management",
    description: "Household batteries, chemicals, and hazardous materials require special disposal through BBMP authorized centers.",
    steps: [
      "Collect batteries in a dry container",
      "Tape terminals of lithium batteries",
      "Take to BBMP hazardous waste collection center",
      "Get acknowledgment receipt"
    ],
    dosList: [
      "Separate different battery types",
      "Tape terminals to prevent short circuits",
      "Keep batteries dry and cool",
      "Use original packaging when possible"
    ],
    dontsList: [
      "Never put in regular waste bins",
      "Don't expose to heat or moisture",
      "Don't mix damaged batteries with others",
      "Don't attempt to disassemble"
    ],
    externalLinks: [
      {
        title: "BBMP Hazardous Waste Management",
        url: "https://site.bbmp.gov.in/departmentwebsites/swm/Domestic%20Hazardous%20Waste.html"
      }
    ],
    defaultInterval: 30,
    lastUpdated: subDays(new Date(), 22).toISOString(),
  },
  {
    id: "BBMP-MED-1",
    category: "medical",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru Medical Waste Disposal",
    description: "Prescription medications, syringes, and medical supplies require disposal through authorized medical waste handlers.",
    steps: [
      "Remove personal information from containers",
      "Place medications in original containers",
      "Take to authorized medical waste collection point",
      "Follow Karnataka PCB guidelines"
    ],
    dosList: [
      "Use authorized medical waste disposal methods",
      "Remove or black out personal information",
      "Keep medications in original containers",
      "Check for hospital take-back programs"
    ],
    dontsList: [
      "Never flush medications down drain",
      "Don't put in regular household waste",
      "Don't give unused medications to others",
      "Don't burn or bury medical waste"
    ],
    externalLinks: [
      {
        title: "Karnataka Medical Waste Rules",
        url: "https://kspcb.karnataka.gov.in/medical-waste.php"
      }
    ],
    defaultInterval: 1,
    lastUpdated: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "BBMP-EW-1",
    category: "e-waste",
    region: "Karnataka",
    city: "Bengaluru",
    title: "Bengaluru E-Waste Management",
    description: "Computers, phones, and electronic devices require specialized recycling through BBMP authorized e-waste recyclers.",
    steps: [
      "Back up and wipe personal data completely",
      "Remove batteries if possible",
      "Take to BBMP authorized e-waste recycler",
      "Get certificate of proper disposal"
    ],
    dosList: [
      "Wipe all personal data completely",
      "Remove or destroy hard drives with sensitive data",
      "Keep original accessories together",
      "Use manufacturer take-back programs when available"
    ],
    dontsList: [
      "Never put in regular waste bins",
      "Don't forget to backup important data",
      "Don't leave personal information on devices",
      "Don't break or disassemble devices yourself"
    ],
    externalLinks: [
      {
        title: "BBMP E-Waste Management",
        url: "https://bbmp.gov.in/e-waste-management/"
      }
    ],
    defaultInterval: 30,
    lastUpdated: subDays(new Date(), 18).toISOString(),
  },
  // Mumbai rules
  {
    id: "BMC-WET-1",
    category: "wet",
    region: "Maharashtra",
    city: "Mumbai",
    title: "Mumbai Wet Waste Segregation",
    description: "All organic, biodegradable waste generated from kitchens and gardens must be segregated and composted or handed over to BMC collection daily.",
    steps: [
      "Collect all food scraps, fruit and vegetable peels, cooked food leftovers, garden waste in a separate bin.",
      "Ensure no plastic, glass, metal, or non-biodegradable items are mixed with wet waste.",
      "Hand it over to the BMC waste collector daily."
    ],
    dosList: [
      "Segregate wet waste daily.",
      "Compost kitchen and garden waste at home if possible.",
      "Ensure wet waste is free from non-biodegradable contaminants."
    ],
    dontsList: [
      "Mix wet waste with dry, recyclable, medical, or hazardous waste.",
      "Dispose of plastic bags or e-waste in wet waste bins.",
      "Let wet waste accumulate for more than 1 day."
    ],
    externalLinks: [
      {
        title: "BMC Waste Management Guidelines",
        url: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlswm"
      }
    ],
    defaultInterval: 1,
    lastUpdated: subDays(new Date(), 12).toISOString(),
  },
  {
    id: "BMC-REC-1",
    category: "recyclable",
    region: "Maharashtra",
    city: "Mumbai",
    title: "Mumbai Recyclable Waste Management",
    description: "Clean plastic bottles, containers, and packaging materials can be recycled through BMC collection or local kabadiwala.",
    steps: [
      "Empty and rinse containers with water",
      "Remove caps and lids (recycle separately)",
      "Sort by plastic type (PET, HDPE, etc.)",
      "Give to local kabadiwala or BMC collection vehicle"
    ],
    dosList: [
      "Rinse containers to remove food residue",
      "Check recycling codes 1-7",
      "Separate different plastic types",
      "Keep bottles and caps separate"
    ],
    dontsList: [
      "Don't include dirty or greasy containers",
      "Don't mix with wet waste",
      "Don't include multilayer packaging",
      "Don't throw in regular dustbin"
    ],
    externalLinks: [
      {
        title: "BMC Waste Management Guidelines",
        url: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlswm"
      }
    ],
    defaultInterval: 7,
    lastUpdated: subDays(new Date(), 15).toISOString(),
  },
  // Delhi rules
  {
    id: "MCD-DRY-1",
    category: "dry",
    region: "Delhi",
    city: "Delhi",
    title: "Delhi Dry Waste Management",
    description: "Clean paper products and cardboard packaging for recycling through Delhi's waste management system.",
    steps: [
      "Remove any plastic wrapping or tape",
      "Flatten cardboard boxes",
      "Sort paper by type (newspaper, magazines, etc.)",
      "Give to local kabadiwala or MCD collection"
    ],
    dosList: [
      "Include newspapers, magazines, books",
      "Flatten boxes to save space",
      "Remove staples and clips if possible",
      "Keep materials clean and dry"
    ],
    dontsList: [
      "Don't include wax-coated paper",
      "Don't add tissue paper or napkins",
      "Don't include carbon paper",
      "Don't mix with wet waste"
    ],
    externalLinks: [
      {
        title: "MCD Waste Management",
        url: "https://mcdonline.nic.in/"
      }
    ],
    defaultInterval: 7,
    lastUpdated: subDays(new Date(), 12).toISOString(),
  }
];

export function getDisposalRulesByRegion(region: string): DisposalRule[] {
  return DISPOSAL_RULES.filter(rule => 
    rule.city.toLowerCase().includes(region.toLowerCase()) ||
    rule.region.toLowerCase().includes(region.toLowerCase())
  );
}

export function getDisposalRulesByCategory(category: string): DisposalRule[] {
  return DISPOSAL_RULES.filter(rule => rule.category === category);
}

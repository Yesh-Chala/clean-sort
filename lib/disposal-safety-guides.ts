// General disposal safety guidelines and tips
export interface SafetyGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  doItems: string[];
  dontItems: string[];
  icon: string;
  severity: "low" | "medium" | "high";
  tips: string[];
}

export const DISPOSAL_SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: "hazardous-waste",
    title: "Hazardous Waste Disposal",
    category: "hazardous",
    description: "Proper disposal of hazardous materials to protect yourself and the environment",
    doItems: [
      "Store in original containers with labels",
      "Keep away from children and pets",
      "Take to designated collection centers",
      "Check local regulations for specific items",
      "Use protective gear when handling"
    ],
    dontItems: [
      "Never pour down drains or toilets",
      "Don't mix different hazardous materials",
      "Avoid burning or incinerating",
      "Don't dispose in regular trash",
      "Never store near food or water sources"
    ],
    icon: "⚠️",
    severity: "high",
    tips: [
      "Create a designated storage area away from living spaces",
      "Keep an inventory of hazardous items with expiration dates",
      "Research local drop-off locations before accumulation",
      "Consider alternatives to hazardous products when possible"
    ]
  },
  {
    id: "e-waste",
    title: "Electronic Waste (E-Waste)",
    category: "e-waste",
    description: "Safe disposal of electronic devices and components",
    doItems: [
      "Remove personal data before disposal",
      "Take to certified e-waste recyclers",
      "Check for manufacturer take-back programs",
      "Separate batteries from devices",
      "Keep cables and chargers together"
    ],
    dontItems: [
      "Don't throw in regular trash",
      "Avoid breaking or dismantling yourself",
      "Don't burn electronic components",
      "Never dispose of batteries in regular trash",
      "Don't mix with other waste types"
    ],
    icon: "💻",
    severity: "medium",
    tips: [
      "Consider donating working electronics to charities",
      "Look for trade-in programs for newer devices",
      "Store old devices safely until disposal",
      "Check if components can be reused or repurposed"
    ]
  },
  {
    id: "medical-waste",
    title: "Medical & Pharmaceutical Waste",
    category: "medical",
    description: "Proper disposal of medications and medical supplies",
    doItems: [
      "Take unused medications to pharmacy take-back programs",
      "Mix pills with unpalatable substances before disposal",
      "Remove personal information from containers",
      "Follow specific disposal instructions on labels",
      "Use designated medical waste containers"
    ],
    dontItems: [
      "Never flush medications down the toilet",
      "Don't share prescription medications",
      "Avoid disposing in regular household trash",
      "Don't crush or break pills unnecessarily",
      "Never mix different types of medications"
    ],
    icon: "💊",
    severity: "high",
    tips: [
      "Keep a list of medications and their disposal requirements",
      "Check expiration dates regularly",
      "Consider pill organizers to reduce waste",
      "Ask your pharmacist about disposal options"
    ]
  },
  {
    id: "food-waste",
    title: "Food Waste Management",
    category: "wet",
    description: "Efficient handling of organic food waste",
    doItems: [
      "Compost fruit and vegetable scraps",
      "Use airtight containers to prevent odors",
      "Freeze meat scraps until collection day",
      "Separate different types of organic waste",
      "Use biodegradable bags when possible"
    ],
    dontItems: [
      "Don't let food waste sit for too long",
      "Avoid mixing with non-organic materials",
      "Don't dispose of large quantities at once",
      "Never put hot food directly in containers",
      "Don't use regular plastic bags for composting"
    ],
    icon: "🍎",
    severity: "low",
    tips: [
      "Start a small compost bin for kitchen scraps",
      "Plan meals to reduce food waste",
      "Use vegetable scraps for homemade broth",
      "Consider worm composting for apartment living"
    ]
  },
  {
    id: "recyclable-materials",
    title: "Recyclable Materials",
    category: "recyclable",
    description: "Proper preparation and disposal of recyclable items",
    doItems: [
      "Rinse containers before recycling",
      "Remove labels and caps when required",
      "Check local recycling guidelines",
      "Separate different material types",
      "Flatten cardboard and paper"
    ],
    dontItems: [
      "Don't put dirty or contaminated items in recycling",
      "Avoid wish-cycling (hoping items are recyclable)",
      "Don't mix recyclables with regular trash",
      "Never put plastic bags in curbside recycling",
      "Don't recycle items smaller than a credit card"
    ],
    icon: "♻️",
    severity: "low",
    tips: [
      "Create a dedicated recycling station at home",
      "Learn your local recycling symbols and codes",
      "Consider upcycling items before recycling",
      "Support companies that use recycled materials"
    ]
  },
  {
    id: "dry-waste",
    title: "Dry Waste Management",
    category: "dry",
    description: "Handling non-recyclable dry materials",
    doItems: [
      "Separate by material type when possible",
      "Store in dry, covered containers",
      "Check for local specialized disposal programs",
      "Consider donation for usable items",
      "Use appropriate bag sizes for collection"
    ],
    dontItems: [
      "Don't mix with wet or organic waste",
      "Avoid overfilling containers",
      "Don't dispose of large items in regular trash",
      "Never put hazardous materials in dry waste",
      "Don't use plastic bags for everything"
    ],
    icon: "📦",
    severity: "low",
    tips: [
      "Consider bulk purchasing to reduce packaging",
      "Look for items with minimal packaging",
      "Reuse containers and packaging when possible",
      "Support zero-waste stores and initiatives"
    ]
  }
];

export function getSafetyGuidesByCategory(category?: string): SafetyGuide[] {
  if (!category || category === "all") {
    return DISPOSAL_SAFETY_GUIDES;
  }
  return DISPOSAL_SAFETY_GUIDES.filter(guide => guide.category === category);
}

export function getSafetyGuideById(id: string): SafetyGuide | undefined {
  return DISPOSAL_SAFETY_GUIDES.find(guide => guide.id === id);
}

export function getCategories(): string[] {
  const categories = [...new Set(DISPOSAL_SAFETY_GUIDES.map(guide => guide.category))];
  return ["all", ...categories];
}

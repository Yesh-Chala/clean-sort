import type { WasteCategory } from "./db";

export const WASTE_CATEGORIES: Record<
  WasteCategory,
  {
    label: string;
    color: string;
    defaultInterval: number;
    description: string;
  }
> = {
  dry: {
    label: "Dry Waste",
    color: "bg-amber-500",
    defaultInterval: 7,
    description: "Paper, plastic, metal, glass",
  },
  wet: {
    label: "Wet/Organic",
    color: "bg-green-500",
    defaultInterval: 1,
    description: "Food scraps, vegetable peels",
  },
  medical: {
    label: "Medical",
    color: "bg-red-500",
    defaultInterval: 1,
    description: "Medicine, syringes, bandages",
  },
  hazardous: {
    label: "Hazardous",
    color: "bg-orange-500",
    defaultInterval: 30,
    description: "Batteries, chemicals, paint",
  },
  recyclable: {
    label: "Recyclable",
    color: "bg-blue-500",
    defaultInterval: 7,
    description: "Clean plastic, glass, metal",
  },
  "e-waste": {
    label: "E-Waste",
    color: "bg-purple-500",
    defaultInterval: 30,
    description: "Electronics, gadgets, cables",
  },
};

export const QUICK_INTERVALS = [
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "1 week", value: 7 },
  { label: "2 weeks", value: 14 },
  { label: "1 month", value: 30 },
];

export const SNOOZE_OPTIONS = [
  { label: "1 hour", value: 1 },
  { label: "6 hours", value: 6 },
  { label: "1 day", value: 24 },
];

// Sample data for demo
export const SAMPLE_ITEMS = [
  {
    id: "1",
    name: "Milk 1L",
    category: "recyclable" as WasteCategory,
    defaultInterval: 3,
  },
  {
    id: "2",
    name: "Rice 5kg",
    category: "dry" as WasteCategory,
    defaultInterval: 7,
  },
  {
    id: "3",
    name: "Batteries AA (4)",
    category: "hazardous" as WasteCategory,
    defaultInterval: 30,
  },
  {
    id: "4",
    name: "Painkillers",
    category: "medical" as WasteCategory,
    defaultInterval: 1,
  },
];

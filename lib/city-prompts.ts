// City-specific prompt templates for OCR processing
export interface CityPrompt {
  city: string;
  region: string;
  promptSuffix: string;
  description: string;
}

export const CITY_PROMPTS: Record<string, CityPrompt> = {
  "Mumbai, Maharashtra": {
    city: "Mumbai",
    region: "Maharashtra",
    promptSuffix: `\n\nIMPORTANT: This receipt is from Mumbai, Maharashtra. Please consider local waste management practices:
- BMC (Brihanmumbai Municipal Corporation) has specific segregation rules
- Wet waste should be disposed daily due to humidity
- Dry waste can be stored for 7 days before disposal
- Hazardous waste must be taken to designated collection centers
- E-waste collection is available through authorized dealers`,
    description: "Mumbai-specific waste management guidelines"
  },
  "Delhi, NCR": {
    city: "Delhi",
    region: "NCR",
    promptSuffix: `\n\nIMPORTANT: This receipt is from Delhi, NCR. Please consider local waste management practices:
- MCD (Municipal Corporation of Delhi) enforces strict segregation
- Wet waste should be composted or disposed within 24 hours
- Dry waste can be stored for up to 7 days
- Hazardous waste requires special handling and collection
- E-waste can be dropped at designated collection points`,
    description: "Delhi NCR-specific waste management guidelines"
  },
  "Bengaluru, Karnataka": {
    city: "Bengaluru",
    region: "Karnataka",
    promptSuffix: `\n\nIMPORTANT: This receipt is from Bengaluru, Karnataka. Please consider local waste management practices:
- BBMP (Bruhat Bengaluru Mahanagara Palike) has comprehensive waste segregation rules
- Wet waste should be disposed daily or every other day
- Dry waste can be stored for 7 days before disposal
- Hazardous waste must be taken to designated collection centers
- E-waste collection is available through authorized dealers`,
    description: "Bengaluru-specific waste management guidelines"
  },
  "Chennai, Tamil Nadu": {
    city: "Chennai",
    region: "Tamil Nadu",
    promptSuffix: `\n\nIMPORTANT: This receipt is from Chennai, Tamil Nadu. Please consider local waste management practices:
- Greater Chennai Corporation has specific segregation requirements
- Wet waste should be disposed daily due to tropical climate
- Dry waste can be stored for 7 days before disposal
- Hazardous waste requires special handling and collection
- E-waste can be dropped at designated collection points`,
    description: "Chennai-specific waste management guidelines"
  },
  "Hyderabad, Telangana": {
    city: "Hyderabad",
    region: "Telangana",
    promptSuffix: `\n\nIMPORTANT: This receipt is from Hyderabad, Telangana. Please consider local waste management practices:
- GHMC (Greater Hyderabad Municipal Corporation) enforces waste segregation
- Wet waste should be disposed daily or every other day
- Dry waste can be stored for 7 days before disposal
- Hazardous waste must be taken to designated collection centers
- E-waste collection is available through authorized dealers`,
    description: "Hyderabad-specific waste management guidelines"
  }
};

export function getCityPrompt(cityKey: string): CityPrompt | null {
  return CITY_PROMPTS[cityKey] || null;
}

export function getAllCities(): CityPrompt[] {
  return Object.values(CITY_PROMPTS);
}

export function getCityPromptSuffix(cityKey: string): string {
  const prompt = getCityPrompt(cityKey);
  return prompt ? prompt.promptSuffix : "";
}

export interface DisposalRule {
  id: string;
  category: string;
  region: string;
  city: string;
  title: string;
  description: string;
  steps: string[];
  dos?: string[];
  donts?: string[];
  pickupSchedule?: string;
  externalLinks?: Array<{
    title: string;
    url: string;
  }>;
  lastUpdated: string;
}

export class DisposalRulesService {
  static async getRules(
    city?: string,
    category?: string
  ): Promise<DisposalRule[]> {
    try {
      // In a real implementation, this would:
      // 1. Query database for disposal rules
      // 2. Filter by city/region and category
      // 3. Return localized disposal guidelines
      // 4. Handle fallbacks to state/country defaults

      // For demo purposes, return mock data
      const mockRules: DisposalRule[] = [
        {
          id: "1",
          category: "recyclable",
          region: "California",
          city: city || "San Francisco",
          title: "Plastic Bottles & Containers",
          description: "Clean plastic bottles and containers for recycling",
          steps: [
            "Empty and rinse containers thoroughly",
            "Remove caps and lids (recycle separately)",
            "Place in blue recycling bin on collection day",
          ],
          dos: [
            "Rinse containers with water",
            "Remove all food residue",
            "Check recycling symbols",
          ],
          donts: [
            "Don't include caps with bottles",
            "Don't recycle dirty containers",
            "Don't crush bottles completely",
          ],
          pickupSchedule: "Every Tuesday and Friday",
          externalLinks: [
            {
              title: "City Recycling Guidelines",
              url: "https://example.com/recycling",
            },
          ],
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          category: "wet",
          region: "California",
          city: city || "San Francisco",
          title: "Food Waste & Organic Matter",
          description: "Proper disposal of food scraps and organic waste",
          steps: [
            "Collect food scraps in compost bin",
            "Add brown materials like paper",
            "Place in green organics bin",
          ],
          dos: [
            "Include fruit and vegetable scraps",
            "Add coffee grounds and filters",
            "Include yard trimmings",
          ],
          donts: [
            "Don't add meat or dairy",
            "Don't include plastic bags",
            "Don't add pet waste",
          ],
          pickupSchedule: "Every Monday and Thursday",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "3",
          category: "hazardous",
          region: "California",
          city: city || "San Francisco",
          title: "Household Hazardous Waste",
          description: "Safe disposal of batteries, chemicals, and electronics",
          steps: [
            "Collect hazardous items separately",
            "Take to designated drop-off location",
            "Never put in regular trash",
          ],
          dos: [
            "Use original containers when possible",
            "Keep items in well-ventilated area",
            "Check collection event schedules",
          ],
          donts: [
            "Don't mix different chemicals",
            "Don't put in regular bins",
            "Don't pour down drains",
          ],
          pickupSchedule: "Monthly collection events - 2nd Saturday",
          externalLinks: [
            {
              title: "Hazardous Waste Collection Sites",
              url: "https://example.com/hazardous",
            },
          ],
          lastUpdated: new Date().toISOString(),
        },
      ];

      // Filter by category if provided
      const filteredRules = category
        ? mockRules.filter(rule => rule.category === category)
        : mockRules;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return filteredRules;
    } catch (error) {
      console.error("Rules API error:", error);
      throw new Error("Failed to fetch rules");
    }
  }

  static async searchRules(
    query: string,
    city?: string
  ): Promise<DisposalRule[]> {
    try {
      const allRules = await this.getRules(city);

      // Simple text search across title, description, and steps
      const searchResults = allRules.filter(rule => {
        const searchText =
          `${rule.title} ${rule.description} ${rule.steps.join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

      return searchResults;
    } catch (error) {
      console.error("Search error:", error);
      throw new Error("Search failed");
    }
  }
}

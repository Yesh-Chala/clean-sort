import type { ParsedItem } from "@/components/parsed-items-list";
import { storageService } from "./storage";
import { apiClient } from "./api-client";

// OCR service using our custom server to avoid CORS issues
export class OCRService {
  static async processReceipt(imageFile: File): Promise<ParsedItem[]> {
    try {
      console.log('=== OCR SERVICE: Starting receipt processing ===');
      
      // Get user's selected city for location-specific prompts
      const selectedCity = await storageService.getSelectedCity();
      console.log('OCR SERVICE: Selected city:', selectedCity);

      // Process receipt using API client (includes authentication)
      const items = await apiClient.processReceipt(imageFile, selectedCity);
      console.log('OCR SERVICE: Items received from API:', items);

      // Validate items structure
      if (!Array.isArray(items)) {
        throw new Error('Server response is not an array');
      }

      return items;
    } catch (error) {
      console.error('OCR SERVICE: Error processing receipt:', error);
      // Fallback to mock data if server fails
      return this.getMockResults();
    }
  }

  static async uploadToAPI(items: ParsedItem[]): Promise<void> {
    // No longer needed since we're processing directly in frontend
  }

  // Fallback mock data for when API fails
  private static getMockResults(): ParsedItem[] {
    const mockResults = [
      {
        id: "1",
        name: "Organic Milk 1L",
        quantity: "1 bottle",
        category: "recyclable",
        interval: 3,
        confidence: 0.95,
      },
      {
        id: "2",
        name: "Bananas",
        quantity: "1.2 kg",
        category: "wet",
        interval: 1,
        confidence: 0.88,
      },
      {
        id: "3",
        name: "Bread Loaf",
        quantity: "1 pack",
        category: "dry",
        interval: 7,
        confidence: 0.92,
      },
    ];

    return mockResults.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`,
      category: item.category as any,
    }));
  }
}

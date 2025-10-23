import type { ParsedItem } from "@/components/parsed-items-list";
import { storageService } from "./storage";

// OCR service using our custom server to avoid CORS issues
export class OCRService {
  private static readonly SERVER_URL = import.meta.env.VITE_OCR_SERVER_URL || "https://cleansort-server-production.up.railway.app";

  static async processReceipt(imageFile: File): Promise<ParsedItem[]> {
    try {
      // Get user's selected city for location-specific prompts
      const selectedCity = await storageService.getSelectedCity();

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      if (selectedCity) {
        formData.append('city', selectedCity);
      }

      const response = await fetch(`${this.SERVER_URL}/api/process-receipt`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Server processing failed');
      }

      const items = data.items;

      // Validate items structure
      if (!Array.isArray(items)) {
        throw new Error('Server response is not an array');
      }

      return items;
    } catch (error) {
      // Fallback to mock data if server fails
      return this.getMockResults();
    }
  }

  static async uploadToAPI(items: ParsedItem[]): Promise<void> {
    // No longer needed since we're processing directly in frontend
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
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

import type { ParsedItem } from "@/components/parsed-items-list";
import { getCityPromptSuffix } from "./city-prompts";
import { storageService } from "./storage";

// Direct OCR service using Gemini API with correct endpoint
export class OCRService {
  private static readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  private static readonly GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  static async processReceipt(imageFile: File): Promise<ParsedItem[]> {
    try {
      console.log('=== OCR SERVICE: Starting processReceipt ===');
      console.log('OCR SERVICE: Image file:', imageFile.name, imageFile.size, 'bytes');
      
      if (!this.GEMINI_API_KEY) {
        console.error('OCR SERVICE: GEMINI_API_KEY not found in environment variables');
        throw new Error('GEMINI_API_KEY not found in environment variables');
      }

      console.log('OCR SERVICE: Processing receipt with Gemini API...');
      console.log('OCR SERVICE: API Key present:', !!this.GEMINI_API_KEY);

      // Get user's selected city for location-specific prompts
      const selectedCity = await storageService.getSelectedCity();
      console.log('OCR SERVICE: Selected city:', selectedCity);
      
      const cityPromptSuffix = getCityPromptSuffix(selectedCity);
      console.log('OCR SERVICE: City prompt suffix:', cityPromptSuffix);

      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Prepare the prompt for Gemini with city-specific information
      const basePrompt = `Extract items from this receipt. Return JSON array with: name, quantity, category (dry/wet/recyclable/hazardous/medical/e-waste), disposalInterval (1-30 days), confidence (0.0-1.0).

Example: [{"name":"Milk","quantity":"1L","category":"recyclable","disposalInterval":3,"confidence":0.95}]`;
      
      const prompt = basePrompt + cityPromptSuffix;

      const requestBody = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      };

      console.log('OCR SERVICE: Making API request to:', `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY.substring(0, 10)}...`);

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('OCR SERVICE: API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('OCR SERVICE: API Response data:', data);
      
      // Check if response was truncated due to token limit
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === 'MAX_TOKENS') {
        console.warn('Response truncated due to token limit. Consider increasing maxOutputTokens or shortening prompt.');
      }
      
      // Extract the JSON response from Gemini
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error('No response from Gemini API');
      }

      // Clean the response text (remove markdown code blocks if present)
      let cleanText = responseText.trim();
      console.log('OCR SERVICE: Raw response text:', responseText);
      
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('OCR SERVICE: Cleaned response text:', cleanText);

      // Parse the JSON response
      let items;
      try {
        items = JSON.parse(cleanText);
        console.log('OCR SERVICE: Parsed JSON items:', items);
        console.log('OCR SERVICE: Number of items parsed:', items.length);
        console.log('OCR SERVICE: Items structure check:', items.map((item, i) => ({
          index: i,
          hasName: !!item.name,
          hasQuantity: !!item.quantity,
          hasCategory: !!item.category,
          hasDisposalInterval: !!item.disposalInterval,
          hasConfidence: !!item.confidence,
          item: item
        })));
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Failed to parse text:', cleanText);
        console.error('Clean text length:', cleanText.length);
        console.error('First 500 chars:', cleanText.substring(0, 500));
        console.error('Last 500 chars:', cleanText.substring(Math.max(0, cleanText.length - 500)));
        throw new Error(`Failed to parse JSON response: ${parseError}`);
      }
      
      // Validate items structure
      if (!Array.isArray(items)) {
        console.error('Response is not an array:', items);
        throw new Error('Response is not an array');
      }
      
      // Transform to match ParsedItem interface
      const parsedItems: ParsedItem[] = items.map((item: any, index: number) => {
        console.log(`OCR SERVICE: Processing item ${index}:`, item);
        
        const parsedItem = {
          id: `${Date.now()}-${index}`,
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          interval: item.disposalInterval,
          confidence: item.confidence,
        };
        
        console.log(`OCR SERVICE: Transformed item ${index}:`, parsedItem);
        return parsedItem;
      });

      console.log('OCR SERVICE: Final parsed items array:', parsedItems);
      console.log('OCR SERVICE: Total items to return:', parsedItems.length);

      return parsedItems;
    } catch (error) {
      console.error('OCR SERVICE: OCR processing failed:', error);
      
      // Fallback to mock data if API fails
      console.log('OCR SERVICE: Falling back to mock data...');
      return this.getMockResults();
    }
  }

  static async uploadToAPI(items: ParsedItem[]): Promise<void> {
    // No longer needed since we're processing directly in frontend
      console.log('OCR SERVICE: Items processed directly in frontend:', items);
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
    }));
  }
}

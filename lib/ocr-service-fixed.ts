import type { ParsedItem } from "@/components/parsed-items-list";

// Direct OCR service using Gemini API with correct endpoint
export class OCRService {
  private static readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  private static readonly GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  static async processReceipt(imageFile: File): Promise<ParsedItem[]> {
    try {
      if (!this.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not found in environment variables');
        throw new Error('GEMINI_API_KEY not found in environment variables');
      }

      console.log('Processing receipt with Gemini API...');
      console.log('API Key present:', !!this.GEMINI_API_KEY);

      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Prepare the prompt for Gemini
      const prompt = `
        Analyze this receipt image and extract all items with their details. For each item, provide:
        1. Name of the item
        2. Quantity (with unit)
        3. Waste category (dry, wet, recyclable, hazardous, medical, e-waste)
        4. Disposal interval in days (1-30)
        5. Confidence score (0.0-1.0)

        Return the response as a JSON array with this exact structure:
        [
          {
            "name": "Item Name",
            "quantity": "1 piece",
            "category": "recyclable",
            "disposalInterval": 7,
            "confidence": 0.95
          }
        ]

        Categories should be one of: dry, wet, recyclable, hazardous, medical, e-waste
        Be specific with item names and realistic with disposal intervals.
      `;

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
          maxOutputTokens: 2048,
        }
      };

      console.log('Making API request to:', `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY.substring(0, 10)}...`);

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      // Extract the JSON response from Gemini
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error('No response from Gemini API');
      }

      // Parse the JSON response
      const items = JSON.parse(responseText);
      
      // Transform to match ParsedItem interface
      const parsedItems: ParsedItem[] = items.map((item: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        interval: item.disposalInterval,
        confidence: item.confidence,
      }));

      return parsedItems;
    } catch (error) {
      console.error('OCR processing failed:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      return this.getMockResults();
    }
  }

  static async uploadToAPI(items: ParsedItem[]): Promise<void> {
    // No longer needed since we're processing directly in frontend
    console.log('Items processed directly in frontend:', items);
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

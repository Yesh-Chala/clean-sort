import { authService } from './auth-service';

const API_BASE_URL = import.meta.env.VITE_OCR_SERVER_URL || 'http://localhost:3001';

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await authService.getIdToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Items API
  async getItems() {
    return this.request<any[]>('/api/items');
  }

  async saveItem(item: Omit<any, 'id' | 'createdAt'>) {
    return this.request<{ item: any; reminder: any }>('/api/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async saveMultipleItems(items: Omit<any, 'id' | 'createdAt'>[]) {
    return this.request<{ items: any[]; reminders: any[] }>('/api/items/bulk', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  async updateItem(id: string, updates: Partial<any>) {
    return this.request<any>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteItem(id: string) {
    return this.request<void>(`/api/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Reminders API
  async getReminders() {
    return this.request<any[]>('/api/reminders');
  }

  async updateReminder(id: string, updates: Partial<any>) {
    return this.request<any>(`/api/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRemindersByItemId(itemId: string) {
    return this.request<void>(`/api/reminders/item/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Settings API
  async getSettings() {
    return this.request<Record<string, any>>('/api/settings');
  }

  async saveSettings(settings: Record<string, any>) {
    return this.request<Record<string, any>>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getSelectedCity() {
    return this.request<string>('/api/settings/city');
  }

  async setSelectedCity(city: string) {
    return this.request<string>('/api/settings/city', {
      method: 'PUT',
      body: JSON.stringify({ city }),
    });
  }

  async getOnboardingStatus() {
    return this.request<boolean>('/api/settings/onboarding');
  }

  async setOnboardingCompleted() {
    return this.request<boolean>('/api/settings/onboarding', {
      method: 'PUT',
      body: JSON.stringify({ completed: true }),
    });
  }

  // Export API
  async exportData() {
    const data = await this.request<any>('/api/export');
    return JSON.stringify(data, null, 2);
  }

  // OCR API (with file upload) - No auth required
  async processReceipt(imageFile: File, city?: string) {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (city) {
      formData.append('city', city);
    }

    const response = await fetch(`${API_BASE_URL}/api/process-receipt`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'OCR processing failed');
    }

    return data.items;
  }
}

export const apiClient = new ApiClient();

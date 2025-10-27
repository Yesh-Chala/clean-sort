"use client";

import type { WasteCategory } from "./db";
import { apiClient } from "./api-client";

export interface StoredItem {
  id: string;
  name: string;
  category: WasteCategory;
  quantity: number;
  unit: string;
  interval: number;
  createdAt: string;
  lastReminder?: string;
  nextReminder?: string;
}

export interface StoredReminder {
  id: string;
  itemId: string;
  itemName: string;
  category: WasteCategory;
  dueDate: string;
  status: "upcoming" | "overdue" | "completed";
  createdAt: string;
}

class StorageService {
  // Items
  async getItems(): Promise<StoredItem[]> {
    try {
      console.log('=== STORAGE SERVICE: Getting items from API ===');
      const items = await apiClient.getItems();
      console.log('STORAGE SERVICE: Items received from API:', items);
      return items;
    } catch (error) {
      console.error("STORAGE SERVICE: Error loading items:", error);
      throw error;
    }
  }

  async saveItem(item: Omit<StoredItem, "id" | "createdAt">): Promise<StoredItem> {
    try {
      console.log('=== STORAGE SERVICE: Starting saveItem via API ===');
      console.log('STORAGE SERVICE: Item to save:', item);
      
      const result = await apiClient.saveItem(item);
      console.log('STORAGE SERVICE: Item saved via API:', result);
      
      return result.item;
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving item:", error);
      throw error;
    }
  }

  async saveMultipleItems(items: Omit<StoredItem, "id" | "createdAt">[]): Promise<StoredItem[]> {
    try {
      console.log('=== STORAGE SERVICE: Starting saveMultipleItems via API ===');
      console.log('STORAGE SERVICE: Items to save:', items.length);
      
      const result = await apiClient.saveMultipleItems(items);
      console.log('STORAGE SERVICE: Items saved via API:', result);
      
      return result.items;
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving multiple items:", error);
      throw error;
    }
  }

  async updateItem(id: string, updates: Partial<StoredItem>): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Updating item via API ===');
      console.log('STORAGE SERVICE: Item ID:', id, 'Updates:', updates);
      
      await apiClient.updateItem(id, updates);
      console.log('STORAGE SERVICE: Item updated via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error updating item:", error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Deleting item via API ===');
      console.log('STORAGE SERVICE: Item ID:', id);
      
      await apiClient.deleteItem(id);
      console.log('STORAGE SERVICE: Item deleted via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error deleting item:", error);
      throw error;
    }
  }

  // Reminders
  async getReminders(): Promise<StoredReminder[]> {
    try {
      console.log('=== STORAGE SERVICE: Getting reminders from API ===');
      const reminders = await apiClient.getReminders();
      console.log('STORAGE SERVICE: Reminders received from API:', reminders);
      return reminders;
    } catch (error) {
      console.error("STORAGE SERVICE: Error loading reminders:", error);
      throw error;
    }
  }

  async createReminder(_item: StoredItem): Promise<StoredReminder> {
    // This is now handled automatically by the API when saving items
    // We keep this method for compatibility but it's not used
    throw new Error('createReminder is now handled automatically by the API');
  }

  async updateReminder(id: string, updates: Partial<StoredReminder>): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Updating reminder via API ===');
      console.log('STORAGE SERVICE: Reminder ID:', id, 'Updates:', updates);
      
      await apiClient.updateReminder(id, updates);
      console.log('STORAGE SERVICE: Reminder updated via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error updating reminder:", error);
      throw error;
    }
  }

  async deleteRemindersByItemId(itemId: string): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Deleting reminders by item ID via API ===');
      console.log('STORAGE SERVICE: Item ID:', itemId);
      
      await apiClient.deleteRemindersByItemId(itemId);
      console.log('STORAGE SERVICE: Reminders deleted via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error deleting reminders:", error);
      throw error;
    }
  }

  // Settings
  async getSettings(): Promise<Record<string, any>> {
    try {
      console.log('=== STORAGE SERVICE: Getting settings from API ===');
      const settings = await apiClient.getSettings();
      console.log('STORAGE SERVICE: Settings received from API:', settings);
      return settings;
    } catch (error) {
      console.error("STORAGE SERVICE: Error loading settings:", error);
      throw error;
    }
  }

  async saveSettings(settings: Record<string, any>): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Saving settings via API ===');
      console.log('STORAGE SERVICE: Settings to save:', settings);
      
      await apiClient.saveSettings(settings);
      console.log('STORAGE SERVICE: Settings saved via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving settings:", error);
      throw error;
    }
  }

  // Onboarding - Use local storage since server doesn't have onboarding API
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = localStorage.getItem('cleansort-onboarding');
      return status === 'completed';
    } catch (error) {
      console.error("STORAGE SERVICE: Error loading onboarding status:", error);
      return false;
    }
  }

  async setOnboardingCompleted(): Promise<void> {
    try {
      localStorage.setItem('cleansort-onboarding', 'completed');
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving onboarding status:", error);
      throw error;
    }
  }

  // Selected City
  async getSelectedCity(): Promise<string> {
    try {
      console.log('=== STORAGE SERVICE: Getting selected city from API ===');
      const city = await apiClient.getSelectedCity();
      console.log('STORAGE SERVICE: Selected city received from API:', city);
      return city;
    } catch (error) {
      console.error("STORAGE SERVICE: Error loading selected city:", error);
      throw error;
    }
  }

  async setSelectedCity(city: string): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Setting selected city via API ===');
      console.log('STORAGE SERVICE: City to set:', city);
      
      await apiClient.setSelectedCity(city);
      console.log('STORAGE SERVICE: Selected city set via API');
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving selected city:", error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      console.log('=== STORAGE SERVICE: Clearing all data via API ===');
      // Note: This would need to be implemented in the API
      // For now, we'll throw an error to indicate it's not implemented
      throw new Error('Clear all data is not implemented in the API yet');
    } catch (error) {
      console.error("STORAGE SERVICE: Error clearing data:", error);
      throw error;
    }
  }

  // Export data
  async exportData(): Promise<string> {
    try {
      console.log('=== STORAGE SERVICE: Exporting data via API ===');
      const data = await apiClient.exportData();
      console.log('STORAGE SERVICE: Data exported via API');
      return data;
    } catch (error) {
      console.error("STORAGE SERVICE: Error exporting data:", error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
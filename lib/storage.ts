"use client";

import type { WasteCategory } from "./db";

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
  private readonly ITEMS_KEY = "cleansort-items";
  private readonly REMINDERS_KEY = "cleansort-reminders";
  private readonly SETTINGS_KEY = "cleansort-settings";
  private readonly ONBOARDING_KEY = "cleansort-onboarding";
  private readonly SELECTED_CITY_KEY = "cleansort-selected-city";

  // Items
  async getItems(): Promise<StoredItem[]> {
    try {
      const items = localStorage.getItem(this.ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error loading items:", error);
      return [];
    }
  }

  async saveItem(item: Omit<StoredItem, "id" | "createdAt">): Promise<StoredItem> {
    try {
      console.log('=== STORAGE SERVICE: Starting saveItem ===');
      console.log('STORAGE SERVICE: Item to save:', item);
      
      const items = await this.getItems();
      console.log('STORAGE SERVICE: Current items in storage:', items);
      console.log('STORAGE SERVICE: Current items count:', items.length);
      
      const newItem: StoredItem = {
        ...item,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      };
      
      console.log('STORAGE SERVICE: Generated new item:', newItem);
      
      items.push(newItem);
      console.log('STORAGE SERVICE: Items after push:', items);
      console.log('STORAGE SERVICE: Items count after push:', items.length);
      
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(items));
      console.log('STORAGE SERVICE: Items saved to localStorage');
      
      // Generate reminder for the item
      console.log('STORAGE SERVICE: Creating reminder for item...');
      await this.createReminder(newItem);
      console.log('STORAGE SERVICE: Reminder created successfully');
      
      console.log('STORAGE SERVICE: saveItem completed successfully');
      console.log('STORAGE SERVICE: Final items count in storage:', items.length);
      return newItem;
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving item:", error);
      throw error;
    }
  }

  async saveMultipleItems(items: Omit<StoredItem, "id" | "createdAt">[]): Promise<StoredItem[]> {
    try {
      console.log('=== STORAGE SERVICE: Starting saveMultipleItems ===');
      console.log('STORAGE SERVICE: Items to save:', items.length);
      
      const existingItems = await this.getItems();
      console.log('STORAGE SERVICE: Current items in storage:', existingItems.length);
      
      const newItems: StoredItem[] = items.map(item => ({
        ...item,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      }));
      
      console.log('STORAGE SERVICE: Generated new items:', newItems);
      
      const allItems = [...existingItems, ...newItems];
      console.log('STORAGE SERVICE: All items after adding new ones:', allItems.length);
      
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(allItems));
      console.log('STORAGE SERVICE: All items saved to localStorage');
      
      // Generate reminders for all items
      console.log('STORAGE SERVICE: Creating reminders for all items...');
      for (const item of newItems) {
        await this.createReminder(item);
      }
      console.log('STORAGE SERVICE: All reminders created successfully');
      
      console.log('STORAGE SERVICE: saveMultipleItems completed successfully');
      return newItems;
    } catch (error) {
      console.error("STORAGE SERVICE: Error saving multiple items:", error);
      throw error;
    }
  }

  async updateItem(id: string, updates: Partial<StoredItem>): Promise<void> {
    try {
      const items = await this.getItems();
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(this.ITEMS_KEY, JSON.stringify(items));
      }
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const items = await this.getItems();
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(filteredItems));
      
      // Remove associated reminders
      await this.deleteRemindersByItemId(id);
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  }

  // Reminders
  async getReminders(): Promise<StoredReminder[]> {
    try {
      const reminders = localStorage.getItem(this.REMINDERS_KEY);
      return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
      console.error("Error loading reminders:", error);
      return [];
    }
  }

  async createReminder(item: StoredItem): Promise<StoredReminder> {
    try {
      const reminders = await this.getReminders();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + item.interval);
      
      const newReminder: StoredReminder = {
        id: this.generateId(),
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        dueDate: dueDate.toISOString(),
        status: "upcoming",
        createdAt: new Date().toISOString(),
      };
      
      reminders.push(newReminder);
      localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(reminders));
      
      return newReminder;
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  }

  async updateReminder(id: string, updates: Partial<StoredReminder>): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const index = reminders.findIndex(reminder => reminder.id === id);
      
      if (index !== -1) {
        reminders[index] = { ...reminders[index], ...updates };
        localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(reminders));
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
      throw error;
    }
  }

  async deleteRemindersByItemId(itemId: string): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const filteredReminders = reminders.filter(reminder => reminder.itemId !== itemId);
      localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(filteredReminders));
    } catch (error) {
      console.error("Error deleting reminders:", error);
      throw error;
    }
  }

  // Settings
  async getSettings(): Promise<Record<string, any>> {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error("Error loading settings:", error);
      return {};
    }
  }

  async saveSettings(settings: Record<string, any>): Promise<void> {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  }

  // Utility
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Onboarding
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = localStorage.getItem(this.ONBOARDING_KEY);
      return status === "completed";
    } catch (error) {
      console.error("Error loading onboarding status:", error);
      return false;
    }
  }

  async setOnboardingCompleted(): Promise<void> {
    try {
      localStorage.setItem(this.ONBOARDING_KEY, "completed");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      throw error;
    }
  }

  // Selected City
  async getSelectedCity(): Promise<string> {
    try {
      const city = localStorage.getItem(this.SELECTED_CITY_KEY);
      return city || "Bengaluru, Karnataka"; // Default city
    } catch (error) {
      console.error("Error loading selected city:", error);
      return "Bengaluru, Karnataka";
    }
  }

  async setSelectedCity(city: string): Promise<void> {
    try {
      localStorage.setItem(this.SELECTED_CITY_KEY, city);
    } catch (error) {
      console.error("Error saving selected city:", error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.ITEMS_KEY);
      localStorage.removeItem(this.REMINDERS_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      localStorage.removeItem(this.ONBOARDING_KEY);
      localStorage.removeItem(this.SELECTED_CITY_KEY);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }

  // Export data
  async exportData(): Promise<string> {
    try {
      const data = {
        items: await this.getItems(),
        reminders: await this.getReminders(),
        settings: await this.getSettings(),
        exportedAt: new Date().toISOString(),
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

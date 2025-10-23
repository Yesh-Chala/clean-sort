"use client";

import { useState, useEffect } from "react";
import type { WasteCategory } from "@/lib/db";
import { addDays, subDays, isBefore } from "date-fns";
import { storageService } from "@/lib/storage";

export function useDashboardData() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('DASHBOARD DATA: useEffect triggered, loading data...');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('=== DASHBOARD DATA: Starting loadData ===');
      const [storedItems, storedReminders] = await Promise.all([
        storageService.getItems(),
        storageService.getReminders()
      ]);

      console.log('DASHBOARD DATA: Stored items from storage:', storedItems);
      console.log('DASHBOARD DATA: Stored items count:', storedItems.length);
      console.log('DASHBOARD DATA: Stored reminders:', storedReminders);

      // Transform stored items to match expected format
      const transformedItems = storedItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        addedAt: item.createdAt,
        disposalAt: item.nextReminder || addDays(new Date(item.createdAt), item.interval).toISOString(),
      }));

      console.log('DASHBOARD DATA: Transformed items:', transformedItems);
      console.log('DASHBOARD DATA: Transformed items count:', transformedItems.length);

      setItems(transformedItems);
    } catch (error) {
      console.error('DASHBOARD DATA: Error loading dashboard data:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  // Generate reminders from items
  const reminders = items
    .filter(item => !item.name.includes("completed")) // Mock completion check
    .map(item => ({
      id: item.id,
      itemName: item.name,
      category: item.category,
      dueAt: item.disposalAt,
      overdue: isBefore(new Date(item.disposalAt), now),
    }))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const stats = {
    totalItems: items.length,
    upcomingReminders: reminders.filter(r => !r.overdue).length,
    completedThisWeek: 3, // Mock completed count
    overdueItems: reminders.filter(r => r.overdue).length,
  };

  const recentItems = items
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(0, 5);

  const handleMarkDone = async (id: string) => {
    try {
      // Find the reminder and mark it as completed
      const reminders = await storageService.getReminders();
      const reminder = reminders.find(r => r.itemId === id);
      
      if (reminder) {
        await storageService.updateReminder(reminder.id, { status: "completed" });
        
        // Reload data to reflect changes
        await loadData();
      }
    } catch (error) {
      console.error('Error marking item as done:', error);
    }
  };

  const handleSnooze = async (id: string) => {
    try {
      // Find the reminder and snooze it by 1 day
      const reminders = await storageService.getReminders();
      const reminder = reminders.find(r => r.itemId === id);
      
      if (reminder) {
        const newDueDate = addDays(new Date(), 1).toISOString();
        await storageService.updateReminder(reminder.id, { 
          dueDate: newDueDate,
          status: "upcoming"
        });
        
        // Reload data to reflect changes
        await loadData();
      }
    } catch (error) {
      console.error('Error snoozing item:', error);
    }
  };

  return {
    loading,
    stats,
    reminders,
    recentItems,
    handleMarkDone,
    handleSnooze,
  };
}

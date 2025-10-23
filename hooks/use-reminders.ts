"use client";

import { useState, useEffect } from "react";
import type { ReminderData } from "@/components/reminder-card";
import { addHours, isBefore } from "date-fns";
import { storageService } from "@/lib/storage";

export function useReminders() {
  const [reminders, setReminders] = useState<ReminderData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await storageService.getReminders();
      
      // Transform stored reminders to match ReminderData interface
      const transformedReminders: ReminderData[] = storedReminders.map(reminder => ({
        id: reminder.id,
        itemName: reminder.itemName,
        category: reminder.category,
        dueAt: reminder.dueDate,
        completed: reminder.status === "completed",
        overdue: reminder.status === "overdue" || (reminder.status === "upcoming" && isBefore(new Date(reminder.dueDate), new Date())),
      }));

      setReminders(transformedReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingReminders = reminders.filter(r => !r.completed && !r.overdue);
  const completedReminders = reminders.filter(r => r.completed);
  const missedReminders = reminders.filter(r => !r.completed && r.overdue);

  const handleMarkDone = async (id: string) => {
    try {
      await storageService.updateReminder(id, { status: "completed" });
      await loadReminders(); // Reload reminders
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error('Error marking reminder as done:', error);
    }
  };

  const handleSnooze = async (id: string, hours: number) => {
    try {
      const newDueAt = addHours(new Date(), hours).toISOString();
      await storageService.updateReminder(id, { 
        dueDate: newDueAt,
        status: "upcoming"
      });
      await loadReminders(); // Reload reminders
    } catch (error) {
      console.error('Error snoozing reminder:', error);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit reminder:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    try {
      // Find the reminder to get the itemId
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        // Delete the associated item and its reminders
        await storageService.deleteItem(reminder.id); // This will also delete associated reminders
        await loadReminders(); // Reload reminders
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleSelectAll = (remindersList: ReminderData[]) => {
    const ids = remindersList.map(r => r.id);
    setSelectedIds(ids);
  };

  const handleSelectNone = () => {
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkMarkDone = async () => {
    try {
      const updatePromises = selectedIds.map(id => 
        storageService.updateReminder(id, { status: "completed" })
      );
      await Promise.all(updatePromises);
      await loadReminders(); // Reload reminders
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk marking reminders as done:', error);
    }
  };

  const handleBulkSnooze = async (hours: number) => {
    try {
      const newDueAt = addHours(new Date(), hours).toISOString();
      const updatePromises = selectedIds.map(id => 
        storageService.updateReminder(id, { 
          dueDate: newDueAt,
          status: "upcoming"
        })
      );
      await Promise.all(updatePromises);
      await loadReminders(); // Reload reminders
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk snoozing reminders:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedIds.map(id => {
        const reminder = reminders.find(r => r.id === id);
        return reminder ? storageService.deleteItem(reminder.id) : Promise.resolve();
      });
      await Promise.all(deletePromises);
      await loadReminders(); // Reload reminders
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk deleting reminders:', error);
    }
  };

  return {
    loading,
    upcomingReminders,
    completedReminders,
    missedReminders,
    selectedIds,
    handleMarkDone,
    handleSnooze,
    handleEdit,
    handleDelete,
    handleSelectAll,
    handleSelectNone,
    handleToggleSelect,
    handleBulkMarkDone,
    handleBulkSnooze,
    handleBulkDelete,
  };
}

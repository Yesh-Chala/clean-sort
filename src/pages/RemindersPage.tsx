import { MobileLayout } from "@/components/mobile-layout";
import { EmptyState } from "@/components/empty-state";
import { useReminders } from "@/hooks/use-reminders";
import { Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function RemindersPage() {
  const { missedReminders, upcomingReminders, completedReminders } =
    useReminders();
  const totalReminders =
    missedReminders.length +
    upcomingReminders.length +
    completedReminders.length;

  return (
    <MobileLayout
      title="Reminders"
      showNotificationBell={true}
      notificationCount={missedReminders.length}
    >
      <div className="p-4">
        {totalReminders === 0 ? (
          <EmptyState
            icon={Bell}
            title="No reminders yet"
            description="Add items to start getting disposal reminders"
            action={{
              label: "Add Your First Item",
              onClick: () => {},
            }}
          >
            <Link to="/add" className="mt-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </Link>
          </EmptyState>
        ) : (
          <div>{/* Placeholder for existing code */}</div>
        )}
      </div>
    </MobileLayout>
  );
}

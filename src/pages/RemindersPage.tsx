import { MobileLayout } from "@/components/mobile-layout";
import { EmptyState } from "@/components/empty-state";
import { useReminders } from "@/hooks/use-reminders";
import { Bell, Plus, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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
          <div className="space-y-6">
            {/* Missed Reminders */}
            {missedReminders.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Overdue ({missedReminders.length})
                </h2>
                <div className="space-y-2">
                  {missedReminders.map(reminder => (
                    <div key={reminder.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-red-800">{reminder.itemName}</h3>
                          <p className="text-sm text-red-600">Overdue by {formatDistanceToNow(new Date(reminder.dueAt))}</p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Mark Done
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Reminders */}
            {upcomingReminders.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming ({upcomingReminders.length})
                </h2>
                <div className="space-y-2">
                  {upcomingReminders.map(reminder => (
                    <div key={reminder.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-orange-800">{reminder.itemName}</h3>
                          <p className="text-sm text-orange-600">Due in {formatDistanceToNow(new Date(reminder.dueAt))}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                            Snooze
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Mark Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Reminders */}
            {completedReminders.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Completed ({completedReminders.length})
                </h2>
                <div className="space-y-2">
                  {completedReminders.map(reminder => (
                    <div key={reminder.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-green-800 line-through">{reminder.itemName}</h3>
                          <p className="text-sm text-green-600">Completed {formatDistanceToNow(new Date(reminder.dueAt))} ago</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

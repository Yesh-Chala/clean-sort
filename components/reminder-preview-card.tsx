"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "./category-pill";
import { Clock, CheckCircle, Store as Snooze } from "lucide-react";
import type { WasteCategory } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface ReminderPreview {
  id: string;
  itemName: string;
  category: WasteCategory;
  dueAt: string;
  overdue: boolean;
}

interface ReminderPreviewCardProps {
  reminders: ReminderPreview[];
  onMarkDone: (id: string) => void;
  onSnooze: (id: string) => void;
}

export function ReminderPreviewCard({
  reminders,
  onMarkDone,
  onSnooze,
}: ReminderPreviewCardProps) {
  if (reminders.length === 0) {
    return (
      <Card className="border border-black shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Disposals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming disposals. Great job staying on top of your waste
            management!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-black shadow-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Upcoming Disposals ({reminders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.slice(0, 3).map(reminder => (
          <div
            key={reminder.id}
            className="flex items-center justify-between gap-3 p-3 bg-muted rounded-lg border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">
                  {reminder.itemName}
                </h4>
                <CategoryPill
                  category={reminder.category}
                  size="sm"
                  showLabel={false}
                />
              </div>
              <p
                className={`text-xs ${reminder.overdue ? "text-red-500" : "text-muted-foreground"}`}
              >
                {reminder.overdue ? "Overdue" : "Due"}{" "}
                {formatDistanceToNow(new Date(reminder.dueAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSnooze(reminder.id)}
                className="h-8 w-8 p-0"
              >
                <Snooze className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkDone(reminder.id)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {reminders.length > 3 && (
          <Link to="/reminders">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-transparent border border-black hover:bg-muted/50 transition-all duration-200"
            >
              View All {reminders.length} Reminders
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "./category-pill";
import {
  CheckCircle,
  Clock,
  MoreHorizontal,
  StoreIcon as SnoozeIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import type { WasteCategory } from "@/lib/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ReminderData {
  id: string;
  itemName: string;
  category: WasteCategory;
  dueAt: string;
  completed: boolean;
  overdue: boolean;
  snoozedUntil?: string;
}

interface ReminderCardProps {
  reminder: ReminderData;
  onMarkDone: (id: string) => void;
  onSnooze: (id: string, hours: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function ReminderCard({
  reminder,
  onMarkDone,
  onSnooze,
  onEdit,
  onDelete,
  className,
}: ReminderCardProps) {
  const [isActioning, setIsActioning] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsActioning(true);
    action();
    // Simulate action delay
    setTimeout(() => setIsActioning(false), 300);
  };

  const dueDate = new Date(reminder.dueAt);
  // const now = new Date()
  const isOverdue = reminder.overdue && !reminder.completed;

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isActioning && "scale-95 opacity-50",
        isOverdue &&
          "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        reminder.completed && "opacity-60",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={cn(
                  "font-medium text-sm truncate",
                  reminder.completed && "line-through text-muted-foreground"
                )}
              >
                {reminder.itemName}
              </h3>
              <CategoryPill
                category={reminder.category}
                size="sm"
                showLabel={false}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3" />
              <span
                className={cn(
                  isOverdue
                    ? "text-red-600 font-medium"
                    : "text-muted-foreground",
                  reminder.completed && "line-through"
                )}
              >
                {isOverdue ? "Overdue" : "Due"}{" "}
                {formatDistanceToNow(dueDate, { addSuffix: true })}
              </span>
            </div>

            {reminder.snoozedUntil && (
              <div className="flex items-center gap-1 mt-1">
                <SnoozeIcon className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">
                  Snoozed until{" "}
                  {format(new Date(reminder.snoozedUntil), "MMM d, h:mm a")}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!reminder.completed && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAction(() => onMarkDone(reminder.id))}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  disabled={isActioning}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={isActioning}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(() => onSnooze(reminder.id, 1))
                      }
                    >
                      <SnoozeIcon className="h-4 w-4 mr-2" />
                      Snooze 1 hour
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(() => onSnooze(reminder.id, 6))
                      }
                    >
                      <SnoozeIcon className="h-4 w-4 mr-2" />
                      Snooze 6 hours
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(() => onSnooze(reminder.id, 24))
                      }
                    >
                      <SnoozeIcon className="h-4 w-4 mr-2" />
                      Snooze 1 day
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(reminder.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(reminder.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

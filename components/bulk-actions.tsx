"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, StoreIcon as SnoozeIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  selectedIds: string[];
  totalCount: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onMarkAllDone: () => void;
  onSnoozeAll: (hours: number) => void;
  onDeleteAll: () => void;
  className?: string;
}

export function BulkActions({
  selectedIds,
  totalCount,
  onSelectAll,
  onSelectNone,
  onMarkAllDone,
  onSnoozeAll,
  onDeleteAll,
  className,
}: BulkActionsProps) {
  const [isActioning, setIsActioning] = useState(false);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = selectedIds.length === totalCount && totalCount > 0;

  const handleAction = async (action: () => void) => {
    setIsActioning(true);
    action();
    setTimeout(() => setIsActioning(false), 500);
  };

  if (totalCount === 0) return null;

  return (
    <div className={cn("bg-muted rounded-lg p-3 space-y-3 border border-border", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={isAllSelected ? onSelectNone : onSelectAll}
            disabled={isActioning}
          />
          <span className="text-sm font-medium">
            {hasSelection ? `${selectedIds.length} selected` : "Select all"}
          </span>
        </div>

        {hasSelection && (
          <span className="text-xs text-muted-foreground">
            {selectedIds.length} of {totalCount}
          </span>
        )}
      </div>

      {hasSelection && (
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(onMarkAllDone)}
            disabled={isActioning}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Done
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(() => onSnoozeAll(24))}
            disabled={isActioning}
          >
            <SnoozeIcon className="h-4 w-4 mr-1" />
            Snooze 1 Day
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(onDeleteAll)}
            disabled={isActioning}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUICK_INTERVALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { format, addDays } from "date-fns";

interface IntervalPickerProps {
  id?: string;
  value: number;
  onChange: (days: number) => void;
  purchaseDate: Date;
  className?: string;
}

export function IntervalPicker({
  value,
  onChange,
  purchaseDate,
  className,
}: IntervalPickerProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState(value.toString());

  const handleQuickSelect = (days: number) => {
    onChange(days);
    setCustomMode(false);
    setCustomValue(days.toString());
  };

  const handleCustomSubmit = () => {
    const days = Number.parseInt(customValue);
    if (days > 0) {
      onChange(days);
    }
  };

  const disposalDate = addDays(purchaseDate, value);

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">Disposal Reminder</Label>

      {/* Quick intervals */}
      <div className="flex flex-wrap gap-2">
        {QUICK_INTERVALS.map(interval => (
          <Button
            key={interval.value}
            type="button"
            variant={
              value === interval.value && !customMode ? "default" : "outline"
            }
            size="sm"
            onClick={() => handleQuickSelect(interval.value)}
            className="text-xs border border-border"
          >
            {interval.label}
          </Button>
        ))}
        <Button
          type="button"
          variant={customMode ? "default" : "outline"}
          size="sm"
          onClick={() => setCustomMode(true)}
          className="text-xs border border-border"
        >
          Custom
        </Button>
      </div>

      {/* Custom input */}
      {customMode && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="365"
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            placeholder="Days"
            className="w-20 text-sm"
          />
          <span className="text-sm text-muted-foreground">days</span>
          <Button
            type="button"
            size="sm"
            onClick={handleCustomSubmit}
            disabled={!customValue || Number.parseInt(customValue) <= 0}
          >
            Set
          </Button>
        </div>
      )}

      {/* Disposal date preview */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <span className="text-muted-foreground">Dispose on: </span>
          <span className="font-medium">
            {format(disposalDate, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}

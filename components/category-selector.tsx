"use client";

import type { WasteCategory } from "@/lib/db";
import { WASTE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  id?: string;
  value: WasteCategory | null;
  onChange: (category: WasteCategory) => void;
  className?: string;
}

export function CategorySelector({
  value,
  onChange,
  className,
}: CategorySelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium">Waste Category</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(WASTE_CATEGORIES).map(([key, config]) => {
          const category = key as WasteCategory;
          const isSelected = value === category;

          return (
            <Button
              key={category}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(category)}
              className={cn(
                "h-auto p-3 flex flex-col items-start gap-1 text-left border border-border",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={cn("w-3 h-3 rounded-full", config.color)} />
                <span className="font-medium text-xs">{config.label}</span>
              </div>
              <span className="text-xs text-muted-foreground leading-tight">
                {config.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

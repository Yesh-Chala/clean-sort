"use client";

import { Button } from "@/components/ui/button";
import { CategoryPill } from "./category-pill";
import type { WasteCategory } from "@/lib/db";
import { WASTE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategories: WasteCategory[];
  onCategoryToggle: (category: WasteCategory) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategories,
  onCategoryToggle,
  className,
}: CategoryFilterProps) {
  const allCategories = Object.keys(WASTE_CATEGORIES) as WasteCategory[];

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-medium text-sm">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map(category => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle(category)}
              className={cn(
                "h-auto p-2 transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CategoryPill
                category={category}
                size="sm"
                className={cn(
                  "border-0",
                  isSelected ? "bg-primary-foreground text-primary" : ""
                )}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

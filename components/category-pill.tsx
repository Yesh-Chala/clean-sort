"use client";

import { Badge } from "@/components/ui/badge";
import type { WasteCategory } from "@/lib/db";
import { WASTE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  category: WasteCategory;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function CategoryPill({
  category,
  size = "md",
  showLabel = true,
  className,
}: CategoryPillProps) {
  const config = WASTE_CATEGORIES[category];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-2 font-medium",
        sizeClasses[size],
        className
      )}
      title={config.description}
    >
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      {showLabel && config.label}
    </Badge>
  );
}

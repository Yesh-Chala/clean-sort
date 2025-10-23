"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SAMPLE_ITEMS } from "@/lib/constants";
import type { WasteCategory } from "@/lib/db";
import { cn } from "@/lib/utils";

interface ItemAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCategorySelect?: (category: WasteCategory) => void;
  className?: string;
}

export function ItemAutocomplete({
  value,
  onChange,
  onCategorySelect,
  className,
}: ItemAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<typeof SAMPLE_ITEMS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = SAMPLE_ITEMS.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSuggestionClick = (item: (typeof SAMPLE_ITEMS)[0]) => {
    onChange(item.name);
    onCategorySelect?.(item.category);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label htmlFor="item-name" className="text-sm font-medium">
        Item Name
      </Label>
      <Input
        ref={inputRef}
        id="item-name"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g., Milk carton, Banana peels..."
        className="w-full"
        autoComplete="off"
      />

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-10 bg-background border border-border rounded-md shadow-lg mt-1">
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map(item => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSuggestionClick(item)}
                className="w-full justify-start text-left p-3 h-auto"
              >
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.category} • {item.defaultInterval} day
                    {item.defaultInterval !== 1 ? "s" : ""}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

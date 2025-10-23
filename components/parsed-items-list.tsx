"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategorySelector } from "./category-selector";
import { IntervalPicker } from "./interval-picker";
import { CategoryPill } from "./category-pill";
import type { WasteCategory } from "@/lib/db";
import { WASTE_CATEGORIES } from "@/lib/constants";
import { Edit2, Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ParsedItem {
  id: string;
  name: string;
  quantity: string;
  category: WasteCategory;
  interval: number;
  confidence: number;
  isEditing?: boolean;
}

interface ParsedItemsListProps {
  items: ParsedItem[];
  onItemsChange: (items: ParsedItem[]) => void;
  onAddAll: () => void;
  className?: string;
}

export function ParsedItemsList({
  items,
  onItemsChange,
  onAddAll,
  className,
}: ParsedItemsListProps) {
  const [applyDefaults] = useState(true);
  
  // Log items whenever they change
  console.log('=== PARSED ITEMS LIST: Rendering ===');
  console.log('PARSED ITEMS LIST: Received items:', items);
  console.log('PARSED ITEMS LIST: Items length:', items.length);
  console.log('PARSED ITEMS LIST: Items details:', items.map((item, i) => `${i}: ${item.name} (${item.category})`));

  const updateItem = (id: string, updates: Partial<ParsedItem>) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    onItemsChange(updatedItems);
  };

  const toggleEdit = (id: string) => {
    updateItem(id, {
      isEditing: !items.find(item => item.id === id)?.isEditing,
    });
  };

  const removeItem = (id: string) => {
    const filteredItems = items.filter(item => item.id !== id);
    onItemsChange(filteredItems);
  };

  const applyDefaultsByCategory = () => {
    const updatedItems = items.map(item => ({
      ...item,
      interval: WASTE_CATEGORIES[item.category].defaultInterval,
    }));
    onItemsChange(updatedItems);
  };

  const purchaseDate = new Date();

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border border-black shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Found {items.length} item{items.length !== 1 ? "s" : ""}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyDefaultsByCategory}
                disabled={!applyDefaults}
              >
                Apply Defaults
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => {
            console.log(`PARSED ITEMS LIST: Rendering item ${index}:`, item);
            console.log(`PARSED ITEMS LIST: Item ${index} structure:`, {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              category: item.category,
              interval: item.interval,
              confidence: item.confidence,
              isEditing: item.isEditing
            });
            return (
            <div key={item.id} className="border border-black rounded-xl p-4 space-y-3 bg-card/50 hover:bg-card/80 transition-all duration-200 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {item.isEditing ? (
                    <Input
                      value={item.name}
                      onChange={e =>
                        updateItem(item.id, { name: e.target.value })
                      }
                      className="mb-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        ({item.quantity})
                      </span>
                      {item.confidence < 0.8 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Low confidence
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CategoryPill category={item.category} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      Dispose in {item.interval} day
                      {item.interval !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    {item.isEditing ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {item.isEditing && (
                <div className="space-y-4 pt-2 border-t">
                  <CategorySelector
                    value={item.category}
                    onChange={category =>
                      updateItem(item.id, {
                        category,
                        interval: WASTE_CATEGORIES[category].defaultInterval,
                      })
                    }
                  />

                  <IntervalPicker
                    value={item.interval}
                    onChange={interval => updateItem(item.id, { interval })}
                    purchaseDate={purchaseDate}
                  />
                </div>
              )}
            </div>
            );
          })}

        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryPill } from "./category-pill";
import { Package, Plus } from "lucide-react";
import type { WasteCategory } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecentItem {
  id: string;
  name: string;
  category: WasteCategory;
  addedAt: string;
  disposalAt: string;
}

interface RecentItemsCardProps {
  items: RecentItem[];
}

export function RecentItemsCard({ items }: RecentItemsCardProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Recently Added
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              No items added yet. Start by adding your first item!
            </p>
            <Link to="/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4" />
          Recently Added
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.slice(0, 3).map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-3 bg-muted rounded-lg border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <CategoryPill
                  category={item.category}
                  size="sm"
                  showLabel={false}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Added{" "}
                {formatDistanceToNow(new Date(item.addedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Dispose{" "}
                {formatDistanceToNow(new Date(item.disposalAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}

        {items.length > 3 && (
          <Link to="/items">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-transparent"
            >
              View All Items
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

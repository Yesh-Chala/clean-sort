import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Trash2, Edit, Calendar, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { storageService } from "@/lib/storage";
import { WASTE_CATEGORIES } from "@/lib/constants";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { WasteCategory } from "@/lib/db";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedItems = await storageService.getItems();
      setItems(storedItems);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await storageService.deleteItem(id);
      await loadItems(); // Reload items
      toast({
        title: "Item deleted",
        description: "Item has been removed from your list",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the item",
        variant: "destructive",
      });
    }
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  // Get category counts for display
  const getCategoryCount = (category: string) => {
    return items.filter(item => item.category === category).length;
  };

  if (loading) {
    return (
      <MobileLayout title="My Items">
        <div className="p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </MobileLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MobileLayout title="My Items">
        <div className="p-4">
          <EmptyState
            icon={Package}
            title="No items yet"
            description="Start adding items to track your waste disposal"
          >
            <Link to="/add" className="mt-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </Link>
          </EmptyState>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="My Items">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Your Items ({filteredItems.length}{selectedCategory !== "all" ? ` of ${items.length}` : ""})
          </h2>
          <Link to="/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by category:</span>
            </div>
            {selectedCategory !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="text-xs"
              >
                Clear Filter
              </Button>
            )}
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <span>All Categories</span>
                  <Badge variant="outline" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
              </SelectItem>
              {Object.entries(WASTE_CATEGORIES).map(([category, info]) => {
                const count = getCategoryCount(category);
                if (count === 0) return null; // Don't show categories with no items
                
                return (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                      <span>{info.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Filtered Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No items found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedCategory === "all" 
                ? "You don't have any items yet" 
                : `No items found in the ${WASTE_CATEGORIES[selectedCategory as WasteCategory]?.label} category`
              }
            </p>
            {selectedCategory !== "all" && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("all")}
                className="mr-2"
              >
                Show All Items
              </Button>
            )}
            <Link to="/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const categoryInfo = WASTE_CATEGORIES[item.category];
              const nextReminder = item.nextReminder 
                ? new Date(item.nextReminder)
                : new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000);

              return (
                <Card key={item.id} className="border border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`${categoryInfo.color} text-white text-xs`}
                          >
                            {categoryInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Next reminder: {format(nextReminder, "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Added {format(new Date(item.createdAt), "MMM dd, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

"use client";

import { MobileLayout } from "@/components/mobile-layout";
import { SafetyGuideCard } from "@/components/safety-guide-card";
import { EmptyState } from "@/components/empty-state";
import { getSafetyGuidesByCategory, getCategories } from "@/lib/disposal-safety-guides";
import { BookOpen, FilterIcon, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = getCategories();
  const allGuides = getSafetyGuidesByCategory(selectedCategory);

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return allGuides;
    
    const query = searchQuery.toLowerCase();
    return allGuides.filter(guide =>
      guide.title.toLowerCase().includes(query) ||
      guide.description.toLowerCase().includes(query) ||
      guide.doItems.some(item => item.toLowerCase().includes(query)) ||
      guide.dontItems.some(item => item.toLowerCase().includes(query)) ||
      guide.tips.some(tip => tip.toLowerCase().includes(query))
    );
  }, [allGuides, searchQuery]);

  return (
    <MobileLayout title="Safety Guides">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Disposal Safety Guides</h1>
          <p className="text-sm text-muted-foreground">
            Essential safety tips for proper waste disposal
          </p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search safety guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border border-black"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 border border-black">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {filteredGuides.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No guides found"
            description="Try adjusting your search or category filter"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {filteredGuides.length} Safety Guide{filteredGuides.length !== 1 ? 's' : ''}
              </h2>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs border border-black"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            {filteredGuides.map(guide => (
              <SafetyGuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
"use client";

import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { DisposalRuleCard } from "@/components/disposal-rule-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchGuides } from "@/components/search-guides";
import { useDisposalGuides } from "@/hooks/use-disposal-guides";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { BookOpen } from "lucide-react";

function GuidesSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Search skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />
      
      {/* Category filter skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
      
      {/* Content skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GuidesPage() {
  const [selectedRegion, setSelectedRegion] = useState("Maharashtra");

  const {
    loading,
    rules,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    handleCategoryToggle,
    clearFilters,
  } = useDisposalGuides(selectedRegion);

  if (loading) {
    return (
      <MobileLayout
        title="Disposal Guides"
        showLocationSelector={true}
        onRegionChange={setSelectedRegion}
      >
        <GuidesSkeleton />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title="Disposal Guides"
      showLocationSelector={true}
      onRegionChange={setSelectedRegion}
    >
      <div className="p-4 space-y-4">
        <SearchGuides value={searchQuery} onChange={setSearchQuery} />

        <CategoryFilter
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onClearFilters={clearFilters}
        />

        {rules.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No disposal guides found"
            description="Try adjusting your search or category filter"
          />
        ) : (
          <div className="space-y-4">
            {rules.map(rule => (
              <DisposalRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

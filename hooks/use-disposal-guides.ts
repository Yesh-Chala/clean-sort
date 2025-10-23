"use client";

import { useState, useEffect, useMemo } from "react";
import type { DisposalRule } from "@/components/disposal-rule-card";
import type { WasteCategory } from "@/lib/db";
import { getDisposalRulesByRegion } from "@/lib/disposal-rules-service";


export function useDisposalGuides(selectedRegion: string) {
  const [rules, setRules] = useState<DisposalRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>(
    []
  );

  useEffect(() => {
    loadDisposalRules(selectedRegion);
  }, [selectedRegion]);

  const loadDisposalRules = async (region: string) => {
    try {
      // Use local disposal rules service
      const rules = getDisposalRulesByRegion(region);
      setRules(rules);
    } catch (error) {
      console.error('Error loading disposal rules:', error);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRules = useMemo(() => {
    let filtered = rules;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        rule =>
          rule.title.toLowerCase().includes(query) ||
          rule.description.toLowerCase().includes(query) ||
          rule.category.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(rule =>
        selectedCategories.includes(rule.category)
      );
    }

    return filtered;
  }, [rules, searchQuery, selectedCategories]);

  const handleCategoryToggle = (category: WasteCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return {
    loading,
    rules: filteredRules,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    handleCategoryToggle,
    clearFilters,
    hasActiveFilters:
      searchQuery.trim() !== "" || selectedCategories.length > 0,
  };
}
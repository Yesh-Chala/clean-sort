"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "@/components/category-selector";
import { IntervalPicker } from "@/components/interval-picker";
import { QuantityInput } from "@/components/quantity-input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { WasteCategory } from "@/lib/db";
import { ArrowLeft, RotateCw as RotateCcwIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { storageService } from "@/lib/storage";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: null as WasteCategory | null,
    interval: 1,
    quantity: 1,
    unit: "pieces" as string,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes
  useEffect(() => {
    const hasChanges = 
      formData.name.trim() !== "" ||
      formData.category !== null ||
      formData.quantity !== 1 ||
      formData.interval !== 1 ||
      formData.unit !== "pieces";
    
    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: null,
      interval: 1,
      quantity: 1,
      unit: "pieces",
    });
    setHasUnsavedChanges(false);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Item name is required");
    } else if (formData.name.trim().length < 2) {
      errors.push("Item name must be at least 2 characters");
    }

    if (!formData.category) {
      errors.push("Please select a waste category");
    }

    if (formData.quantity <= 0) {
      errors.push("Quantity must be greater than 0");
    }

    if (formData.interval < 1) {
      errors.push("Reminder interval must be at least 1 day");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save item to storage
      const savedItem = await storageService.saveItem({
        name: formData.name.trim(),
        category: formData.category!,
        quantity: formData.quantity,
        unit: formData.unit,
        interval: formData.interval,
      });

      toast({
        title: "Item added successfully! 🎉",
        description: `${savedItem.name} will remind you in ${savedItem.interval} day${savedItem.interval !== 1 ? "s" : ""}`,
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        category: null,
        interval: 1,
        quantity: 1,
        unit: "pieces",
      });

      navigate("/home");
    } catch (error) {
      toast({
        title: "Failed to add item",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Add New Item</h1>
          </div>
          
          {hasUnsavedChanges && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                  <RotateCcwIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Form</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset the form? All your changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetForm}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Item Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Plastic bottles, Food waste, Old clothes"
              className="h-11"
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific to get better disposal guidance
            </p>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Waste Category *
            </Label>
            <CategorySelector
              id="category"
              value={formData.category}
              onChange={category => setFormData({ ...formData, category })}
            />
            <p className="text-xs text-muted-foreground">
              Select the type of waste for proper disposal
            </p>
          </div>

          {/* Quantity and Interval Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <QuantityInput
                quantity={formData.quantity.toString()}
                unit={formData.unit}
                onQuantityChange={quantity =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(quantity) || 1,
                  })
                }
                onUnitChange={unit => setFormData({ ...formData, unit })}
              />
            </div>

            {/* Interval Picker */}
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-sm font-medium">
                Reminder (days)
              </Label>
            <IntervalPicker
              id="interval"
              value={formData.interval}
              onChange={interval => setFormData({ ...formData, interval })}
              purchaseDate={new Date()}
            />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !hasUnsavedChanges}
              className="w-full h-11 text-base font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding Item...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
}

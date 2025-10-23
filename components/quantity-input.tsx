"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const UNITS = [
  { value: "pieces", label: "pieces" },
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "L", label: "L" },
  { value: "mL", label: "mL" },
  { value: "packets", label: "packets" },
  { value: "bottles", label: "bottles" },
  { value: "cans", label: "cans" },
  { value: "boxes", label: "boxes" },
];

interface QuantityInputProps {
  quantity: string;
  unit: string;
  onQuantityChange: (quantity: string) => void;
  onUnitChange: (unit: string) => void;
  className?: string;
}

export function QuantityInput({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  className,
}: QuantityInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">Quantity</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          min="1"
          step="0.1"
          value={quantity}
          onChange={e => onQuantityChange(e.target.value)}
          placeholder="1"
          className="flex-1"
        />
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-24 border border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg">
            {UNITS.map(unitOption => (
              <SelectItem key={unitOption.value} value={unitOption.value}>
                {unitOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

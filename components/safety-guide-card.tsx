"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle, X, Lightbulb } from "lucide-react";
import type { SafetyGuide } from "@/lib/disposal-safety-guides";

interface SafetyGuideCardProps {
  guide: SafetyGuide;
  className?: string;
}

export function SafetyGuideCard({ guide, className }: SafetyGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={`border border-black shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{guide.icon}</div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold leading-tight">
                {guide.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {guide.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`text-xs ${getSeverityColor(guide.severity)}`}>
              {guide.severity.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="space-y-2">
              <h4 className="font-medium text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Do's
              </h4>
              <ul className="space-y-1">
                {guide.doItems.map((item, index) => (
                  <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="space-y-2">
              <h4 className="font-medium text-red-700 flex items-center gap-2">
                <X className="h-4 w-4" />
                Don'ts
              </h4>
              <ul className="space-y-1">
                {guide.dontItems.map((item, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Tips */}
          {guide.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Pro Tips
              </h4>
              <ul className="space-y-1">
                {guide.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

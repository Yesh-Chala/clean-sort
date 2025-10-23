"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "./category-pill";
import { ExternalLink, MapPin, Clock, CheckCircle, X } from "lucide-react";
import type { WasteCategory } from "@/lib/db";
import { format } from "date-fns";

export interface DisposalRule {
  id: string;
  category: WasteCategory;
  region: string;
  city: string;
  title: string;
  description: string;
  steps: string[];
  dosList: string[];
  dontsList: string[];
  externalLinks: { title: string; url: string }[];
  pickupSchedule?: string;
  dropoffLocations?: string[];
  lastUpdated: string;
}

interface DisposalRuleCardProps {
  rule: DisposalRule;
  className?: string;
}

export function DisposalRuleCard({ rule, className }: DisposalRuleCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CategoryPill category={rule.category} size="sm" />
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {rule.city}
              </Badge>
            </div>
            <CardTitle className="text-base leading-tight">
              {rule.title}
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {rule.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Steps */}
        {rule.steps.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">How to dispose:</h4>
            <ol className="space-y-1">
              {rule.steps.map((step, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="font-medium text-primary min-w-[1.5rem]">
                    {index + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rule.dosList.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-green-700 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Do's
              </h4>
              <ul className="space-y-1">
                {rule.dosList.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-green-600 min-w-[1rem]">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rule.dontsList.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-red-700 dark:text-red-400 flex items-center gap-1">
                <X className="h-4 w-4" />
                Don'ts
              </h4>
              <ul className="space-y-1">
                {rule.dontsList.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-red-600 min-w-[1rem]">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pickup Schedule */}
        {rule.pickupSchedule && (
          <div className="bg-muted rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Pickup Schedule</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {rule.pickupSchedule}
            </p>
          </div>
        )}

        {/* Drop-off Locations */}
        {rule.dropoffLocations && rule.dropoffLocations.length > 0 && (
          <div className="bg-muted rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Drop-off Locations</span>
            </div>
            <ul className="space-y-1">
              {rule.dropoffLocations.map((location, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {location}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* External Links */}
        {rule.externalLinks.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">More Information</h4>
            <div className="space-y-2">
              {rule.externalLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{link.title}</span>
                      <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {format(new Date(rule.lastUpdated), "MMM d, yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

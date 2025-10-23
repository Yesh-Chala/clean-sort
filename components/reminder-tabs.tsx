"use client";

import type React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ReminderTabsProps {
  upcomingCount: number;
  completedCount: number;
  missedCount: number;
  children: React.ReactNode;
}

export function ReminderTabs({
  upcomingCount,
  completedCount,
  missedCount,
  children,
}: ReminderTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming" className="text-xs">
          Upcoming
          {upcomingCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {upcomingCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed" className="text-xs">
          Completed
          {completedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {completedCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="missed" className="text-xs">
          Missed
          {missedCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {missedCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

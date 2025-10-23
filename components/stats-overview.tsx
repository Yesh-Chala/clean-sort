"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Recycle, AlertTriangle, CheckCircle } from "lucide-react";

interface StatsOverviewProps {
  totalItems: number;
  upcomingReminders: number;
  completedThisWeek: number;
  overdueItems: number;
}

export function StatsOverview({
  totalItems,
  upcomingReminders,
  completedThisWeek,
  overdueItems,
}: StatsOverviewProps) {
  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      label: "Upcoming",
      value: upcomingReminders,
      icon: Recycle,
      color: "text-green-600",
    },
    {
      label: "Completed",
      value: completedThisWeek,
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      label: "Overdue",
      value: overdueItems,
      icon: AlertTriangle,
      color: overdueItems > 0 ? "text-red-600" : "text-gray-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="hover:shadow-md transition-shadow duration-200 border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

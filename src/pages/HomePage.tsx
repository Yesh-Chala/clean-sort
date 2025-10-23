import { MobileLayout } from "@/components/mobile-layout";
import { FloatingActionButton } from "@/components/floating-action-button";
import { QuickActionCard } from "@/components/quick-action-card";
import { ReminderPreviewCard } from "@/components/reminder-preview-card";
import { RecentItemsCard } from "@/components/recent-items-card";
import { StatsOverview } from "@/components/stats-overview";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Camera, Plus, BookOpen, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    loading,
    stats,
    reminders,
    recentItems,
    handleMarkDone,
    handleSnooze,
  } = useDashboardData();

  if (loading) {
    return (
      <MobileLayout
        showLocationSelector={true}
        showNotificationBell={true}
        notificationCount={stats?.overdueItems || 0}
      >
        <DashboardSkeleton />
        <FloatingActionButton />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showLocationSelector={true}
      showNotificationBell={true}
      notificationCount={stats.overdueItems}
    >
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">♻️</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-balance bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to CleanSort
          </h1>
          <p className="text-muted-foreground text-pretty text-sm">
            Smart waste management for a cleaner tomorrow
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview {...stats} />

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <span className="text-xs text-muted-foreground">Get started</span>
          </div>
          <div className="space-y-3">
            <QuickActionCard
              href="/scan"
              icon={Camera}
              title="Scan Receipt"
              description="Upload receipt and auto-add items"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <QuickActionCard
              href="/add"
              icon={Plus}
              title="Add Item"
              description="Manually add a single item"
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
          </div>
        </div>

        {/* Upcoming Disposals */}
        <ReminderPreviewCard
          reminders={reminders}
          onMarkDone={handleMarkDone}
          onSnooze={handleSnooze}
        />

        {/* Recently Added Items */}
        <RecentItemsCard items={recentItems} />

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Explore</h2>
            <span className="text-xs text-muted-foreground">More features</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              href="/guides"
              icon={BookOpen}
              title="Disposal Guides"
              description="Local rules & tips"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              className="col-span-1"
            />
            <QuickActionCard
              href="/items"
              icon={Package}
              title="My Items"
              description="View all items"
              color="bg-gradient-to-br from-orange-500 to-orange-600"
              className="col-span-1"
            />
          </div>
        </div>
      </div>

      <FloatingActionButton />
    </MobileLayout>
  );
}

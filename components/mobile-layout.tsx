"use client";

import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { MobileHeader } from "./mobile-header";
import { PWAInstall } from "./pwa-install";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showLocationSelector?: boolean;
  showNotificationBell?: boolean;
  notificationCount?: number;
  className?: string;
  onRegionChange?: (region: string) => void;
}

export function MobileLayout({
  children,
  title,
  showLocationSelector = false,
  showNotificationBell = false,
  notificationCount = 0,
  className = "",
  onRegionChange,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader
        title={title}
        showLocationSelector={showLocationSelector}
        showNotificationBell={showNotificationBell}
        notificationCount={notificationCount}
        onRegionChange={onRegionChange}
      />

      <main className={`pb-20 ${className}`}>{children}</main>

      <BottomNav />
      <PWAInstall />
    </div>
  );
}

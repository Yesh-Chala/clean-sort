"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Plus, Bell, BookOpen, Settings } from "lucide-react";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "🏠 Home",
    exact: true,
  },
  {
    href: "/add",
    icon: Plus,
    label: "➕ Add",
    exact: false,
  },
  {
    href: "/reminders",
    icon: Bell,
    label: "🔔 Reminders",
    exact: false,
  },
  {
    href: "/guides",
    icon: BookOpen,
    label: "📚 Guides",
    exact: false,
  },
  {
    href: "/settings",
    icon: Settings,
    label: "⚙️ Settings",
    exact: false,
  },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-xl">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-h-[60px] px-3 py-1 rounded-lg transition-all duration-200 border border-transparent",
                "text-xs font-medium gap-1",
                active
                  ? "text-primary bg-primary/10 border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border/50"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

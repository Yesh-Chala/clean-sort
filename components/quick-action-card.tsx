import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  className?: string;
}

export function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  color = "bg-primary",
  className,
}: QuickActionCardProps) {
  return (
    <Link to={href}>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-border shadow-sm",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                color
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-sm text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

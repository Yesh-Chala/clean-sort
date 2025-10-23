"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bell, ChevronDown, Wifi, WifiOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CityChangeDialog } from "@/components/city-change-dialog";
import { storageService } from "@/lib/storage";

interface MobileHeaderProps {
  title?: string;
  showLocationSelector?: boolean;
  showNotificationBell?: boolean;
  notificationCount?: number;
  onRegionChange?: (region: string) => void;
}

export function MobileHeader({
  title,
  showLocationSelector = false,
  showNotificationBell = false,
  notificationCount = 0,
  onRegionChange,
}: MobileHeaderProps) {
  const [selectedRegion, setSelectedRegion] = useState("Bengaluru, Karnataka");
  const [isOnline] = useState(true);
  const [showCityDialog, setShowCityDialog] = useState(false);
  const [pendingCity, setPendingCity] = useState<string>("");
  const [pendingRegion, setPendingRegion] = useState<string>("");

  // Load saved city on component mount
  useEffect(() => {
    const loadSavedCity = async () => {
      try {
        const savedCity = await storageService.getSelectedCity();
        setSelectedRegion(savedCity);
      } catch (error) {
        console.error("Error loading saved city:", error);
      }
    };
    loadSavedCity();
  }, []);

  const handleCityChange = (city: string, region: string) => {
    if (city === selectedRegion) return; // No change needed
    
    setPendingCity(city);
    setPendingRegion(region);
    setShowCityDialog(true);
  };

  const confirmCityChange = async () => {
    try {
      await storageService.setSelectedCity(pendingCity);
      setSelectedRegion(pendingCity);
      onRegionChange?.(pendingRegion);
    } catch (error) {
      console.error("Error saving city:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {title && (
            <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
          )}

          {showLocationSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-background/50 hover:bg-background/80 border-border/50 transition-all duration-200"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{selectedRegion}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl">
                <DropdownMenuItem
                  onClick={() => handleCityChange("Mumbai, Maharashtra", "Maharashtra")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Mumbai, Maharashtra
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCityChange("Delhi, NCR", "Delhi")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Delhi, NCR
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCityChange("Bengaluru, Karnataka", "Karnataka")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Bengaluru, Karnataka
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCityChange("Chennai, Tamil Nadu", "Tamil Nadu")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Chennai, Tamil Nadu
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCityChange("Hyderabad, Telangana", "Telangana")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Hyderabad, Telangana
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCityChange("Pune, Maharashtra", "Maharashtra")}
                  className="bg-background hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150"
                >
                  Pune, Maharashtra
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Online/Offline indicator */}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>

          {showNotificationBell && (
            <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 transition-colors duration-200">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* City Change Confirmation Dialog */}
      <CityChangeDialog
        isOpen={showCityDialog}
        onClose={() => setShowCityDialog(false)}
        onConfirm={confirmCityChange}
        currentCity={selectedRegion}
        newCity={pendingCity}
      />
    </header>
  );
}

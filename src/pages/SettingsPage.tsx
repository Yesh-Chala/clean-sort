"use client";

import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { 
  ArrowLeft, 
  Moon as MoonIcon, 
  Sun as SunIcon, 
  Bell, 
  MapPin, 
  Download, 
  Trash2, 
  HelpCircle as HelpCircleIcon, 
  InfoIcon,
  Shield as ShieldIcon,
  Database as DatabaseIcon
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleExportData = async () => {
    try {
      const data = await storageService.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cleansort-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export your data",
        variant: "destructive",
      });
    }
  };

  const handleClearData = async () => {
    try {
      await storageService.clearAllData();
      toast({
        title: "Data Cleared",
        description: "All your data has been removed",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Could not clear your data",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    setNotifications(true);
    setLocationServices(true);
    setAutoSync(true);
    setTheme("system");
    
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults",
    });
  };

  return (
    <MobileLayout title="Settings">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Appearance */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <SunIcon className="h-4 w-4" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-sm">
                Theme
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="h-8 w-8 p-0"
                >
                  <SunIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="h-8 w-8 p-0"
                >
                  <MoonIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="h-8 w-8 p-0"
                >
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm">
                  Reminder Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified about upcoming disposal reminders
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
            <CardDescription>
              Location-based disposal guides and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location" className="text-sm">
                  Location Services
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable for location-specific disposal guides
                </p>
              </div>
              <Switch
                id="location"
                checked={locationServices}
                onCheckedChange={setLocationServices}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Sync */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DatabaseIcon className="h-4 w-4" />
              Data & Sync
            </CardTitle>
            <CardDescription>
              Manage your data and synchronization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autosync" className="text-sm">
                  Auto Sync
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync data across devices
                </p>
              </div>
              <Switch
                id="autosync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your items, reminders, and settings. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldIcon className="h-4 w-4" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Your privacy and data security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Privacy Policy",
                  description: "Privacy policy will open in your browser",
                })}
              >
                <ShieldIcon className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Terms of Service",
                  description: "Terms of service will open in your browser",
                })}
              >
                <InfoIcon className="h-4 w-4 mr-2" />
                Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircleIcon className="h-4 w-4" />
              Help & Support
            </CardTitle>
            <CardDescription>
              Get help and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Help Center",
                  description: "Help center will open in your browser",
                })}
              >
                <HelpCircleIcon className="h-4 w-4 mr-2" />
                Help Center
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Contact Support",
                  description: "Contact support will open in your browser",
                })}
              >
                <InfoIcon className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card className="border border-border">
          <CardContent className="pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Reset All Settings
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all your settings to their default values. 
                    Your data will not be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetSettings}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            CleanSort v1.0.0
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}

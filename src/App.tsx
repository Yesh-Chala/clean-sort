import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstall } from "@/components/pwa-install";
import { Onboarding } from "@/components/onboarding";
import { storageService } from "@/lib/storage";
import HomePage from "./pages/HomePage";
import AddItemPage from "./pages/AddItemPage";
import ScanPage from "./pages/ScanPage";
import RemindersPage from "./pages/RemindersPage";
import GuidesPage from "./pages/GuidesPage";
import ItemsPage from "./pages/ItemsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await storageService.getOnboardingStatus();
        setShowOnboarding(!hasCompletedOnboarding);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setShowOnboarding(true); // Show onboarding if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await storageService.setOnboardingCompleted();
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      setShowOnboarding(false); // Still hide onboarding even if save fails
    }
  };

  // Show loading state while checking onboarding status
  if (isLoading) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="fixed inset-0 bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
              <span className="text-3xl">♻️</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">CleanSort</h1>
              <p className="text-sm text-muted-foreground">Smart waste management</p>
            </div>
            <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddItemPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster />
      <PWAInstall />
    </ThemeProvider>
  );
}

export default App;

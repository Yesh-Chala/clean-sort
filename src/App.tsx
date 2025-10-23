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
        <div className="fixed inset-0 bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mx-auto flex items-center justify-center">
              <span className="text-2xl">♻️</span>
            </div>
            <h1 className="text-xl font-semibold">CleanSort</h1>
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
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

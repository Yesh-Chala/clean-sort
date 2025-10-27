import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstall } from "@/components/pwa-install";
import { Onboarding } from "@/components/onboarding";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { storageService } from "@/lib/storage";
import HomePage from "./pages/HomePage";
import AddItemPage from "./pages/AddItemPage";
import ScanPage from "./pages/ScanPage";
import RemindersPage from "./pages/RemindersPage";
import GuidesPage from "./pages/GuidesPage";
import ItemsPage from "./pages/ItemsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function AuthenticatedApp() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await storageService.getOnboardingStatus();
        console.log("Onboarding status:", hasCompletedOnboarding);
        setShowOnboarding(!hasCompletedOnboarding);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error, assume onboarding is not completed
        // This will show onboarding for new users or if there's a connection issue
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkOnboardingStatus();
    } else {
      // If no user, don't show anything - let ProtectedRoute handle redirect
      setShowOnboarding(false);
      setIsLoading(false);
    }
  }, [user]);

  // If no user, don't render anything - ProtectedRoute will handle redirect
  if (!user) {
    return null;
  }

  const handleOnboardingComplete = async () => {
    try {
      console.log("Marking onboarding as completed...");
      await storageService.setOnboardingCompleted();
      console.log("Onboarding completed successfully");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      setShowOnboarding(false); // Still hide onboarding even if save fails
    }
  };

  // Show loading state while checking onboarding status
  if (isLoading) {
    return (
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
    );
  }

  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AuthenticatedApp />
            </ProtectedRoute>
          } />
        </Routes>
        
        <Toaster />
        <PWAInstall />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

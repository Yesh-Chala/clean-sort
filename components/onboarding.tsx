"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Plus, 
  BookOpen, 
  Bell, 
  ArrowRight, 
  CheckCircle,
  MapPin,
  Recycle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to CleanSort",
    description: "Your smart companion for waste management and disposal reminders",
    icon: Recycle,
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Scan Receipts",
    description: "Take a photo of your receipt to automatically add items to your inventory",
    icon: Camera,
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Add Items Manually",
    description: "Manually add items with custom quantities and disposal intervals",
    icon: Plus,
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Get Disposal Guides",
    description: "Access location-specific disposal guides and recycling tips",
    icon: BookOpen,
    color: "bg-orange-500",
  },
  {
    id: 5,
    title: "Set Reminders",
    description: "Never miss disposal dates with smart reminders and notifications",
    icon: Bell,
    color: "bg-red-500",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show onboarding after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md mx-auto border border-border shadow-lg">
          <CardContent className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center",
                    currentStepData.color
                  )}
                >
                  <currentStepData.icon className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Title and Description */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentStep
                        ? "bg-primary"
                        : index < currentStep
                        ? "bg-primary/50"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {currentStep < onboardingSteps.length - 1 ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      className="flex-1"
                    >
                      Skip
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleComplete} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scan } from "lucide-react";

interface OCRProgressProps {
  isProcessing: boolean;
  onComplete?: () => void;
  isComplete?: boolean;
}

export function OCRProgress({ isProcessing, onComplete, isComplete }: OCRProgressProps) {
  const [currentStep, setCurrentStep] = useState("");

  const steps = [
    "Uploading image to AI service...",
    "Analyzing image quality...",
    "Detecting text regions...",
    "Extracting item names...",
    "Identifying quantities...",
    "Categorizing items...",
    "Finalizing results...",
  ];

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep("");
      return;
    }

    // Cycle through steps to show activity
    let stepIndex = 0;
    setCurrentStep(steps[0]);
    
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setCurrentStep(steps[stepIndex]);
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Complete when API call finishes
  useEffect(() => {
    if (isComplete && isProcessing) {
      setCurrentStep("Processing complete!");
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  }, [isComplete, isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <Scan className="h-8 w-8 text-primary animate-spin" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Processing Receipt</h3>
            <p className="text-sm text-muted-foreground mb-4">{currentStep}</p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-muted-foreground">
              This may take a few moments...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

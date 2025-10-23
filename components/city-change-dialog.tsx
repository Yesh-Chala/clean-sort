"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin } from "lucide-react";
import { getCityPrompt } from "@/lib/city-prompts";

interface CityChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentCity: string;
  newCity: string;
}

export function CityChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  currentCity,
  newCity,
}: CityChangeDialogProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleConfirm = async () => {
    setIsChanging(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error changing city:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const newCityPrompt = getCityPrompt(newCity);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-background/95 backdrop-blur-md border-border/50 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Change Location
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You're about to change your location from{" "}
              <span className="font-medium">{currentCity}</span> to{" "}
              <span className="font-medium">{newCity}</span>.
            </p>
            
            {newCityPrompt && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm">ℹ️</span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">
                      Location-specific features will be updated:
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {newCityPrompt.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              This will update your disposal guides and customize receipt processing 
              for your new location's waste management rules.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isChanging} className="transition-colors duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isChanging}
            className="bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            {isChanging ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Changing...
              </>
            ) : (
              "Change Location"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

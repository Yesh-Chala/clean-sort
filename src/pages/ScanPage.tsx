"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile-layout";
import { CameraUpload } from "@/components/camera-upload";
import { OCRProgress } from "@/components/ocr-progress";
import {
  ParsedItemsList,
  type ParsedItem,
} from "@/components/parsed-items-list";
import { OCRService } from "@/lib/ocr-service";
import { storageService } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, CheckCircle, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// type ScanStep = "upload" | "processing" | "results"

export default function ScanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);

  const handleImageCapture = (file: File) => {
    console.log('=== SCAN PAGE: Image captured ===');
    setCapturedImage(file);
    setParsedItems([]);
    setProcessingComplete(false);
    toast({
      title: "Image Captured!",
      description: "Click 'Process Receipt' to analyze your receipt",
    });
  };

  const handleProcessReceipt = async () => {
    if (!capturedImage) {
      toast({
        title: "No Image",
        description: "Please capture or upload an image first",
        variant: "destructive",
      });
      return;
    }

    console.log('=== SCAN PAGE: Starting receipt processing ===');
    setIsProcessing(true);
    setProcessingComplete(false);
    
    try {
      // Use real OCR service
      console.log('SCAN PAGE: Calling OCRService.processReceipt...');
      const items = await OCRService.processReceipt(capturedImage);
      console.log('SCAN PAGE: Received items from OCR service:', items);
      console.log('SCAN PAGE: Number of items received:', items.length);
      
      setParsedItems(items);
      setProcessingComplete(true);
      console.log('SCAN PAGE: Set parsedItems state to:', items);
      setIsProcessing(false);
      
      toast({
        title: "Receipt Processed Successfully! 🎉",
        description: `Found ${items.length} items in your receipt`,
      });
    } catch (error) {
      console.error('SCAN PAGE: OCR processing error:', error);
      setIsProcessing(false);
      setProcessingComplete(false);
      
      toast({
        title: "Processing Failed",
        description: "Could not read the receipt. Please try again with a clearer image.",
        variant: "destructive",
      });
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
  };

  const handleAddAllItems = async () => {
    console.log('=== SCAN PAGE: Starting handleAddAllItems ===');
    console.log('SCAN PAGE: Current parsedItems:', parsedItems);
    console.log('SCAN PAGE: parsedItems length:', parsedItems?.length);
    
    if (!parsedItems || parsedItems.length === 0) {
      console.log('SCAN PAGE: No items to add, showing error toast');
      toast({
        title: "No items to add",
        description: "Please scan a receipt first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save all items to local storage atomically to avoid race conditions
      console.log('SCAN PAGE: Starting to save items to storage...');
      console.log('SCAN PAGE: Total items to save:', parsedItems.length);
      
      // Prepare all items for saving
      const itemsToSave = parsedItems.map((item, index) => {
        console.log(`SCAN PAGE: Processing item ${index} for storage:`, item);
        // Extract quantity number from string like "1 pack" or "1.2 kg"
        const quantityMatch = item.quantity.match(/(\d+(?:\.\d+)?)/);
        const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
        
        const itemToSave = {
          name: item.name,
          category: item.category as any, // Type assertion needed
          quantity: quantity,
          unit: "pieces", // Default unit
          interval: item.interval,
        };
        console.log(`SCAN PAGE: Item ${index} to save:`, itemToSave);
        console.log(`SCAN PAGE: Quantity extracted: "${item.quantity}" -> ${quantity}`);
        return itemToSave;
      });
      
      // Save all items atomically
      try {
        const savedItems = await storageService.saveMultipleItems(itemsToSave);
        console.log('SCAN PAGE: Successfully saved all items:', savedItems.length);
        console.log('SCAN PAGE: Save completed - all items saved successfully');
      } catch (error) {
        console.error('SCAN PAGE: Failed to save items:', error);
        throw error;
      }

      // Also try to upload to server (optional)
      try {
        await OCRService.uploadToAPI(parsedItems);
      } catch (serverError) {
        console.log('Server upload failed, but items saved locally');
      }

      toast({
        title: "Items added successfully! 🎉",
        description: `Added ${parsedItems.length} items from your receipt`,
      });

      // Clear the parsed items and navigate
      setParsedItems([]);
      navigate("/home");
    } catch (error) {
      console.error('Error adding items:', error);
      toast({
        title: "Failed to add items",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <h1 className="text-xl font-semibold">📸 Smart Scanner</h1>
          </div>
        </div>

        {/* Camera Upload */}
        <CameraUpload onImageCapture={handleImageCapture} />

        {/* Process Button - Show when image is captured but not processed */}
        {capturedImage && !processingComplete && !isProcessing && (
          <div className="pt-4 animate-in slide-in-from-bottom-4 duration-500">
            <Button 
              onClick={handleProcessReceipt}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg"
            >
              <Scan className="h-5 w-5 mr-2" />
              🚀 Process Receipt
            </Button>
          </div>
        )}

        {/* OCR Progress */}
        <OCRProgress
          isProcessing={isProcessing}
          isComplete={processingComplete}
          onComplete={() => handleProcessingComplete()}
        />

        {/* Processing Complete Success Message */}
        {processingComplete && parsedItems.length > 0 && (
          <div className="pt-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-6 text-center shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2 text-lg">🎉 Amazing! Processing Complete!</h3>
              <p className="text-sm text-green-700">
                Found {parsedItems.length} item{parsedItems.length !== 1 ? 's' : ''} in your receipt - you're doing great! 🌟
              </p>
            </div>
          </div>
        )}

        {/* Parsed Items List */}
        {processingComplete && (
          <ParsedItemsList
            items={parsedItems || []}
            onItemsChange={setParsedItems}
            onAddAll={handleAddAllItems}
          />
        )}

        {/* Add All Items Button */}
        {processingComplete && parsedItems && parsedItems.length > 0 && (
          <div className="pt-4 space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <Button 
              onClick={handleAddAllItems} 
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding Items...
                </>
              ) : (
                `✨ Add All ${parsedItems.length} Items`
              )}
            </Button>
            
            <Button 
              onClick={() => {
                setCapturedImage(null);
                setParsedItems([]);
                setProcessingComplete(false);
                setIsProcessing(false);
              }}
              variant="outline"
              className="w-full h-11 text-sm border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              <Camera className="h-4 w-4 mr-2" />
              📸 Scan Another Receipt
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

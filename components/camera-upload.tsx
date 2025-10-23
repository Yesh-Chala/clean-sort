"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, RotateCw, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraUploadProps {
  onImageCapture: (file: File) => void;
  className?: string;
}

export function CameraUpload({ onImageCapture, className }: CameraUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(
      blob => {
        if (blob) {
          const file = new File([blob], "receipt.jpg", { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          onImageCapture(file);
          stopCamera();
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageCapture(file);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!previewUrl && !isCapturing && (
        <div className="space-y-3">
          <Button
            type="button"
            onClick={startCamera}
            size="lg"
            className="w-full"
          >
            <Camera className="h-5 w-5 mr-2" />
            Take Photo
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="w-full"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload from Gallery
          </Button>
        </div>
      )}

      {isCapturing && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={stopCamera}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button type="button" onClick={capturePhoto} size="sm">
                  <Camera className="h-4 w-4 mr-1" />
                  Capture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Receipt preview"
                className="w-full rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                disabled
              >
                <RotateCw className="h-4 w-4 mr-1" />
                Rotate
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                disabled
              >
                <Crop className="h-4 w-4 mr-1" />
                Crop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

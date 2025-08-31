"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, RefreshCcw, Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CameraInputProps {
  onCapture: (dataUri: string) => void;
}

export function CameraInput({ onCapture }: CameraInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported in this browser.");
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUri);
      }
    }
  }, []);

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 border-2 border-dashed rounded-lg bg-card transition-colors min-h-[220px]">
        <canvas ref={canvasRef} className="hidden" />
        {capturedImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-sm font-medium">Image Captured</p>
                <img src={capturedImage} alt="Captured" className="rounded-md max-h-40 w-auto" />
                <div className="flex gap-2">
                    <Button onClick={handleRetake} variant="outline"><RefreshCcw className="mr-2"/>Retake</Button>
                    <Button onClick={handleConfirm}><Send className="mr-2"/>Confirm</Button>
                </div>
            </div>
        ) : (
            <div className="w-full">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature. You may need to refresh the page after granting permission.
                        </AlertDescription>
                    </Alert>
                )}
                 {hasCameraPermission && (
                    <Button onClick={captureImage} className="w-full mt-2" disabled={!hasCameraPermission}>
                        <Camera className="mr-2" />
                        Capture
                    </Button>
                )}
            </div>
        )}
    </div>
  );
}

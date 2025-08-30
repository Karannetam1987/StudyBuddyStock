"use client";

import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VoiceInputButtonProps {
  isRecording: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export function VoiceInputButton({ isRecording, isAvailable, onClick }: VoiceInputButtonProps) {
  if (!isAvailable) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" disabled className="cursor-not-allowed opacity-50">
              <Mic className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input not available in this browser.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`transition-colors ${isRecording ? 'bg-accent/80 text-accent-foreground' : ''}`}
            onClick={onClick}
          >
            <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isRecording ? "Stop recording" : "Start recording (speak)"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

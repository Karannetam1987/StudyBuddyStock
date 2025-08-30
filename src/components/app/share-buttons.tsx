"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ShareButtons({ textToShare }: { textToShare: string }) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToShare).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "The question and answer have been copied.",
      });
    }, (err) => {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  const shareOn = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let url: string;
    const shareUrl = "https://firestudio.ai"; // A placeholder URL
    const encodedText = encodeURIComponent(textToShare);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=AI-Generated Answer&summary=${encodedText}`;
        break;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareActions = [
    { name: "Twitter", icon: Twitter, action: () => shareOn('twitter') },
    { name: "Facebook", icon: Facebook, action: () => shareOn('facebook') },
    { name: "LinkedIn", icon: Linkedin, action: () => shareOn('linkedin') },
    { name: "Copy", icon: Copy, action: copyToClipboard },
  ];

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share</span>
       <TooltipProvider>
        {shareActions.map(({ name, icon: Icon, action }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={action}>
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on {name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FacebookIcon, InstagramIcon, TelegramIcon, WhatsappIcon } from "@/components/app/social-icons";

export function AppShare() {
    const { toast } = useToast();
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = "Check out this awesome StudyBuddy app!";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
            title: "Copied to clipboard!",
            description: "The app link has been copied.",
        });
        }, (err) => {
        toast({
            variant: "destructive",
            title: "Failed to copy",
            description: "Could not copy link to clipboard.",
        });
        });
    };

    const shareOn = (platform: 'whatsapp' | 'facebook' | 'instagram' | 'telegram') => {
        let url: string;
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);

        switch(platform) {
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                break;
            case 'telegram':
                 url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'instagram':
                // Instagram does not support direct sharing with pre-filled text via URL.
                // This will open Instagram. The user has to manually share.
                url = `https://www.instagram.com`;
                toast({
                    title: "Share on Instagram",
                    description: "Copy the link and share it in your story or bio!",
                  });
                break;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <Card className="bg-muted/50 border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Share2 className="h-6 w-6 text-primary" />
                    Share the App
                </CardTitle>
                <CardDescription>If you find this app helpful, share it with your friends!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
                 <Button onClick={() => shareOn('whatsapp')} variant="outline" className="flex-1 min-w-[140px] gap-2">
                    <WhatsappIcon className="h-5 w-5"/> WhatsApp
                </Button>
                <Button onClick={() => shareOn('facebook')} variant="outline" className="flex-1 min-w-[140px] gap-2">
                    <FacebookIcon className="h-5 w-5"/> Facebook
                </Button>
                <Button onClick={() => shareOn('instagram')} variant="outline" className="flex-1 min-w-[140px] gap-2">
                    <InstagramIcon className="h-5 w-5"/> Instagram
                </Button>
                 <Button onClick={() => shareOn('telegram')} variant="outline" className="flex-1 min-w-[140px] gap-2">
                    <TelegramIcon className="h-5 w-5"/> Telegram
                </Button>
                <Button onClick={copyToClipboard} variant="secondary" className="flex-1 min-w-[140px] gap-2">
                    <Copy className="h-5 w-5" /> Copy Link
                </Button>
            </CardContent>
        </Card>
    );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FacebookIcon, InstagramIcon, TelegramIcon, WhatsappIcon } from "@/components/app/social-icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
            <CardContent className="flex flex-col items-center justify-center gap-4">
                 <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button onClick={() => shareOn('whatsapp')} variant="outline" size="icon" className="h-14 w-14 rounded-full hover:bg-[#25D366] hover:text-white transition-colors">
                        <WhatsappIcon className="h-7 w-7"/>
                    </Button>
                    <Button onClick={() => shareOn('facebook')} variant="outline" size="icon" className="h-14 w-14 rounded-full hover:bg-[#1877F2] hover:text-white transition-colors">
                        <FacebookIcon className="h-7 w-7"/>
                    </Button>
                    <Button onClick={() => shareOn('instagram')} variant="outline" size="icon" className="h-14 w-14 rounded-full hover:bg-[#E4405F] hover:text-white transition-colors">
                        <InstagramIcon className="h-7 w-7"/>
                    </Button>
                    <Button onClick={() => shareOn('telegram')} variant="outline" size="icon" className="h-14 w-14 rounded-full hover:bg-[#26A5E4] hover:text-white transition-colors">
                        <TelegramIcon className="h-7 w-7"/>
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" size="icon" className="h-14 w-14 rounded-full hover:bg-muted-foreground hover:text-background transition-colors">
                        <Copy className="h-7 w-7" />
                    </Button>
                 </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                    </Link>
                    <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                    </Link>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                    </Link>
                </div>
                 <p className="text-center text-sm text-muted-foreground mt-4">
                    © 2025 Investo Future Consultancy. All rights reserved.
                </p>
            </CardContent>
        </Card>
    );
}

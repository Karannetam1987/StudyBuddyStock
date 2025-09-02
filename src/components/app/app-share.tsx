
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, FileBadge, ShieldCheck, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FacebookIcon, InstagramIcon, TelegramIcon, WhatsappIcon, YouTubeIcon } from "@/components/app/social-icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { NearMeSearch } from "@/components/app/near-me-search";

export function AppShare() {
    const { toast } = useToast();
    const shareUrl = typeof window !== 'undefined' ? 'https://study-buddy-stock.com' : '';
    const shareText = "Check out this awesome StudyBuddy app!";
    const youtubeUrl = 'https://www.youtube.com/@investofuture';

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

    const shareOn = (platform: 'whatsapp' | 'facebook' | 'instagram' | 'telegram' | 'youtube') => {
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
                url = `https://www.instagram.com`;
                toast({
                    title: "Share on Instagram",
                    description: "Copy the link and share it in your story or bio!",
                  });
                break;
            case 'youtube':
                url = youtubeUrl;
                break;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <Card className="bg-muted/50 border-border/50">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3">
                    <Share2 className="h-6 w-6 text-primary" />
                    Share the App
                </CardTitle>
                <CardDescription>If you find this app helpful, share it with your friends!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button onClick={() => shareOn('whatsapp')} variant="outline" size="icon" className="h-12 w-12 rounded-lg hover:bg-[#25D366] hover:text-white transition-colors">
                        <WhatsappIcon className="h-6 w-6"/>
                    </Button>
                    <Button onClick={() => shareOn('facebook')} variant="outline" size="icon" className="h-12 w-12 rounded-lg hover:bg-[#1877F2] hover:text-white transition-colors">
                        <FacebookIcon className="h-6 w-6"/>
                    </Button>
                    <Button onClick={() => shareOn('instagram')} variant="outline" size="icon" className="h-12 w-12 rounded-lg hover:bg-[#E4405F] hover:text-white transition-colors">
                        <InstagramIcon className="h-6 w-6"/>
                    </Button>
                    <Button onClick={() => shareOn('telegram')} variant="outline" size="icon" className="h-12 w-12 rounded-lg hover:bg-[#26A5E4] hover:text-white transition-colors">
                        <TelegramIcon className="h-6 w-6"/>
                    </Button>
                    <Button onClick={() => shareOn('youtube')} variant-outline size="icon" className="h-12 w-12 rounded-lg hover:bg-[#FF0000] hover:text-white transition-colors">
                        <YouTubeIcon className="h-6 w-6"/>
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" size="icon" className="h-12 w-12 rounded-lg hover:bg-muted-foreground hover:text-background transition-colors">
                        <Copy className="h-6 w-6" />
                    </Button>
                    <NearMeSearch />
                 </div>

                 <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button asChild variant="outline" className="h-12 px-4 rounded-lg">
                        <Link href="/privacy-policy">
                            <ShieldCheck className="mr-2" /> Privacy
                        </Link>
                    </Button>
                     <Button asChild variant="outline" className="h-12 px-4 rounded-lg">
                        <Link href="/terms-and-conditions">
                            <FileBadge className="mr-2" /> Terms
                        </Link>
                    </Button>
                     <Button asChild variant="outline" className="h-12 px-4 rounded-lg">
                        <Link href="/contact">
                            <MessageSquare className="mr-2" /> Contact
                        </Link>
                    </Button>
                 </div>
                 <Separator />
                 <p className="text-center text-sm text-muted-foreground">
                    © 2025 Investo Future Consultancy. All rights reserved.
                </p>
            </CardContent>
        </Card>
    );
}

import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
            <Button asChild variant="outline" className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2" />
                    Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>We'd love to hear from you. Here's how you can reach us.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-start gap-4">
                        <Building className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Company Name</h3>
                            <p className="text-muted-foreground">Investo Future Consultancy</p>
                        </div>
                   </div>
                   <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <a href="mailto:support@investofuture.in" className="text-muted-foreground hover:text-primary transition-colors">support@investofuture.in</a>
                        </div>
                   </div>
                   <div className="flex items-start gap-4">
                        <Globe className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Website</h3>
                            <a href="https://www.investofuture.in" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                www.investofuture.in
                            </a>
                        </div>
                   </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

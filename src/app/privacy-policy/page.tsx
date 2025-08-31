import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <Button asChild variant="outline" className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2" />
                    Back to Home
                </Link>
            </Button>
            <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                Your privacy is important to us. It is Investo Future Consultancy's policy to respect your privacy regarding any information we may collect from you across our website,{' '}
                <a href="https://www.investofuture.in" className="text-primary hover:underline">www.investofuture.in</a>, and other sites we own and operate.
                </p>
                <p>
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
                </p>
                <p>
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
                </p>
                <p>
                We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
                </p>
                <p>
                Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
                </p>
                <p>
                You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
                </p>
                <p>
                Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us at{' '}
                <a href="mailto:support@investofuture.in" className="text-primary hover:underline">support@investofuture.in</a>.
                </p>
                <p>This policy is effective as of 1 August 2024.</p>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

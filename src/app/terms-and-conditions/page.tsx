import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditions() {
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
                <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                Welcome to StudyBuddyStock, operated by Investo Future Consultancy. By accessing our application, you agree to be bound by these Terms and Conditions.
                </p>
                <p>
                <strong>1. Use of Service:</strong> The services provided by StudyBuddyStock are for educational and informational purposes only. The AI-generated answers should not be considered as professional advice.
                </p>
                <p>
                <strong>2. User Conduct:</strong> You agree not to use the service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
                </p>
                <p>
                <strong>3. Intellectual Property:</strong> The service and its original content, features, and functionality are and will remain the exclusive property of Investo Future Consultancy.
                </p>
                <p>
                <strong>4. Limitation of Liability:</strong> In no event shall Investo Future Consultancy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
                <p>
                <strong>5. Governing Law:</strong> These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
                <p>
                For any questions about these Terms, please contact us at{' '}
                <a href="mailto:support@investofuture.in" className="text-primary hover:underline">support@investofuture.in</a> or visit our website at{' '}
                <a href="https://www.investofuture.in" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.investofuture.in</a>.
                </p>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

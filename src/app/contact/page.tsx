
"use client";

import { useState } from 'react';
import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building, Mail, Globe, Lock, Palette, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAIL = "karannetam4@gmail.com";

export default function Contact() {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAdminLogin = () => {
    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      alert('Invalid admin email.');
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setEmail('');
  };

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

            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary"/>
                  Admin Panel
                </CardTitle>
                <CardDescription>Access restricted to administrators.</CardDescription>
              </CardHeader>
              <CardContent>
                {!isAdmin ? (
                   <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input 
                        id="admin-email" 
                        type="email" 
                        placeholder="Enter admin email" 
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <Button onClick={handleAdminLogin}>Login</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-green-500 font-semibold">Admin access granted.</p>
                    
                    <div className="space-y-4 pt-4 border-t">
                       <h3 className="font-semibold text-lg">Dashboard</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button variant="outline" disabled><Palette className="mr-2" /> Theme Customization</Button>
                            <Button variant="outline" disabled><FileText className="mr-2" /> Content Management</Button>
                            <Button variant="outline" disabled><Settings className="mr-2" /> API & Ads</Button>
                            <Button variant="outline" disabled><Mail className="mr-2" /> Change Admin Email</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Note: Feature implementation is pending.</p>
                    </div>

                    <Button onClick={handleAdminLogout} variant="destructive" className="w-full mt-4">
                      Logout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

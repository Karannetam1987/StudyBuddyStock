
"use client";

import { useState } from 'react';
import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building, Mail, Globe, Lock, Palette, FileText, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ADMIN_EMAIL = "karannetam4@gmail.com";

export default function Contact() {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [themeCustomizationOpen, setThemeCustomizationOpen] = useState(false);

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
                        <div className="space-y-2">
                           <Collapsible open={themeCustomizationOpen} onOpenChange={setThemeCustomizationOpen}>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <span className="flex items-center"><Palette className="mr-2" /> Theme Customization</span>
                                  <ChevronDown className={`transition-transform ${themeCustomizationOpen ? 'rotate-180' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="p-4 mt-2 border rounded-lg space-y-4">
                                  <p className="text-sm text-muted-foreground">Change the look and feel of the application. Note: This feature is under development.</p>
                                  <div className="space-y-2">
                                      <Label htmlFor="primary-color">Primary Color</Label>
                                      <Input id="primary-color" type="color" defaultValue="#6a11cb" disabled />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="background-color">Background Color</Label>
                                      <Input id="background-color" type="color" defaultValue="#1a202c" disabled />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="accent-color">Accent Color</Label>
                                      <Input id="accent-color" type="color" defaultValue="#6a11cb" disabled />
                                  </div>
                                  <Button disabled>Save Theme</Button>
                              </CollapsibleContent>
                            </Collapsible>
                            <Button variant="outline" disabled className="w-full"><FileText className="mr-2" /> Content Management</Button>
                            <Button variant="outline" disabled className="w-full"><Settings className="mr-2" /> API & Ads</Button>
                            <Button variant="outline" disabled className="w-full"><Mail className="mr-2" /> Change Admin Email</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Note: More features are pending implementation.</p>
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


"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building, Mail, Globe, Lock, Palette, FileText, Settings, ChevronDown, KeyRound, MonitorPlay, Facebook, Settings2, BrainCircuit, Bot, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const DEFAULT_ADMIN_EMAIL = "karannetam4@gmail.com";

const DEFAULT_CONTACT_INFO = {
    companyName: "Investo Future Consultancy",
    email: "support@investofuture.in",
    website: "https://www.investofuture.in"
};

// Helper to convert HEX to HSL string
const hexToHsl = (hex: string): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Helper to get root CSS variable
const getCssVariable = (variable: string) => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// Helper to convert HSL string to HEX
const hslToHex = (hslStr: string): string => {
    if (!hslStr) return "#000000";
    const [h, s, l] = hslStr.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const sDecimal = s / 100;
    const lDecimal = l / 100;
    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lDecimal - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else { [r, g, b] = [c, 0, x]; }

    const toHex = (val: number) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


export default function Contact() {
  const [loginEmail, setLoginEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [adminPanelOpen, setAdminPanelOpen] = useState({theme: false, content: false, api: false});
  const { toast } = useToast();

  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#000000');

  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [editedContactInfo, setEditedContactInfo] = useState(DEFAULT_CONTACT_INFO);
  
  const [apiKeys, setApiKeys] = useState({ google: '', facebook: '', gemini: '', openai: '' });
  const [adsConfig, setAdsConfig] = useState({ provider: 'none', code: '' });

  const [showSaveApiOtpDialog, setShowSaveApiOtpDialog] = useState(false);
  const [saveApiOtp, setSaveApiOtp] = useState('');
  const [isSendingSaveApiOtp, setIsSendingSaveApiOtp] = useState(false);
  
  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [changeEmailStep, setChangeEmailStep] = useState(1);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [oldEmailOtp, setOldEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [isSendingChangeEmailOtps, setIsSendingChangeEmailOtps] = useState(false);


  useEffect(() => {
    // Load Admin Email
    const savedAdminEmail = localStorage.getItem('adminEmail');
    setAdminEmail(savedAdminEmail || DEFAULT_ADMIN_EMAIL);

    // Load Theme
    const primaryHsl = getCssVariable('--primary');
    const backgroundHsl = getCssVariable('--background');
    const accentHsl = getCssVariable('--accent');
    
    setPrimaryColor(hslToHex(primaryHsl));
    setBackgroundColor(hslToHex(backgroundHsl));
    setAccentColor(hslToHex(accentHsl));

    // Load Contact Info
    const savedContactInfo = localStorage.getItem('contactInfo');
    if (savedContactInfo) {
        const info = JSON.parse(savedContactInfo);
        setContactInfo(info);
        setEditedContactInfo(info);
    }

    // Load API Keys and Ads
    const savedApiKeys = localStorage.getItem('apiKeys');
    if(savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

    const savedAdsConfig = localStorage.getItem('adsConfig');
    if(savedAdsConfig) setAdsConfig(JSON.parse(savedAdsConfig));

  }, [isAdmin]);


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };

  const handleAdminLogin = () => {
    if (loginEmail === adminEmail) {
      setIsAdmin(true);
      toast({ title: "Admin access granted." });
    } else {
      toast({ variant: "destructive", title: "Invalid admin email." });
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setLoginEmail('');
  };

  const handleSaveTheme = () => {
    try {
        const theme = {
            primary: hexToHsl(primaryColor),
            background: hexToHsl(backgroundColor),
            accent: hexToHsl(accentColor),
        };

        localStorage.setItem('customTheme', JSON.stringify(theme));

        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--background', theme.background);
        document.documentElement.style.setProperty('--accent', theme.accent);

        toast({ title: "Theme Saved!", description: "Your new theme has been applied." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error saving theme", description: "Could not save the theme." });
        console.error(error);
    }
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContactInfo({
      ...editedContactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveContactInfo = () => {
    localStorage.setItem('contactInfo', JSON.stringify(editedContactInfo));
    setContactInfo(editedContactInfo);
    toast({ title: "Contact Info Saved!", description: "The contact information has been updated." });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSaveApiAndAds = async () => {
    setIsSendingSaveApiOtp(true);
    try {
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail, type: 'saveApi' }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTP');
        }
        setShowSaveApiOtpDialog(true);
        toast({ title: "OTP Sent", description: `An OTP has been sent to ${adminEmail}.` });
    } catch (error: any) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
        setIsSendingSaveApiOtp(false);
    }
  };

  const handleSaveApiOtpVerification = () => {
    // In a real app, you'd verify the OTP against the backend.
    // For this prototype, we'll just check if it's a 6-digit number.
    if (saveApiOtp && saveApiOtp.length === 6) {
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
        localStorage.setItem('adsConfig', JSON.stringify(adsConfig));
        toast({ title: "API & Ads Saved!", description: "Your settings have been updated successfully." });
        setShowSaveApiOtpDialog(false);
        setSaveApiOtp('');
    } else {
        toast({ variant: "destructive", title: "Invalid OTP", description: "Please enter a valid 6-digit OTP." });
    }
  };
  
  const handleChangeEmailSendOtps = async () => {
     if (!newAdminEmail || !/^\S+@\S+\.\S+$/.test(newAdminEmail)) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid new admin email." });
      return;
    }
    setIsSendingChangeEmailOtps(true);
    try {
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: adminEmail,
                newEmail: newAdminEmail,
                type: 'changeAdminEmail'
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTPs');
        }
        setChangeEmailStep(2);
        toast({ title: "OTPs Sent", description: `OTPs sent to ${adminEmail} and ${newAdminEmail}.` });
    } catch (error: any) {
         console.error(error);
         toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
        setIsSendingChangeEmailOtps(false);
    }
  }

  const handleVerifyChangeEmailOtps = () => {
     // In a real app, you'd verify both OTPs against the backend.
    if (oldEmailOtp.length === 6 && newEmailOtp.length === 6) {
        localStorage.setItem('adminEmail', newAdminEmail);
        setAdminEmail(newAdminEmail);
        toast({ title: "Admin Email Changed!", description: "You have been logged out. Please log in with your new email." });
        setShowChangeEmailDialog(false);
        setChangeEmailStep(1);
        setNewAdminEmail('');
        setOldEmailOtp('');
        setNewEmailOtp('');
        handleAdminLogout();
    } else {
        toast({ variant: "destructive", title: "Invalid OTPs", description: "Please enter valid 6-digit OTPs for both emails." });
    }
  }


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
                            <p className="text-muted-foreground">{contactInfo.companyName}</p>
                        </div>
                   </div>
                   <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">{contactInfo.email}</a>
                        </div>
                   </div>
                   <div className="flex items-start gap-4">
                        <Globe className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Website</h3>
                            <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                {contactInfo.website.replace('https://', '')}
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
                        value={loginEmail}
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
                           <Collapsible open={adminPanelOpen.theme} onOpenChange={(isOpen) => setAdminPanelOpen({...adminPanelOpen, theme: isOpen})}>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <span className="flex items-center"><Palette className="mr-2" /> Theme Customization</span>
                                  <ChevronDown className={`transition-transform ${adminPanelOpen.theme ? 'rotate-180' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="p-4 mt-2 border rounded-lg space-y-4">
                                  <p className="text-sm text-muted-foreground">Change the look and feel of the application.</p>
                                  <div className="space-y-2">
                                      <Label htmlFor="primary-color">Primary Color</Label>
                                      <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="background-color">Background Color</Label>
                                      <Input id="background-color" type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="accent-color">Accent Color</Label>
                                      <Input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                                  </div>
                                  <Button onClick={handleSaveTheme}>Save Theme</Button>
                              </CollapsibleContent>
                            </Collapsible>
                            <Collapsible open={adminPanelOpen.content} onOpenChange={(isOpen) => setAdminPanelOpen({...adminPanelOpen, content: isOpen})}>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <span className="flex items-center"><FileText className="mr-2" /> Content Management</span>
                                  <ChevronDown className={`transition-transform ${adminPanelOpen.content ? 'rotate-180' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="p-4 mt-2 border rounded-lg space-y-4">
                                  <p className="text-sm text-muted-foreground">Edit the content of the contact page.</p>
                                  <div className="space-y-2">
                                      <Label htmlFor="companyName">Company Name</Label>
                                      <Input id="companyName" name="companyName" value={editedContactInfo.companyName} onChange={handleContactInfoChange} />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="email">Email</Label>
                                      <Input id="email" name="email" type="email" value={editedContactInfo.email} onChange={handleContactInfoChange} />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="website">Website</Label>
                                      <Input id="website" name="website" type="url" value={editedContactInfo.website} onChange={handleContactInfoChange} />
                                  </div>
                                  <Button onClick={handleSaveContactInfo}>Save Contact Info</Button>
                              </CollapsibleContent>
                            </Collapsible>
                            <Collapsible open={adminPanelOpen.api} onOpenChange={(isOpen) => setAdminPanelOpen({...adminPanelOpen, api: isOpen})}>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <span className="flex items-center"><Settings className="mr-2" /> API & Ads</span>
                                  <ChevronDown className={`transition-transform ${adminPanelOpen.api ? 'rotate-180' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="p-4 mt-2 border rounded-lg space-y-6">
                                <div className='space-y-4'>
                                    <h4 className="font-semibold flex items-center gap-2"><KeyRound/> API Key Management</h4>
                                    <p className="text-sm text-muted-foreground">Manage API keys for various services.</p>
                                    <div className="space-y-2">
                                        <Label htmlFor="google-api-key">Google API Key</Label>
                                        <Input id="google-api-key" name="google" value={apiKeys.google} onChange={handleApiKeyChange} placeholder="Enter your Google API Key (for Maps, etc)" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="facebook-api-key">Facebook API Key</Label>
                                        <Input id="facebook-api-key" name="facebook" value={apiKeys.facebook} onChange={handleApiKeyChange} placeholder="Enter your Facebook API Key" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gemini-api-key" className="flex items-center gap-2"><Bot/>Google Gemini API Key</Label>
                                        <Input id="gemini-api-key" name="gemini" value={apiKeys.gemini} onChange={handleApiKeyChange} placeholder="Enter your Google Gemini API Key" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="openai-api-key" className="flex items-center gap-2"><BrainCircuit/>OpenAI API Key</Label>
                                        <Input id="openai-api-key" name="openai" value={apiKeys.openai} onChange={handleApiKeyChange} placeholder="Enter your OpenAI API Key" />
                                    </div>
                                </div>
                                <Separator/>
                                <div className='space-y-4'>
                                    <h4 className="font-semibold flex items-center gap-2"><MonitorPlay/> Ads Management</h4>
                                    <p className="text-sm text-muted-foreground">Configure your ad provider and settings.</p>
                                    <div className="space-y-2">
                                      <Label>Ad Provider</Label>
                                      <Select value={adsConfig.provider} onValueChange={(value) => setAdsConfig({...adsConfig, provider: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select an ad provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">None</SelectItem>
                                          <SelectItem value="adsterra">Adsterra</SelectItem>
                                          <SelectItem value="adsense">Google AdSense</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ad-code">Ad Code/ID</Label>
                                        <Textarea id="ad-code" value={adsConfig.code} onChange={(e) => setAdsConfig({...adsConfig, code: e.target.value})} placeholder="Paste your ad script or ID here" rows={4} />
                                    </div>
                                </div>
                                <Button onClick={handleSaveApiAndAds} disabled={isSendingSaveApiOtp}>
                                    {isSendingSaveApiOtp && <Loader2 className="mr-2 animate-spin" />}
                                    Save API & Ads
                                </Button>
                              </CollapsibleContent>
                            </Collapsible>

                            <Button variant="outline" className="w-full" onClick={() => setShowChangeEmailDialog(true)}><Mail className="mr-2" /> Change Admin Email</Button>
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

       <Dialog open={showSaveApiOtpDialog} onOpenChange={setShowSaveApiOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OTP Verification</DialogTitle>
            <DialogDescription>
              To protect your account, please enter the OTP sent to {adminEmail}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="text" 
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={saveApiOtp}
              onChange={(e) => setSaveApiOtp(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveApiOtpDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveApiOtpVerification}><ShieldCheck className="mr-2"/>Verify & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showChangeEmailDialog} onOpenChange={setShowChangeEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Admin Email</DialogTitle>
            {changeEmailStep === 1 && (
                <DialogDescription>
                    Enter the new email address you want to use for admin access.
                </DialogDescription>
            )}
             {changeEmailStep === 2 && (
                <DialogDescription>
                    To complete the change, please enter the OTPs sent to your old and new email addresses.
                </DialogDescription>
            )}
          </DialogHeader>
          {changeEmailStep === 1 && (
             <div className="py-4 space-y-2">
                <Label htmlFor="new-admin-email">New Admin Email</Label>
                <Input 
                  id="new-admin-email"
                  type="email" 
                  placeholder="new.admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
          )}
          {changeEmailStep === 2 && (
             <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="old-email-otp">OTP from {adminEmail}</Label>
                    <Input 
                      id="old-email-otp"
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={oldEmailOtp}
                      onChange={(e) => setOldEmailOtp(e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-email-otp">OTP from {newAdminEmail}</Label>                    
                    <Input 
                      id="new-email-otp"
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={newEmailOtp}
                      onChange={(e) => setNewEmailOtp(e.target.value)}
                    />
                </div>
              </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            {changeEmailStep === 1 && 
                <Button onClick={handleChangeEmailSendOtps} disabled={isSendingChangeEmailOtps}>
                    {isSendingChangeEmailOtps && <Loader2 className="mr-2 animate-spin" />}
                    Send OTPs
                </Button>
            }
            {changeEmailStep === 2 && <Button onClick={handleVerifyChangeEmailOtps}><ShieldCheck className="mr-2"/>Verify & Change</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

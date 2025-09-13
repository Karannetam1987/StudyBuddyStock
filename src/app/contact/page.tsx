
"use client";

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building, Mail, Globe, Lock, Palette, FileText, Settings, ChevronDown, KeyRound, MonitorPlay, Facebook, Settings2, BrainCircuit, Bot, ShieldCheck, Loader2, Megaphone, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const DEFAULT_ADMIN_EMAIL = "karannetam4@gmail.com";
const TEMP_DEFAULT_PIN = "1234";

const DEFAULT_CONTACT_INFO = {
    companyName: "Investo Future Consultancy",
    email: "support@investofuture.in",
    website: "https://www.investofuture.in"
};

const DEFAULT_AD_ITEM = {
  imageUrl: "https://picsum.photos/seed/ad-placeholder/800/400",
  title: "",
  description: "",
  buttonText: "",
  link: "",
  imageHint: ""
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
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState({theme: false, content: false, api: false});
  const { toast } = useToast();
  
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#000000');

  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [editedContactInfo, setEditedContactInfo] = useState(DEFAULT_CONTACT_INFO);
  
  const [apiKeys, setApiKeys] = useState({ google: '', facebook: '', gemini: '', openai: '', resend: '' });
  const [adsConfig, setAdsConfig] = useState({ provider: 'none', code: '' });
  
  const [customAds, setCustomAds] = useState(() => Array(5).fill(null).map(() => ({ ...DEFAULT_AD_ITEM })));
  const adImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Login State
  const [loginStep, setLoginStep] = useState(1); // 1 for email, 2 for pin
  const [loginPinInput, setLoginPinInput] = useState('');

  // OTP State (now only for PIN changes)
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpAction, setOtpAction] = useState<(() => void) | null>(null);

  // PIN Management State
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [changeEmailStep, setChangeEmailStep] = useState(1);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [oldEmailOtp, setOldEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [isSendingChangeEmailOtps, setIsSendingChangeEmailOtps] = useState(false);
  const [otpForOldEmail, setOtpForOldEmail] = useState<string | null>(null);
  const [otpForNewEmail, setOtpForNewEmail] = useState<string | null>(null);
  const [isSavingApiKeys, setIsSavingApiKeys] = useState(false);


  useEffect(() => {
    // Load Admin Email
    const savedAdminEmail = localStorage.getItem('adminEmail');
    setAdminEmail(savedAdminEmail || DEFAULT_ADMIN_EMAIL);
    
    // Load Admin PIN
    const savedAdminPin = localStorage.getItem('adminPin');
    setAdminPin(savedAdminPin);

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

    const savedCustomAds = localStorage.getItem('customAds');
    if (savedCustomAds) {
      const parsedAds = JSON.parse(savedCustomAds);
      const fullAdsArray = Array(5).fill(null).map((_, i) => parsedAds[i] || { ...DEFAULT_AD_ITEM });
      setCustomAds(fullAdsArray);
    }

  }, []);

  // --- OTP Logic (for verification purposes) ---
  const sendOtp = async (email: string, subject: string): Promise<string | null> => {
    setIsSendingOtp(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, subject, otp: generatedOtp }),
      });

      if (response.ok) {
        toast({ title: "OTP Sent", description: `An OTP has been sent to ${email}.` });
        setIsSendingOtp(false);
        return generatedOtp;
      } else {
        const errorData = await response.json().catch(() => ({ error: "An unknown error occurred." }));
        console.log(`PROTOTYPE ONLY - OTP for ${email}: ${generatedOtp}`);
        toast({ 
          variant: "destructive", 
          title: "Email Sending Failed", 
          description: `Could not send email. The OTP for development is in the browser console. Reason: ${errorData.error || 'Unknown'}`
        });
        setIsSendingOtp(false);
        return generatedOtp; 
      }
    } catch (error) {
      console.log(`PROTOTYPE ONLY - OTP for ${email}: ${generatedOtp}`);
      toast({ 
        variant: "destructive", 
        title: "Email Sending Failed", 
        description: "Could not send email. The OTP has been logged to the browser console for you to use." 
      });
      setIsSendingOtp(false);
      return generatedOtp;
    }
  };


  const handleOtpVerification = () => {
    if (otpInput === otpSent) {
      toast({ title: "Verification Successful!" });
      if (otpAction) {
        otpAction();
      }
      resetOtpState();
    } else {
      toast({ variant: "destructive", title: "Invalid OTP", description: "The OTP you entered is incorrect." });
    }
  };

  const resetOtpState = () => {
    setShowOtpDialog(false);
    setOtpInput('');
    setOtpSent(null);
    setOtpAction(null);
  };
  // --- End OTP Logic ---
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };
  
  const handleAdminEmailSubmit = () => {
    if (loginEmail !== adminEmail) {
      toast({ variant: "destructive", title: "Invalid admin email." });
      return;
    }
    // If no PIN is set, log in directly. Otherwise, go to PIN step.
    if (!adminPin) {
        setIsAdmin(true);
        toast({ title: "Admin access granted." });
    } else {
        setLoginStep(2);
    }
  };

  const handleAdminPinSubmit = () => {
    const currentPin = adminPin || TEMP_DEFAULT_PIN;
    if (loginPinInput === currentPin) {
      setIsAdmin(true);
      toast({ title: "Admin access granted." });
      setLoginStep(1);
      setLoginPinInput('');
    } else {
      toast({ variant: "destructive", title: "Invalid PIN." });
      setLoginPinInput('');
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setLoginEmail('');
    setLoginPinInput('');
    setLoginStep(1);
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
  
  const handleCustomAdChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedAds = [...customAds];
    updatedAds[index] = { ...updatedAds[index], [e.target.name]: e.target.value };
    setCustomAds(updatedAds);
  };
  
  const handleAdImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "Image too large", description: "Please upload an image smaller than 4MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedAds = [...customAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl: e.target?.result as string };
        setCustomAds(updatedAds);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdImage = (index: number) => {
    const updatedAds = [...customAds];
    updatedAds[index] = { ...updatedAds[index], imageUrl: DEFAULT_AD_ITEM.imageUrl };
    setCustomAds(updatedAds);
    const inputRef = adImageInputRefs.current[index];
    if (inputRef) {
      inputRef.value = "";
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSaveApiAndAds = async () => {
    setIsSavingApiKeys(true);
    // 1. Save non-sensitive settings to localStorage
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys)); // Still save to UI for display
    localStorage.setItem('adsConfig', JSON.stringify(adsConfig));
    const adsToSave = customAds.filter(ad => ad.title && ad.imageUrl !== DEFAULT_AD_ITEM.imageUrl);
    localStorage.setItem('customAds', JSON.stringify(adsToSave));

    // 2. Save sensitive keys to the backend
    try {
        const response = await fetch('/api/save-env', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // This is a simplified auth check for the prototype.
                // In a real app, you'd use a proper session token.
                'x-admin-secret': adminPin || TEMP_DEFAULT_PIN,
            },
            body: JSON.stringify({
                gemini: apiKeys.gemini,
                resend: apiKeys.resend,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            toast({ 
                title: "Settings Saved!", 
                description: "Your settings have been updated. The backend may need a restart to use new API keys."
            });
        } else {
            throw new Error(result.error || 'Failed to save API keys to server.');
        }
    } catch (error: any) {
        toast({ 
            variant: "destructive", 
            title: "Failed to Save API Keys", 
            description: error.message || "An error occurred while saving keys to the server." 
        });
    } finally {
        setIsSavingApiKeys(false);
    }
  };

  const handleSetNewPin = () => {
    // If a pin is already set, validate the old pin
    if (adminPin && oldPin !== adminPin) {
      toast({ variant: "destructive", title: "Incorrect Old PIN", description: "The old PIN you entered is incorrect." });
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      toast({ variant: "destructive", title: "Invalid PIN", description: "New PIN must be 4 digits." });
      return;
    }
    if (newPin !== confirmNewPin) {
      toast({ variant: "destructive", title: "PINs do not match", description: "The new PINs you entered do not match." });
      return;
    }
    
    localStorage.setItem('adminPin', newPin);
    setAdminPin(newPin);
    toast({ title: "PIN Set Successfully!" });
    
    // Reset fields and close dialog
    setShowPinDialog(false);
    setOldPin('');
    setNewPin('');
    setConfirmNewPin('');
  };
  
  const handleChangeEmailSendOtps = async () => {
     if (!newAdminEmail || !/^\S+@\S+\.\S+$/.test(newAdminEmail)) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid new admin email." });
      return;
    }
    setIsSendingChangeEmailOtps(true);
    const otp1 = await sendOtp(adminEmail, "Admin Email Change Verification");
    const otp2 = await sendOtp(newAdminEmail, "Admin Email Change Verification");
    setIsSendingChangeEmailOtps(false);

    if (otp1 && otp2) {
      setOtpForOldEmail(otp1);
      setOtpForNewEmail(otp2);
      setChangeEmailStep(2);
      toast({ title: "OTPs Sent", description: `Verification codes have been sent to both email addresses.` });
    } else {
      toast({ variant: "destructive", title: "Failed to Send OTPs", description: "Could not send verification codes. Please check your settings and try again." });
    }
  }

  const handleVerifyChangeEmailOtps = () => {
    if (oldEmailOtp === otpForOldEmail && newEmailOtp === otpForNewEmail) {
        localStorage.setItem('adminEmail', newAdminEmail);
        setAdminEmail(newAdminEmail);
        toast({ title: "Admin Email Changed!", description: "You have been logged out. Please log in with your new email." });
        setShowChangeEmailDialog(false);
        setChangeEmailStep(1);
        setNewAdminEmail('');
        setOldEmailOtp('');
        setNewEmailOtp('');
        setOtpForOldEmail(null);
        setOtpForNewEmail(null);
        handleAdminLogout();
    } else {
        toast({ variant: "destructive", title: "Invalid OTPs", description: "Please ensure both OTPs are correct." });
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
                  <>
                   {loginStep === 1 && (
                     <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input 
                          id="admin-email" 
                          type="email" 
                          placeholder="Enter admin email" 
                          value={loginEmail}
                          onChange={handleEmailChange}
                          onKeyDown={(e) => e.key === 'Enter' && handleAdminEmailSubmit()}
                        />
                      </div>
                      <Button onClick={handleAdminEmailSubmit}>
                          Next
                      </Button>
                    </div>
                   )}
                   {loginStep === 2 && (
                    <div className="space-y-4">
                      <p>Enter PIN for <span className="font-semibold">{loginEmail}</span></p>
                      <div className="flex items-end gap-2">
                         <div className="flex-1">
                           <Label htmlFor="admin-pin">Admin PIN</Label>
                           <Input 
                              id="admin-pin"
                              type="password"
                              maxLength={4}
                              placeholder="Enter 4-digit PIN"
                              value={loginPinInput}
                              onChange={(e) => setLoginPinInput(e.target.value.replace(/\D/g, ''))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAdminPinSubmit()}
                           />
                         </div>
                         <Button onClick={handleAdminPinSubmit}>
                           Login
                         </Button>
                      </div>
                      <Button variant="link" onClick={() => setLoginStep(1)}>Back to email</Button>
                    </div>
                   )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-green-500 font-semibold">Admin access granted.</p>

                    {!adminPin && (
                        <Card className="bg-yellow-500/10 border-yellow-500/50">
                            <CardHeader>
                                <CardTitle className="text-yellow-500 text-lg">Important: Set up your PIN</CardTitle>
                                <CardDescription className="text-yellow-500/80">
                                    Your account is not fully secure. Please set up an admin PIN to protect your settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="secondary" onClick={() => setShowPinDialog(true)}>Set Admin PIN Now</Button>
                            </CardContent>
                        </Card>
                    )}
                    
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
                                    <p className="text-sm text-muted-foreground">Manage API keys for various services. Keys are saved securely on the server.</p>
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
                                     <div className="space-y-2">
                                        <Label htmlFor="resend-api-key" className="flex items-center gap-2"><Mail/>Resend API Key</Label>
                                        <Input id="resend-api-key" name="resend" value={apiKeys.resend} onChange={handleApiKeyChange} placeholder="Enter your Resend API Key" />
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
                                <Separator/>
                                <div className='space-y-4'>
                                    <h4 className="font-semibold flex items-center gap-2"><Megaphone /> Custom Ad Management</h4>
                                    <p className="text-sm text-muted-foreground">Manage the custom ad banner on the homepage. Up to 5 ads can be configured.</p>
                                    
                                    {customAds.map((ad, index) => (
                                      <div key={index} className="space-y-4 border p-4 rounded-lg">
                                        <h5 className="font-medium">Ad Slot {index + 1}</h5>
                                        <div className="space-y-2">
                                          <Label>Ad Image</Label>
                                          <div className="relative">
                                            <Image src={ad.imageUrl} width={600} height={300} alt={`Ad ${index + 1} preview`} className="rounded-lg w-full object-contain max-h-48 border" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeAdImage(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          <label htmlFor={`ad-image-upload-${index}`} className="mt-2 flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors p-4 text-center">
                                              <div className="flex flex-col items-center justify-center">
                                                  <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                  <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 4MB)</p>
                                              </div>
                                              <Input id={`ad-image-upload-${index}`} type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleAdImageChange(index, e)} ref={(el) => adImageInputRefs.current[index] = el} />
                                          </label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`ad-title-${index}`}>Title</Label>
                                            <Input id={`ad-title-${index}`} name="title" value={ad.title} onChange={(e) => handleCustomAdChange(index, e)} placeholder="Ad Title" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`ad-description-${index}`}>Description</Label>
                                            <Textarea id={`ad-description-${index}`} name="description" value={ad.description} onChange={(e) => handleCustomAdChange(index, e)} placeholder="Ad description text." rows={2} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`ad-buttonText-${index}`}>Button Text</Label>
                                            <Input id={`ad-buttonText-${index}`} name="buttonText" value={ad.buttonText} onChange={(e) => handleCustomAdChange(index, e)} placeholder="e.g., Learn More" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`ad-link-${index}`}>Link URL</Label>
                                            <Input id={`ad-link-${index}`} name="link" value={ad.link} onChange={(e) => handleCustomAdChange(index, e)} placeholder="https://example.com/product" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`ad-imageHint-${index}`}>Image AI Hint</Label>
                                            <Input id={`ad-imageHint-${index}`} name="imageHint" value={ad.imageHint} onChange={(e) => handleCustomAdChange(index, e)} placeholder="e.g., marketing banner" />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                                <Button onClick={handleSaveApiAndAds} disabled={isSavingApiKeys}>
                                    {isSavingApiKeys ? <Loader2 className="animate-spin"/> : null}
                                    Save All Settings
                                </Button>
                              </CollapsibleContent>
                            </Collapsible>

                            <Button variant="outline" className="w-full" onClick={() => setShowPinDialog(true)}><KeyRound className="mr-2" /> {adminPin ? 'Change' : 'Set'} Admin PIN</Button>
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

      {/* OTP Dialog for general verification */}
      <Dialog open={showOtpDialog} onOpenChange={(isOpen) => { if(!isOpen) resetOtpState(); }}>
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
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOtpVerification()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetOtpState}>Cancel</Button>
            <Button onClick={handleOtpVerification}><ShieldCheck className="mr-2"/>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* PIN Management Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adminPin ? 'Change' : 'Set'} Admin PIN</DialogTitle>
            <DialogDescription>
              {adminPin ? 'Change your 4-digit admin PIN.' : 'Create a new 4-digit PIN for your account.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {adminPin && (
              <div className="space-y-2">
                <Label htmlFor="old-pin">Old PIN</Label>
                <Input 
                  id="old-pin"
                  type="password"
                  maxLength={4}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-pin">New 4-Digit PIN</Label>
              <Input 
                id="new-pin"
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-pin">Confirm New PIN</Label>
              <Input 
                id="confirm-new-pin"
                type="password"
                maxLength={4}
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleSetNewPin()}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSetNewPin}>{adminPin ? 'Change' : 'Set'} PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Email Dialog */}
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
                    To complete the change, please enter the OTPs sent to both email addresses.
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
                    <Label htmlFor="old-email-otp">OTP for {adminEmail}</Label>
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
                    <Label htmlFor="new-email-otp">OTP for {newAdminEmail}</Label>                    
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

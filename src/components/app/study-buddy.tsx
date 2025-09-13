
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnswerCard } from "@/components/app/answer-card";
import { VoiceInputButton } from "@/components/app/voice-input-button";
import { Send, Loader2, UploadCloud, X, Camera, BrainCircuit, BookOpen, FlaskConical, PenSquare, Code, Calculator, Languages, GraduationCap, Briefcase, Cog, HeartPulse, Sprout, Landmark, Palette, Album, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraInput } from "@/components/app/camera-input";
import { Separator } from "@/components/ui/separator";
import { AppShare } from "@/components/app/app-share";
import { useIsMobile } from "@/hooks/use-mobile";
import { NearMeSearch } from "./near-me-search";
import type { AnswerAcademicQuestionInput } from "@/ai/schemas/academic-question-schemas";
import { AnswerAcademicQuestionInputSchema } from "@/ai/schemas/academic-question-schemas";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const subjects = [
  { name: "General Knowledge", icon: BrainCircuit },
  { name: "History", icon: BookOpen },
  { name: "Science", icon: FlaskConical },
  { name: "Computer Science", icon: Code },
  { name: "Literature", icon: BookOpen },
  { name: "Maths", icon: Calculator },
  { name: "English", icon: Languages },
  { name: "Commerce", icon: Briefcase },
  { name: "Engineering", icon: Cog },
  { name: "Health Science", icon: HeartPulse },
  { name: "Agriculture", icon: Sprout },
  { name: "Hindi", icon: Languages },
  { name: "Business Studies", icon: Briefcase },
  { name: "Beauty & Design", icon: Palette },
  { name: "Accounting", icon: Album },
  { name: "Economy", icon: Landmark },
];
const languages = ['Hindi', 'English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Russian', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi'];

const formSchema = AnswerAcademicQuestionInputSchema;

type FormValues = AnswerAcademicQuestionInput;

const DEFAULT_CUSTOM_AD = {
  imageUrl: "https://picsum.photos/seed/ad1/800/400",
  title: "Your Custom Advertisement",
  description: "Promote your product or service here with a catchy description. This space is fully customizable.",
  buttonText: "Click Here",
  link: "https://www.investofuture.in",
  imageHint: "advertisement banner"
};

export function StudyBuddy() {
  const [selectedSubject, setSelectedSubject] = useState('General Knowledge');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [customAds, setCustomAds] = useState([DEFAULT_CUSTOM_AD]);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const subjectsToShow = isMobile && !showAllSubjects ? subjects.slice(0, 8) : subjects;

  useEffect(() => {
    const storedLanguage = localStorage.getItem('studyBuddyLanguage');
    if (storedLanguage && languages.includes(storedLanguage)) {
      setSelectedLanguage(storedLanguage);
    }
    
    const savedAds = localStorage.getItem('customAds');
    if (savedAds) {
      try {
        const parsedAds = JSON.parse(savedAds);
        // Filter out any empty/invalid ads before setting state
        const validAds = parsedAds.filter((ad: any) => ad && ad.imageUrl && ad.title);
        if (validAds.length > 0) {
          setCustomAds(validAds);
        } else {
          setCustomAds([DEFAULT_CUSTOM_AD]);
        }
      } catch (error) {
        console.error("Failed to parse custom ads from localStorage", error);
        setCustomAds([DEFAULT_CUSTOM_AD]);
      }
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: selectedSubject, language: selectedLanguage, question: "" },
  });

  useEffect(() => {
    form.setValue("subject", selectedSubject);
  }, [selectedSubject, form]);
  
  useEffect(() => {
    form.setValue("language", selectedLanguage);
  }, [selectedLanguage, form]);


  const { isRecording, toggleRecording, isAvailable } = useSpeechToText({
    onTranscriptChange: (transcript) => form.setValue("question", transcript),
  });
  
  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('studyBuddyLanguage', language);
    form.setValue("language", language);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const processFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
      toast({ variant: "destructive", title: "Image too large", description: "Please upload an image smaller than 4MB." });
      return;
    }
    form.setValue("image", file as any);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const reader = new FileReader();
    reader.onload = (e) => setImageDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  const handleCameraCapture = (dataUri: string) => {
     fetch(dataUri)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        processFile(file);
      });
  }
  
  const removeImage = () => {
    setImagePreview(null);
    setImageDataUri(null);
    form.setValue("image", undefined);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAnswer(null);

    try {
        const payload: AnswerAcademicQuestionInput = {
          subject: values.subject,
          language: values.language,
          question: values.question,
          image: imageDataUri || undefined,
        };

        const response = await fetch('/api/studybuddy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        const result = await response.json();

        if (result && result.answer) {
            setAnswer(result.answer);
        } else {
            throw new Error("No answer received from the AI.");
        }

    } catch (error: any) {
        console.error("Error getting answer:", error);
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.message || "Failed to get an answer. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-primary/5 border-primary/20 mb-8">
        <CardHeader>
             <CardTitle className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-primary"/>
                    Welcome to StudyBuddyStock!
                </div>
                <div>
                  <NearMeSearch />
                </div>
            </CardTitle>
            <CardDescription>Your AI-powered academic assistant. Select a subject below, ask your question, and let our AI help you out!</CardDescription>
        </CardHeader>
      </Card>

      {/* Custom Ad Carousel */}
      <Carousel
        className="mb-8 w-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {customAds.map((ad, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden shadow-lg border-2 border-primary/30">
                <div className="relative w-full h-48">
                    <Image 
                      src={ad.imageUrl}
                      alt={ad.title}
                      fill
                      className="object-cover"
                      data-ai-hint={ad.imageHint}
                    />
                </div>
                <div className="p-4 bg-card">
                    <h3 className="text-lg font-bold text-card-foreground">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
                    <Button 
                        asChild 
                        className="mt-4 w-full md:w-auto"
                    >
                        <a href={ad.link} target="_blank" rel="noopener noreferrer">
                            {ad.buttonText}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">1. Choose a Subject</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {subjectsToShow.map(({ name, icon: Icon }) => (
                    <Card 
                      key={name} 
                      className={`overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer ${selectedSubject === name ? 'ring-2 ring-primary shadow-lg' : ''}`} 
                      onClick={() => handleSubjectClick(name)}
                    >
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                        <div className={`p-3 rounded-full transition-colors ${selectedSubject === name ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                            <Icon className="h-8 w-8" />
                        </div>
                        <p className="font-semibold text-sm">{name}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
             {isMobile && subjects.length > 8 && (
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => setShowAllSubjects(!showAllSubjects)}>
                  {showAllSubjects ? 'See Less' : 'See More'}
                </Button>
              </div>
            )}
        </div>

        <Separator />

        <Card className="shadow-lg" id="ask-question">
          <CardHeader>
              <CardTitle>2. Ask a Question</CardTitle>
              <CardDescription>Ask a question, with or without an image. Your selected subject is <span className="font-bold text-primary">{selectedSubject}</span>.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                          <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value); setSelectedSubject(value); }} value={field.value}>
                                  <FormControl>
                                      <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {subjects.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                                  </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="language"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
                                  <FormControl>
                                      <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                  </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                      </div>
                       <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                          <FormItem className="flex flex-col">
                              <FormLabel>Image (Optional)</FormLabel>
                               {imagePreview ? (
                                  <div className="relative">
                                      <Image src={imagePreview} width={600} height={400} alt="Image preview" className="rounded-lg w-full object-contain max-h-48 border" />
                                      <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={removeImage}>
                                          <X className="h-4 w-4" />
                                      </Button>
                                  </div>
                              ) : (
                                  <Tabs defaultValue="upload" className="w-full">
                                      <TabsList className="grid w-full grid-cols-2">
                                          <TabsTrigger value="upload"><UploadCloud className="mr-2"/>Upload</TabsTrigger>
                                          <TabsTrigger value="camera"><Camera className="mr-2"/>Camera</TabsTrigger>
                                      </TabsList>
                                      <TabsContent value="upload">
                                          <FormControl>
                                              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors p-6">
                                                  <div className="flex flex-col items-center justify-center">
                                                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                      <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 4MB)</p>
                                                  </div>
                                                  <Input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} ref={fileInputRef} />
                                              </label>
                                          </FormControl>
                                      </TabsContent>
                                      <TabsContent value="camera">
                                          <CameraInput onCapture={handleCameraCapture}/>
                                      </TabsContent>
                                  </Tabs>
                              )}
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </div>
                  
                  <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                              <div className="relative">
                              <Textarea placeholder="e.g., What was the significance of the Renaissance? or What is in this picture?" {...field} rows={4} />
                              <div className="absolute bottom-2 right-2">
                                  <VoiceInputButton isRecording={isRecording} isAvailable={isAvailable} onClick={toggleRecording} />
                              </div>
                              </div>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                      Submit Question
                  </Button>
              </form>
            </Form>
            {isLoading && (
              <div className="mt-6 space-y-4">
                  <Skeleton className="h-8 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {answer && <AnswerCard answer={answer} question={form.getValues("question")} imagePreview={imagePreview || undefined} />}
          </CardContent>
        </Card>

        <AppShare />

        <div className="flex justify-center items-center h-[50px] w-[320px] bg-muted rounded-lg mt-8 mx-auto">
            <p className="text-muted-foreground text-sm">Adsterra Ad Placeholder (320x50)</p>
        </div>
      </div>
    </div>
  );
}

    

"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { answerAcademicQuestion } from "@/ai/flows/answer-academic-questions";
import { analyzeImageAndAnswer } from "@/ai/flows/analyze-images-and-answer-questions";
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
import { Send, Loader2, UploadCloud, X, ArrowLeft, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraInput } from "@/components/app/camera-input";

const subjects = ['General Knowledge', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'Maths', 'English'];
const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Russian'];

const formSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  language: z.string().min(1, "Please select a language."),
  question: z.string().min(10, "Please enter a question with at least 10 characters."),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TextQuestionProps {
  onBack: () => void;
  initialSubject: string;
}

export function TextQuestion({ onBack, initialSubject }: TextQuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: initialSubject, language: "English", question: "" },
  });
  
  useEffect(() => {
    form.setValue("subject", initialSubject);
  }, [initialSubject, form]);


  const { isRecording, toggleRecording, isAvailable } = useSpeechToText({
    onTranscriptChange: (transcript) => form.setValue("question", transcript),
  });

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
    form.setValue("image", file);
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
    form.setValue("image", null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAnswer(null);
    try {
      let result;
      if (imageDataUri) {
        result = await analyzeImageAndAnswer({ imageDataUri, question: values.question });
      } else {
        result = await answerAcademicQuestion(values);
      }
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get an answer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
       <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Subjects
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
            <CardDescription>Ask a question, with or without an image. Your selected subject is {initialSubject}.</CardDescription>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </div>
  );
}

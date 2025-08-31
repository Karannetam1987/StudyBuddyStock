"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeImageAndAnswer } from "@/ai/flows/analyze-images-and-answer-questions";
import { useToast } from "@/hooks/use-toast";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnswerCard } from "@/components/app/answer-card";
import { VoiceInputButton } from "@/components/app/voice-input-button";
import { Send, Loader2, UploadCloud, X, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  image: z.any().refine(file => file, "Please upload an image."),
  question: z.string().min(10, "Please enter a question with at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

interface ImageQuestionProps {
    onBack: () => void;
}

export function ImageQuestion({ onBack }: ImageQuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  });

  const { isRecording, toggleRecording, isAvailable } = useSpeechToText({
    onTranscriptChange: (transcript) => form.setValue("question", transcript),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageDataUri(null);
    form.setValue("image", null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!imageDataUri) {
      toast({ variant: "destructive", title: "No image", description: "Please upload an image to analyze." });
      return;
    }
    setIsLoading(true);
    setAnswer(null);
    try {
      const result = await analyzeImageAndAnswer({ imageDataUri, question: values.question });
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to analyze the image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analyze an Image</CardTitle>
          <CardDescription>Upload an image and ask a question about it.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      {imagePreview ? (
                        <div className="relative">
                          <Image src={imagePreview} width={600} height={400} alt="Image preview" className="rounded-lg w-full object-contain max-h-96" />
                          <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={removeImage}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 4MB)</p>
                          </div>
                          <Input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} ref={fileInputRef} />
                        </label>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea placeholder="e.g., What is in this picture?" {...field} rows={2} />
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
                Submit for Analysis
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

          {answer && imagePreview && <AnswerCard answer={answer} question={form.getValues("question")} imagePreview={imagePreview} />}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { answerAcademicQuestion } from "@/ai/flows/answer-academic-questions";
import { useToast } from "@/hooks/use-toast";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnswerCard } from "@/components/app/answer-card";
import { VoiceInputButton } from "@/components/app/voice-input-button";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const subjects = ['General Knowledge', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'Maths', 'English'];
const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Russian'];

const formSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  language: z.string().min(1, "Please select a language."),
  question: z.string().min(10, "Please enter a question with at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

interface TextQuestionProps {
    selectedSubject: string;
    onBack: () => void;
}

export function TextQuestion({ selectedSubject, onBack }: TextQuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: selectedSubject || "General Knowledge", language: "English", question: "" },
  });

  const { isRecording, toggleRecording, isAvailable } = useSpeechToText({
    onTranscriptChange: (transcript) => form.setValue("question", transcript),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAnswer(null);
    try {
      const result = await answerAcademicQuestion(values);
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get an answer from the AI. Please try again.",
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
            <CardTitle>Ask an Academic Question</CardTitle>
            <CardDescription>Select a subject and language, then type or speak your question.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
                name="question"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Textarea placeholder="e.g., What was the significance of the Renaissance?" {...field} rows={4} />
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
            {answer && <AnswerCard answer={answer} question={form.getValues("question")} />}
        </CardContent>
        </Card>
    </div>
  );
}

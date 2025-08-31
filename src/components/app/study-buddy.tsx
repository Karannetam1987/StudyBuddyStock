"use client";

import { useState } from "react";
import { TextQuestion } from "@/components/app/text-question";
import { ImageQuestion } from "@/components/app/image-question";
import { PenSquare, Image as ImageIcon, History, FlaskConical, Code, BookOpen, BrainCircuit, Calculator, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const subjects = [
  { name: 'General Knowledge', icon: BrainCircuit },
  { name: 'History', icon: History },
  { name: 'Physics', icon: FlaskConical },
  { name: 'Chemistry', icon: FlaskConical },
  { name: 'Biology', icon: FlaskConical },
  { name: 'Computer Science', icon: Code },
  { name: 'Literature', icon: BookOpen },
  { name: 'Maths', icon: Calculator },
  { name: 'English', icon: Languages },
];

export function StudyBuddy() {
  const [activeView, setActiveView] = useState<'home' | 'text' | 'image'>('home');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setActiveView('text');
  };

  const handleImageAnalysis = () => {
    setActiveView('image');
  };
  
  const handleBack = () => {
      setActiveView('home');
      setSelectedSubject('');
      setQuestion('');
  }

  if (activeView === 'text') {
    return <TextQuestion selectedSubject={selectedSubject} onBack={handleBack} />;
  }

  if (activeView === 'image') {
    return <ImageQuestion onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Welcome to StudyBuddy</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your AI-powered academic assistant.</p>
      </div>

      <Card className="shadow-lg animate-in fade-in duration-500 bg-card/80">
        <CardHeader>
          <CardTitle>What would you like to do?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
                onClick={handleImageAnalysis}
                className="flex flex-col items-center justify-center p-6 bg-background/50 hover:bg-muted rounded-lg border transition-all text-center h-full min-h-[150px]"
            >
                <ImageIcon className="h-12 w-12 mb-3 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Analyze an Image</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload an image and ask questions about it.</p>
            </button>
             <div className="space-y-4">
                <h3 className="text-center font-semibold text-lg text-foreground md:text-left">... or ask a question about a subject</h3>
                <div className="grid grid-cols-3 gap-3">
                    {subjects.map((subject) => {
                    const Icon = subject.icon;
                    return (
                        <button
                        key={subject.name}
                        onClick={() => handleSubjectSelect(subject.name)}
                        className="flex flex-col items-center justify-center p-4 bg-background/50 hover:bg-muted rounded-lg border transition-all text-center h-28"
                        >
                        <Icon className="h-8 w-8 mb-2 text-primary" />
                        <span className="text-sm font-medium text-foreground text-center">{subject.name}</span>
                        </button>
                    );
                    })}
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg animate-in fade-in duration-700 bg-card/80">
          <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="text-center text-muted-foreground py-8">
                  <History className="h-12 w-12 mx-auto mb-4"/>
                  <p>No recent activity yet.</p>
                  <p className="text-sm">Start by asking a question or analyzing an image.</p>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

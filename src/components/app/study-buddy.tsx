"use client";

import { useState } from "react";
import { TextQuestion } from "@/components/app/text-question";
import { PenSquare, Image as ImageIcon, History, FlaskConical, Code, BookOpen, BrainCircuit, Calculator, Languages, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  { name: "General Knowledge", icon: BrainCircuit },
  { name: "History", icon: BookOpen },
  { name: "Physics", icon: FlaskConical },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: PenSquare },
  { name: "Computer Science", icon: Code },
  { name: "Literature", icon: BookOpen },
  { name: "Maths", icon: Calculator },
  { name: "English", icon: Languages },
];


export function StudyBuddy() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState('General Knowledge');

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentView('ask-question');
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  if (currentView === 'ask-question') {
    return <TextQuestion onBack={handleBack} initialSubject={selectedSubject} />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
       <Card className="bg-primary/5 border-primary/20 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
             <GraduationCap className="h-8 w-8 text-primary"/>
            Welcome to StudyBuddy!
            </CardTitle>
          <CardDescription>Your AI-powered academic assistant. Select a subject below to get started or ask a general question.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Choose a Subject</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {subjects.map(({ name, icon: Icon }) => (
                    <Card key={name} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer" onClick={() => handleSubjectClick(name)}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Icon className="h-8 w-8" />
                        </div>
                        <p className="font-semibold text-sm">{name}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextQuestion } from "@/components/app/text-question";
import { ImageQuestion } from "@/components/app/image-question";
import { PenSquare, Image as ImageIcon } from "lucide-react";

export function StudyBuddy() {
  return (
    <Tabs defaultValue="text" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 h-12 rounded-lg">
        <TabsTrigger value="text" className="h-full text-base gap-2">
          <PenSquare className="h-5 w-5" />
          Ask a Question
        </TabsTrigger>
        <TabsTrigger value="image" className="h-full text-base gap-2">
          <ImageIcon className="h-5 w-5" />
          Analyze Image
        </TabsTrigger>
      </TabsList>
      <TabsContent value="text" className="mt-6">
        <TextQuestion />
      </TabsContent>
      <TabsContent value="image" className="mt-6">
        <ImageQuestion />
      </TabsContent>
    </Tabs>
  );
}

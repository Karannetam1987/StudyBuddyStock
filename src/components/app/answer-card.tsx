import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButtons } from "@/components/app/share-buttons";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface AnswerCardProps {
  answer: string;
  question: string;
  imagePreview?: string;
}

export function AnswerCard({ answer, question, imagePreview }: AnswerCardProps) {
  return (
    <Card className="mt-6 animate-in fade-in duration-500 bg-primary/5">
      <CardHeader>
        <CardTitle>AI Generated Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {imagePreview && (
          <div className="relative aspect-video w-full border rounded-lg overflow-hidden">
            <Image 
              src={imagePreview} 
              alt="Analyzed image" 
              fill
              style={{ objectFit: 'contain' }}
              data-ai-hint="analysis preview"
            />
          </div>
        )}
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Your Question:</p>
            <p className="italic text-foreground/80">"{question}"</p>
        </div>
        <Separator />
         <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">The Answer:</p>
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{answer}</p>
        </div>
      </CardContent>
      <CardFooter>
        <ShareButtons textToShare={`Question: ${question}\n\nAnswer: ${answer}`} />
      </CardFooter>
    </Card>
  );
}

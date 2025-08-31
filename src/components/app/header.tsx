import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground font-headline tracking-tight">
          StudyBuddyStock
        </h1>
      </div>
    </header>
  );
}

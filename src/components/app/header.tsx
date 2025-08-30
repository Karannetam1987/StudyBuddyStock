import { BookOpenCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <BookOpenCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground font-headline">
          StudyBuddyStock
        </h1>
      </div>
    </header>
  );
}


import { GraduationCap } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background animate-fade-out" style={{animationDelay: '2.5s', animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg">
          <GraduationCap className="h-16 w-16" />
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          StudyBuddyStock
        </h1>
      </div>
    </div>
  );
}

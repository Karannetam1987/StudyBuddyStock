
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/app/header';
import { StudyBuddy } from '@/components/app/study-buddy';
import { SplashScreen } from '@/components/app/splash-screen';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setting a mock timer to simulate loading, since we are bypassing the AI part for now.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  // The original loading logic was tied to a 3-second splash screen.
  // We'll keep a splash screen, but a shorter one for this test.
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 animate-in fade-in duration-500">
      <Header />
      <main className="flex-1">
        <StudyBuddy />
      </main>
    </div>
  );
}

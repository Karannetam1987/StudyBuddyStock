
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/app/header';
import { StudyBuddy } from '@/components/app/study-buddy';
import { SplashScreen } from '@/components/app/splash-screen';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

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

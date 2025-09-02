
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react';

// This is a client component because we need useEffect to apply the theme
// We can't do this in a server component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        if(theme.primary) document.documentElement.style.setProperty('--primary', theme.primary);
        if(theme.background) document.documentElement.style.setProperty('--background', theme.background);
        if(theme.accent) document.documentElement.style.setProperty('--accent', theme.accent);
      } catch (error) {
        console.error("Failed to parse or apply saved theme.", error);
      }
    }
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>StudyBuddyStock</title>
        <meta name="description" content="AI-powered academic assistance for students." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { StudyBuddy } from '@/components/app/study-buddy';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      <main className="flex-1">
        <StudyBuddy />
      </main>
      <Footer />
    </div>
  );
}

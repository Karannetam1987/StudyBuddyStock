import { Header } from '@/components/app/header';
import { StudyBuddy } from '@/components/app/study-buddy';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <StudyBuddy />
      </main>
    </div>
  );
}

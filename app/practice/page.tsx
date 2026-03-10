"use client";

import { Dumbbell } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { SubjectCard } from "@/components/subject-card";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { subjects } from "@/lib/data";

function PracticeContent() {
  const { getSubjectStats } = useProgress();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Practice</h1>
              <p className="text-muted-foreground">
                Test your knowledge with fun quizzes!
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject.id);
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                mode="practice"
                stats={stats}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ProgressProvider>
      <PracticeContent />
    </ProgressProvider>
  );
}

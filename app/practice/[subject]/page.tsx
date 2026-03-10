"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Calculator, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { TopicCard } from "@/components/topic-card";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { getSubject } from "@/lib/data";
import { notFound } from "next/navigation";

function SubjectPracticeContent({ subjectId }: { subjectId: string }) {
  const subject = getSubject(subjectId);
  const { getTopicProgress } = useProgress();

  if (!subject) {
    notFound();
  }

  const isMath = subject.color === "math";
  const Icon = isMath ? Calculator : Microscope;
  const iconBg = isMath ? "bg-blue-500" : "bg-emerald-500";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/practice">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Subjects
          </Button>
        </Link>

        <div className={`mb-8 rounded-2xl ${lightBg} p-6`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {subject.name} Practice
              </h1>
              <p className="text-muted-foreground">
                Test your knowledge with quizzes!
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {subject.topics.length} quiz topics available
            </span>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-foreground">Choose a Topic</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subject.topics.map((topic) => {
            const topicProgress = getTopicProgress(subject.id, topic.id);

            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                subjectId={subject.id}
                mode="practice"
                subjectColor={subject.color}
                bestScore={topicProgress.bestScore}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function SubjectPracticePage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = use(params);
  
  return (
    <ProgressProvider>
      <SubjectPracticeContent subjectId={subject} />
    </ProgressProvider>
  );
}

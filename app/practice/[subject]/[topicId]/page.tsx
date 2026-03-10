"use client";

import { use, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Quiz } from "@/components/quiz";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { getSubject, getTopic } from "@/lib/data";
import { notFound } from "next/navigation";

function TopicQuizContent({ 
  subjectId, 
  topicId 
}: { 
  subjectId: string; 
  topicId: string;
}) {
  const subject = getSubject(subjectId);
  const topic = getTopic(subjectId, topicId);
  const { recordQuizAttempt } = useProgress();

  if (!subject || !topic) {
    notFound();
  }

  const handleQuizComplete = useCallback((score: number, total: number) => {
    recordQuizAttempt(subjectId, topicId, score, total);
  }, [subjectId, topicId, recordQuizAttempt]);

  const isMath = subject.color === "math";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href={`/practice/${subjectId}`}>
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {subject.name}
          </Button>
        </Link>

        <div className={`mb-6 rounded-2xl ${lightBg} p-6`}>
          <h1 className="text-2xl font-bold text-foreground">
            {topic.title} Quiz
          </h1>
          <p className="mt-1 text-muted-foreground">
            Answer the questions to test your knowledge!
          </p>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{topic.questions.length} questions</span>
            <span>|</span>
            <Link 
              href={`/learn/${subjectId}/${topicId}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" />
              Review lessons first
            </Link>
          </div>
        </div>

        <Quiz
          questions={topic.questions}
          subjectColor={subject.color}
          onComplete={handleQuizComplete}
        />
      </main>
    </div>
  );
}

export default function TopicQuizPage({
  params,
}: {
  params: Promise<{ subject: string; topicId: string }>;
}) {
  const { subject, topicId } = use(params);
  
  return (
    <ProgressProvider>
      <TopicQuizContent subjectId={subject} topicId={topicId} />
    </ProgressProvider>
  );
}

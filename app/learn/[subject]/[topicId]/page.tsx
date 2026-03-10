"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { VideoPlayer } from "@/components/video-player";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { getSubject, getTopic } from "@/lib/data";
import { notFound } from "next/navigation";

function TopicLessonContent({ 
  subjectId, 
  topicId 
}: { 
  subjectId: string; 
  topicId: string;
}) {
  const subject = getSubject(subjectId);
  const topic = getTopic(subjectId, topicId);
  const { getLessonProgress, markLessonComplete } = useProgress();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  if (!subject || !topic) {
    notFound();
  }

  const currentLesson = topic.lessons[currentLessonIndex];
  const lessonProgress = getLessonProgress(subjectId, topicId, currentLesson.id);

  const handleLessonComplete = useCallback(() => {
    markLessonComplete(subjectId, topicId, currentLesson.id);
  }, [subjectId, topicId, currentLesson.id, markLessonComplete]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href={`/learn/${subjectId}`}>
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {subject.name}
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {topic.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{topic.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer
              lesson={currentLesson}
              subjectColor={subject.color}
              onComplete={handleLessonComplete}
              isCompleted={lessonProgress.completed}
            />
          </div>

          {/* Lesson List */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">
                    Lessons ({topic.lessons.length})
                  </h2>
                </div>

                <div className="space-y-2">
                  {topic.lessons.map((lesson, index) => {
                    const progress = getLessonProgress(subjectId, topicId, lesson.id);
                    const isActive = index === currentLessonIndex;
                    const isMath = subject.color === "math";

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(index)}
                        className={`w-full rounded-lg p-3 text-left transition-all ${
                          isActive
                            ? isMath
                              ? "bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950/30"
                              : "bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-950/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {progress.completed ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium truncate ${
                              isActive ? "text-foreground" : "text-foreground"
                            }`}>
                              {lesson.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={currentLessonIndex === 0}
                    onClick={() => setCurrentLessonIndex((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={currentLessonIndex === topic.lessons.length - 1}
                    onClick={() => setCurrentLessonIndex((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>

                {/* Practice Link */}
                <Link href={`/practice/${subjectId}/${topicId}`} className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    Practice This Topic
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TopicLessonPage({
  params,
}: {
  params: Promise<{ subject: string; topicId: string }>;
}) {
  const { subject, topicId } = use(params);
  
  return (
    <ProgressProvider>
      <TopicLessonContent subjectId={subject} topicId={topicId} />
    </ProgressProvider>
  );
}

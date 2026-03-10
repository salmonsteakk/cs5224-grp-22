"use client";

import Link from "next/link";
import { 
  Plus, Minus, X, Divide, Shapes, Leaf, Heart, Cloud, Sun,
  CheckCircle2, Play, HelpCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Topic } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plus,
  Minus,
  X,
  Divide,
  Shapes,
  Leaf,
  Dog: Heart,
  Heart,
  Cloud,
  Sun,
};

interface TopicCardProps {
  topic: Topic;
  subjectId: string;
  mode: "learn" | "practice";
  subjectColor: "math" | "science";
  lessonsCompleted?: number;
  bestScore?: number;
}

export function TopicCard({
  topic,
  subjectId,
  mode,
  subjectColor,
  lessonsCompleted = 0,
  bestScore,
}: TopicCardProps) {
  const Icon = iconMap[topic.icon] || HelpCircle;
  const isMath = subjectColor === "math";
  
  const totalLessons = topic.lessons.length;
  const progressPercent = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;
  
  const iconBgColor = isMath ? "bg-blue-100 dark:bg-blue-900/50" : "bg-emerald-100 dark:bg-emerald-900/50";
  const iconColor = isMath ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400";
  const progressColor = isMath ? "[&>div]:bg-blue-500" : "[&>div]:bg-emerald-500";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{topic.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
              {topic.description}
            </p>

            {mode === "learn" && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {lessonsCompleted} of {totalLessons} lessons
                  </span>
                  {progressPercent === 100 && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </span>
                  )}
                </div>
                <Progress value={progressPercent} className={`h-2 ${progressColor}`} />
              </div>
            )}

            {mode === "practice" && (
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {topic.questions.length} questions
                </span>
                {bestScore !== undefined && bestScore > 0 && (
                  <span className={`font-medium ${
                    bestScore >= 80 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : bestScore >= 60 
                        ? "text-amber-600 dark:text-amber-400" 
                        : "text-red-600 dark:text-red-400"
                  }`}>
                    Best: {bestScore}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Link href={`/${mode}/${subjectId}/${topic.id}`} className="mt-4 block">
          <Button variant="outline" className="w-full gap-2">
            {mode === "learn" ? (
              <>
                <Play className="h-4 w-4" />
                {lessonsCompleted > 0 ? "Continue" : "Start"} Lessons
              </>
            ) : (
              <>
                <HelpCircle className="h-4 w-4" />
                Take Quiz
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

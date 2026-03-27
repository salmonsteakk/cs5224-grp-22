import { Link } from "react-router-dom";
import { Calculator, Microscope, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Subject, SubjectCardStats } from "@/types";

const iconMap = {
  Calculator: Calculator,
  Microscope: Microscope,
};

interface SubjectCardProps {
  subject: Subject;
  mode: "learn" | "practice";
  stats?: SubjectCardStats;
}

export function SubjectCard({ subject, mode, stats }: SubjectCardProps) {
  const Icon = iconMap[subject.icon as keyof typeof iconMap] || Calculator;
  const isMath = subject.color === "math";

  const bgColor = isMath
    ? "bg-blue-50 dark:bg-blue-950/30"
    : "bg-emerald-50 dark:bg-emerald-950/30";
  const borderColor = isMath
    ? "border-blue-200 dark:border-blue-800"
    : "border-emerald-200 dark:border-emerald-800";
  const iconBgColor = isMath
    ? "bg-blue-500"
    : "bg-emerald-500";
  const buttonColor = isMath
    ? "bg-blue-500 hover:bg-blue-600 text-white"
    : "bg-emerald-500 hover:bg-emerald-600 text-white";

  return (
    <Card className={`overflow-hidden border-2 ${borderColor} ${bgColor} transition-all hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBgColor}`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{subject.description}</p>

            {stats && (
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {mode === "learn" && stats.lessonsCompleted !== undefined && (
                  <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground">
                    {stats.lessonsCompleted} lessons completed
                  </span>
                )}
                {mode === "practice" && stats.quizzesTaken !== undefined && (
                  <>
                    <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground">
                      {stats.quizzesTaken} quizzes taken
                    </span>
                    {stats.averageScore !== undefined && stats.averageScore > 0 && (
                      <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground">
                        {stats.averageScore}% avg score
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {subject.topics.length} topics available
              </span>
            </div>
          </div>
        </div>

        <Link to={`/${mode}/${subject.id}`} className="mt-4 block">
          <Button className={`w-full gap-2 ${buttonColor}`}>
            {mode === "learn" ? "Start Learning" : "Start Practicing"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

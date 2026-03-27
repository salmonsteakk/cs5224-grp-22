import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SubjectCard } from "@/components/SubjectCard";
import { useAuth } from "@/context/auth-context";
import { getDashboardAnalyticsSummary, getLearnSubjects } from "@/services/api";
import type { DashboardAnalyticsSummary, Subject, SubjectCardStats } from "@/types";

export default function LearnPage() {
  const { token } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsSummary | null>(null);

  useEffect(() => {
    getLearnSubjects().then(setSubjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;
    getDashboardAnalyticsSummary(token).then(setAnalytics).catch(console.error);
  }, [token]);

  const completionMap = new Map(
    (analytics?.subjectCompletion || []).map((row) => [row.subjectId, row])
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Learn</h1>
              <p className="text-muted-foreground">
                Watch video lessons and learn new things!
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => {
            const completion = completionMap.get(subject.id);
            const stats: SubjectCardStats = {
              lessonsCompleted: completion?.completedLessons ?? 0,
              totalLessons: completion?.totalLessons ?? 0,
            };
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                mode="learn"
                stats={stats}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

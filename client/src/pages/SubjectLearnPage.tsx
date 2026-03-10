import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calculator, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { TopicCard } from "@/components/TopicCard";
import { useProgress } from "@/context/progress-context";
import { getLearnSubject } from "@/services/api";
import type { Subject } from "@/types";

export default function SubjectLearnPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { getTopicProgress } = useProgress();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    if (!subjectId) return;
    getLearnSubject(subjectId)
      .then(setSubject)
      .catch(() => navigate("/learn", { replace: true }));
  }, [subjectId, navigate]);

  if (!subject) return null;

  const isMath = subject.color === "math";
  const Icon = isMath ? Calculator : Microscope;
  const iconBg = isMath ? "bg-blue-500" : "bg-emerald-500";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link to="/learn">
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
                {subject.name}
              </h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {subject.topics.length} topics available
            </span>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-foreground">Topics</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subject.topics.map((topic) => {
            const topicProgress = getTopicProgress(subject.id, topic.id);
            const lessonsCompleted = Object.values(topicProgress.lessons).filter(
              (l) => l.completed
            ).length;

            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                subjectId={subject.id}
                mode="learn"
                subjectColor={subject.color}
                lessonsCompleted={lessonsCompleted}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

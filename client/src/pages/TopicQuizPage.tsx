import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/context/progress-context";
import { getLearnSubject, getQuestions } from "@/services/api";
import type { Subject, Question } from "@/types";

export default function TopicQuizPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { recordQuizAttempt } = useProgress();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!subjectId || !topicId) return;

    Promise.all([
      getLearnSubject(subjectId),
      getQuestions(subjectId, topicId),
    ])
      .then(([subjectData, questionsData]) => {
        setSubject(subjectData);
        setQuestions(questionsData);
      })
      .catch(() => navigate("/practice", { replace: true }));
  }, [subjectId, topicId, navigate]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    if (!subjectId || !topicId) return;
    recordQuizAttempt(subjectId, topicId, score, total);
  }, [subjectId, topicId, recordQuizAttempt]);

  if (!subject || questions.length === 0) return null;

  const topic = subject.topics.find((t) => t.id === topicId);
  if (!topic) return null;

  const isMath = subject.color === "math";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link to={`/practice/${subjectId}`}>
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
            <span>{questions.length} questions</span>
            <span>|</span>
            <Link
              to={`/learn/${subjectId}/${topicId}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" />
              Review lessons first
            </Link>
          </div>
        </div>

        <Quiz
          questions={questions}
          subjectColor={subject.color}
          onComplete={handleQuizComplete}
        />
      </main>
    </div>
  );
}

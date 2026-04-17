import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/context/progress-context";
import { useAuth } from "@/context/auth-context";
import { getFocusLoop, getLearnSubject, getQuestions, listTopicQuizAttempts } from "@/services/api";
import type {
  FocusLoopRecommendation,
  Subject,
  Question,
  TopicQuizAttemptDto,
  QuizCompletionResult,
} from "@/types";

export default function TopicQuizPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { recordQuizAttempt, recordStrategyCardOpen } = useProgress();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<TopicQuizAttemptDto[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [focusLoop, setFocusLoop] = useState<FocusLoopRecommendation | null>(null);

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

  const loadAttempts = useCallback(async () => {
    if (!token || !subjectId || !topicId) return;
    setAttemptsLoading(true);
    try {
      const res = await listTopicQuizAttempts(token, subjectId, topicId);
      setAttempts(res.attempts);
    } catch {
      setAttempts([]);
    } finally {
      setAttemptsLoading(false);
    }
  }, [token, subjectId, topicId]);

  useEffect(() => {
    void loadAttempts();
  }, [loadAttempts]);

  const handleQuizComplete = useCallback(
    (result: QuizCompletionResult) => {
      if (!subjectId || !topicId) return;
      recordQuizAttempt(subjectId, topicId, result);
      if (result.focusLoopTag) {
        void getFocusLoop(subjectId, topicId, result.focusLoopTag)
          .then(setFocusLoop)
          .catch(() => setFocusLoop(null));
      } else {
        setFocusLoop(null);
      }
      void loadAttempts();
    },
    [subjectId, topicId, recordQuizAttempt, loadAttempts]
  );

  if (!subject || questions.length === 0) return null;

  const topic = subject.topics.find((t) => t.id === topicId);
  if (!topic) return null;

  const isMath = subject.color === "math";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  const questionById = new Map(questions.map((q) => [q.id, q]));

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
          onStrategyViewed={() => {
            if (!subjectId || !topicId) return;
            recordStrategyCardOpen(subjectId, topicId);
          }}
        />

        {focusLoop && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Targeted Practice Boost</CardTitle>
              <p className="text-sm text-muted-foreground">{focusLoop.rationale}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-foreground">Target: {focusLoop.misconceptionTag}</p>
              {focusLoop.questions.map((q, idx) => (
                <div key={q.id} className="rounded-md border border-border px-3 py-2">
                  {idx + 1}. {q.question}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your practice attempts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Open an attempt to review each question and whether you got it right.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {attemptsLoading && (
                <p className="text-sm text-muted-foreground">Loading attempts…</p>
              )}
              {!attemptsLoading && attempts.length === 0 && (
                <p className="text-sm text-muted-foreground">No attempts yet. Complete the quiz below.</p>
              )}
              {attempts.map((att) => {
                const pct = Math.round((att.score / att.totalQuestions) * 100);
                const open = expandedAttemptId === att.attemptId;
                return (
                  <div key={att.attemptId} className="rounded-lg border border-border">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm"
                      onClick={() =>
                        setExpandedAttemptId(open ? null : att.attemptId)
                      }
                    >
                      <span>
                        {new Date(att.submittedAt).toLocaleString()} — {att.score}/
                        {att.totalQuestions} ({pct}%)
                      </span>
                      {open ? (
                        <ChevronUp className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                    {open && (
                      <div className="space-y-3 border-t border-border px-3 py-3">
                        {att.responses.map((r) => {
                          const q = questionById.get(r.questionId);
                          return (
                            <div
                              key={r.questionId}
                              className={`rounded-md p-3 text-sm ${
                                r.correct
                                  ? "bg-emerald-50 dark:bg-emerald-950/30"
                                  : "bg-red-50 dark:bg-red-950/30"
                              }`}
                            >
                              <p className="font-medium text-foreground">
                                {q?.question ?? `Question ${r.questionId}`}
                              </p>
                              <p className="mt-1 text-muted-foreground">
                                Your answer:{" "}
                                {r.selectedIndex >= 0 && q
                                  ? q.options[r.selectedIndex] ?? "(n/a)"
                                  : "(no answer)"}{" "}
                                — {r.correct ? "Correct" : "Incorrect"}
                              </p>
                              {q?.explanation && (
                                <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Quiz } from "@/components/Quiz";
import { useAuth } from "@/context/auth-context";
import { useProgress } from "@/context/progress-context";
import { useExamPaper } from "@/hooks/useExamPaper";
import { useExamAttempts } from "@/hooks/useExamAttempts";
import { submitExamAttempt } from "@/services/api";
import type { QuizCompletionResult } from "@/types";

export default function ExamPaperPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { refreshProgressFromServer } = useProgress();
  const { paper, loading, error } = useExamPaper(paperId);
  const { attempts, loading: attemptsLoading, refreshAttempts } = useExamAttempts(
    paperId,
    token
  );
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);

  const subjectColor = paper?.subjectId === "math" ? "math" : "science";
  const isMath = subjectColor === "math";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  const questionById = new Map((paper?.questions ?? []).map((q) => [q.id, q]));

  useEffect(() => {
    if (!loading && (!paper || error)) {
      navigate("/exams", { replace: true });
    }
  }, [loading, paper, error, navigate]);

  const handleQuizComplete = useCallback(
    (result: QuizCompletionResult) => {
      if (!token || !paperId) return;
      void (async () => {
        try {
          await submitExamAttempt(token, {
            examPaperId: paperId,
            score: result.score,
            totalQuestions: result.totalQuestions,
            responses: result.responses,
          });
          await refreshProgressFromServer();
          await refreshAttempts();
        } catch (e) {
          console.error("submitExamAttempt failed", e);
        }
      })();
    },
    [token, paperId, refreshProgressFromServer, refreshAttempts]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading paper…</p>
        </main>
      </div>
    );
  }

  if (!paper) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/exams">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to mock exams
          </Button>
        </Link>

        <div className={`mb-6 rounded-2xl ${lightBg} p-6`}>
          <h1 className="text-2xl font-bold text-foreground">{paper.title}</h1>
          <p className="mt-1 text-muted-foreground">{paper.description}</p>
          <p className="mt-4 text-sm text-muted-foreground capitalize">
            Subject: {paper.subjectId} · {paper.questions.length} questions
          </p>
        </div>

        <Quiz
          questions={paper.questions}
          subjectColor={subjectColor}
          onComplete={handleQuizComplete}
        />

        {isAuthenticated && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your attempts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Expand an attempt to review each question.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {attemptsLoading && (
                <p className="text-sm text-muted-foreground">Loading attempts…</p>
              )}
              {!attemptsLoading && attempts.length === 0 && (
                <p className="text-sm text-muted-foreground">No attempts yet. Complete the paper above.</p>
              )}
              {attempts.map((att) => {
                const pct = Math.round((att.score / att.totalQuestions) * 100);
                const open = expandedAttemptId === att.attemptId;
                return (
                  <div key={att.attemptId} className="rounded-lg border border-border">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm"
                      onClick={() => setExpandedAttemptId(open ? null : att.attemptId)}
                    >
                      <span>
                        {new Date(att.submittedAt).toLocaleString()} — {att.score}/{att.totalQuestions}{" "}
                        ({pct}%)
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

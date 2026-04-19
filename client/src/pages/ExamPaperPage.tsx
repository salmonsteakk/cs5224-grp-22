import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Play, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Quiz } from "@/components/Quiz";
import { useAuth } from "@/context/auth-context";
import { useProgress } from "@/context/progress-context";
import { useExamPaper } from "@/hooks/useExamPaper";
import { useExamAttempts } from "@/hooks/useExamAttempts";
import { submitExamAttempt } from "@/services/api";
import { useChatbot } from "@/context/chatbot-context";
import type { QuizCompletionResult } from "@/types";

type ExamState = "start" | "quiz" | "review";

export default function ExamPaperPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { refreshProgressFromServer } = useProgress();
  const { isSidebarOpen, closeSidebar, setHideAssistantButton } = useChatbot();
  const { paper, loading, error } = useExamPaper(paperId);
  const { attempts, loading: attemptsLoading, refreshAttempts } = useExamAttempts(
    paperId,
    token
  );
  const [examState, setExamState] = useState<ExamState>("start");
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [currentAttemptResult, setCurrentAttemptResult] = useState<QuizCompletionResult | null>(null);

  const subjectColor = paper?.subjectId === "math" ? "math" : "science";
  const isMath = subjectColor === "math";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  const questionById = new Map((paper?.questions ?? []).map((q) => [q.id, q]));

  useEffect(() => {
    if (!loading && (!paper || error)) {
      navigate("/exams", { replace: true });
    }
  }, [loading, paper, error, navigate]);

  const handleReviewClick = useCallback(
    (result: QuizCompletionResult) => {
      setCurrentAttemptResult(result);
      setExamState("review");

      // Submit the attempt asynchronously after the state transition
      if (token && paperId) {
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
      }
    },
    [token, paperId, refreshProgressFromServer, refreshAttempts]
  );

  const handleStartExam = () => {
    setExamState("quiz");
  };

  const handleReviewAttempts = () => {
    setExamState("review");
  };

  const handleBackToStart = () => {
    setExamState("start");
    setCurrentAttemptResult(null);
  };

  useEffect(() => {
    setHideAssistantButton(examState === "quiz");

    if (examState === "quiz" && isSidebarOpen) {
      closeSidebar();
    }

    return () => {
      setHideAssistantButton(false);
    };
  }, [examState, isSidebarOpen, closeSidebar, setHideAssistantButton]);

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

        {examState === "start" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Instructions</CardTitle>
                <CardDescription>
                  This is a timed mock exam. You will have limited time to complete all questions.
                  Make sure you're in a quiet environment and have all necessary materials ready.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Exam Details</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {paper.questions.length} questions total</li>
                      <li>• Multiple choice format</li>
                      <li>• Timed exam</li>
                      <li>• Instant feedback after completion</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Tips for Success</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Read each question carefully</li>
                      <li>• Manage your time wisely</li>
                      <li>• Review your answers if time allows</li>
                      <li>• Stay focused throughout</li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleStartExam} className="flex-1 gap-2">
                    <Play className="h-4 w-4" />
                    Start Exam
                  </Button>
                  {isAuthenticated && attempts.length > 0 && (
                    <Button variant="outline" onClick={handleReviewAttempts} className="gap-2">
                      <History className="h-4 w-4" />
                      Review Past Attempts
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {examState === "quiz" && (
          <Quiz
            questions={paper.questions}
            subjectColor={subjectColor}
            onComplete={handleReviewClick}
            showReviewButton={true}
            onReview={handleReviewClick}
          />
        )}

        {examState === "review" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Exam Complete</h2>
              <Button variant="outline" onClick={handleBackToStart}>
                Back to Start
              </Button>
            </div>

            {currentAttemptResult && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    Your Latest Attempt
                  </CardTitle>
                  <CardDescription>
                    Completed just now • {currentAttemptResult.score}/{currentAttemptResult.totalQuestions} correct
                    ({Math.round((currentAttemptResult.score / currentAttemptResult.totalQuestions) * 100)}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentAttemptResult.responses.map((response, index) => {
                      const question = questionById.get(response.questionId);
                      return (
                        <div
                          key={response.questionId}
                          className={`rounded-md p-3 text-sm ${
                            response.correct
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                              : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          <p className="font-medium text-foreground">
                            Question {index + 1}: {question?.question ?? `Question ${response.questionId}`}
                          </p>
                          <p className="mt-1 text-muted-foreground">
                            Your answer: {response.selectedIndex >= 0 && question
                              ? question.options[response.selectedIndex] ?? "(n/a)"
                              : "(no answer)"}
                          </p>
                          {!response.correct && question && (
                            <p className="mt-1 text-emerald-700 dark:text-emerald-300">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          {question?.explanation && (
                            <p className="mt-2 text-xs text-muted-foreground">{question.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Past Attempts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Expand an attempt to review each question.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {attemptsLoading && (
                  <p className="text-sm text-muted-foreground">Loading attempts…</p>
                )}
                {!attemptsLoading && attempts.length === 0 && (
                  <p className="text-sm text-muted-foreground">No previous attempts.</p>
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
          </div>
        )}
      </main>
    </div>
  );
}

import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Dumbbell,
  Target,
  Trophy,
  Star,
  Medal,
  Zap,
  Crown,
  Calculator,
  Microscope,
  ChevronDown,
  Lightbulb,
  Clock,
  ScrollText,
  ArrowRight,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { useProgress } from "@/context/progress-context";
import { useAuth } from "@/context/auth-context";
import {
  findFirstIncompleteLesson,
  findWeakestPracticedTopic,
  formatRelativeTime,
  getDashboardRecommendations,
  getNextAchievementHint,
  getRecentLessonActivity,
  topicQuizCoverage,
} from "@/lib/dashboard-recommendations";
import { buildDashboardCoachPayload } from "@/lib/dashboard-coach-payload";
import {
  getExamPapers,
  getLearnSubjects,
  getWeeklyInterventionSummary,
  listExamAttempts,
  postDashboardCoach,
} from "@/services/api";
import type { ExamPaperSummaryDto, Subject, WeeklyInterventionSummaryDto } from "@/types";

const achievements = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", icon: Star },
  { id: "five-lessons", title: "Quick Learner", description: "Complete 5 lessons", icon: Zap },
  { id: "ten-lessons", title: "Knowledge Seeker", description: "Complete 10 lessons", icon: BookOpen },
  { id: "first-quiz", title: "Quiz Starter", description: "Take your first quiz", icon: Target },
  { id: "ten-quizzes", title: "Quiz Master", description: "Complete 10 quizzes", icon: Medal },
  { id: "perfect-score", title: "Perfect Score", description: "Get 100% on a quiz", icon: Crown },
] as const;

const levelTitles = [
  "Beginner",
  "Explorer",
  "Learner",
  "Scholar",
  "Expert",
  "Master",
  "Champion",
  "Legend",
];

const EXAM_PAPERS_FETCH_CAP = 12;

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-hidden="true">
      <div className="h-36 rounded-xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
      <div className="h-64 rounded-xl bg-muted" />
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { progress, getTotalStats, getSubjectStats, getLessonProgress, isProgressLoaded } = useProgress();
  const stats = getTotalStats();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [openSubjectTopics, setOpenSubjectTopics] = useState<Record<string, boolean>>({});
  const [examRows, setExamRows] = useState<
    Array<{ paper: ExamPaperSummaryDto; latestPercent: number | null; attemptCount: number }>
  >([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [coachText, setCoachText] = useState<string | null>(null);
  const [coachFailed, setCoachFailed] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyInterventionSummaryDto | null>(null);

  useEffect(() => {
    getLearnSubjects()
      .then(setSubjects)
      .catch(() => setSubjectsError("Could not load subjects."))
      .finally(() => setSubjectsLoading(false));
  }, []);

  useEffect(() => {
    if (!token || !isProgressLoaded) return;
    let cancelled = false;
    setExamsLoading(true);
    (async () => {
      try {
        const { papers } = await getExamPapers();
        const cap = papers.slice(0, EXAM_PAPERS_FETCH_CAP);
        const rows = await Promise.all(
          cap.map(async (paper) => {
            try {
              const { attempts } = await listExamAttempts(token, paper.paperId);
              const latest = attempts[0];
              const latestPercent =
                latest && latest.totalQuestions > 0
                  ? Math.round((latest.score / latest.totalQuestions) * 100)
                  : null;
              return {
                paper,
                latestPercent,
                attemptCount: attempts.length,
              };
            } catch {
              return { paper, latestPercent: null, attemptCount: 0 };
            }
          })
        );
        if (!cancelled) setExamRows(rows);
      } catch {
        if (!cancelled) setExamRows([]);
      } finally {
        if (!cancelled) setExamsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, isProgressLoaded]);

  useEffect(() => {
    if (!token || !isProgressLoaded) return;
    getWeeklyInterventionSummary(token)
      .then(setWeeklySummary)
      .catch(() => setWeeklySummary(null));
  }, [token, isProgressLoaded]);

  const firstIncomplete = useMemo(
    () => (subjects.length ? findFirstIncompleteLesson(subjects, progress) : null),
    [subjects, progress]
  );

  const recommendations = useMemo(
    () => (subjects.length ? getDashboardRecommendations(subjects, progress) : []),
    [subjects, progress]
  );

  const recentLessons = useMemo(
    () => (subjects.length ? getRecentLessonActivity(subjects, progress, 5) : []),
    [subjects, progress]
  );

  const weakestTopic = useMemo(
    () => (subjects.length ? findWeakestPracticedTopic(subjects, progress) : null),
    [subjects, progress]
  );

  const nextAchievementHint = useMemo(
    () => getNextAchievementHint(stats, progress.achievements),
    [stats, progress.achievements]
  );

  const lastActivityText = useMemo(() => {
    const top = recentLessons[0];
    if (!top) return null;
    const rel = formatRelativeTime(top.watchedAt);
    if (!rel) return null;
    return `Last lesson activity ${rel} — ${top.lessonTitle}`;
  }, [recentLessons]);

  const levelTitle = levelTitles[Math.min(progress.level - 1, levelTitles.length - 1)];
  const pointsToNextLevel = progress.level * 100 - progress.totalPoints;
  const levelProgress = ((progress.totalPoints % 100) / 100) * 100;

  const displayName = user?.name?.trim() || "there";
  const dataReady = isProgressLoaded && !subjectsLoading;

  const papersAttempted = examRows.filter((r) => r.attemptCount > 0).length;
  const papersNotStarted = examRows.filter((r) => r.attemptCount === 0).length;

  /** Same slice as sent to /dashboard-coach — real Router links in the AI card */
  const coachQuickLinks = useMemo(() => recommendations.slice(0, 5), [recommendations]);

  const coachPayload = useMemo(() => {
    if (!dataReady) return null;
    return buildDashboardCoachPayload({
      level: progress.level,
      totalPoints: progress.totalPoints,
      levelTitle,
      stats,
      recommendations,
      examSummary: {
        papersAttempted,
        papersNotStarted,
        papersListed: examRows.length,
      },
    });
  }, [
    dataReady,
    progress.level,
    progress.totalPoints,
    levelTitle,
    stats.totalLessonsCompleted,
    stats.totalQuizzesTaken,
    stats.overallAccuracy,
    stats.totalQuestionsAnswered,
    recommendations,
    papersAttempted,
    papersNotStarted,
    examRows.length,
  ]);

  useEffect(() => {
    if (!coachPayload) {
      setCoachText(null);
      setCoachFailed(false);
      return;
    }
    let cancelled = false;
    setCoachText(null);
    setCoachFailed(false);
    postDashboardCoach(coachPayload)
      .then((r) => {
        if (cancelled) return;
        const t = r.coachText?.trim();
        if (t) setCoachText(t);
        else setCoachFailed(true);
      })
      .catch(() => {
        if (!cancelled) setCoachFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [coachPayload]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Welcome back, {displayName}
                </h1>
                <p className="text-muted-foreground">
                  {lastActivityText ??
                    "Track progress, get suggestions, and jump back into learning."}
                </p>
              </div>
            </div>
            {dataReady && (
              <Button variant="outline" size="sm" className="shrink-0 gap-2 self-start" asChild>
                <Link to="/learn">
                  <BookOpen className="h-4 w-4" />
                  All subjects
                </Link>
              </Button>
            )}
          </div>
          {subjectsError && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {subjectsError}
            </p>
          )}
        </header>

        {!dataReady ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Continue learning hero */}
            <section className="mb-8" aria-labelledby="continue-heading">
              <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <h2 id="continue-heading" className="text-lg font-semibold text-foreground">
                      {firstIncomplete ? "Continue learning" : "Great progress"}
                    </h2>
                    {firstIncomplete ? (
                      <p className="max-w-xl text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{firstIncomplete.lessonTitle}</span>
                        {" · "}
                        {firstIncomplete.topicTitle} ({firstIncomplete.subjectName})
                      </p>
                    ) : (
                      <p className="max-w-xl text-sm text-muted-foreground">
                        {weakestTopic
                          ? `Review ${weakestTopic.topicTitle} (${weakestTopic.bestScore}% best) or try a mock exam.`
                          : "Try a mock exam or revisit a topic quiz to stay sharp."}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {firstIncomplete ? (
                      <>
                        <Button className="gap-2" asChild>
                          <Link to={`/learn/${firstIncomplete.subjectId}/${firstIncomplete.topicId}`}>
                            Resume lesson
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        {firstIncomplete.questionCount > 0 && (
                          <Button variant="outline" className="gap-2" asChild>
                            <Link
                              to={`/practice/${firstIncomplete.subjectId}/${firstIncomplete.topicId}`}
                            >
                              <Dumbbell className="h-4 w-4" />
                              Practice
                            </Link>
                          </Button>
                        )}
                      </>
                    ) : weakestTopic ? (
                      <>
                        <Button className="gap-2" asChild>
                          <Link
                            to={`/practice/${weakestTopic.subjectId}/${weakestTopic.topicId}`}
                          >
                            <Dumbbell className="h-4 w-4" />
                            Practice weakest topic
                          </Link>
                        </Button>
                        <Button variant="outline" className="gap-2" asChild>
                          <Link to="/exams">
                            <ScrollText className="h-4 w-4" />
                            Mock exams
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button className="gap-2" asChild>
                        <Link to="/exams">
                          <ScrollText className="h-4 w-4" />
                          Browse mock exams
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* AI coach (HF); rule-based cards below stay the source of truth for links */}
            <section className="mb-8" aria-labelledby="coach-heading">
              <Card className="border-primary/15 bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle id="coach-heading" className="text-base">
                      AI study tip
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {coachFailed ? (
                    <p className="text-sm text-muted-foreground">
                      Personalised tip unavailable right now.
                    </p>
                  ) : coachText ? (
                    <p className="whitespace-pre-wrap text-sm text-foreground">{coachText}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground animate-pulse" aria-busy="true">
                      Getting your tip…
                    </p>
                  )}
                  {coachQuickLinks.length > 0 && (
                    <div
                      className="flex flex-col gap-2 border-t border-border/60 pt-4"
                      aria-label="Quick links for suggested actions"
                    >
                      <p className="text-xs font-medium text-muted-foreground">Go to</p>
                      <div className="flex flex-wrap gap-2">
                        {coachQuickLinks.map((rec) => (
                          <Fragment key={rec.id}>
                            <Button size="sm" className="gap-1" asChild>
                              <Link to={rec.primaryHref}>{rec.primaryLabel}</Link>
                            </Button>
                            {rec.secondaryHref && rec.secondaryLabel ? (
                              <Button size="sm" variant="outline" className="gap-1" asChild>
                                <Link to={rec.secondaryHref}>{rec.secondaryLabel}</Link>
                              </Button>
                            ) : null}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <section className="mb-8" aria-labelledby="rec-heading">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <h2 id="rec-heading" className="text-lg font-semibold text-foreground">
                    Suggested for you
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="mt-auto flex flex-1 flex-col gap-4">
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="gap-1" asChild>
                            <Link to={rec.primaryHref}>{rec.primaryLabel}</Link>
                          </Button>
                          {rec.secondaryHref && rec.secondaryLabel && (
                            <Button size="sm" variant="outline" className="gap-1" asChild>
                              <Link to={rec.secondaryHref}>{rec.secondaryLabel}</Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Recent activity */}
            {recentLessons.length > 0 && (
              <section className="mb-8" aria-labelledby="recent-heading">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <h2 id="recent-heading" className="text-lg font-semibold text-foreground">
                    Recent lessons
                  </h2>
                </div>
                <Card>
                  <CardContent className="divide-y p-0">
                    {recentLessons.map((row) => (
                      <div
                        key={`${row.subjectId}-${row.topicId}-${row.lessonId}-${row.watchedAt}`}
                        className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium text-foreground">{row.lessonTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {row.topicTitle} · {row.subjectName}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {formatRelativeTime(row.watchedAt)}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/learn/${row.subjectId}/${row.topicId}`}>Open</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Mock exam snapshot */}
            {token && (
              <section className="mb-8" aria-labelledby="exams-heading">
                <div className="mb-4 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 id="exams-heading" className="text-lg font-semibold text-foreground">
                    Mock exams
                  </h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    {examsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading exam activity…</p>
                    ) : examRows.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No exam papers available yet.{" "}
                        <Link to="/exams" className="font-medium text-primary underline-offset-4 hover:underline">
                          Open exams
                        </Link>
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{papersAttempted}</span> paper
                          {papersAttempted === 1 ? "" : "s"} with attempts ·{" "}
                          <span className="font-medium text-foreground">{papersNotStarted}</span> not
                          started yet
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/exams">View all papers</Link>
                        </Button>
                      </div>
                    )}
                    {!examsLoading && examRows.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-border pt-4">
                        {examRows.slice(0, 5).map(({ paper, latestPercent, attemptCount }) => (
                          <li
                            key={paper.paperId}
                            className="flex flex-wrap items-center justify-between gap-2 text-sm"
                          >
                            <Link
                              to={`/exams/paper/${paper.paperId}`}
                              className="font-medium text-foreground underline-offset-4 hover:underline"
                            >
                              {paper.title}
                            </Link>
                            <span className="text-muted-foreground">
                              {attemptCount === 0
                                ? "Not tried"
                                : `Latest ${latestPercent ?? 0}% · ${attemptCount} attempt${
                                    attemptCount === 1 ? "" : "s"
                                  }`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Stats Overview */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                      <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total points</p>
                      <p className="text-2xl font-bold text-foreground">{progress.totalPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lessons done</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalLessonsCompleted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                      <Dumbbell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quizzes taken</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalQuizzesTaken}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                      <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.overallAccuracy > 0 ? `${stats.overallAccuracy}%` : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {weeklySummary && (
              <section className="mb-8" aria-labelledby="weekly-parent-summary">
                <Card>
                  <CardHeader>
                    <CardTitle id="weekly-parent-summary" className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Weekly Parent Progress Snapshot
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(weeklySummary.periodStart).toLocaleDateString()} -{" "}
                      {new Date(weeklySummary.periodEnd).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Strengths</p>
                      <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                        {weeklySummary.strengths.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Risks</p>
                      <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                        {weeklySummary.risks.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Interventions</p>
                      <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                        {weeklySummary.interventions.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-3 grid gap-3 sm:grid-cols-3">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground">Learning Growth</p>
                          <p className="text-2xl font-bold text-foreground">
                            {weeklySummary.metrics.learningGain}%
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground">Learning Activity</p>
                          <p className="text-2xl font-bold text-foreground">
                            {weeklySummary.metrics.engagement}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground">Learning Consistency (D7/W4)</p>
                          <p className="text-2xl font-bold text-foreground">
                            {weeklySummary.metrics.retention}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    Your level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                      <span className="text-3xl font-bold text-white">{progress.level}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl font-semibold text-foreground">{levelTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {pointsToNextLevel > 0
                          ? `${pointsToNextLevel} points to next level`
                          : "You're at the next level threshold — keep earning points!"}
                      </p>
                      <div className="mt-2">
                        <Progress value={levelProgress} className="h-2 [&>div]:bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    Achievements
                  </CardTitle>
                  {nextAchievementHint && (
                    <p className="text-sm text-muted-foreground">{nextAchievementHint}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className="grid grid-cols-3 gap-3"
                    role="list"
                    aria-label="Achievement badges"
                  >
                    {achievements.map((achievement) => {
                      const isUnlocked = progress.achievements.includes(achievement.id);
                      const Icon = achievement.icon;
                      const label = `${achievement.title}. ${achievement.description}. ${
                        isUnlocked ? "Unlocked" : "Locked"
                      }`;

                      return (
                        <div
                          key={achievement.id}
                          role="listitem"
                          tabIndex={0}
                          aria-label={label}
                          className={`flex flex-col items-center rounded-lg p-3 text-center outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring ${
                            isUnlocked
                              ? "bg-amber-50 dark:bg-amber-900/30"
                              : "bg-muted opacity-60"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isUnlocked ? "bg-amber-500" : "bg-muted-foreground/30"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                isUnlocked ? "text-white" : "text-muted-foreground"
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                          <p
                            className={`mt-2 text-xs font-medium ${
                              isUnlocked ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {achievement.title}
                          </p>
                          <span className="sr-only">{achievement.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject progress */}
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Subject progress</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {subjects.map((subject) => {
                  const subjectStats = getSubjectStats(subject.id);
                  const isMath = subject.color === "math";
                  const Icon = isMath ? Calculator : Microscope;

                  const totalLessons = subject.topics.reduce(
                    (acc, topic) => acc + (topic.lessons?.length || 0),
                    0
                  );
                  const lessonsProgress =
                    totalLessons > 0 ? (subjectStats.lessonsCompleted / totalLessons) * 100 : 0;
                  const qCov = topicQuizCoverage(subject, progress);
                  const topicsOpen = openSubjectTopics[subject.id] ?? false;

                  return (
                    <Card
                      key={subject.id}
                      className={`border-2 ${
                        isMath
                          ? "border-blue-200 dark:border-blue-800"
                          : "border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                              isMath ? "bg-blue-500" : "bg-emerald-500"
                            }`}
                          >
                            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground">{subject.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {subjectStats.lessonsCompleted} of {totalLessons} lessons
                              {qCov.withQuestions > 0 && (
                                <>
                                  {" · "}
                                  Quiz coverage {qCov.practiced}/{qCov.withQuestions} topics
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">Lessons</span>
                            <span className="font-medium text-foreground">
                              {Math.round(lessonsProgress)}%
                            </span>
                          </div>
                          <Progress
                            value={lessonsProgress}
                            className={`h-2 ${
                              isMath ? "[&>div]:bg-blue-500" : "[&>div]:bg-emerald-500"
                            }`}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {subjectStats.quizzesTaken} quizzes taken
                          </span>
                          {subjectStats.averageScore > 0 && (
                            <span className="font-medium text-foreground">
                              {subjectStats.averageScore}% avg
                            </span>
                          )}
                        </div>

                        <details
                          className="group mt-4 rounded-lg border border-border bg-muted/30"
                          open={topicsOpen}
                          onToggle={(e) => {
                            setOpenSubjectTopics((prev) => ({
                              ...prev,
                              [subject.id]: (e.target as HTMLDetailsElement).open,
                            }));
                          }}
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                            <span>Topics</span>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                          </summary>
                          <ul className="divide-y divide-border border-t border-border px-3 py-1">
                            {subject.topics.map((topic) => {
                              const tp = progress.subjects[subject.id]?.topics[topic.id];
                              const tLessons = topic.lessons.length;
                              const tDone = topic.lessons.filter(
                                (l) => getLessonProgress(subject.id, topic.id, l.id).completed
                              ).length;
                              const attempts = tp?.quizAttemptCount ?? tp?.quizAttempts.length ?? 0;
                              const qn =
                                typeof topic.questionCount === "number"
                                  ? topic.questionCount
                                  : topic.questions?.length ?? 0;
                              const best = tp?.bestScore ?? 0;

                              return (
                                <li
                                  key={topic.id}
                                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium text-foreground">{topic.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Lessons {tDone}/{tLessons}
                                      {qn > 0 &&
                                        (attempts > 0
                                          ? ` · Best quiz ${best}%`
                                          : " · Quiz not tried")}
                                    </p>
                                  </div>
                                  <div className="flex shrink-0 gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link to={`/learn/${subject.id}/${topic.id}`}>Learn</Link>
                                    </Button>
                                    {qn > 0 && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <Link to={`/practice/${subject.id}/${topic.id}`}>
                                          Practice
                                        </Link>
                                      </Button>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </details>

                        <div className="mt-4 flex gap-2">
                          <Link to={`/learn/${subject.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <BookOpen className="h-4 w-4" />
                              Learn
                            </Button>
                          </Link>
                          <Link to={`/practice/${subject.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <Dumbbell className="h-4 w-4" />
                              Practice
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Empty state */}
            {stats.totalLessonsCompleted === 0 && stats.totalQuizzesTaken === 0 && (
              <Card className="mt-6">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Start your learning journey
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                    Complete lessons and take quizzes to earn points, level up, and unlock
                    achievements.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link to="/learn">
                      <Button className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Start learning
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}

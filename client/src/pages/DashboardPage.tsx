import { useEffect, useMemo, useState } from "react";
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
  Flame,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { useProgress } from "@/context/progress-context";
import { useAuth } from "@/context/auth-context";
import { getDashboardAnalyticsSummary, getLearnSubjects } from "@/services/api";
import { fireAndForgetAnalytics } from "@/services/analytics";
import type { DashboardAnalyticsSummary, Subject } from "@/types";

const achievements = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", icon: Star },
  { id: "five-lessons", title: "Quick Learner", description: "Complete 5 lessons", icon: Zap },
  { id: "ten-lessons", title: "Knowledge Seeker", description: "Complete 10 lessons", icon: BookOpen },
  { id: "first-quiz", title: "Quiz Starter", description: "Take your first quiz", icon: Target },
  { id: "ten-quizzes", title: "Quiz Master", description: "Complete 10 quizzes", icon: Medal },
  { id: "perfect-score", title: "Perfect Score", description: "Get 100% on a quiz", icon: Crown },
];

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

export default function DashboardPage() {
  const { progress } = useProgress();
  const { token } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    getLearnSubjects().then(setSubjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    getDashboardAnalyticsSummary(token)
      .then(setAnalytics)
      .catch((error) => {
        setAnalyticsError(error instanceof Error ? error.message : "Failed to load analytics");
      })
      .finally(() => setAnalyticsLoading(false));
    fireAndForgetAnalytics(token, { eventType: "dashboard_view" });
  }, [token]);

  const levelTitle = levelTitles[Math.min(progress.level - 1, levelTitles.length - 1)];
  const pointsToNextLevel = progress.level * 100 - progress.totalPoints;
  const levelProgress = ((progress.totalPoints % 100) / 100) * 100;
  const fallbackAccuracyTrend = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
        return {
          label: date.toISOString().slice(5, 10),
          accuracy: 0,
        };
      }),
    []
  );
  const accuracyTrend = analytics?.trends.accuracy7d?.length
    ? analytics.trends.accuracy7d
    : fallbackAccuracyTrend;
  const subjectCompletionRows = analytics?.subjectCompletion ?? [];
  const subjectQuizStatsMap = useMemo(
    () =>
      new Map(
        (analytics?.subjectQuizStats || []).map((row) => [row.subjectId, row])
      ),
    [analytics?.subjectQuizStats]
  );
  const hasAccuracyData = accuracyTrend.some((point) => point.accuracy > 0);
  const strongestAccuracyDay = useMemo(() => {
    if (!accuracyTrend.length) return null;
    return accuracyTrend.reduce((best, cur) =>
      cur.accuracy > best.accuracy ? cur : best
    );
  }, [accuracyTrend]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Dashboard</h1>
              <p className="text-muted-foreground">
                Track your learning progress and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy (7d)</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsLoading ? "-" : analytics ? `${analytics.kpis.accuracy7d}%` : "-"}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsLoading ? "-" : analytics?.kpis.lessonsCompleted ?? "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50">
                  <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsLoading ? "-" : `${analytics?.kpis.streakDays ?? 0} days`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                  <Clock3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent (7d)</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsLoading ? "-" : `${analytics?.kpis.timeSpentMinutes7d ?? 0} min`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {analyticsError && (
          <Card className="mb-8 border-amber-500/40">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Analytics data is temporarily unavailable. Try refreshing the page in a few seconds.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Row 2: Accuracy Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Accuracy Trend (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-44 items-end gap-2">
                {accuracyTrend.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-sm bg-blue-500/20">
                      <div
                        className="w-full rounded-sm bg-blue-500"
                        style={{ height: `${Math.max(point.accuracy, 4)}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{point.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {hasAccuracyData && strongestAccuracyDay
                  ? `Best day: ${strongestAccuracyDay.label} (${strongestAccuracyDay.accuracy}%)`
                  : "No quiz attempts yet. Start a quiz to see your trend."}
              </p>
            </CardContent>
          </Card>

          {/* Row 2: Subject Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Subject Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectCompletionRows.map((row) => (
                <div key={row.subjectId}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.subjectName}</span>
                    <span className="font-medium text-foreground">{row.completion}%</span>
                  </div>
                  <Progress value={row.completion} className="h-2 [&>div]:bg-emerald-500" />
                </div>
              ))}
              {subjectCompletionRows.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {analyticsLoading ? "Loading analytics..." : "No analytics data yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Row 3: Weak Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-rose-500" />
                Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(analytics?.weakTopics || []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Complete quizzes to reveal your weakest topics.
                </p>
              )}
              {(analytics?.weakTopics || []).map((topic) => (
                <div key={`${topic.subjectId}:${topic.topicId}`} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{topic.topicTitle}</p>
                    <p className="text-sm text-muted-foreground">{topic.mastery}% mastery</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.subjectName} - accuracy {topic.accuracy}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Row 3: Next Best Action */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Next Best Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {analytics?.nextBestAction || "Complete a lesson and quiz to get personalized recommendations."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Row 4: Motivation Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Points This Week vs Last Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">This week</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics?.trends.pointsWeekVsLastWeek.thisWeek ?? 0}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Last week</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics?.trends.pointsWeekVsLastWeek.lastWeek ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Your Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                  <span className="text-3xl font-bold text-white">{progress.level}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-foreground">{levelTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {pointsToNextLevel > 0
                      ? `${pointsToNextLevel} points to next level`
                      : "Max level reached!"}
                  </p>
                  <div className="mt-2">
                    <Progress value={levelProgress} className="h-2 [&>div]:bg-amber-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Subject Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => {
              const subjectCompletion = subjectCompletionRows.find((row) => row.subjectId === subject.id);
              const subjectQuizStats = subjectQuizStatsMap.get(subject.id);
              const isMath = subject.color === "math";
              const Icon = isMath ? Calculator : Microscope;
              const totalLessons = subjectCompletion?.totalLessons || 0;
              const completedLessons = subjectCompletion?.completedLessons || 0;
              const lessonsProgress = subjectCompletion?.completion || 0;

              return (
                <Card key={subject.id} className={`border-2 ${
                  isMath
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-emerald-200 dark:border-emerald-800"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isMath ? "bg-blue-500" : "bg-emerald-500"
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {completedLessons} of {totalLessons} lessons
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
                        {subjectQuizStats?.quizzesTaken ?? 0} quizzes taken
                      </span>
                      {(subjectQuizStats?.averageScore ?? 0) > 0 && (
                        <span className="font-medium text-foreground">
                          {subjectQuizStats?.averageScore}% avg
                        </span>
                      )}
                    </div>

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

        {/* Achievements */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement) => {
                const isUnlocked = progress.achievements.includes(achievement.id);
                const Icon = achievement.icon;

                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center rounded-lg p-3 text-center transition-all ${
                      isUnlocked
                        ? "bg-amber-50 dark:bg-amber-900/30"
                        : "bg-muted opacity-50"
                    }`}
                    title={achievement.description}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isUnlocked
                          ? "bg-amber-500"
                          : "bg-muted-foreground/30"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isUnlocked ? "text-white" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {achievement.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {progress.totalPoints === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Start Your Learning Journey!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Complete lessons and take quizzes to earn points, level up, and unlock achievements.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/learn">
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

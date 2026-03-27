import { AnalyticsEventModel } from "../models/AnalyticsEvent.js";
import { SubjectModel } from "../models/Subject.js";
import type { AnalyticsEvent, AnalyticsEventType } from "../types/index.js";

const DAY_MS = 24 * 60 * 60 * 1000;

interface DailyAccuracyPoint {
  label: string;
  accuracy: number;
}

interface SubjectCompletion {
  subjectId: string;
  subjectName: string;
  completedLessons: number;
  totalLessons: number;
  completion: number;
}

interface SubjectQuizStats {
  subjectId: string;
  quizzesTaken: number;
  averageScore: number;
}

interface WeakTopic {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  mastery: number;
  accuracy: number;
}

export interface DashboardAnalyticsSummary {
  kpis: {
    accuracy7d: number;
    lessonsCompleted: number;
    streakDays: number;
    timeSpentMinutes7d: number;
  };
  trends: {
    accuracy7d: DailyAccuracyPoint[];
    pointsWeekVsLastWeek: {
      thisWeek: number;
      lastWeek: number;
    };
  };
  subjectCompletion: SubjectCompletion[];
  subjectQuizStats: SubjectQuizStats[];
  weakTopics: WeakTopic[];
  nextBestAction: string;
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  await AnalyticsEventModel.create(event);
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function safePercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export async function getDashboardAnalytics(userId: string): Promise<DashboardAnalyticsSummary> {
  const [eventsRaw, subjectsRaw] = await Promise.all([
    AnalyticsEventModel.query("userId").eq(userId).using("userIdIndex").exec(),
    SubjectModel.scan().exec(),
  ]);

  const events = eventsRaw.map((doc: any) => doc.toJSON()) as AnalyticsEvent[];
  const subjects = subjectsRaw.map((doc: any) => doc.toJSON()) as Array<{
    id: string;
    name: string;
    topics: Array<{ id: string; title: string; lessons: Array<{ id: string }> }>;
  }>;

  const now = Date.now();
  const cutoff7d = now - 7 * DAY_MS;
  const cutoff14d = now - 14 * DAY_MS;
  const answeredEvents = events.filter((event) => event.eventType === "question_answered");
  const answered7d = answeredEvents.filter((event) => new Date(event.createdAt).getTime() >= cutoff7d);

  const lessonsCompletedSet = new Set(
    events
      .filter((event) => event.eventType === "lesson_complete" && event.lessonId)
      .map((event) => `${event.subjectId}:${event.topicId}:${event.lessonId}`)
  );

  const activeDates = new Set(
    events
      .filter((event) => {
        const type = event.eventType as AnalyticsEventType;
        return type === "lesson_complete" || type === "quiz_complete" || type === "question_answered";
      })
      .map((event) => event.createdAt.slice(0, 10))
  );

  let streakDays = 0;
  for (let i = 0; i < 60; i++) {
    const date = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    if (activeDates.has(date)) {
      streakDays++;
    } else if (streakDays > 0) {
      break;
    }
  }

  const timeSpentMinutes7d = Math.round(
    events
      .filter((event) => {
        if (!event.durationSeconds) return false;
        if (event.eventType !== "lesson_complete" && event.eventType !== "quiz_complete") return false;
        return new Date(event.createdAt).getTime() >= cutoff7d;
      })
      .reduce((acc, event) => acc + (event.durationSeconds || 0), 0) / 60
  );

  const trendMap = new Map<string, { correct: number; total: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    trendMap.set(d, { correct: 0, total: 0 });
  }
  answered7d.forEach((event) => {
    const key = event.createdAt.slice(0, 10);
    const current = trendMap.get(key);
    if (!current) return;
    current.total += 1;
    if (event.isCorrect) current.correct += 1;
  });
  const accuracy7dTrend: DailyAccuracyPoint[] = Array.from(trendMap.entries()).map(([label, v]) => ({
    label: label.slice(5),
    accuracy: safePercent(v.correct, v.total),
  }));

  const pointsThisWeek = events
    .filter(
      (event) =>
        typeof event.pointsEarned === "number" && new Date(event.createdAt).getTime() >= cutoff7d
    )
    .reduce((acc, event) => acc + (event.pointsEarned || 0), 0);

  const pointsLastWeek = events
    .filter((event) => {
      if (typeof event.pointsEarned !== "number") return false;
      const ts = new Date(event.createdAt).getTime();
      return ts >= cutoff14d && ts < cutoff7d;
    })
    .reduce((acc, event) => acc + (event.pointsEarned || 0), 0);

  const completedBySubject = new Map<string, number>();
  lessonsCompletedSet.forEach((compositeId) => {
    const subjectId = compositeId.split(":")[0];
    completedBySubject.set(subjectId, (completedBySubject.get(subjectId) || 0) + 1);
  });

  const subjectCompletion: SubjectCompletion[] = subjects.map((subject) => {
    const totalLessons = subject.topics.reduce((acc, topic) => acc + topic.lessons.length, 0);
    const completed = completedBySubject.get(subject.id) || 0;
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      completedLessons: completed,
      totalLessons,
      completion: safePercent(completed, totalLessons),
    };
  });

  const quizStatsBySubject = new Map<string, { score: number; total: number; quizzes: number }>();
  events
    .filter((event) => event.eventType === "quiz_complete")
    .forEach((event) => {
      if (!event.subjectId) return;
      if (typeof event.score !== "number" || typeof event.totalQuestions !== "number") return;
      const current = quizStatsBySubject.get(event.subjectId) || { score: 0, total: 0, quizzes: 0 };
      current.score += event.score;
      current.total += event.totalQuestions;
      current.quizzes += 1;
      quizStatsBySubject.set(event.subjectId, current);
    });

  const subjectQuizStats: SubjectQuizStats[] = subjects.map((subject) => {
    const stats = quizStatsBySubject.get(subject.id);
    return {
      subjectId: subject.id,
      quizzesTaken: stats?.quizzes || 0,
      averageScore: stats ? safePercent(stats.score, stats.total) : 0,
    };
  });

  const topicMeta = new Map<
    string,
    { subjectId: string; subjectName: string; topicId: string; topicTitle: string }
  >();
  subjects.forEach((subject) => {
    subject.topics.forEach((topic) => {
      topicMeta.set(`${subject.id}:${topic.id}`, {
        subjectId: subject.id,
        subjectName: subject.name,
        topicId: topic.id,
        topicTitle: topic.title,
      });
    });
  });

  const topicStats = new Map<string, { correct: number; total: number; latestTs: number }>();
  answeredEvents.forEach((event) => {
    if (!event.subjectId || !event.topicId) return;
    const key = `${event.subjectId}:${event.topicId}`;
    const current = topicStats.get(key) || { correct: 0, total: 0, latestTs: 0 };
    current.total += 1;
    if (event.isCorrect) current.correct += 1;
    const ts = new Date(event.createdAt).getTime();
    if (ts > current.latestTs) current.latestTs = ts;
    topicStats.set(key, current);
  });

  const weakTopics: WeakTopic[] = Array.from(topicStats.entries())
    .map(([key, stats]) => {
      const meta = topicMeta.get(key);
      if (!meta) return null;
      const accuracy = safePercent(stats.correct, stats.total);
      const confidence = Math.min(1, stats.total / 5);
      const recencyBoost = stats.latestTs >= cutoff7d ? 1 : 0.9;
      const mastery = Math.round(accuracy * confidence * recencyBoost);
      return {
        ...meta,
        mastery,
        accuracy,
      };
    })
    .filter((topic): topic is WeakTopic => Boolean(topic))
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  const weakestTopic = weakTopics[0];
  const nextBestAction = weakestTopic
    ? `Review ${weakestTopic.topicTitle} lessons, then retry the ${weakestTopic.topicTitle} quiz.`
    : "Complete a lesson, then take a quiz to unlock personalized recommendations.";

  return {
    kpis: {
      accuracy7d: safePercent(
        answered7d.filter((event) => event.isCorrect).length,
        answered7d.length
      ),
      lessonsCompleted: lessonsCompletedSet.size,
      streakDays,
      timeSpentMinutes7d,
    },
    trends: {
      accuracy7d: accuracy7dTrend,
      pointsWeekVsLastWeek: {
        thisWeek: pointsThisWeek,
        lastWeek: pointsLastWeek,
      },
    },
    subjectCompletion,
    subjectQuizStats,
    weakTopics,
    nextBestAction,
  };
}

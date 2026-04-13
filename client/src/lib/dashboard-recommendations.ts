import type { StudentProgress, Subject, TotalStats } from "@/types";

export type DashboardRecommendationKind =
  | "weak_topic"
  | "start_quiz"
  | "resume_lesson"
  | "balance_subject";

export interface DashboardRecommendation {
  id: string;
  kind: DashboardRecommendationKind;
  title: string;
  reason: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Lower sorts first */
  sortKey: number;
}

export interface FirstIncompleteLesson {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  lessonId: string;
  lessonTitle: string;
  questionCount: number;
}

export interface RecentLessonActivity {
  watchedAt: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  lessonId: string;
  lessonTitle: string;
}

const WEAK_SCORE_THRESHOLD = 70;
const BALANCE_GAP_PERCENT = 20;

function topicProgress(progress: StudentProgress, subjectId: string, topicId: string) {
  return progress.subjects[subjectId]?.topics[topicId];
}

function countTopicLessonsCompleted(progress: StudentProgress, subjectId: string, topicId: string): number {
  const lessons = topicProgress(progress, subjectId, topicId)?.lessons ?? {};
  return Object.values(lessons).filter((l) => l.completed).length;
}

function questionCount(topic: { questions?: unknown[]; questionCount?: number }): number {
  if (typeof topic.questionCount === "number") return topic.questionCount;
  return topic.questions?.length ?? 0;
}

export function findFirstIncompleteLesson(
  subjects: Subject[],
  progress: StudentProgress
): FirstIncompleteLesson | null {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      for (const lesson of topic.lessons) {
        const completed = topicProgress(progress, subject.id, topic.id)?.lessons[lesson.id]?.completed;
        if (!completed) {
          return {
            subjectId: subject.id,
            subjectName: subject.name,
            topicId: topic.id,
            topicTitle: topic.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            questionCount: questionCount(topic),
          };
        }
      }
    }
  }
  return null;
}

export function findWeakestPracticedTopic(
  subjects: Subject[],
  progress: StudentProgress
): {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  bestScore: number;
} | null {
  let best: { bestScore: number; subjectId: string; subjectName: string; topicId: string; topicTitle: string } | null =
    null;

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const tp = topicProgress(progress, subject.id, topic.id);
      const attempts = tp?.quizAttemptCount ?? tp?.quizAttempts.length ?? 0;
      if (attempts === 0) continue;
      const score = tp?.bestScore ?? 0;
      if (!best || score < best.bestScore) {
        best = {
          bestScore: score,
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: topic.id,
          topicTitle: topic.title,
        };
      }
    }
  }
  return best;
}

export function getRecentLessonActivity(
  subjects: Subject[],
  progress: StudentProgress,
  limit: number
): RecentLessonActivity[] {
  const byTopic = new Map<string, { topicTitle: string; subjectId: string; subjectName: string }>();
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      byTopic.set(`${subject.id}:${topic.id}`, {
        topicTitle: topic.title,
        subjectId: subject.id,
        subjectName: subject.name,
      });
    }
  }

  const rows: RecentLessonActivity[] = [];

  for (const [subjectId, sp] of Object.entries(progress.subjects)) {
    for (const [topicId, tp] of Object.entries(sp.topics)) {
      const meta = byTopic.get(`${subjectId}:${topicId}`);
      if (!meta) continue;
      for (const [lessonId, lp] of Object.entries(tp.lessons)) {
        if (!lp.completed || !lp.watchedAt) continue;
        const subject = subjects.find((s) => s.id === subjectId);
        const topic = subject?.topics.find((t) => t.id === topicId);
        const lesson = topic?.lessons.find((l) => l.id === lessonId);
        rows.push({
          watchedAt: lp.watchedAt,
          subjectId,
          subjectName: meta.subjectName,
          topicId,
          topicTitle: meta.topicTitle,
          lessonId,
          lessonTitle: lesson?.title ?? lessonId,
        });
      }
    }
  }

  rows.sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));
  return rows.slice(0, limit);
}

export function topicQuizCoverage(
  subject: Subject,
  progress: StudentProgress
): { practiced: number; withQuestions: number } {
  let withQuestions = 0;
  let practiced = 0;
  for (const topic of subject.topics) {
    const q = questionCount(topic);
    if (q === 0) continue;
    withQuestions += 1;
    const tp = topicProgress(progress, subject.id, topic.id);
    const attempts = tp?.quizAttemptCount ?? tp?.quizAttempts.length ?? 0;
    if (attempts > 0) practiced += 1;
  }
  return { practiced, withQuestions };
}

export function subjectLessonFraction(
  subject: Subject,
  progress: StudentProgress
): { completed: number; total: number; percent: number } {
  let total = 0;
  let completed = 0;
  for (const topic of subject.topics) {
    for (const lesson of topic.lessons) {
      total += 1;
      if (topicProgress(progress, subject.id, topic.id)?.lessons[lesson.id]?.completed) {
        completed += 1;
      }
    }
  }
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export function getDashboardRecommendations(
  subjects: Subject[],
  progress: StudentProgress
): DashboardRecommendation[] {
  const recs: DashboardRecommendation[] = [];
  const weakTopicKeys = new Set<string>();

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const tp = topicProgress(progress, subject.id, topic.id);
      const attempts = tp?.quizAttemptCount ?? tp?.quizAttempts.length ?? 0;
      const best = tp?.bestScore ?? 0;
      const key = `${subject.id}:${topic.id}`;

      if (attempts > 0 && best < WEAK_SCORE_THRESHOLD) {
        weakTopicKeys.add(key);
        recs.push({
          id: `weak-${key}`,
          kind: "weak_topic",
          title: `Practice ${topic.title}`,
          reason: `Your best score is ${best}% on this topic — aim for ${WEAK_SCORE_THRESHOLD}%+ with another quiz.`,
          primaryHref: `/practice/${subject.id}/${topic.id}`,
          primaryLabel: "Practice quiz",
          secondaryHref: `/learn/${subject.id}/${topic.id}`,
          secondaryLabel: "Review lesson",
          sortKey: best,
        });
      }
    }
  }

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const key = `${subject.id}:${topic.id}`;
      if (weakTopicKeys.has(key)) continue;

      const qCount = questionCount(topic);
      if (qCount === 0) continue;

      const tp = topicProgress(progress, subject.id, topic.id);
      const attempts = tp?.quizAttemptCount ?? tp?.quizAttempts.length ?? 0;
      if (attempts > 0) continue;

      const lessonsDone = countTopicLessonsCompleted(progress, subject.id, topic.id);
      if (lessonsDone === 0) continue;

      recs.push({
        id: `quiz-${key}`,
        kind: "start_quiz",
        title: `Quiz: ${topic.title}`,
        reason: "You've started this topic — try a quiz to check your understanding.",
        primaryHref: `/practice/${subject.id}/${topic.id}`,
        primaryLabel: "Start quiz",
        secondaryHref: `/learn/${subject.id}/${topic.id}`,
        secondaryLabel: "Keep learning",
        sortKey: 500 - lessonsDone,
      });
    }
  }

  if (subjects.length >= 2) {
    const fractions = subjects.map((s) => ({
      subject: s,
      ...subjectLessonFraction(s, progress),
    }));
    const percents = fractions.map((f) => f.percent);
    const maxP = Math.max(...percents);
    const minF = fractions.reduce((a, b) => (b.percent < a.percent ? b : a));
    if (maxP - minF.percent >= BALANCE_GAP_PERCENT && minF.total > 0) {
      const ahead = fractions.find((f) => f.percent === maxP);
      recs.push({
        id: `balance-${minF.subject.id}`,
        kind: "balance_subject",
        title: `Catch up on ${minF.subject.name}`,
        reason: ahead
          ? `Your lesson progress in ${minF.subject.name} is behind ${ahead.subject.name} — a short session helps balance both subjects.`
          : `Focus on lessons in ${minF.subject.name} to keep both subjects on track.`,
        primaryHref: `/learn/${minF.subject.id}`,
        primaryLabel: "Open subject",
        secondaryHref: `/practice/${minF.subject.id}`,
        secondaryLabel: "Practice",
        sortKey: 200 + minF.percent,
      });
    }
  }

  const topicWithAction = new Set<string>();
  for (const r of recs) {
    if (r.kind === "weak_topic" || r.kind === "start_quiz") {
      const rest = r.id.replace(/^(weak|quiz)-/, "");
      topicWithAction.add(rest);
    }
  }

  const firstInc = findFirstIncompleteLesson(subjects, progress);
  if (firstInc) {
    const key = `${firstInc.subjectId}:${firstInc.topicId}`;
    if (!topicWithAction.has(key)) {
      recs.push({
        id: `resume-${key}-${firstInc.lessonId}`,
        kind: "resume_lesson",
        title: `Continue: ${firstInc.lessonTitle}`,
        reason: `Next up in ${firstInc.topicTitle} — pick up where you left off.`,
        primaryHref: `/learn/${firstInc.subjectId}/${firstInc.topicId}`,
        primaryLabel: "Resume lesson",
        secondaryHref:
          firstInc.questionCount > 0
            ? `/practice/${firstInc.subjectId}/${firstInc.topicId}`
            : undefined,
        secondaryLabel: firstInc.questionCount > 0 ? "Practice this topic" : undefined,
        sortKey: 300,
      });
    }
  }

  recs.sort((a, b) => a.sortKey - b.sortKey);
  const seen = new Set<string>();
  const out: DashboardRecommendation[] = [];
  for (const r of recs) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
    if (out.length >= 5) break;
  }
  return out;
}

export function getNextAchievementHint(totalStats: TotalStats, unlockedIds: string[]): string | null {
  const has = (id: string) => unlockedIds.includes(id);

  if (!has("first-lesson") && totalStats.totalLessonsCompleted < 1) {
    return "Complete your first lesson to unlock First Steps.";
  }
  if (!has("five-lessons") && totalStats.totalLessonsCompleted < 5) {
    const n = 5 - totalStats.totalLessonsCompleted;
    return `${n} more lesson${n === 1 ? "" : "s"} to unlock Quick Learner.`;
  }
  if (!has("ten-lessons") && totalStats.totalLessonsCompleted < 10) {
    const n = 10 - totalStats.totalLessonsCompleted;
    return `${n} more lesson${n === 1 ? "" : "s"} to unlock Knowledge Seeker.`;
  }
  if (!has("first-quiz") && totalStats.totalQuizzesTaken < 1) {
    return "Take your first quiz to unlock Quiz Starter.";
  }
  if (!has("ten-quizzes") && totalStats.totalQuizzesTaken < 10) {
    const n = 10 - totalStats.totalQuizzesTaken;
    return `${n} more quiz${n === 1 ? "" : "zes"} to unlock Quiz Master.`;
  }
  if (!has("perfect-score")) {
    return "Score 100% on any quiz to unlock Perfect Score.";
  }
  return null;
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diffSec = Math.round((now - t) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 48) return rtf.format(-diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, "day");
  const diffMonth = Math.round(diffDay / 30);
  return rtf.format(-diffMonth, "month");
}

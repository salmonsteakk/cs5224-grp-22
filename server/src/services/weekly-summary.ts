import { TopicQuizAttemptModel } from "../models/TopicQuizAttempt.js";
import { UserProgressProfileModel } from "../models/UserProgressProfile.js";
import type { LearningMetrics, WeeklyInterventionSummary } from "../types/index.js";

type AttemptRow = {
  submittedAt: string;
  score: number;
  totalQuestions: number;
  responses?: Array<{ correct: boolean; misconceptionTags?: string[] }>;
};

function toIso(daysAgo: number): string {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString();
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeLearningGain(attempts: AttemptRow[]): number {
  if (attempts.length < 2) return 0;
  const sorted = [...attempts].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const pre = first.totalQuestions > 0 ? first.score / first.totalQuestions : 0;
  const post = last.totalQuestions > 0 ? last.score / last.totalQuestions : 0;
  const denom = Math.max(pre, 0.1);
  return round2(((post - pre) / denom) * 100);
}

function computeEngagement(attempts: AttemptRow[]): number {
  const uniqueDays = new Set(attempts.map((a) => a.submittedAt.slice(0, 10))).size;
  const loopSignals = attempts.reduce((acc, a) => {
    const flagged = (a.responses || []).some((r) => (r.misconceptionTags || []).length > 0);
    return acc + (flagged ? 1 : 0);
  }, 0);
  return uniqueDays * 10 + attempts.length * 5 + loopSignals * 3;
}

async function computeRetention(): Promise<number> {
  const profiles = await UserProgressProfileModel.scan().exec();
  const now = Date.now();
  const activeWindowStart = now - 28 * 24 * 60 * 60 * 1000;
  let cohort = 0;
  let retained = 0;
  for (const p of profiles) {
    const first = new Date(String((p as any).firstActiveAt || "")).getTime();
    const last = new Date(String((p as any).lastActiveAt || "")).getTime();
    if (!Number.isFinite(first) || first < activeWindowStart) continue;
    cohort += 1;
    if (Number.isFinite(last) && last - first >= 7 * 24 * 60 * 60 * 1000) retained += 1;
  }
  if (cohort === 0) return 0;
  return round2((retained / cohort) * 100);
}

export async function buildWeeklyInterventionSummary(userId: string): Promise<WeeklyInterventionSummary> {
  const periodStart = toIso(7);
  const periodEnd = new Date().toISOString();
  const attemptsRaw = await TopicQuizAttemptModel.query("userId").eq(userId).exec();
  const attempts = [...attemptsRaw]
    .filter((a: any) => String(a.submittedAt) >= periodStart)
    .map((a: any) => ({
      submittedAt: String(a.submittedAt),
      score: Number(a.score || 0),
      totalQuestions: Number(a.totalQuestions || 0),
      responses: (a.responses || []) as AttemptRow["responses"],
    }));

  const misconceptionCounts = new Map<string, number>();
  for (const att of attempts) {
    for (const response of att.responses || []) {
      if (response.correct) continue;
      for (const tag of response.misconceptionTags || []) {
        misconceptionCounts.set(tag, (misconceptionCounts.get(tag) || 0) + 1);
      }
    }
  }
  const sortedMisconceptions = [...misconceptionCounts.entries()].sort((a, b) => b[1] - a[1]);

  const metrics: LearningMetrics = {
    learningGain: computeLearningGain(attempts),
    engagement: computeEngagement(attempts),
    retention: await computeRetention(),
  };

  const strengths =
    attempts.length === 0
      ? ["No practice attempts this week yet."]
      : [`Completed ${attempts.length} quiz attempt(s) this week.`];
  const risks =
    sortedMisconceptions.length === 0
      ? ["No high-frequency misconception cluster detected."]
      : sortedMisconceptions.slice(0, 2).map(([tag, count]) => `${tag} appeared in ${count} incorrect responses.`);
  const interventions =
    sortedMisconceptions.length === 0
      ? ["Schedule one focused practice loop and review one lesson before next quiz."]
      : sortedMisconceptions
          .slice(0, 2)
          .map(([tag]) => `Run a misconception-focused loop on "${tag}" and discuss strategy steps at home.`);

  return { periodStart, periodEnd, strengths, risks, interventions, metrics };
}

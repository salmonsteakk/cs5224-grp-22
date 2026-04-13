import type { DashboardRecommendation } from "@/lib/dashboard-recommendations";
import type { TotalStats } from "@/types";

export interface DashboardCoachRequestBody {
  level: number;
  totalPoints: number;
  levelTitle: string;
  stats: Pick<TotalStats, "totalLessonsCompleted" | "totalQuizzesTaken" | "overallAccuracy">;
  recommendations: Array<{
    kind: DashboardRecommendation["kind"];
    title: string;
    reason: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  }>;
  examSummary?: {
    papersAttempted: number;
    papersNotStarted: number;
    papersListed: number;
  };
}

export function buildDashboardCoachPayload(input: {
  level: number;
  totalPoints: number;
  levelTitle: string;
  stats: TotalStats;
  recommendations: DashboardRecommendation[];
  examSummary?: {
    papersAttempted: number;
    papersNotStarted: number;
    papersListed: number;
  };
}): DashboardCoachRequestBody {
  const recommendations = input.recommendations.slice(0, 5).map((r) => {
    const row: DashboardCoachRequestBody["recommendations"][number] = {
      kind: r.kind,
      title: r.title,
      reason: r.reason,
      primaryHref: r.primaryHref,
      primaryLabel: r.primaryLabel,
    };
    if (r.secondaryHref && r.secondaryLabel) {
      row.secondaryHref = r.secondaryHref;
      row.secondaryLabel = r.secondaryLabel;
    }
    return row;
  });

  const body: DashboardCoachRequestBody = {
    level: input.level,
    totalPoints: input.totalPoints,
    levelTitle: input.levelTitle,
    stats: {
      totalLessonsCompleted: input.stats.totalLessonsCompleted,
      totalQuizzesTaken: input.stats.totalQuizzesTaken,
      overallAccuracy: input.stats.overallAccuracy,
    },
    recommendations,
  };

  if (input.examSummary) {
    body.examSummary = { ...input.examSummary };
  }

  return body;
}

import { describe, expect, it } from "vitest";
import { buildDashboardCoachPayload } from "./dashboard-coach-payload";
import type { DashboardRecommendation } from "./dashboard-recommendations";
import type { TotalStats } from "@/types";

const baseStats: TotalStats = {
  totalLessonsCompleted: 3,
  totalQuizzesTaken: 2,
  totalQuestionsAnswered: 10,
  overallAccuracy: 72,
};

function makeRec(overrides: Partial<DashboardRecommendation> = {}): DashboardRecommendation {
  return {
    id: "weak-math:t1",
    kind: "weak_topic",
    title: "Practice Fractions",
    reason: "Your best score is 60%.",
    primaryHref: "/practice/math/t1",
    primaryLabel: "Practice quiz",
    secondaryHref: "/learn/math/t1",
    secondaryLabel: "Review lesson",
    sortKey: 60,
    ...overrides,
  };
}

describe("buildDashboardCoachPayload", () => {
  it("maps stats and caps recommendations at five", () => {
    const recs = Array.from({ length: 7 }, (_, i) =>
      makeRec({ id: `r${i}`, title: `T${i}`, sortKey: i })
    );
    const body = buildDashboardCoachPayload({
      level: 2,
      totalPoints: 150,
      levelTitle: "Explorer",
      stats: baseStats,
      recommendations: recs,
      examSummary: { papersAttempted: 1, papersNotStarted: 3, papersListed: 4 },
    });

    expect(body.level).toBe(2);
    expect(body.totalPoints).toBe(150);
    expect(body.levelTitle).toBe("Explorer");
    expect(body.stats).toEqual({
      totalLessonsCompleted: 3,
      totalQuizzesTaken: 2,
      overallAccuracy: 72,
    });
    expect(body.recommendations).toHaveLength(5);
    expect(body.recommendations[0].title).toBe("T0");
    expect(body.examSummary).toEqual({
      papersAttempted: 1,
      papersNotStarted: 3,
      papersListed: 4,
    });
  });

  it("omits secondary fields when not both present", () => {
    const body = buildDashboardCoachPayload({
      level: 1,
      totalPoints: 0,
      levelTitle: "Beginner",
      stats: baseStats,
      recommendations: [
        makeRec({
          secondaryHref: undefined,
          secondaryLabel: undefined,
        }),
      ],
    });
    expect(body.recommendations[0].secondaryHref).toBeUndefined();
    expect(body.recommendations[0].secondaryLabel).toBeUndefined();
  });

  it("omits examSummary when not provided", () => {
    const body = buildDashboardCoachPayload({
      level: 1,
      totalPoints: 10,
      levelTitle: "Beginner",
      stats: baseStats,
      recommendations: [],
    });
    expect(body.examSummary).toBeUndefined();
  });
});

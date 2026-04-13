import { describe, expect, it } from "vitest";
import type { ProgressProfileDto, StudentProgress, TopicProgressRowDto } from "@/types";
import { computeSubjectStats, computeTotalStats, mergeServerProgress } from "./progress-metrics";

describe("progress metrics contract", () => {
  it("maps server progress rows into client progress shape", () => {
    const profile: ProgressProfileDto = {
      userId: "u1",
      totalPoints: 120,
      level: 2,
      achievements: ["first-lesson"],
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const rows: TopicProgressRowDto[] = [
      {
        userId: "u1",
        topicKey: "math:fractions",
        subjectId: "math",
        topicId: "fractions",
        lessons: { l1: { completed: true } },
        bestScore: 80,
        quizAttemptCount: 2,
        quizScoreSum: 7,
        quizQuestionSum: 10,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const progress = mergeServerProgress(profile, rows);

    expect(progress.totalPoints).toBe(120);
    expect(progress.level).toBe(2);
    expect(progress.subjects.math.topics.fractions.lessons.l1.completed).toBe(true);
    expect(progress.subjects.math.topics.fractions.quizAttemptCount).toBe(2);
  });

  it("computes subject and total stats from aggregate quiz counters", () => {
    const progress: StudentProgress = {
      totalPoints: 0,
      level: 1,
      achievements: [],
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: {
                l1: { completed: true },
                l2: { completed: false },
              },
              quizAttempts: [],
              bestScore: 80,
              quizAttemptCount: 2,
              quizScoreSum: 7,
              quizQuestionSum: 10,
            },
          },
        },
      },
    };

    const subjectStats = computeSubjectStats(progress, "math");
    const totalStats = computeTotalStats(progress);

    expect(subjectStats).toEqual({
      lessonsCompleted: 1,
      quizzesTaken: 2,
      averageScore: 70,
    });
    expect(totalStats).toEqual({
      totalLessonsCompleted: 1,
      totalQuizzesTaken: 2,
      totalQuestionsAnswered: 10,
      overallAccuracy: 70,
    });
  });
});

import { describe, expect, it } from "vitest";
import type { StudentProgress, Subject } from "@/types";
import {
  findFirstIncompleteLesson,
  findWeakestPracticedTopic,
  getDashboardRecommendations,
  getNextAchievementHint,
  getRecentLessonActivity,
  subjectLessonFraction,
  topicQuizCoverage,
} from "./dashboard-recommendations";

const subjectsFixture: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    description: "",
    icon: "",
    color: "math",
    topics: [
      {
        id: "algebra",
        title: "Algebra",
        description: "",
        icon: "",
        lessons: [
          { id: "l1", title: "Intro", description: "", videoUrl: "", duration: "1" },
          { id: "l2", title: "Equations", description: "", videoUrl: "", duration: "1" },
        ],
        questions: [{ id: "q1", question: "", options: [], correctAnswer: 0, explanation: "" }],
      },
      {
        id: "geometry",
        title: "Geometry",
        description: "",
        icon: "",
        lessons: [{ id: "g1", title: "Shapes", description: "", videoUrl: "", duration: "1" }],
        questions: [{ id: "q2", question: "", options: [], correctAnswer: 0, explanation: "" }],
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    description: "",
    icon: "",
    color: "science",
    topics: [
      {
        id: "bio",
        title: "Biology",
        description: "",
        icon: "",
        lessons: [
          { id: "b1", title: "Cells", description: "", videoUrl: "", duration: "1" },
          { id: "b2", title: "DNA", description: "", videoUrl: "", duration: "1" },
        ],
        questions: [],
      },
    ],
  },
];

describe("findFirstIncompleteLesson", () => {
  it("returns first lesson in curriculum order when none completed", () => {
    const progress: StudentProgress = {
      subjects: {},
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const r = findFirstIncompleteLesson(subjectsFixture, progress);
    expect(r).toEqual({
      subjectId: "math",
      subjectName: "Mathematics",
      topicId: "algebra",
      topicTitle: "Algebra",
      lessonId: "l1",
      lessonTitle: "Intro",
      questionCount: 1,
    });
  });

  it("skips completed lessons", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: { l1: { completed: true, watchedAt: "2026-01-01T00:00:00.000Z" } },
              quizAttempts: [],
              bestScore: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const r = findFirstIncompleteLesson(subjectsFixture, progress);
    expect(r?.lessonId).toBe("l2");
  });
});

describe("getDashboardRecommendations", () => {
  it("adds weak topic when best score below threshold", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: { l1: { completed: true } },
              quizAttempts: [],
              bestScore: 55,
              quizAttemptCount: 1,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const recs = getDashboardRecommendations(subjectsFixture, progress);
    const weak = recs.find((r) => r.kind === "weak_topic");
    expect(weak).toBeDefined();
    expect(weak?.primaryHref).toBe("/practice/math/algebra");
  });

  it("suggests quiz when lessons started but no attempts", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            geometry: {
              lessons: { g1: { completed: true } },
              quizAttempts: [],
              bestScore: 0,
              quizAttemptCount: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const recs = getDashboardRecommendations([subjectsFixture[0]], progress);
    const q = recs.find((r) => r.kind === "start_quiz");
    expect(q?.primaryHref).toBe("/practice/math/geometry");
  });

  it("does not add start_quiz for same topic as weak_topic", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: { l1: { completed: true } },
              quizAttempts: [],
              bestScore: 50,
              quizAttemptCount: 2,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const recs = getDashboardRecommendations(subjectsFixture, progress);
    expect(recs.some((r) => r.kind === "start_quiz" && r.id.includes("algebra"))).toBe(false);
    expect(recs.some((r) => r.kind === "weak_topic")).toBe(true);
  });

  it("adds balance nudge when subject lesson gaps are large", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: {
                l1: { completed: true },
                l2: { completed: true },
              },
              quizAttempts: [],
              bestScore: 0,
            },
            geometry: {
              lessons: { g1: { completed: true } },
              quizAttempts: [],
              bestScore: 0,
            },
          },
        },
        science: {
          topics: {
            bio: {
              lessons: {},
              quizAttempts: [],
              bestScore: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const recs = getDashboardRecommendations(subjectsFixture, progress);
    expect(recs.some((r) => r.kind === "balance_subject" && r.id === "balance-science")).toBe(true);
  });
});

describe("getRecentLessonActivity", () => {
  it("sorts by watchedAt descending", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: {
                l1: { completed: true, watchedAt: "2026-01-01T00:00:00.000Z" },
                l2: { completed: true, watchedAt: "2026-01-03T00:00:00.000Z" },
              },
              quizAttempts: [],
              bestScore: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const rows = getRecentLessonActivity(subjectsFixture, progress, 5);
    expect(rows[0].lessonId).toBe("l2");
    expect(rows[1].lessonId).toBe("l1");
  });
});

describe("findWeakestPracticedTopic", () => {
  it("returns topic with lowest best score among attempted", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: {},
              quizAttempts: [],
              bestScore: 90,
              quizAttemptCount: 1,
            },
            geometry: {
              lessons: {},
              quizAttempts: [],
              bestScore: 40,
              quizAttemptCount: 1,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const w = findWeakestPracticedTopic(subjectsFixture, progress);
    expect(w?.topicId).toBe("geometry");
    expect(w?.bestScore).toBe(40);
  });
});

describe("subjectLessonFraction and topicQuizCoverage", () => {
  it("counts lesson completion", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: { l1: { completed: true } },
              quizAttempts: [],
              bestScore: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const f = subjectLessonFraction(subjectsFixture[0], progress);
    expect(f.completed).toBe(1);
    expect(f.total).toBe(3);
  });

  it("counts quiz coverage", () => {
    const progress: StudentProgress = {
      subjects: {
        math: {
          topics: {
            algebra: {
              lessons: {},
              quizAttempts: [],
              bestScore: 0,
              quizAttemptCount: 1,
            },
            geometry: {
              lessons: {},
              quizAttempts: [],
              bestScore: 0,
              quizAttemptCount: 0,
            },
          },
        },
      },
      totalPoints: 0,
      level: 1,
      achievements: [],
    };
    const c = topicQuizCoverage(subjectsFixture[0], progress);
    expect(c.withQuestions).toBe(2);
    expect(c.practiced).toBe(1);
  });
});

describe("getNextAchievementHint", () => {
  it("returns lesson hint when close to five-lessons", () => {
    const hint = getNextAchievementHint(
      {
        totalLessonsCompleted: 3,
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        overallAccuracy: 0,
      },
      ["first-lesson"]
    );
    expect(hint).toContain("2 more lessons");
  });
});

import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { UserProgressProfileModel } from "../models/UserProgressProfile.js";
import { UserTopicProgressModel } from "../models/UserTopicProgress.js";
import { TopicQuizAttemptModel } from "../models/TopicQuizAttempt.js";
import { buildTopicKey, buildUserTopicKey } from "../utils/topic-key.js";

type LessonEntry = { lessonId: string; completed: boolean; watchedAt?: string };

function nowIso(): string {
  return new Date().toISOString();
}

async function getOrCreateProfile(userId: string) {
  try {
    const row = await UserProgressProfileModel.get(userId);
    if (row) return row;
  } catch {
    // not found
  }
  const fresh = {
    userId,
    totalPoints: 0,
    level: 1,
    achievements: [] as string[],
    updatedAt: nowIso(),
  };
  await UserProgressProfileModel.create(fresh);
  return fresh;
}

function lessonsArrayToRecord(lessons: LessonEntry[]): Record<string, { completed: boolean; watchedAt?: string }> {
  const out: Record<string, { completed: boolean; watchedAt?: string }> = {};
  for (const e of lessons) {
    out[e.lessonId] = { completed: e.completed, watchedAt: e.watchedAt };
  }
  return out;
}

function mergeLessons(existing: LessonEntry[], patch: Record<string, { completed: boolean; watchedAt?: string }>): LessonEntry[] {
  const byId = new Map(existing.map((e) => [e.lessonId, { ...e }]));
  for (const [lessonId, v] of Object.entries(patch)) {
    byId.set(lessonId, {
      lessonId,
      completed: v.completed,
      watchedAt: v.watchedAt,
    });
  }
  return Array.from(byId.values());
}

function countCompletedLessonsAcrossTopics(rows: Array<{ lessons?: LessonEntry[] }>): number {
  let n = 0;
  for (const row of rows) {
    for (const e of row.lessons || []) {
      if (e.completed) n += 1;
    }
  }
  return n;
}

export async function getProfile(req: Request, res: Response) {
  const userId = req.auth!.sub;
  try {
    const row = await getOrCreateProfile(userId);
    res.json({
      userId: row.userId,
      totalPoints: row.totalPoints,
      level: row.level,
      achievements: row.achievements || [],
      updatedAt: row.updatedAt,
    });
  } catch (e) {
    console.error("getProfile", e);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

export async function putProfile(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const { totalPoints, level, achievements } = req.body as {
    totalPoints?: number;
    level?: number;
    achievements?: string[];
  };
  if (
    typeof totalPoints !== "number" ||
    typeof level !== "number" ||
    !Array.isArray(achievements)
  ) {
    res.status(400).json({ error: "totalPoints, level, and achievements[] are required" });
    return;
  }
  try {
    const updated = {
      userId,
      totalPoints,
      level,
      achievements,
      updatedAt: nowIso(),
    };
    await UserProgressProfileModel.create(updated, { overwrite: true });
    res.json(updated);
  } catch (e) {
    console.error("putProfile", e);
    res.status(500).json({ error: "Failed to save profile" });
  }
}

export async function listTopics(req: Request, res: Response) {
  const userId = req.auth!.sub;
  try {
    const rows = await UserTopicProgressModel.query("userId").eq(userId).exec();
    const items = rows.map((r: {
      userId: string;
      topicKey: string;
      subjectId: string;
      topicId: string;
      lessons?: LessonEntry[];
      bestScore: number;
      quizAttemptCount?: number;
      quizScoreSum?: number;
      quizQuestionSum?: number;
      updatedAt: string;
    }) => ({
      userId: r.userId,
      topicKey: r.topicKey,
      subjectId: r.subjectId,
      topicId: r.topicId,
      lessons: lessonsArrayToRecord((r.lessons || []) as LessonEntry[]),
      bestScore: r.bestScore,
      quizAttemptCount: r.quizAttemptCount ?? 0,
      quizScoreSum: r.quizScoreSum ?? 0,
      quizQuestionSum: r.quizQuestionSum ?? 0,
      updatedAt: r.updatedAt,
    }));
    res.json({ topics: items });
  } catch (e) {
    console.error("listTopics", e);
    res.status(500).json({ error: "Failed to list topic progress" });
  }
}

export async function getTopic(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const subjectId = String(req.params.subjectId ?? "");
  const topicId = String(req.params.topicId ?? "");
  if (!subjectId || !topicId) {
    res.status(400).json({ error: "subjectId and topicId required" });
    return;
  }
  const topicKey = buildTopicKey(subjectId, topicId);
  try {
    const r = await UserTopicProgressModel.get({ userId, topicKey });
    if (!r) {
      res.json({
        userId,
        topicKey,
        subjectId,
        topicId,
        lessons: {},
        bestScore: 0,
        quizAttemptCount: 0,
        quizScoreSum: 0,
        quizQuestionSum: 0,
        updatedAt: nowIso(),
      });
      return;
    }
    res.json({
      userId: r.userId,
      topicKey: r.topicKey,
      subjectId: r.subjectId,
      topicId: r.topicId,
      lessons: lessonsArrayToRecord((r.lessons || []) as LessonEntry[]),
      bestScore: r.bestScore,
      quizAttemptCount: r.quizAttemptCount ?? 0,
      quizScoreSum: r.quizScoreSum ?? 0,
      quizQuestionSum: r.quizQuestionSum ?? 0,
      updatedAt: r.updatedAt,
    });
  } catch (e) {
    console.error("getTopic", e);
    res.status(500).json({ error: "Failed to load topic progress" });
  }
}

export async function putTopic(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const subjectId = String(req.params.subjectId ?? "");
  const topicId = String(req.params.topicId ?? "");
  const body = req.body as {
    lessons?: Record<string, { completed: boolean; watchedAt?: string }>;
    bestScore?: number;
  };
  if (!subjectId || !topicId) {
    res.status(400).json({ error: "subjectId and topicId required" });
    return;
  }
  const topicKey = buildTopicKey(subjectId, topicId);
  try {
    let existing: LessonEntry[] = [];
    let prevBest = 0;
    let prevAttemptCount = 0;
    let prevScoreSum = 0;
    let prevQSum = 0;
    try {
      const row = await UserTopicProgressModel.get({ userId, topicKey });
      if (row) {
        existing = (row.lessons || []) as LessonEntry[];
        prevBest = row.bestScore ?? 0;
        prevAttemptCount = row.quizAttemptCount ?? 0;
        prevScoreSum = row.quizScoreSum ?? 0;
        prevQSum = row.quizQuestionSum ?? 0;
      }
    } catch {
      // none
    }

    const mergedLessons = body.lessons ? mergeLessons(existing, body.lessons) : existing;
    const bestScore =
      typeof body.bestScore === "number" ? Math.max(body.bestScore, prevBest) : prevBest;

    const updatedAt = nowIso();
    const payload = {
      userId,
      topicKey,
      subjectId,
      topicId,
      lessons: mergedLessons,
      bestScore,
      quizAttemptCount: prevAttemptCount,
      quizScoreSum: prevScoreSum,
      quizQuestionSum: prevQSum,
      updatedAt,
    };
    await UserTopicProgressModel.create(payload, { overwrite: true });

    // Gamification for new lesson completions (mirror client progress-context)
    const profile = await getOrCreateProfile(userId);
    if (body.lessons) {
      const beforeMap = lessonsArrayToRecord(existing);
      let addedPoints = 0;
      const newAchievements = [...(profile.achievements || [])];

      for (const [lid, v] of Object.entries(body.lessons)) {
        if (!v.completed) continue;
        const was = beforeMap[lid]?.completed;
        if (!was) {
          addedPoints += 10;
        }
      }

      if (addedPoints > 0) {
        const totalPoints = profile.totalPoints + addedPoints;
        const level = Math.floor(totalPoints / 100) + 1;

        const allTopicRows = await UserTopicProgressModel.query("userId").eq(userId).exec();
        const lessonsCompleted = countCompletedLessonsAcrossTopics(
          allTopicRows.map((t: { topicKey: string; lessons?: LessonEntry[] }) => ({
            lessons: t.topicKey === topicKey ? mergedLessons : ((t.lessons || []) as LessonEntry[]),
          }))
        );

        if (lessonsCompleted === 1 && !newAchievements.includes("first-lesson")) {
          newAchievements.push("first-lesson");
        }
        if (lessonsCompleted >= 5 && !newAchievements.includes("five-lessons")) {
          newAchievements.push("five-lessons");
        }
        if (lessonsCompleted >= 10 && !newAchievements.includes("ten-lessons")) {
          newAchievements.push("ten-lessons");
        }

        await UserProgressProfileModel.create(
          {
            userId,
            totalPoints,
            level,
            achievements: newAchievements,
            updatedAt: nowIso(),
          },
          { overwrite: true }
        );
      }
    }

    res.json({
      userId,
      topicKey,
      subjectId,
      topicId,
      lessons: lessonsArrayToRecord(mergedLessons),
      bestScore,
      quizAttemptCount: prevAttemptCount,
      quizScoreSum: prevScoreSum,
      quizQuestionSum: prevQSum,
      updatedAt,
    });
  } catch (e) {
    console.error("putTopic", e);
    res.status(500).json({ error: "Failed to save topic progress" });
  }
}

export async function postQuizAttempt(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const body = req.body as {
    subjectId?: string;
    topicId?: string;
    score?: number;
    totalQuestions?: number;
    responses?: Array<{ questionId: string; selectedIndex: number; correct: boolean }>;
  };

  if (
    !body.subjectId ||
    !body.topicId ||
    typeof body.score !== "number" ||
    typeof body.totalQuestions !== "number" ||
    !Array.isArray(body.responses)
  ) {
    res.status(400).json({ error: "subjectId, topicId, score, totalQuestions, responses[] required" });
    return;
  }

  const attemptId = randomUUID();
  const submittedAt = nowIso();
  const userTopicKey = buildUserTopicKey(userId, body.subjectId, body.topicId);

  try {
    await TopicQuizAttemptModel.create({
      userId,
      attemptId,
      subjectId: body.subjectId,
      topicId: body.topicId,
      userTopicKey,
      submittedAt,
      score: body.score,
      totalQuestions: body.totalQuestions,
      responses: body.responses,
    });

    const percentage = Math.round((body.score / body.totalQuestions) * 100);
    const topicKey = buildTopicKey(body.subjectId, body.topicId);

    let existing: LessonEntry[] = [];
    let prevBest = 0;
    let prevAttemptCount = 0;
    let prevScoreSum = 0;
    let prevQSum = 0;
    try {
      const row = await UserTopicProgressModel.get({ userId, topicKey });
      if (row) {
        existing = (row.lessons || []) as LessonEntry[];
        prevBest = row.bestScore ?? 0;
        prevAttemptCount = row.quizAttemptCount ?? 0;
        prevScoreSum = row.quizScoreSum ?? 0;
        prevQSum = row.quizQuestionSum ?? 0;
      }
    } catch {
      // none
    }
    const nextBest = Math.max(prevBest, percentage);
    const nextAttemptCount = prevAttemptCount + 1;
    const nextScoreSum = prevScoreSum + body.score;
    const nextQSum = prevQSum + body.totalQuestions;
    await UserTopicProgressModel.create(
      {
        userId,
        topicKey,
        subjectId: body.subjectId,
        topicId: body.topicId,
        lessons: existing,
        bestScore: nextBest,
        quizAttemptCount: nextAttemptCount,
        quizScoreSum: nextScoreSum,
        quizQuestionSum: nextQSum,
        updatedAt: nowIso(),
      },
      { overwrite: true }
    );

    const profile = await getOrCreateProfile(userId);
    const totalPoints = profile.totalPoints + body.score * 5;
    const level = Math.floor(totalPoints / 100) + 1;
    const newAchievements = [...(profile.achievements || [])];

    if (percentage === 100 && !newAchievements.includes("perfect-score")) {
      newAchievements.push("perfect-score");
    }

    const allAttempts = await TopicQuizAttemptModel.query("userId").eq(userId).exec();
    const totalQuizzes = allAttempts.length;
    if (totalQuizzes === 1 && !newAchievements.includes("first-quiz")) {
      newAchievements.push("first-quiz");
    }
    if (totalQuizzes >= 10 && !newAchievements.includes("ten-quizzes")) {
      newAchievements.push("ten-quizzes");
    }

    await UserProgressProfileModel.create(
      {
        userId,
        totalPoints,
        level,
        achievements: newAchievements,
        updatedAt: nowIso(),
      },
      { overwrite: true }
    );

    res.status(201).json({
      attemptId,
      userId,
      subjectId: body.subjectId,
      topicId: body.topicId,
      userTopicKey,
      submittedAt,
      score: body.score,
      totalQuestions: body.totalQuestions,
      responses: body.responses,
    });
  } catch (e) {
    console.error("postQuizAttempt", e);
    res.status(500).json({ error: "Failed to save quiz attempt" });
  }
}

export async function listQuizAttempts(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const subjectId = req.query.subjectId as string | undefined;
  const topicId = req.query.topicId as string | undefined;
  if (!subjectId || !topicId) {
    res.status(400).json({ error: "subjectId and topicId query params required" });
    return;
  }
  const userTopicKey = buildUserTopicKey(userId, subjectId, topicId);
  try {
    const rowsRaw = await TopicQuizAttemptModel.query("userTopicKey")
      .eq(userTopicKey)
      .using("UserTopicIndex")
      .exec();
    const rows = [...rowsRaw].sort((a, b) =>
      String(b.submittedAt).localeCompare(String(a.submittedAt))
    );
    const items = rows.map((r: {
      attemptId: string;
      userId: string;
      subjectId: string;
      topicId: string;
      submittedAt: string;
      score: number;
      totalQuestions: number;
      responses: unknown[];
    }) => ({
      attemptId: r.attemptId,
      userId: r.userId,
      subjectId: r.subjectId,
      topicId: r.topicId,
      submittedAt: r.submittedAt,
      score: r.score,
      totalQuestions: r.totalQuestions,
      responses: r.responses,
    }));
    res.json({ attempts: items });
  } catch (e) {
    console.error("listQuizAttempts", e);
    res.status(500).json({ error: "Failed to list quiz attempts" });
  }
}

export async function getQuizAttempt(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const attemptId = String(req.params.attemptId ?? "");
  if (!attemptId) {
    res.status(400).json({ error: "attemptId required" });
    return;
  }
  try {
    const r = await TopicQuizAttemptModel.get({ userId, attemptId });
    if (!r) {
      res.status(404).json({ error: "Attempt not found" });
      return;
    }
    res.json({
      attemptId: r.attemptId,
      userId: r.userId,
      subjectId: r.subjectId,
      topicId: r.topicId,
      submittedAt: r.submittedAt,
      score: r.score,
      totalQuestions: r.totalQuestions,
      responses: r.responses,
    });
  } catch (e) {
    console.error("getQuizAttempt", e);
    res.status(500).json({ error: "Failed to load attempt" });
  }
}

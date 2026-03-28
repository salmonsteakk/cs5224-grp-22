import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { ExamPaperModel } from "../models/ExamPaper.js";
import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { TopicQuizAttemptModel } from "../models/TopicQuizAttempt.js";
import { UserProgressProfileModel } from "../models/UserProgressProfile.js";
import { buildUserExamKey } from "../utils/exam-key.js";

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

function paperToDto(p: {
  paperId: string;
  subjectId: string;
  title: string;
  description: string;
  questions: unknown[];
}) {
  return {
    paperId: p.paperId,
    subjectId: p.subjectId,
    title: p.title,
    description: p.description,
    questionCount: Array.isArray(p.questions) ? p.questions.length : 0,
  };
}

export async function listPapers(req: Request, res: Response) {
  const subjectId = req.query.subjectId as string | undefined;
  try {
    if (subjectId) {
      const rows = await ExamPaperModel.query("subjectId")
        .eq(subjectId)
        .using("SubjectPapersIndex")
        .exec();
      const items = [...rows]
        .map((r: { paperId: string; subjectId: string; title: string; description: string; questions: unknown[] }) =>
          paperToDto(r)
        )
        .sort((a, b) => a.title.localeCompare(b.title));
      res.json({ papers: items });
      return;
    }
    const scan = await ExamPaperModel.scan().exec();
    const items = [...scan]
      .map((r: { paperId: string; subjectId: string; title: string; description: string; questions: unknown[] }) =>
        paperToDto(r)
      )
      .sort((a, b) => a.title.localeCompare(b.title));
    res.json({ papers: items });
  } catch (e) {
    console.error("listPapers", e);
    res.status(500).json({ error: "Failed to list exam papers" });
  }
}

export async function getPaper(req: Request, res: Response) {
  const paperId = String(req.params.paperId ?? "");
  if (!paperId) {
    res.status(400).json({ error: "paperId required" });
    return;
  }
  try {
    const p = await ExamPaperModel.get(paperId);
    if (!p) {
      res.status(404).json({ error: "Exam paper not found" });
      return;
    }
    res.json({
      paperId: p.paperId,
      subjectId: p.subjectId,
      title: p.title,
      description: p.description,
      questions: p.questions,
    });
  } catch (e) {
    console.error("getPaper", e);
    res.status(500).json({ error: "Failed to load exam paper" });
  }
}

export async function postExamAttempt(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const body = req.body as {
    examPaperId?: string;
    score?: number;
    totalQuestions?: number;
    responses?: Array<{ questionId: string; selectedIndex: number; correct: boolean }>;
  };

  if (
    !body.examPaperId ||
    typeof body.score !== "number" ||
    typeof body.totalQuestions !== "number" ||
    !Array.isArray(body.responses)
  ) {
    res.status(400).json({ error: "examPaperId, score, totalQuestions, responses[] required" });
    return;
  }

  let paper: {
    paperId: string;
    subjectId: string;
    questions: Array<{ id: string; correctAnswer: number }>;
  };
  try {
    const row = await ExamPaperModel.get(body.examPaperId);
    if (!row) {
      res.status(404).json({ error: "Exam paper not found" });
      return;
    }
    paper = row as typeof paper;
  } catch (e) {
    console.error("postExamAttempt load paper", e);
    res.status(500).json({ error: "Failed to load exam paper" });
    return;
  }

  const qById = new Map(paper.questions.map((q) => [q.id, q]));
  if (body.responses.length !== paper.questions.length) {
    res.status(400).json({ error: "responses must match number of questions on the paper" });
    return;
  }

  const seenIds = new Set<string>();
  let computedScore = 0;
  for (const r of body.responses) {
    if (seenIds.has(r.questionId)) {
      res.status(400).json({ error: "duplicate questionId in responses" });
      return;
    }
    seenIds.add(r.questionId);
    const q = qById.get(r.questionId);
    if (!q) {
      res.status(400).json({ error: `Unknown questionId: ${r.questionId}` });
      return;
    }
    const correct = r.selectedIndex === q.correctAnswer;
    if (correct) computedScore += 1;
    if (r.correct !== correct) {
      res.status(400).json({ error: "responses[].correct must match selected answers" });
      return;
    }
  }
  if (seenIds.size !== paper.questions.length) {
    res.status(400).json({ error: "responses must include each question exactly once" });
    return;
  }

  if (body.score !== computedScore || body.totalQuestions !== paper.questions.length) {
    res.status(400).json({ error: "score and totalQuestions must match computed results" });
    return;
  }

  const attemptId = randomUUID();
  const submittedAt = nowIso();
  const userExamKey = buildUserExamKey(userId, body.examPaperId);

  try {
    await ExamAttemptModel.create({
      userId,
      attemptId,
      examPaperId: body.examPaperId,
      subjectId: paper.subjectId,
      userExamKey,
      submittedAt,
      score: body.score,
      totalQuestions: body.totalQuestions,
      responses: body.responses,
    });

    const percentage = Math.round((body.score / body.totalQuestions) * 100);
    const profile = await getOrCreateProfile(userId);
    const totalPoints = profile.totalPoints + body.score * 5;
    const level = Math.floor(totalPoints / 100) + 1;
    const newAchievements = [...(profile.achievements || [])];

    if (percentage === 100 && !newAchievements.includes("perfect-score")) {
      newAchievements.push("perfect-score");
    }

    const topicRows = await TopicQuizAttemptModel.query("userId").eq(userId).exec();
    const examRows = await ExamAttemptModel.query("userId").eq(userId).exec();
    const totalQuizzes = topicRows.length + examRows.length;
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
      examPaperId: body.examPaperId,
      subjectId: paper.subjectId,
      userExamKey,
      submittedAt,
      score: body.score,
      totalQuestions: body.totalQuestions,
      responses: body.responses,
    });
  } catch (e) {
    console.error("postExamAttempt", e);
    res.status(500).json({ error: "Failed to save exam attempt" });
  }
}

export async function listExamAttempts(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const examPaperId = req.query.examPaperId as string | undefined;
  if (!examPaperId) {
    res.status(400).json({ error: "examPaperId query param required" });
    return;
  }
  const userExamKey = buildUserExamKey(userId, examPaperId);
  try {
    const rowsRaw = await ExamAttemptModel.query("userExamKey")
      .eq(userExamKey)
      .using("UserExamIndex")
      .exec();
    const rows = [...rowsRaw].sort((a, b) =>
      String(b.submittedAt).localeCompare(String(a.submittedAt))
    );
    const items = rows.map((r: {
      attemptId: string;
      userId: string;
      examPaperId: string;
      subjectId: string;
      submittedAt: string;
      score: number;
      totalQuestions: number;
      responses: unknown[];
    }) => ({
      attemptId: r.attemptId,
      userId: r.userId,
      examPaperId: r.examPaperId,
      subjectId: r.subjectId,
      submittedAt: r.submittedAt,
      score: r.score,
      totalQuestions: r.totalQuestions,
      responses: r.responses,
    }));
    res.json({ attempts: items });
  } catch (e) {
    console.error("listExamAttempts", e);
    res.status(500).json({ error: "Failed to list exam attempts" });
  }
}

export async function getExamAttempt(req: Request, res: Response) {
  const userId = req.auth!.sub;
  const attemptId = String(req.params.attemptId ?? "");
  if (!attemptId) {
    res.status(400).json({ error: "attemptId required" });
    return;
  }
  try {
    const r = await ExamAttemptModel.get({ userId, attemptId });
    if (!r) {
      res.status(404).json({ error: "Attempt not found" });
      return;
    }
    res.json({
      attemptId: r.attemptId,
      userId: r.userId,
      examPaperId: r.examPaperId,
      subjectId: r.subjectId,
      submittedAt: r.submittedAt,
      score: r.score,
      totalQuestions: r.totalQuestions,
      responses: r.responses,
    });
  } catch (e) {
    console.error("getExamAttempt", e);
    res.status(500).json({ error: "Failed to load attempt" });
  }
}

/** Full replace of a paper (curriculum). Guarded by EXAM_ADMIN_KEY + x-exam-admin-key header. */
export async function putExamPaper(req: Request, res: Response) {
  const paperId = String(req.params.paperId ?? "");
  if (!paperId) {
    res.status(400).json({ error: "paperId required" });
    return;
  }
  const body = req.body as {
    subjectId?: string;
    title?: string;
    description?: string;
    questions?: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
  if (
    !body.subjectId ||
    typeof body.title !== "string" ||
    typeof body.description !== "string" ||
    !Array.isArray(body.questions) ||
    body.questions.length === 0
  ) {
    res.status(400).json({
      error: "subjectId, title, description, and non-empty questions[] are required",
    });
    return;
  }
  for (const q of body.questions) {
    if (
      !q.id ||
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      typeof q.correctAnswer !== "number" ||
      typeof q.explanation !== "string"
    ) {
      res.status(400).json({ error: "Each question needs id, question, options[], correctAnswer, explanation" });
      return;
    }
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      res.status(400).json({ error: "correctAnswer must be a valid option index" });
      return;
    }
  }

  try {
    const item = {
      paperId,
      subjectId: body.subjectId,
      title: body.title,
      description: body.description,
      questions: body.questions,
    };
    await ExamPaperModel.create(item, { overwrite: true });
    res.json({
      paperId,
      subjectId: item.subjectId,
      title: item.title,
      description: item.description,
      questionCount: item.questions.length,
    });
  } catch (e) {
    console.error("putExamPaper", e);
    res.status(500).json({ error: "Failed to save exam paper" });
  }
}

import { randomUUID } from "crypto";
import { Request, Response } from "express";
import type { AnalyticsEventType } from "../types/index.js";
import { getDashboardAnalytics, trackEvent } from "../services/analytics.service.js";

interface TrackEventRequestBody {
  eventType?: AnalyticsEventType;
  subjectId?: string;
  topicId?: string;
  lessonId?: string;
  questionId?: string;
  isCorrect?: boolean;
  score?: number;
  totalQuestions?: number;
  attemptNumber?: number;
  durationSeconds?: number;
  pointsEarned?: number;
}

const validEventTypes = new Set<AnalyticsEventType>([
  "lesson_start",
  "lesson_complete",
  "quiz_start",
  "question_answered",
  "quiz_complete",
  "dashboard_view",
]);

export async function createEvent(req: Request, res: Response) {
  if (!req.auth?.sub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = req.body as TrackEventRequestBody;
  if (!body.eventType || !validEventTypes.has(body.eventType)) {
    res.status(400).json({ error: "Invalid event type" });
    return;
  }

  try {
    await trackEvent({
      id: randomUUID(),
      userId: req.auth.sub,
      eventType: body.eventType,
      subjectId: body.subjectId,
      topicId: body.topicId,
      lessonId: body.lessonId,
      questionId: body.questionId,
      isCorrect: body.isCorrect,
      score: body.score,
      totalQuestions: body.totalQuestions,
      attemptNumber: body.attemptNumber,
      durationSeconds: body.durationSeconds,
      pointsEarned: body.pointsEarned,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSummary(req: Request, res: Response) {
  if (!req.auth?.sub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const summary = await getDashboardAnalytics(req.auth.sub);
    res.json(summary);
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

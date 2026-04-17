import { Router } from "express";
import { hfChatCompletion } from "../lib/hf.js";
import { evaluateAiOutput, getAbstainFallback, logAiPolicyDecision } from "../lib/ai-policy.js";

const router = Router();

const REC_KINDS = new Set(["weak_topic", "start_quiz", "resume_lesson", "balance_subject"]);

function isNonNegInt(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0 && Math.floor(n) === n;
}

function isStringMax(s: unknown, max: number): s is string {
  return typeof s === "string" && s.length <= max;
}

function parsePayload(body: unknown):
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const o = body as Record<string, unknown>;

  if (typeof o.level !== "number" || !Number.isFinite(o.level) || o.level < 1 || o.level > 999) {
    return { ok: false, error: "level must be a number between 1 and 999" };
  }
  if (typeof o.totalPoints !== "number" || !Number.isFinite(o.totalPoints) || o.totalPoints < 0) {
    return { ok: false, error: "totalPoints must be a non-negative number" };
  }
  if (o.levelTitle !== undefined && typeof o.levelTitle !== "string") {
    return { ok: false, error: "levelTitle must be a string" };
  }
  if (o.levelTitle !== undefined && o.levelTitle.length > 80) {
    return { ok: false, error: "levelTitle too long" };
  }

  const stats = o.stats;
  if (!stats || typeof stats !== "object") {
    return { ok: false, error: "stats object is required" };
  }
  const st = stats as Record<string, unknown>;
  for (const key of ["totalLessonsCompleted", "totalQuizzesTaken", "overallAccuracy"] as const) {
    const v = st[key];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0) {
      return { ok: false, error: `stats.${key} must be a non-negative number` };
    }
    if (key === "overallAccuracy" && v > 100) {
      return { ok: false, error: "stats.overallAccuracy must be at most 100" };
    }
  }

  const recs = o.recommendations;
  if (!Array.isArray(recs)) {
    return { ok: false, error: "recommendations must be an array" };
  }
  if (recs.length > 5) {
    return { ok: false, error: "at most 5 recommendations allowed" };
  }

  for (const item of recs) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "each recommendation must be an object" };
    }
    const r = item as Record<string, unknown>;
    if (typeof r.kind !== "string" || !REC_KINDS.has(r.kind)) {
      return { ok: false, error: "invalid recommendation kind" };
    }
    if (!isStringMax(r.title, 200) || !isStringMax(r.reason, 500)) {
      return { ok: false, error: "title or reason invalid or too long" };
    }
    if (!isStringMax(r.primaryHref, 240) || !isStringMax(r.primaryLabel, 80)) {
      return { ok: false, error: "primaryHref or primaryLabel invalid or too long" };
    }
    if (r.secondaryHref !== undefined) {
      if (!isStringMax(r.secondaryHref, 240)) {
        return { ok: false, error: "secondaryHref invalid or too long" };
      }
      if (r.secondaryLabel !== undefined && !isStringMax(r.secondaryLabel, 80)) {
        return { ok: false, error: "secondaryLabel invalid or too long" };
      }
    }
  }

  if (o.examSummary !== undefined) {
    if (!o.examSummary || typeof o.examSummary !== "object") {
      return { ok: false, error: "examSummary must be an object" };
    }
    const ex = o.examSummary as Record<string, unknown>;
    if (!isNonNegInt(ex.papersAttempted) || !isNonNegInt(ex.papersNotStarted) || !isNonNegInt(ex.papersListed)) {
      return { ok: false, error: "examSummary fields must be non-negative integers" };
    }
  }

  return { ok: true, payload: o };
}

router.post("/", async (req, res) => {
  const parsed = parsePayload(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error });
  }

  const p = parsed.payload;
  const userContent = JSON.stringify({
    level: p.level,
    totalPoints: p.totalPoints,
    levelTitle: p.levelTitle,
    stats: p.stats,
    recommendations: p.recommendations,
    examSummary: p.examSummary,
  });

  const systemPrompt = `You are a friendly PSLE study coach for a Singapore primary school learning app.
You ONLY use facts from the JSON the user sends. Do not invent scores, subjects, or topics not in the data.
Write 2–4 short sentences OR up to 3 bullet points (use "- " for bullets). Be encouraging and concrete.
Reference the student's level and stats when relevant. If recommendations are non-empty, prioritise those actions and refer to them by their titles and primaryLabel text (e.g. "Practice quiz on …"). Do not say "in-app links", "click below", or paste URLs — the app UI shows tappable buttons for each recommendation under your message.
If there are no recommendations, still give one gentle next step based on stats and exam summary.
Keep total output under 120 words. No markdown headings or code blocks.`;

  try {
    const result = await hfChatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      { max_tokens: 280, temperature: 0.55 }
    );

    if (!result.ok) {
      const status = result.status === 503 ? 503 : 502;
      return res.status(status).json({ error: result.body });
    }

    const policy = evaluateAiOutput(result.text, {
      endpoint: "/api/dashboard-coach",
      request: req,
    });
    logAiPolicyDecision(
      {
        endpoint: "/api/dashboard-coach",
        request: req,
      },
      policy
    );

    if (policy.decision !== "allow") {
      return res.json({
        coachText: getAbstainFallback("dashboard-coach"),
        policy: {
          decision: policy.decision,
          reason: policy.reason,
          confidence: policy.confidence,
          requestId: policy.requestId,
        },
      });
    }

    res.json({
      coachText: result.text,
      policy: {
        decision: policy.decision,
        reason: policy.reason,
        confidence: policy.confidence,
        requestId: policy.requestId,
      },
    });
  } catch (error) {
    console.error("Dashboard coach error:", error);
    res.status(500).json({ error: "Coach request failed" });
  }
});

export default router;

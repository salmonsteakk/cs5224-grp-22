import type { Request } from "express";
import { getAiPolicyConfig } from "../config/ai-policy.js";

export type AiPolicyDecision = "allow" | "abstain" | "suppressed";

export interface AiPolicyContext {
  endpoint: string;
  request: Request;
}

export interface AiPolicyResult {
  decision: AiPolicyDecision;
  reason: string;
  confidence: number;
  requestId: string;
}

export function isAiExplanationsEnabled(): boolean {
  return getAiPolicyConfig().explanationsEnabled;
}

export function getAiMinConfidence(): number {
  return getAiPolicyConfig().minConfidence;
}

export function getRequestId(req: Request): string {
  const header = req.headers["x-request-id"];
  if (typeof header === "string" && header.trim()) return header.trim();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function scoreForLength(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words >= 12 && words <= 90) return 0.45;
  if (words >= 8 && words <= 120) return 0.3;
  return 0.12;
}

function scoreForPolicyPhrases(text: string): number {
  const lower = text.toLowerCase();
  const cautionPhrases = ["i might be wrong", "not sure", "i think", "maybe", "likely"];
  const unsafePhrases = ["definitely", "always", "guaranteed", "100%"];
  const cautionHits = cautionPhrases.filter((p) => lower.includes(p)).length;
  const unsafeHits = unsafePhrases.filter((p) => lower.includes(p)).length;
  return Math.max(0, 0.4 - cautionHits * 0.08 - unsafeHits * 0.04);
}

function scoreForFormatting(text: string): number {
  if (!text.trim()) return 0;
  if (text.length > 1200) return 0.05;
  if (text.includes("```")) return 0.08;
  return 0.2;
}

export function estimateConfidence(text: string): number {
  const score = scoreForLength(text) + scoreForPolicyPhrases(text) + scoreForFormatting(text);
  return Math.min(1, Math.max(0, Number(score.toFixed(3))));
}

export function evaluateAiOutput(text: string, ctx: AiPolicyContext): AiPolicyResult {
  const requestId = getRequestId(ctx.request);
  if (!isAiExplanationsEnabled()) {
    return {
      decision: "suppressed",
      reason: "AI_EXPLANATIONS_ENABLED is false",
      confidence: 0,
      requestId,
    };
  }

  const confidence = estimateConfidence(text);
  const threshold = getAiMinConfidence();
  if (confidence < threshold) {
    return {
      decision: "abstain",
      reason: `confidence ${confidence.toFixed(3)} below threshold ${threshold.toFixed(3)}`,
      confidence,
      requestId,
    };
  }

  return {
    decision: "allow",
    reason: "confidence gate passed",
    confidence,
    requestId,
  };
}

export function logAiPolicyDecision(ctx: AiPolicyContext, result: AiPolicyResult): void {
  console.log(
    JSON.stringify({
      event: "ai_policy_decision",
      endpoint: ctx.endpoint,
      requestId: result.requestId,
      decision: result.decision,
      reason: result.reason,
      confidence: result.confidence,
    })
  );
}

export function getAbstainFallback(surface: "chat" | "dashboard-coach"): string {
  if (surface === "dashboard-coach") {
    return "I cannot provide a reliable personalised tip right now. Please use the suggested action buttons to continue with your next lesson or quiz.";
  }
  return "I do not have enough confidence to answer this safely right now. Please ask a narrower PSLE syllabus question or use the recommended lesson and practice links.";
}

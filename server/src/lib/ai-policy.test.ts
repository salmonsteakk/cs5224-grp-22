import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateAiOutput,
  estimateConfidence,
  getAbstainFallback,
  getAiMinConfidence,
  isAiExplanationsEnabled,
} from "./ai-policy.js";

test("estimateConfidence keeps score between 0 and 1", () => {
  const value = estimateConfidence("This is a concise and clear PSLE-aligned explanation.");
  assert.ok(value >= 0);
  assert.ok(value <= 1);
});

test("AI can be globally suppressed via env switch", () => {
  const prev = process.env.AI_EXPLANATIONS_ENABLED;
  process.env.AI_EXPLANATIONS_ENABLED = "false";
  assert.equal(isAiExplanationsEnabled(), false);
  const result = evaluateAiOutput("Any response text", {
    endpoint: "/api/chat",
    request: { headers: {} } as any,
  });
  assert.equal(result.decision, "suppressed");
  process.env.AI_EXPLANATIONS_ENABLED = prev;
});

test("low confidence yields abstain decision", () => {
  const prev = process.env.AI_MIN_CONFIDENCE;
  process.env.AI_MIN_CONFIDENCE = "0.9";
  assert.equal(getAiMinConfidence(), 0.9);
  const result = evaluateAiOutput("maybe", {
    endpoint: "/api/chat",
    request: { headers: {} } as any,
  });
  assert.equal(result.decision, "abstain");
  process.env.AI_MIN_CONFIDENCE = prev;
});

test("abstain fallback text is provided for both surfaces", () => {
  assert.ok(getAbstainFallback("chat").length > 0);
  assert.ok(getAbstainFallback("dashboard-coach").length > 0);
});

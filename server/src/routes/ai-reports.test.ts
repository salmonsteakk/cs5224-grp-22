import test from "node:test";
import assert from "node:assert/strict";
import { validateCreateAiReportBody, validatePatchAiReportBody } from "./ai-reports.js";

test("validateCreateAiReportBody accepts valid payload", () => {
  const result = validateCreateAiReportBody({
    source: "chat",
    outputExcerpt: "The explanation says the answer is always B.",
    reportReason: "This appears factually wrong for the topic.",
    priority: "high",
  });
  assert.equal(result.ok, true);
});

test("validateCreateAiReportBody rejects invalid source", () => {
  const result = validateCreateAiReportBody({
    source: "other",
    outputExcerpt: "This is invalid",
    reportReason: "Bad",
  });
  assert.equal(result.ok, false);
});

test("validatePatchAiReportBody requires correction fields for corrected state", () => {
  const result = validatePatchAiReportBody({
    status: "corrected",
  });
  assert.equal(result.ok, false);
});

test("validatePatchAiReportBody accepts suppression", () => {
  const result = validatePatchAiReportBody({
    status: "suppressed",
    note: "Immediate suppression after multiple reports",
  });
  assert.equal(result.ok, true);
});

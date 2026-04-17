import { randomUUID, createHash } from "crypto";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { AiReportModel } from "../models/AiReport.js";

const router = Router();

type AiReportSource = "chat" | "dashboard-coach";
type AiReportPriority = "critical" | "high" | "medium" | "low";
type AiReportStatus = "new" | "triaged" | "corrected" | "suppressed" | "closed";
type AuditAction = "created" | "triaged" | "corrected" | "suppressed" | "closed" | "note";

const allowedSources = new Set<AiReportSource>(["chat", "dashboard-coach"]);
const allowedPriorities = new Set<AiReportPriority>(["critical", "high", "medium", "low"]);
const allowedStatuses = new Set<AiReportStatus>(["new", "triaged", "corrected", "suppressed", "closed"]);
const statusActionMap: Record<Exclude<AiReportStatus, "new">, AuditAction> = {
  triaged: "triaged",
  corrected: "corrected",
  suppressed: "suppressed",
  closed: "closed",
};

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function validateCreateAiReportBody(body: unknown): { ok: true } | { ok: false; error: string } {
  const source = asString((body as Record<string, unknown> | undefined)?.source) as AiReportSource | null;
  const outputExcerpt = asString((body as Record<string, unknown> | undefined)?.outputExcerpt);
  const reportReason = asString((body as Record<string, unknown> | undefined)?.reportReason);
  const priorityRaw = (
    asString((body as Record<string, unknown> | undefined)?.priority) ?? "medium"
  ).toLowerCase() as AiReportPriority;

  if (!source || !allowedSources.has(source)) {
    return { ok: false, error: "source must be chat or dashboard-coach" };
  }
  if (!outputExcerpt || outputExcerpt.length < 5 || outputExcerpt.length > 500) {
    return { ok: false, error: "outputExcerpt must be between 5 and 500 characters" };
  }
  if (!reportReason || reportReason.length < 5 || reportReason.length > 500) {
    return { ok: false, error: "reportReason must be between 5 and 500 characters" };
  }
  if (!allowedPriorities.has(priorityRaw)) {
    return { ok: false, error: "priority must be critical, high, medium, or low" };
  }
  return { ok: true };
}

export function validatePatchAiReportBody(body: unknown): { ok: true } | { ok: false; error: string } {
  const nextStatus = asString((body as Record<string, unknown> | undefined)?.status) as
    | AiReportStatus
    | null;

  if (!nextStatus || !allowedStatuses.has(nextStatus) || nextStatus === "new") {
    return { ok: false, error: "status must be triaged, corrected, suppressed, or closed" };
  }
  if (nextStatus === "corrected") {
    const reason = asString((body as Record<string, unknown> | undefined)?.correctionReason);
    const notice = asString((body as Record<string, unknown> | undefined)?.correctionNotice);
    if (!reason || !notice) {
      return { ok: false, error: "correctionReason and correctionNotice are required" };
    }
  }
  return { ok: true };
}

function pushAuditEvent(
  report: Record<string, unknown>,
  event: {
    at: string;
    actorId?: string;
    action: AuditAction;
    fromStatus?: string;
    toStatus?: string;
    note?: string;
  }
) {
  const current = Array.isArray(report.auditTrail) ? report.auditTrail : [];
  report.auditTrail = [...current, event];
}

router.post("/", requireAuth, async (req, res) => {
  const validated = validateCreateAiReportBody(req.body);
  if (!validated.ok) return res.status(400).json({ error: validated.error });

  const source = asString(req.body?.source) as AiReportSource;
  const outputExcerpt = asString(req.body?.outputExcerpt) as string;
  const reportReason = asString(req.body?.reportReason) as string;
  const priorityRaw = (asString(req.body?.priority) ?? "medium").toLowerCase() as AiReportPriority;

  const now = new Date().toISOString();
  const reportId = randomUUID();
  const report = {
    reportId,
    createdAt: now,
    updatedAt: now,
    source,
    status: "new" as AiReportStatus,
    priority: priorityRaw,
    outputExcerpt,
    outputHash: createHash("sha256").update(outputExcerpt).digest("hex"),
    reportReason,
    endpoint: asString(req.body?.endpoint) ?? undefined,
    policyDecision: asString(req.body?.policyDecision) ?? undefined,
    policyReason: asString(req.body?.policyReason) ?? undefined,
    policyConfidence:
      typeof req.body?.policyConfidence === "number" && Number.isFinite(req.body.policyConfidence)
        ? req.body.policyConfidence
        : undefined,
    policyRequestId: asString(req.body?.policyRequestId) ?? undefined,
    reporterUserId: req.auth?.sub,
    reporterName: asString(req.body?.reporterName) ?? undefined,
    pathname: asString(req.body?.pathname) ?? undefined,
    metadataJson:
      req.body?.metadata && typeof req.body.metadata === "object"
        ? JSON.stringify(req.body.metadata)
        : undefined,
    correction: undefined,
    auditTrail: [
      {
        at: now,
        actorId: req.auth?.sub,
        action: "created" as AuditAction,
        fromStatus: undefined,
        toStatus: "new",
        note: "user_report_submission",
      },
    ],
  };

  try {
    await AiReportModel.create(report);
    res.status(201).json({
      reportId,
      status: report.status,
      priority: report.priority,
      createdAt: report.createdAt,
    });
  } catch (error) {
    console.error("AI report create failed:", error);
    res.status(500).json({ error: "Failed to create AI report" });
  }
});

router.patch("/:reportId", requireAuth, async (req, res) => {
  const reportId = req.params.reportId;
  const validated = validatePatchAiReportBody(req.body);
  if (!validated.ok) return res.status(400).json({ error: validated.error });
  const nextStatus = asString(req.body?.status) as Exclude<AiReportStatus, "new">;
  const note = asString(req.body?.note) ?? undefined;

  if (!reportId) return res.status(400).json({ error: "reportId is required" });

  try {
    const report = (await AiReportModel.get(reportId)) as Record<string, unknown> | undefined;
    if (!report) return res.status(404).json({ error: "AI report not found" });

    const currentStatus = (report.status as string | undefined) ?? "new";
    const now = new Date().toISOString();
    report.status = nextStatus;
    report.updatedAt = now;

    pushAuditEvent(report, {
      at: now,
      actorId: req.auth?.sub,
      action: statusActionMap[nextStatus],
      fromStatus: currentStatus,
      toStatus: nextStatus,
      note,
    });

    if (nextStatus === "corrected") {
      const reason = asString(req.body?.correctionReason);
      const notice = asString(req.body?.correctionNotice);
      report.correction = {
        correctedAt: now,
        correctedBy: req.auth?.sub,
        reason,
        notice,
      };
    }

    if (nextStatus === "suppressed" && !report.correction) {
      report.correction = {
        correctedAt: now,
        correctedBy: req.auth?.sub,
        reason: asString(req.body?.correctionReason) ?? "Flagged output suppressed pending correction",
        notice:
          asString(req.body?.correctionNotice) ??
          "This explanation has been temporarily suppressed while we review a reported issue.",
      };
    }

    await AiReportModel.update({ reportId }, report);
    return res.json({
      reportId,
      status: report.status,
      updatedAt: report.updatedAt,
      correction: report.correction,
    });
  } catch (error) {
    console.error("AI report update failed:", error);
    return res.status(500).json({ error: "Failed to update AI report" });
  }
});

export default router;

import type { Request, Response, NextFunction } from "express";

/** Allows updating exam paper definitions when EXAM_ADMIN_KEY is set and x-exam-admin-key matches. */
export function requireExamAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.EXAM_ADMIN_KEY;
  if (!expected) {
    res.status(501).json({ error: "Exam paper updates are not enabled (EXAM_ADMIN_KEY unset)" });
    return;
  }
  const got = req.headers["x-exam-admin-key"];
  if (typeof got !== "string" || got !== expected) {
    res.status(403).json({ error: "Invalid or missing x-exam-admin-key" });
    return;
  }
  next();
}

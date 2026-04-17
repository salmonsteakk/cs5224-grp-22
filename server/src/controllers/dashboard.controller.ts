import type { Request, Response } from "express";
import { buildWeeklyInterventionSummary } from "../services/weekly-summary.js";

export async function getWeeklySummary(req: Request, res: Response) {
  const userId = req.auth!.sub;
  try {
    const summary = await buildWeeklyInterventionSummary(userId);
    res.json(summary);
  } catch (e) {
    console.error("getWeeklySummary", e);
    res.status(500).json({ error: "Failed to load weekly summary" });
  }
}

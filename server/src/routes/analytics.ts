import { Router } from "express";
import * as ctrl from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/events", requireAuth, ctrl.createEvent);
router.get("/dashboard-summary", requireAuth, ctrl.getSummary);

export default router;

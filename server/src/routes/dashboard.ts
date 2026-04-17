import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as ctrl from "../controllers/dashboard.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/weekly-summary", ctrl.getWeeklySummary);

export default router;

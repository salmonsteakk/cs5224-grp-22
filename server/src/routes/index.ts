import { Router } from "express";
import authRoutes from "./auth.js";
import learnRoutes from "./learn.js";
import practiceRoutes from "./practice.js";
import analyticsRoutes from "./analytics.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/learn", learnRoutes);
router.use("/practice", practiceRoutes);
router.use("/analytics", analyticsRoutes);

export default router;

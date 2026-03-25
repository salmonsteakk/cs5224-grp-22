import { Router } from "express";
import authRoutes from "./auth.js";
import learnRoutes from "./learn.js";
import practiceRoutes from "./practice.js";
import progressRoutes from "./progress.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/learn", learnRoutes);
router.use("/practice", practiceRoutes);
router.use("/progress", progressRoutes);

export default router;

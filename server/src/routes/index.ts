import { Router } from "express";
import authRoutes from "./auth.js";
import learnRoutes from "./learn.js";
import practiceRoutes from "./practice.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/learn", learnRoutes);
router.use("/practice", practiceRoutes);

export default router;

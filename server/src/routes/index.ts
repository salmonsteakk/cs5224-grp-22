import { Router } from "express";
import learnRoutes from "./learn.js";
import practiceRoutes from "./practice.js";

const router = Router();

router.use("/learn", learnRoutes);
router.use("/practice", practiceRoutes);

export default router;

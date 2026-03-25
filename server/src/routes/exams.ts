import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireExamAdmin } from "../middleware/exam-admin.js";
import * as ctrl from "../controllers/exam.controller.js";

const router = Router();

router.get("/papers", ctrl.listPapers);
router.get("/papers/:paperId", ctrl.getPaper);
router.put("/papers/:paperId", requireExamAdmin, ctrl.putExamPaper);

router.use(requireAuth);
router.post("/attempts", ctrl.postExamAttempt);
router.get("/attempts", ctrl.listExamAttempts);
router.get("/attempts/:attemptId", ctrl.getExamAttempt);

export default router;

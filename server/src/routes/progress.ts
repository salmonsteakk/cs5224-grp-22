import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as ctrl from "../controllers/progress.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/profile", ctrl.getProfile);
router.put("/profile", ctrl.putProfile);
router.get("/topics", ctrl.listTopics);
router.get("/topics/:subjectId/:topicId", ctrl.getTopic);
router.put("/topics/:subjectId/:topicId", ctrl.putTopic);
router.post("/quiz-attempts", ctrl.postQuizAttempt);
router.get("/quiz-attempts", ctrl.listQuizAttempts);
router.get("/quiz-attempts/:attemptId", ctrl.getQuizAttempt);

export default router;

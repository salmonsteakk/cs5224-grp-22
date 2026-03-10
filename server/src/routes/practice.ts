import { Router } from "express";
import * as ctrl from "../controllers/practice.controller.js";

const router = Router();

router.get("/subjects", ctrl.getPracticeSubjects);
router.get("/subjects/:subjectId/topics/:topicId/questions", ctrl.getQuestions);

export default router;

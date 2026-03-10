import { Router } from "express";
import * as ctrl from "../controllers/learn.controller.js";

const router = Router();

router.get("/subjects", ctrl.getSubjects);
router.get("/subjects/:subjectId", ctrl.getSubjectById);
router.get("/subjects/:subjectId/topics/:topicId", ctrl.getTopicById);

export default router;

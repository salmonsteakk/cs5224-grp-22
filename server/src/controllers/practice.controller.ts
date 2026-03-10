import { Request, Response } from "express";
import { SubjectModel } from "../models/Subject.js";

export async function getPracticeSubjects(_req: Request, res: Response) {
  try {
    const subjects = await SubjectModel.scan().exec();
    const result = subjects.map((s) => {
      const obj = s.toJSON();
      return {
        ...obj,
        topics: (obj.topics as Array<Record<string, unknown> & { questions: unknown[] }>).map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          icon: t.icon,
          lessons: t.lessons,
          questionCount: t.questions?.length || 0,
        })),
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching practice subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getQuestions(req: Request, res: Response) {
  try {
    const subject = await SubjectModel.get(req.params.subjectId);
    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    const obj = subject.toJSON();
    const topics = obj.topics as Array<Record<string, unknown> & { id: string; questions: unknown[] }>;
    const topic = topics.find((t) => t.id === req.params.topicId);
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    res.json(topic.questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

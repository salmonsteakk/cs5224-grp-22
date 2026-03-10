import { Request, Response } from "express";
import { SubjectModel } from "../models/Subject.js";

function stripQuestions(topic: Record<string, unknown>) {
  const { questions, ...rest } = topic;
  return rest;
}

export async function getSubjects(_req: Request, res: Response) {
  try {
    const subjects = await SubjectModel.scan().exec();
    const result = subjects.map((s) => {
      const obj = s.toJSON();
      return {
        ...obj,
        topics: (obj.topics as Record<string, unknown>[]).map(stripQuestions),
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSubjectById(req: Request, res: Response) {
  try {
    const subject = await SubjectModel.get(req.params.subjectId);
    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    const obj = subject.toJSON();
    res.json({
      ...obj,
      topics: (obj.topics as Record<string, unknown>[]).map(stripQuestions),
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTopicById(req: Request, res: Response) {
  try {
    const subject = await SubjectModel.get(req.params.subjectId);
    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    const obj = subject.toJSON();
    const topics = obj.topics as Array<Record<string, unknown> & { id: string }>;
    const topic = topics.find((t) => t.id === req.params.topicId);
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    res.json(stripQuestions(topic));
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

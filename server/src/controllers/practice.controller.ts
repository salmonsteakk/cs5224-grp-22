import { Request, Response } from "express";
import { SubjectModel } from "../models/Subject.js";
import type { PracticeQuestion, Question, StrategyCoachHint } from "../types/index.js";

function inferMisconceptionTags(question: Question): string[] {
  if (Array.isArray(question.misconceptionTags) && question.misconceptionTags.length > 0) {
    return question.misconceptionTags;
  }
  const text = `${question.question} ${question.explanation}`.toLowerCase();
  const tags: string[] = [];
  if (text.includes("fraction") || text.includes("ratio")) tags.push("fraction-reasoning");
  if (text.includes("decimal") || text.includes("place value")) tags.push("place-value");
  if (text.includes("classif") || text.includes("group")) tags.push("classification");
  if (text.includes("force") || text.includes("energy")) tags.push("science-concepts");
  if (tags.length === 0) tags.push("concept-application");
  return tags;
}

function inferStrategyHint(question: Question): StrategyCoachHint {
  const focus = question.strategyFocus ?? "command-word";
  if (focus === "elimination") {
    return {
      title: "Eliminate weak options",
      focus: "Use elimination before committing to an answer.",
      steps: ["Strike out impossible choices first.", "Compare the last two options to the stem."],
    };
  }
  if (focus === "working-backwards") {
    return {
      title: "Work backwards",
      focus: "Start from options and test against the question conditions.",
      steps: ["Substitute options quickly.", "Choose the first option that satisfies every condition."],
    };
  }
  if (focus === "evidence") {
    return {
      title: "Claim-evidence check",
      focus: "Match your option with explicit evidence from the prompt.",
      steps: ["Identify the scientific evidence in the question.", "Pick the option supported by that evidence."],
    };
  }
  return {
    title: "Decode the command word",
    focus: "Find what the question asks before solving.",
    steps: ["Underline command words (describe, explain, calculate).", "Answer exactly that command."],
  };
}

function toPracticeQuestion(question: Question): PracticeQuestion {
  return {
    ...question,
    misconceptionTags: inferMisconceptionTags(question),
    strategyHint: inferStrategyHint(question),
  };
}

export async function getPracticeSubjects(_req: Request, res: Response) {
  try {
    const subjects = await SubjectModel.scan().exec();
    const result = subjects.map((s: any) => {
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
    const subject = await SubjectModel.get(String(req.params.subjectId));
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
    const practiceQuestions = ((topic.questions || []) as Question[]).map(toPracticeQuestion);
    res.json(practiceQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFocusLoop(req: Request, res: Response) {
  try {
    const subject = await SubjectModel.get(String(req.params.subjectId));
    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    const obj = subject.toJSON();
    const topics = obj.topics as Array<Record<string, unknown> & { id: string; questions: Question[] }>;
    const topic = topics.find((t) => t.id === req.params.topicId);
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    const misconceptionTag = String(req.query.tag ?? "concept-application");
    const allQuestions = ((topic.questions || []) as Question[]).map(toPracticeQuestion);
    const targeted = allQuestions.filter((q) => q.misconceptionTags.includes(misconceptionTag)).slice(0, 5);
    res.json({
      misconceptionTag,
      rationale: `This loop targets the "${misconceptionTag}" misconception with short corrective practice.`,
      questions: targeted.length > 0 ? targeted : allQuestions.slice(0, 3),
    });
  } catch (error) {
    console.error("Error fetching focus loop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

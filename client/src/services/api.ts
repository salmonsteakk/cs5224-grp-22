import type { Subject, Question } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const getLearnSubjects = () =>
  fetchJson<Subject[]>("/learn/subjects");

export const getLearnSubject = (id: string) =>
  fetchJson<Subject>(`/learn/subjects/${id}`);

export const getPracticeSubjects = () =>
  fetchJson<Subject[]>("/practice/subjects");

export const getQuestions = (subjectId: string, topicId: string) =>
  fetchJson<Question[]>(`/practice/subjects/${subjectId}/topics/${topicId}/questions`);

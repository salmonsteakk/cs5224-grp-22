import type {
  Subject,
  Question,
  LoginResponse,
  CurrentUserResponse,
  ProgressProfileDto,
  TopicProgressRowDto,
  TopicQuizAttemptDto,
  ExamPaperSummaryDto,
  ExamPaperDetailDto,
  ExamAttemptDto,
} from "../types";
import type { DashboardCoachRequestBody } from "../lib/dashboard-coach-payload";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

async function fetchJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let message = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorJson = (await response.json()) as { error?: string };
      if (errorJson.error) {
        message = errorJson.error;
      }
    } catch {
      // Keep fallback message when response body is not JSON.
    }
    throw new Error(message);
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

export const login = (email: string, password: string) =>
  fetchJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const register = (email: string, password: string, name: string) =>
  fetchJson<LoginResponse>("/auth/register", {
    method: "POST",
    body: { email, password, name },
  });

export const getCurrentUser = (token: string) =>
  fetchJson<CurrentUserResponse>("/auth/me", {
    token,
  });

export const getProgressProfile = (token: string) =>
  fetchJson<ProgressProfileDto>("/progress/profile", { token });

export const putProgressProfile = (
  token: string,
  body: { totalPoints: number; level: number; achievements: string[] }
) =>
  fetchJson<ProgressProfileDto>("/progress/profile", {
    method: "PUT",
    body,
    token,
  });

export const getProgressTopics = (token: string) =>
  fetchJson<{ topics: TopicProgressRowDto[] }>("/progress/topics", { token });

export const putTopicProgress = (
  token: string,
  subjectId: string,
  topicId: string,
  body: {
    lessons?: Record<string, { completed: boolean; watchedAt?: string }>;
    bestScore?: number;
  }
) =>
  fetchJson<TopicProgressRowDto>(`/progress/topics/${subjectId}/${topicId}`, {
    method: "PUT",
    body,
    token,
  });

export const postQuizAttempt = (
  token: string,
  body: {
    subjectId: string;
    topicId: string;
    score: number;
    totalQuestions: number;
    responses: Array<{ questionId: string; selectedIndex: number; correct: boolean }>;
  }
) =>
  fetchJson<TopicQuizAttemptDto>("/progress/quiz-attempts", {
    method: "POST",
    body,
    token,
  });

export const listTopicQuizAttempts = (token: string, subjectId: string, topicId: string) => {
  const q = new URLSearchParams({ subjectId, topicId });
  return fetchJson<{ attempts: TopicQuizAttemptDto[] }>(
    `/progress/quiz-attempts?${q.toString()}`,
    { token }
  );
};

export const getTopicQuizAttempt = (token: string, attemptId: string) =>
  fetchJson<TopicQuizAttemptDto>(`/progress/quiz-attempts/${attemptId}`, { token });

export const getExamPapers = (subjectId?: string) => {
  const q = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : "";
  return fetchJson<{ papers: ExamPaperSummaryDto[] }>(`/exams/papers${q}`);
};

export const getExamPaper = (paperId: string) =>
  fetchJson<ExamPaperDetailDto>(`/exams/papers/${encodeURIComponent(paperId)}`);

export const submitExamAttempt = (
  token: string,
  body: {
    examPaperId: string;
    score: number;
    totalQuestions: number;
    responses: Array<{ questionId: string; selectedIndex: number; correct: boolean }>;
  }
) =>
  fetchJson<ExamAttemptDto>("/exams/attempts", {
    method: "POST",
    body,
    token,
  });

export const listExamAttempts = (token: string, examPaperId: string) => {
  const q = new URLSearchParams({ examPaperId });
  return fetchJson<{ attempts: ExamAttemptDto[] }>(`/exams/attempts?${q.toString()}`, {
    token,
  });
};

export const getExamAttempt = (token: string, attemptId: string) =>
  fetchJson<ExamAttemptDto>(`/exams/attempts/${encodeURIComponent(attemptId)}`, { token });

export const postDashboardCoach = (body: DashboardCoachRequestBody) =>
  fetchJson<{ coachText: string }>("/dashboard-coach", {
    method: "POST",
    body,
  });

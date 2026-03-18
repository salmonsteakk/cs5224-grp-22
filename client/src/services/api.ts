import type {
  Subject,
  Question,
  LoginResponse,
  CurrentUserResponse,
} from "../types";

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

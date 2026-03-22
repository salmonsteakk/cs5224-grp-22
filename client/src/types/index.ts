export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  questions: Question[];
  questionCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: "math" | "science";
  topics: Topic[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "student";
  status: "active" | "disabled";
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface CurrentUserResponse {
  user: AuthUser;
}

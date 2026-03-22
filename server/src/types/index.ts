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
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: "math" | "science";
  topics: Topic[];
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "student";
  status: "active" | "disabled";
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: User["role"];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: User["role"];
  status: User["status"];
}

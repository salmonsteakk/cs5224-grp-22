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
  misconceptionTags?: string[];
  strategyFocus?: "command-word" | "elimination" | "working-backwards" | "evidence";
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

export interface StrategyCoachHint {
  title: string;
  focus: string;
  steps: string[];
}

export interface PracticeQuestion extends Question {
  misconceptionTags: string[];
  strategyHint: StrategyCoachHint;
}

export interface QuizAttemptResponse {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  misconceptionTags?: string[];
}

export interface LearningMetrics {
  learningGain: number;
  engagement: number;
  retention: number;
}

export interface WeeklyInterventionSummary {
  periodStart: string;
  periodEnd: string;
  strengths: string[];
  risks: string[];
  interventions: string[];
  metrics: LearningMetrics;
}

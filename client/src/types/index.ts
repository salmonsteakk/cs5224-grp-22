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

export interface LessonProgress {
  completed: boolean;
  watchedAt?: string;
}

export interface QuizQuestionResponse {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

export interface QuizCompletionResult {
  score: number;
  totalQuestions: number;
  responses: QuizQuestionResponse[];
}

export interface QuizAttempt {
  score: number;
  totalQuestions: number;
  attemptedAt: string;
  responses?: QuizQuestionResponse[];
  attemptId?: string;
}

export interface TopicProgress {
  lessons: Record<string, LessonProgress>;
  quizAttempts: QuizAttempt[];
  bestScore: number;
  quizAttemptCount?: number;
  quizScoreSum?: number;
  quizQuestionSum?: number;
}

export interface SubjectProgress {
  topics: Record<string, TopicProgress>;
}

export interface StudentProgress {
  subjects: Record<string, SubjectProgress>;
  totalPoints: number;
  level: number;
  achievements: string[];
}

export interface ProgressProfileDto {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: string[];
  updatedAt: string;
}

export interface TopicProgressRowDto {
  userId: string;
  topicKey: string;
  subjectId: string;
  topicId: string;
  lessons: Record<string, { completed: boolean; watchedAt?: string }>;
  bestScore: number;
  quizAttemptCount: number;
  quizScoreSum?: number;
  quizQuestionSum?: number;
  updatedAt: string;
}

export interface TopicQuizAttemptDto {
  attemptId: string;
  userId: string;
  subjectId: string;
  topicId: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  responses: QuizQuestionResponse[];
}

export interface ExamPaperSummaryDto {
  paperId: string;
  subjectId: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface ExamPaperDetailDto {
  paperId: string;
  subjectId: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface ExamAttemptDto {
  attemptId: string;
  userId: string;
  examPaperId: string;
  subjectId: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  responses: QuizQuestionResponse[];
}

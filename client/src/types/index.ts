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

export type AnalyticsEventType =
  | "lesson_start"
  | "lesson_complete"
  | "quiz_start"
  | "question_answered"
  | "quiz_complete"
  | "dashboard_view";

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  subjectId?: string;
  topicId?: string;
  lessonId?: string;
  questionId?: string;
  isCorrect?: boolean;
  score?: number;
  totalQuestions?: number;
  attemptNumber?: number;
  durationSeconds?: number;
  pointsEarned?: number;
}

export interface DashboardAnalyticsSummary {
  kpis: {
    accuracy7d: number;
    lessonsCompleted: number;
    streakDays: number;
    timeSpentMinutes7d: number;
  };
  trends: {
    accuracy7d: Array<{
      label: string;
      accuracy: number;
    }>;
    pointsWeekVsLastWeek: {
      thisWeek: number;
      lastWeek: number;
    };
  };
  subjectCompletion: Array<{
    subjectId: string;
    subjectName: string;
    completedLessons: number;
    totalLessons: number;
    completion: number;
  }>;
  subjectQuizStats: Array<{
    subjectId: string;
    quizzesTaken: number;
    averageScore: number;
  }>;
  weakTopics: Array<{
    subjectId: string;
    subjectName: string;
    topicId: string;
    topicTitle: string;
    mastery: number;
    accuracy: number;
  }>;
  nextBestAction: string;
}

export interface SubjectCardStats {
  lessonsCompleted?: number;
  totalLessons?: number;
  quizzesTaken?: number;
  averageScore?: number;
}

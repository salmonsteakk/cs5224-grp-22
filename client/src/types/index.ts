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
  strategyHint?: StrategyCoachHint;
}

export interface StrategyCoachHint {
  title: string;
  focus: string;
  steps: string[];
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
  misconceptionTags?: string[];
}

export interface QuizCompletionResult {
  score: number;
  totalQuestions: number;
  responses: QuizQuestionResponse[];
  focusLoopTag?: string;
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
  focusLoopsCompleted?: number;
  strategyCardOpens?: number;
  learningGain?: number;
}

export interface SubjectProgress {
  topics: Record<string, TopicProgress>;
}

export interface StudentProgress {
  subjects: Record<string, SubjectProgress>;
  totalPoints: number;
  level: number;
  achievements: string[];
  activeDays?: string[];
  firstActiveAt?: string;
  lastActiveAt?: string;
}

export interface SubjectStats {
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface TotalStats {
  totalLessonsCompleted: number;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
}

export interface ProgressProfileDto {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: string[];
  firstActiveAt?: string;
  lastActiveAt?: string;
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
  focusLoopsCompleted?: number;
  strategyCardOpens?: number;
  learningGain?: number;
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
  learningGain?: number;
  engagementScore?: number;
  retentionScore?: number;
  focusLoopTag?: string;
  focusLoop?: FocusLoopRecommendation;
}

export interface FocusLoopRecommendation {
  misconceptionTag: string;
  rationale: string;
  questions: Question[];
}

export interface LearningMetrics {
  learningGain: number;
  engagement: number;
  retention: number;
}

export interface WeeklyInterventionSummaryDto {
  periodStart: string;
  periodEnd: string;
  strengths: string[];
  risks: string[];
  interventions: string[];
  metrics: LearningMetrics;
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

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  getProgressProfile,
  getProgressTopics,
  putTopicProgress,
  postQuizAttempt,
} from "@/services/api";
import type {
  StudentProgress,
  TopicProgress,
  LessonProgress,
  QuizCompletionResult,
  TopicProgressRowDto,
  ProgressProfileDto,
} from "@/types";

const STORAGE_KEY = "student-progress";

const defaultTopicProgress = (): TopicProgress => ({
  lessons: {},
  quizAttempts: [],
  bestScore: 0,
});

const defaultProgress: StudentProgress = {
  subjects: {},
  totalPoints: 0,
  level: 1,
  achievements: [],
};

function mergeServerProgress(
  profile: ProgressProfileDto,
  rows: TopicProgressRowDto[]
): StudentProgress {
  const subjects: StudentProgress["subjects"] = {};
  for (const row of rows) {
    if (!subjects[row.subjectId]) {
      subjects[row.subjectId] = { topics: {} };
    }
    subjects[row.subjectId].topics[row.topicId] = {
      lessons: row.lessons || {},
      quizAttempts: [],
      bestScore: row.bestScore,
      quizAttemptCount: row.quizAttemptCount,
      quizScoreSum: row.quizScoreSum,
      quizQuestionSum: row.quizQuestionSum,
    };
  }
  return {
    subjects,
    totalPoints: profile.totalPoints,
    level: profile.level,
    achievements: profile.achievements || [],
  };
}

interface ProgressContextType {
  progress: StudentProgress;
  isProgressLoaded: boolean;
  refreshProgressFromServer: () => Promise<void>;
  markLessonComplete: (subjectId: string, topicId: string, lessonId: string) => void;
  recordQuizAttempt: (subjectId: string, topicId: string, result: QuizCompletionResult) => void;
  getTopicProgress: (subjectId: string, topicId: string) => TopicProgress;
  getLessonProgress: (
    subjectId: string,
    topicId: string,
    lessonId: string
  ) => LessonProgress;
  getSubjectStats: (subjectId: string) => {
    lessonsCompleted: number;
    totalLessons: number;
    quizzesTaken: number;
    averageScore: number;
  };
  getTotalStats: () => {
    totalLessonsCompleted: number;
    totalQuizzesTaken: number;
    totalQuestionsAnswered: number;
    overallAccuracy: number;
  };
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<StudentProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshProgressFromServer = useCallback(async () => {
    if (!token) return;
    try {
      const [profile, topicsRes] = await Promise.all([
        getProgressProfile(token),
        getProgressTopics(token),
      ]);
      setProgress(mergeServerProgress(profile, topicsRes.topics));
    } catch (e) {
      console.error("Failed to refresh progress from server", e);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProgress(JSON.parse(saved) as StudentProgress);
        } catch {
          setProgress(defaultProgress);
        }
      } else {
        setProgress(defaultProgress);
      }
      setIsLoaded(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [profile, topicsRes] = await Promise.all([
          getProgressProfile(token),
          getProgressTopics(token),
        ]);
        if (!cancelled) {
          setProgress(mergeServerProgress(profile, topicsRes.topics));
        }
      } catch (e) {
        console.error("Failed to load progress", e);
        if (!cancelled) setProgress(defaultProgress);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isAuthenticated && token) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, isLoaded, isAuthenticated, token]);

  const getTopicProgress = useCallback(
    (subjectId: string, topicId: string): TopicProgress => {
      return (
        progress.subjects[subjectId]?.topics[topicId] || {
          ...defaultTopicProgress(),
        }
      );
    },
    [progress]
  );

  const getLessonProgress = useCallback(
    (subjectId: string, topicId: string, lessonId: string): LessonProgress => {
      return (
        progress.subjects[subjectId]?.topics[topicId]?.lessons[lessonId] || {
          completed: false,
        }
      );
    },
    [progress]
  );

  const markLessonComplete = useCallback(
    (subjectId: string, topicId: string, lessonId: string) => {
      const watchedAt = new Date().toISOString();

      setProgress((prev) => {
        const newProgress: StudentProgress = {
          ...prev,
          subjects: { ...prev.subjects },
        };

        if (!newProgress.subjects[subjectId]) {
          newProgress.subjects[subjectId] = { topics: {} };
        }
        if (!newProgress.subjects[subjectId].topics[topicId]) {
          newProgress.subjects[subjectId].topics[topicId] = defaultTopicProgress();
        }

        const topic = newProgress.subjects[subjectId].topics[topicId];
        const wasCompleted = topic.lessons[lessonId]?.completed;

        topic.lessons = { ...topic.lessons, [lessonId]: { completed: true, watchedAt } };

        if (!wasCompleted) {
          newProgress.totalPoints += 10;
          newProgress.level = Math.floor(newProgress.totalPoints / 100) + 1;

          const lessonsCompleted = Object.values(newProgress.subjects).reduce(
            (total, subject) =>
              total +
              Object.values(subject.topics).reduce(
                (topicTotal, t) =>
                  topicTotal + Object.values(t.lessons).filter((l) => l.completed).length,
                0
              ),
            0
          );

          const ach = [...newProgress.achievements];
          if (lessonsCompleted === 1 && !ach.includes("first-lesson")) ach.push("first-lesson");
          if (lessonsCompleted >= 5 && !ach.includes("five-lessons")) ach.push("five-lessons");
          if (lessonsCompleted >= 10 && !ach.includes("ten-lessons")) ach.push("ten-lessons");
          newProgress.achievements = ach;
        }

        return newProgress;
      });

      if (token) {
        void (async () => {
          try {
            await putTopicProgress(token, subjectId, topicId, {
              lessons: { [lessonId]: { completed: true, watchedAt } },
            });
            await refreshProgressFromServer();
          } catch (e) {
            console.error("markLessonComplete API failed", e);
          }
        })();
      }
    },
    [token, refreshProgressFromServer]
  );

  const recordQuizAttempt = useCallback(
    (subjectId: string, topicId: string, result: QuizCompletionResult) => {
      const { score, totalQuestions, responses } = result;
      const attemptedAt = new Date().toISOString();
      const percentage = Math.round((score / totalQuestions) * 100);

      setProgress((prev) => {
        const newProgress: StudentProgress = {
          ...prev,
          subjects: { ...prev.subjects },
        };

        if (!newProgress.subjects[subjectId]) {
          newProgress.subjects[subjectId] = { topics: {} };
        }
        if (!newProgress.subjects[subjectId].topics[topicId]) {
          newProgress.subjects[subjectId].topics[topicId] = defaultTopicProgress();
        }

        const topic = newProgress.subjects[subjectId].topics[topicId];
        const prevCount = topic.quizAttemptCount ?? topic.quizAttempts.length;

        topic.quizAttempts = [
          ...topic.quizAttempts,
          { score, totalQuestions, attemptedAt, responses },
        ];
        topic.quizAttemptCount = prevCount + 1;
        topic.quizScoreSum = (topic.quizScoreSum ?? 0) + score;
        topic.quizQuestionSum = (topic.quizQuestionSum ?? 0) + totalQuestions;

        if (percentage > topic.bestScore) {
          topic.bestScore = percentage;
        }

        newProgress.totalPoints += score * 5;
        newProgress.level = Math.floor(newProgress.totalPoints / 100) + 1;

        const ach = [...newProgress.achievements];
        if (percentage === 100 && !ach.includes("perfect-score")) ach.push("perfect-score");

        const totalQuizzes = Object.values(newProgress.subjects).reduce(
          (total, subject) =>
            total +
            Object.values(subject.topics).reduce(
              (topicTotal, t) => topicTotal + (t.quizAttemptCount ?? t.quizAttempts.length),
              0
            ),
          0
        );

        if (totalQuizzes === 1 && !ach.includes("first-quiz")) ach.push("first-quiz");
        if (totalQuizzes >= 10 && !ach.includes("ten-quizzes")) ach.push("ten-quizzes");
        newProgress.achievements = ach;

        return newProgress;
      });

      if (token) {
        void (async () => {
          try {
            await postQuizAttempt(token, {
              subjectId,
              topicId,
              score,
              totalQuestions,
              responses,
            });
            await refreshProgressFromServer();
          } catch (e) {
            console.error("recordQuizAttempt API failed", e);
          }
        })();
      }
    },
    [token, refreshProgressFromServer]
  );

  const getSubjectStats = useCallback(
    (subjectId: string) => {
      const subject = progress.subjects[subjectId];
      if (!subject) {
        return {
          lessonsCompleted: 0,
          totalLessons: 0,
          quizzesTaken: 0,
          averageScore: 0,
        };
      }

      let lessonsCompleted = 0;
      let quizzesTaken = 0;
      let totalScore = 0;
      let totalQs = 0;

      Object.values(subject.topics).forEach((topic) => {
        lessonsCompleted += Object.values(topic.lessons).filter((l) => l.completed).length;
        const n = topic.quizAttemptCount ?? topic.quizAttempts.length;
        quizzesTaken += n;
        if (
          topic.quizScoreSum != null &&
          topic.quizQuestionSum != null &&
          topic.quizAttempts.length === 0
        ) {
          totalScore += topic.quizScoreSum;
          totalQs += topic.quizQuestionSum;
        } else {
          topic.quizAttempts.forEach((attempt) => {
            totalScore += attempt.score;
            totalQs += attempt.totalQuestions;
          });
        }
      });

      return {
        lessonsCompleted,
        totalLessons: 0,
        quizzesTaken,
        averageScore: totalQs > 0 ? Math.round((totalScore / totalQs) * 100) : 0,
      };
    },
    [progress]
  );

  const getTotalStats = useCallback(() => {
    let totalLessonsCompleted = 0;
    let totalQuizzesTaken = 0;
    let totalScore = 0;
    let totalQs = 0;

    Object.values(progress.subjects).forEach((subject) => {
      Object.values(subject.topics).forEach((topic) => {
        totalLessonsCompleted += Object.values(topic.lessons).filter((l) => l.completed).length;
        totalQuizzesTaken += topic.quizAttemptCount ?? topic.quizAttempts.length;
        if (
          topic.quizScoreSum != null &&
          topic.quizQuestionSum != null &&
          topic.quizAttempts.length === 0
        ) {
          totalScore += topic.quizScoreSum;
          totalQs += topic.quizQuestionSum;
        } else {
          topic.quizAttempts.forEach((attempt) => {
            totalScore += attempt.score;
            totalQs += attempt.totalQuestions;
          });
        }
      });
    });

    return {
      totalLessonsCompleted,
      totalQuizzesTaken,
      totalQuestionsAnswered: totalQs,
      overallAccuracy: totalQs > 0 ? Math.round((totalScore / totalQs) * 100) : 0,
    };
  }, [progress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isProgressLoaded: isLoaded,
        refreshProgressFromServer,
        markLessonComplete,
        recordQuizAttempt,
        getTopicProgress,
        getLessonProgress,
        getSubjectStats,
        getTotalStats,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

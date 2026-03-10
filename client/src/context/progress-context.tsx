import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface LessonProgress {
  completed: boolean;
  watchedAt?: string;
}

interface QuizAttempt {
  score: number;
  totalQuestions: number;
  attemptedAt: string;
}

interface TopicProgress {
  lessons: Record<string, LessonProgress>;
  quizAttempts: QuizAttempt[];
  bestScore: number;
}

interface SubjectProgress {
  topics: Record<string, TopicProgress>;
}

interface StudentProgress {
  subjects: Record<string, SubjectProgress>;
  totalPoints: number;
  level: number;
  achievements: string[];
}

interface ProgressContextType {
  progress: StudentProgress;
  markLessonComplete: (subjectId: string, topicId: string, lessonId: string) => void;
  recordQuizAttempt: (
    subjectId: string,
    topicId: string,
    score: number,
    totalQuestions: number
  ) => void;
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

const defaultProgress: StudentProgress = {
  subjects: {},
  totalPoints: 0,
  level: 1,
  achievements: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<StudentProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("student-progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        setProgress(defaultProgress);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("student-progress", JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const getTopicProgress = useCallback(
    (subjectId: string, topicId: string): TopicProgress => {
      return (
        progress.subjects[subjectId]?.topics[topicId] || {
          lessons: {},
          quizAttempts: [],
          bestScore: 0,
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
      setProgress((prev) => {
        const newProgress = { ...prev };

        if (!newProgress.subjects[subjectId]) {
          newProgress.subjects[subjectId] = { topics: {} };
        }
        if (!newProgress.subjects[subjectId].topics[topicId]) {
          newProgress.subjects[subjectId].topics[topicId] = {
            lessons: {},
            quizAttempts: [],
            bestScore: 0,
          };
        }

        const wasCompleted =
          newProgress.subjects[subjectId].topics[topicId].lessons[lessonId]
            ?.completed;

        newProgress.subjects[subjectId].topics[topicId].lessons[lessonId] = {
          completed: true,
          watchedAt: new Date().toISOString(),
        };

        if (!wasCompleted) {
          newProgress.totalPoints += 10;
          newProgress.level = Math.floor(newProgress.totalPoints / 100) + 1;

          const lessonsCompleted = Object.values(newProgress.subjects).reduce(
            (total, subject) =>
              total +
              Object.values(subject.topics).reduce(
                (topicTotal, topic) =>
                  topicTotal +
                  Object.values(topic.lessons).filter((l) => l.completed).length,
                0
              ),
            0
          );

          if (lessonsCompleted === 1 && !newProgress.achievements.includes("first-lesson")) {
            newProgress.achievements.push("first-lesson");
          }
          if (lessonsCompleted >= 5 && !newProgress.achievements.includes("five-lessons")) {
            newProgress.achievements.push("five-lessons");
          }
          if (lessonsCompleted >= 10 && !newProgress.achievements.includes("ten-lessons")) {
            newProgress.achievements.push("ten-lessons");
          }
        }

        return newProgress;
      });
    },
    []
  );

  const recordQuizAttempt = useCallback(
    (
      subjectId: string,
      topicId: string,
      score: number,
      totalQuestions: number
    ) => {
      setProgress((prev) => {
        const newProgress = { ...prev };

        if (!newProgress.subjects[subjectId]) {
          newProgress.subjects[subjectId] = { topics: {} };
        }
        if (!newProgress.subjects[subjectId].topics[topicId]) {
          newProgress.subjects[subjectId].topics[topicId] = {
            lessons: {},
            quizAttempts: [],
            bestScore: 0,
          };
        }

        const topic = newProgress.subjects[subjectId].topics[topicId];
        const percentage = Math.round((score / totalQuestions) * 100);

        topic.quizAttempts.push({
          score,
          totalQuestions,
          attemptedAt: new Date().toISOString(),
        });

        if (percentage > topic.bestScore) {
          topic.bestScore = percentage;
        }

        newProgress.totalPoints += score * 5;
        newProgress.level = Math.floor(newProgress.totalPoints / 100) + 1;

        if (percentage === 100 && !newProgress.achievements.includes("perfect-score")) {
          newProgress.achievements.push("perfect-score");
        }

        const totalQuizzes = Object.values(newProgress.subjects).reduce(
          (total, subject) =>
            total +
            Object.values(subject.topics).reduce(
              (topicTotal, t) => topicTotal + t.quizAttempts.length,
              0
            ),
          0
        );

        if (totalQuizzes === 1 && !newProgress.achievements.includes("first-quiz")) {
          newProgress.achievements.push("first-quiz");
        }
        if (totalQuizzes >= 10 && !newProgress.achievements.includes("ten-quizzes")) {
          newProgress.achievements.push("ten-quizzes");
        }

        return newProgress;
      });
    },
    []
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
        lessonsCompleted += Object.values(topic.lessons).filter(
          (l) => l.completed
        ).length;
        quizzesTaken += topic.quizAttempts.length;
        topic.quizAttempts.forEach((attempt) => {
          totalScore += attempt.score;
          totalQs += attempt.totalQuestions;
        });
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
        totalLessonsCompleted += Object.values(topic.lessons).filter(
          (l) => l.completed
        ).length;
        totalQuizzesTaken += topic.quizAttempts.length;
        topic.quizAttempts.forEach((attempt) => {
          totalScore += attempt.score;
          totalQs += attempt.totalQuestions;
        });
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

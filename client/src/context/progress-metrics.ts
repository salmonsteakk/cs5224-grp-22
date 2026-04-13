import type {
  ProgressProfileDto,
  StudentProgress,
  SubjectStats,
  TopicProgress,
  TopicProgressRowDto,
  TotalStats,
} from "@/types";

export function mergeServerProgress(
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

function getTopicAggregates(topic: TopicProgress) {
  const quizzesTaken = topic.quizAttemptCount ?? topic.quizAttempts.length;

  if (
    topic.quizScoreSum != null &&
    topic.quizQuestionSum != null &&
    topic.quizAttempts.length === 0
  ) {
    return {
      quizzesTaken,
      totalScore: topic.quizScoreSum,
      totalQuestions: topic.quizQuestionSum,
    };
  }

  const totals = topic.quizAttempts.reduce(
    (acc, attempt) => {
      acc.totalScore += attempt.score;
      acc.totalQuestions += attempt.totalQuestions;
      return acc;
    },
    { totalScore: 0, totalQuestions: 0 }
  );

  return {
    quizzesTaken,
    totalScore: totals.totalScore,
    totalQuestions: totals.totalQuestions,
  };
}

export function computeSubjectStats(progress: StudentProgress, subjectId: string): SubjectStats {
  const subject = progress.subjects[subjectId];
  if (!subject) {
    return {
      lessonsCompleted: 0,
      quizzesTaken: 0,
      averageScore: 0,
    };
  }

  let lessonsCompleted = 0;
  let quizzesTaken = 0;
  let totalScore = 0;
  let totalQuestions = 0;

  Object.values(subject.topics).forEach((topic) => {
    lessonsCompleted += Object.values(topic.lessons).filter((l) => l.completed).length;
    const topicTotals = getTopicAggregates(topic);
    quizzesTaken += topicTotals.quizzesTaken;
    totalScore += topicTotals.totalScore;
    totalQuestions += topicTotals.totalQuestions;
  });

  return {
    lessonsCompleted,
    quizzesTaken,
    averageScore: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
  };
}

export function computeTotalStats(progress: StudentProgress): TotalStats {
  let totalLessonsCompleted = 0;
  let totalQuizzesTaken = 0;
  let totalScore = 0;
  let totalQuestionsAnswered = 0;

  Object.values(progress.subjects).forEach((subject) => {
    Object.values(subject.topics).forEach((topic) => {
      totalLessonsCompleted += Object.values(topic.lessons).filter((l) => l.completed).length;
      const topicTotals = getTopicAggregates(topic);
      totalQuizzesTaken += topicTotals.quizzesTaken;
      totalScore += topicTotals.totalScore;
      totalQuestionsAnswered += topicTotals.totalQuestions;
    });
  });

  return {
    totalLessonsCompleted,
    totalQuizzesTaken,
    totalQuestionsAnswered,
    overallAccuracy:
      totalQuestionsAnswered > 0 ? Math.round((totalScore / totalQuestionsAnswered) * 100) : 0,
  };
}

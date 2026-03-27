import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const analyticsEventSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    required: true,
    index: {
      name: "userIdIndex",
      type: "global",
    },
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      "lesson_start",
      "lesson_complete",
      "quiz_start",
      "question_answered",
      "quiz_complete",
      "dashboard_view",
    ],
  },
  subjectId: String,
  topicId: String,
  lessonId: String,
  questionId: String,
  isCorrect: Boolean,
  score: Number,
  totalQuestions: Number,
  attemptNumber: Number,
  durationSeconds: Number,
  pointsEarned: Number,
  createdAt: {
    type: String,
    required: true,
  },
});

export const AnalyticsEventModel = dynamoose.model(
  "AnalyticsEvent",
  analyticsEventSchema,
  {
    tableName: "AnalyticsEvents",
    create: false,
    waitForActive: false,
  }
);

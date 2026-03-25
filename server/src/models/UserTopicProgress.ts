import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const lessonEntrySchema = new dynamoose.Schema({
  lessonId: { type: String, required: true },
  completed: { type: Boolean, required: true },
  watchedAt: { type: String, required: false },
});

const userTopicProgressSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  topicKey: {
    type: String,
    rangeKey: true,
  },
  subjectId: { type: String, required: true },
  topicId: { type: String, required: true },
  lessons: {
    type: Array,
    schema: [lessonEntrySchema],
    default: [],
  },
  bestScore: { type: Number, required: true, default: 0 },
  quizAttemptCount: { type: Number, required: true, default: 0 },
  quizScoreSum: { type: Number, required: true, default: 0 },
  quizQuestionSum: { type: Number, required: true, default: 0 },
  updatedAt: { type: String, required: true },
});

export const UserTopicProgressModel = dynamoose.model(
  "UserTopicProgress",
  userTopicProgressSchema,
  {
    tableName: "UserTopicProgress",
    create: false,
    waitForActive: false,
  }
);

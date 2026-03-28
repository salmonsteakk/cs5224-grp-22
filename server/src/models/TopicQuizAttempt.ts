import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const responseSchema = new dynamoose.Schema({
  questionId: { type: String, required: true },
  selectedIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true },
});

const topicQuizAttemptSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  attemptId: {
    type: String,
    rangeKey: true,
  },
  subjectId: { type: String, required: true },
  topicId: { type: String, required: true },
  userTopicKey: {
    type: String,
    required: true,
    index: {
      name: "UserTopicIndex",
      type: "global",
      rangeKey: "submittedAt",
    },
  },
  submittedAt: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  responses: {
    type: Array,
    schema: [responseSchema],
    required: true,
  },
});

export const TopicQuizAttemptModel = dynamoose.model("TopicQuizAttempt", topicQuizAttemptSchema, {
  tableName: "TopicQuizAttempts",
  create: false,
  waitForActive: false,
});

import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const responseSchema = new dynamoose.Schema({
  questionId: { type: String, required: true },
  selectedIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true },
});

const examAttemptSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  attemptId: {
    type: String,
    rangeKey: true,
  },
  examPaperId: { type: String, required: true },
  subjectId: { type: String, required: true },
  userExamKey: {
    type: String,
    required: true,
    index: {
      name: "UserExamIndex",
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

export const ExamAttemptModel = dynamoose.model("ExamAttempt", examAttemptSchema, {
  tableName: "ExamAttempts",
  create: false,
  waitForActive: false,
});

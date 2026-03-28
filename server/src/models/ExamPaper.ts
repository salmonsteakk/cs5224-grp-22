import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const questionSchema = new dynamoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: {
    type: Array,
    schema: [String],
  },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
});

const examPaperSchema = new dynamoose.Schema({
  paperId: {
    type: String,
    hashKey: true,
  },
  subjectId: {
    type: String,
    required: true,
    index: {
      name: "SubjectPapersIndex",
      type: "global",
      rangeKey: "paperId",
    },
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: {
    type: Array,
    schema: [questionSchema],
    required: true,
  },
});

export const ExamPaperModel = dynamoose.model("ExamPaper", examPaperSchema, {
  tableName: "ExamPapers",
  create: false,
  waitForActive: false,
});

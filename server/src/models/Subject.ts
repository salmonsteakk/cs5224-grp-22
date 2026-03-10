import * as dynamoose from "dynamoose";

const lessonSchema = new dynamoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String, required: true },
});

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

const topicSchema = new dynamoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  lessons: {
    type: Array,
    schema: [lessonSchema],
  },
  questions: {
    type: Array,
    schema: [questionSchema],
  },
});

const subjectSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: {
    type: String,
    required: true,
    enum: ["math", "science"],
  },
  topics: {
    type: Array,
    schema: [topicSchema],
  },
});

export const SubjectModel = dynamoose.model("Subject", subjectSchema, {
  tableName: "Subjects",
  create: false,
  waitForActive: false,
});

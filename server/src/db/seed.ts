import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;
import { SubjectModel } from "../models/Subject.js";
import { UserModel } from "../models/User.js";
import { ExamPaperModel } from "../models/ExamPaper.js";
import { subjects } from "../data/subjects.js";
import { examPapers } from "../data/examPapers.js";
import { hashPassword } from "../utils/password.js";

const DEMO_USER_ID = "user-demo-student";
const DEMO_USER_EMAIL = "student@example.com";
const DEMO_USER_PASSWORD = "Password123!";

async function ensureSubjectsTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();

  try {
    await ddb.describeTable({ TableName: "Subjects" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "Subjects",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
      });

      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "Subjects" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }

      console.log("Created Subjects table.");
    } else {
      throw error;
    }
  }
}

async function ensureUsersTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();

  try {
    await ddb.describeTable({ TableName: "Users" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "Users",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "email", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "emailIndex",
            KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });

      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "Users" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }

      console.log("Created Users table.");
    } else {
      throw error;
    }
  }
}

async function ensureUserProgressProfileTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();
  try {
    await ddb.describeTable({ TableName: "UserProgressProfile" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "UserProgressProfile",
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
      });
      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "UserProgressProfile" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }
      console.log("Created UserProgressProfile table.");
    } else {
      throw error;
    }
  }
}

async function ensureUserTopicProgressTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();
  try {
    await ddb.describeTable({ TableName: "UserTopicProgress" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "UserTopicProgress",
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "topicKey", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "topicKey", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });
      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "UserTopicProgress" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }
      console.log("Created UserTopicProgress table.");
    } else {
      throw error;
    }
  }
}

async function ensureTopicQuizAttemptsTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();
  try {
    await ddb.describeTable({ TableName: "TopicQuizAttempts" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "TopicQuizAttempts",
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "attemptId", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "attemptId", AttributeType: "S" },
          { AttributeName: "userTopicKey", AttributeType: "S" },
          { AttributeName: "submittedAt", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "UserTopicIndex",
            KeySchema: [
              { AttributeName: "userTopicKey", KeyType: "HASH" },
              { AttributeName: "submittedAt", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });
      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "TopicQuizAttempts" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }
      console.log("Created TopicQuizAttempts table.");
    } else {
      throw error;
    }
  }
}

async function ensureExamPapersTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();
  try {
    await ddb.describeTable({ TableName: "ExamPapers" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "ExamPapers",
        KeySchema: [{ AttributeName: "paperId", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "paperId", AttributeType: "S" },
          { AttributeName: "subjectId", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "SubjectPapersIndex",
            KeySchema: [
              { AttributeName: "subjectId", KeyType: "HASH" },
              { AttributeName: "paperId", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });
      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "ExamPapers" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }
      console.log("Created ExamPapers table.");
    } else {
      throw error;
    }
  }
}

async function ensureExamAttemptsTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();
  try {
    await ddb.describeTable({ TableName: "ExamAttempts" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "ExamAttempts",
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "attemptId", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "attemptId", AttributeType: "S" },
          { AttributeName: "userExamKey", AttributeType: "S" },
          { AttributeName: "submittedAt", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "UserExamIndex",
            KeySchema: [
              { AttributeName: "userExamKey", KeyType: "HASH" },
              { AttributeName: "submittedAt", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });
      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "ExamAttempts" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }
      console.log("Created ExamAttempts table.");
    } else {
      throw error;
    }
  }
}

export async function seedDatabase(): Promise<void> {
  await ensureSubjectsTable();
  await ensureUsersTable();
  await ensureUserProgressProfileTable();
  await ensureUserTopicProgressTable();
  await ensureTopicQuizAttemptsTable();
  await ensureExamPapersTable();
  await ensureExamAttemptsTable();

  try {
    const existingSubject = await SubjectModel.get("math");
    if (existingSubject) {
      console.log("Subjects already seeded, skipping.");
    } else {
      await SubjectModel.batchPut(subjects);
      console.log(`Database seeded with ${subjects.length} subjects.`);
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }

  try {
    const existingPaper = await ExamPaperModel.get("science-mock-1");
    if (existingPaper) {
      console.log("Exam papers already seeded, skipping.");
    } else {
      await ExamPaperModel.batchPut(examPapers);
      console.log(`Seeded ${examPapers.length} exam papers.`);
    }
  } catch (error) {
    console.error("Failed to seed exam papers:", error);
    throw error;
  }

  try {
    const existingDemoUser = await UserModel.get(DEMO_USER_ID);
    if (existingDemoUser) {
      console.log("Demo user already seeded, skipping.");
      return;
    }

    await UserModel.create({
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      passwordHash: hashPassword(DEMO_USER_PASSWORD),
      name: "Demo Student",
      role: "student",
      status: "active",
    });

    console.log(`Seeded demo user: ${DEMO_USER_EMAIL} / ${DEMO_USER_PASSWORD}`);
  } catch (error) {
    console.error("Failed to seed demo user:", error);
    throw error;
  }
}

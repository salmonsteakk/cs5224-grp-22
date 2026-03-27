import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;
import { SubjectModel } from "../models/Subject.js";
import { UserModel } from "../models/User.js";
import { subjects } from "../data/subjects.js";
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

async function ensureAnalyticsEventsTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();

  try {
    await ddb.describeTable({ TableName: "AnalyticsEvents" });
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      await ddb.createTable({
        TableName: "AnalyticsEvents",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "userId", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "userIdIndex",
            KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });

      let active = false;
      while (!active) {
        const desc = await ddb.describeTable({ TableName: "AnalyticsEvents" });
        active = desc.Table?.TableStatus === "ACTIVE";
        if (!active) await new Promise((r) => setTimeout(r, 500));
      }

      console.log("Created AnalyticsEvents table.");
    } else {
      throw error;
    }
  }
}

export async function seedDatabase(): Promise<void> {
  await ensureSubjectsTable();
  await ensureUsersTable();
  await ensureAnalyticsEventsTable();

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

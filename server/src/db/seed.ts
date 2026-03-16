import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;
import { SubjectModel } from "../models/Subject.js";
import { subjects } from "../data/subjects.js";

async function ensureTable(): Promise<void> {
  const ddb = dynamoose.aws.ddb();

  try {
    await ddb.describeTable({ TableName: "Subjects" });
    // Table exists
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      // Table doesn't exist — create it
      await ddb.createTable({
        TableName: "Subjects",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
      });
      // Wait for table to become active
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

export async function seedDatabase(): Promise<void> {
  await ensureTable();

  try {
    const existing = await SubjectModel.get("math");
    if (existing) {
      console.log("Database already seeded, skipping.");
      return;
    }
  } catch {
    // Item not found — proceed with seeding
  }

  try {
    await SubjectModel.batchPut(subjects);
    console.log(`Database seeded with ${subjects.length} subjects.`);
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }
}

// Initialize DynamoDB connection before anything else
import "./db/index.js";

import app from "./app.js";
import { seedDatabase } from "./db/seed.js";

const PORT = process.env.PORT || 3001;

async function start() {
  // Retry seeding — dynamodb-local may take a moment to be ready
  let retries = 10;
  while (retries > 0) {
    try {
      await seedDatabase();
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error("Failed to seed database after retries:", error);
        process.exit(1);
      }
      console.log(`Waiting for DynamoDB... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

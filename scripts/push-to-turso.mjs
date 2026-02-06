import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

async function push() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  console.log("Generating SQL from Prisma schema...");
  // We use prisma migrate diff to get the SQL
  // Prisma 7 requires a file: URL for sqlite datasource during CLI diff.
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
    {
      env: {
        ...process.env,
        DATABASE_URL: "file:./prisma/dev.db",
      },
    }
  ).toString();

  const client = createClient({ url, authToken });
  
  console.log("Pushing SQL to Turso...");
  // Split SQL into individual statements
  const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
  
  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log("Successfully pushed schema to Turso!");
}

push().catch(console.error);

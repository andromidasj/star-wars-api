import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { dbCredentials } from "./dbCredentials";
import * as schema from "./schema";

const client = new Client(dbCredentials);

try {
  await client.connect();
} catch (error) {
  throw new Error(
    "Error connecting to database. Did you set the correct environment variables in .env?"
  );
}

export const db = drizzle(client, { schema, logger: true });

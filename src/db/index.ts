import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "postgres",
});

await client.connect();

export const db = drizzle(client, { schema });

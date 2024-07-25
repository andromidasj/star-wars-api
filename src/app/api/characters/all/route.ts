import { db } from "@/db";
import { characters } from "@/db/schema";

export async function GET(request: Request) {
  const results = await db.select().from(characters);
  return Response.json({
    count: results.length,
    results,
  });
}

import { db } from "@/db";
import { planets } from "@/db/schema";

export async function GET(request: Request) {
  const results = await db.select().from(planets);
  return Response.json({
    count: results.length,
    results,
  });
}
